import { ErrorResponseObject } from '@akhilome/common';
import { RequestHandler } from 'express';
import {
  ValidationError,
  AsyncValidationOptions,
  ValidationErrorItem,
  ValidationOptions,
} from 'joi';
import { Route } from './types';

type ValidatorParam = 'params' | 'query' | 'body';
type SpecOptionsArg = ValidationOptions | AsyncValidationOptions;

export const joiValidatorMW = (route: Route, specOptions: SpecOptionsArg): RequestHandler =>
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
        req[param] = await validator[param]?.validateAsync(req[param], specOptions);
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
