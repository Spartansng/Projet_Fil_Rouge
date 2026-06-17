const { body } = require('express-validator');

const createAppointmentValidator = [
  body('property_id')
    .notEmpty().withMessage('property_id est requis.')
    .isInt({ gt: 0 }).withMessage('property_id doit être un entier positif.'),

  body('appointment_date')
    .notEmpty().withMessage('appointment_date est requis.')
    .isISO8601().withMessage('appointment_date doit être une date valide (format ISO 8601).')
    .custom(value => new Date(value).getTime() > Date.now())
    .withMessage('appointment_date doit être une date future.'),

  body('message')
    .optional({ nullable: true })
    .isString().withMessage('Le message doit être une chaîne de caractères.')
    .trim()
    .escape()
    .isLength({ max: 1000 }).withMessage('Le message ne doit pas dépasser 1000 caractères.'),
];

const updateAppointmentValidator = [
  body('appointment_date')
    .optional()
    .isISO8601().withMessage('appointment_date doit être une date valide (format ISO 8601).')
    .custom(value => new Date(value).getTime() > Date.now())
    .withMessage('appointment_date doit être une date future.'),

  body('message')
    .optional({ nullable: true })
    .isString().withMessage('Le message doit être une chaîne de caractères.')
    .trim()
    .escape()
    .isLength({ max: 1000 }).withMessage('Le message ne doit pas dépasser 1000 caractères.'),

  body('status')
    .optional()
    .isIn(['pending', 'confirmed', 'cancelled']).withMessage('status invalide.'),
];

module.exports = { createAppointmentValidator, updateAppointmentValidator };
