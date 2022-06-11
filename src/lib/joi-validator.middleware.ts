import { RequestHandler } from 'express';
import { ValidationError, AsyncValidationOptions, ValidationErrorItem } from 'joi';
import { Route } from './types';
import { ErrorResponseObject } from './http';

type ValidatorParam = 'params' | 'query' | 'body';
const joiSpecOptions: AsyncValidationOptions = { abortEarly: false, stripUnknown: true };

export const joiValidatorMW = (route: Route): RequestHandler =>
  async function (req, res, next) {
    const { validator } = route;
    if (!validator || validator.skip) return next();

    const passedKeys = Object.keys(validator) as ValidatorParam[];
    const doValidation: ValidatorParam[] = [];

    for (const key of passedKeys) {
      if (validator[key]) doValidation.push(key);
    }

    if (!doValidation.length) return next();

    // lower value indicates higher priority
    const validationPriority: Record<ValidatorParam, number> = { params: 0, query: 1, body: 2 };
    doValidation.sort((a, b) => validationPriority[a] - validationPriority[b]);

    for (const param of doValidation) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        req[param] = await validator[param]?.validateAsync(req[param], joiSpecOptions);
      } catch (error) {
        const errors = [];

        if (error instanceof ValidationError) {
          errors.push(...error.details.map(getFormattedError));
        } else if (error instanceof Error) {
          errors.push({ message: error.message });
        }

        const errorResponse = new ErrorResponseObject(`request ${param} failed validation`, errors);
        return res.status(400).json(errorResponse);
      }
    }

    return next();
  };

function getFormattedError(e: ValidationErrorItem) {
  return { message: e.message, field: String(e.context?.key || e.path[0]) };
}
