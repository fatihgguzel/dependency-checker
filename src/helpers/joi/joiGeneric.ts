import * as Joi from 'joi';

// NUMBERS
export const num = Joi.number();

// Objects

// eslint-disable-next-line
export const obj = (fields?: Record<string, any>) => {
  return Joi.object(fields || {});
};

// eslint-disable-next-line
export const objNullable = (fields?: Record<string, any>) => {
  return obj(fields || {}).allow(null);
};

export const stringEnum = (enums: object, name: string) => {
  return stringTrimmed.valid(...Object.values(enums)).label(`ENUMS.${name}`);
};

export const arr = (schema: Joi.Schema) => {
  return Joi.array().items(schema);
};

// STRINGS
export const stringTrimmed = Joi.string().trim();

export const email = stringTrimmed.email().lowercase();
