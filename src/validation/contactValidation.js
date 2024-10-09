import Joi from 'joi';

export const contactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    'string.base': 'Name should be a string',
    'string.empty': 'Name is required',
    'string.min': 'Name should have at least 3 characters',
    'string.max': 'Name should have at most 30 characters',
  }),
  phoneNumber: Joi.string().required().messages({
    'string.base': 'Phone number should be a string',
    'string.empty': 'Phone number is required',
  }),
  email: Joi.string().email().optional().messages({
    'string.email': 'Email must be a valid email address',

  }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal').required().messages({
    'any.only': 'Contact type must be either work, home, or personal',
    'string.empty': 'Contact type is required',
  }),
});

export const patchContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).messages({
    'string.base': 'Name should be a string',
    'string.min': 'Name should have at least 3 characters',
    'string.max': 'Name should have at most 30 characters',
  }),
  phoneNumber: Joi.string().messages({
    'string.base': 'Phone number should be a string',
  }),
  email: Joi.string().email().optional().messages({
    'string.email': 'Email must be a valid email address',
  }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal').messages({
    'any.only': 'Contact type must be either work, home, or personal',
  }),
});
