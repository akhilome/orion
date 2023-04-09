import { ErrorResponseObject } from '@akhilome/common';
import { RequestHandler } from 'express';
import { ValidationError, ValidationErrorItem } from 'joi';
import { OrionOptions, Route } from './types';

type SchemaParam = 'params' | 'query' | 'body';
type OrionValidation = OrionOptions['validation'];

export const schemaValidator = (r: Route, v: OrionValidation): RequestHandler =>
  async function (req, res, next) {
    const { schema } = r;
    if (!schema || schema.skip) return next();

    const passedKeys = Object.keys(schema) as SchemaParam[];
    const paramsToBeValidated: SchemaParam[] = [];

    for (const key of passedKeys) {
      if (schema[key]) paramsToBeValidated.push(key);
    }

    if (!paramsToBeValidated.length) return next();

    // lower value indicates higher priority
    const validationPriority: Record<SchemaParam, number> = { params: 0, query: 1, body: 2 };
    paramsToBeValidated.sort((a, b) => validationPriority[a] - validationPriority[b]);

    for (const param of paramsToBeValidated) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        req[param] = await schema[param]?.validateAsync(req[param], v?.options);
      } catch (error) {
        const errors = [];

        if (error instanceof ValidationError) {
          errors.push(...error.details.map(getFormattedError));
        } else if (error instanceof Error) {
          errors.push({ message: error.message });
        }

        const errorResponse = new ErrorResponseObject(`request ${param} failed validation`, errors);
        const errorStatus = v?.errorStatusCode || 422;
        return res.status(errorStatus).json(errorResponse);
      }
    }

    return next();
  };

function getFormattedError(e: ValidationErrorItem) {
  return { message: e.message, field: String(e.context?.key || e.path[0]) };
}
