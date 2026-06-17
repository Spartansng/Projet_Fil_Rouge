const { body, param } = require('express-validator');

const createAgencyValidator = [
  body('name')
    .trim()
    .escape()
    .notEmpty().withMessage('Le nom est requis.'),

  body('city')
    .trim()
    .escape()
    .notEmpty().withMessage('La ville est requise.'),

  body('address')
    .optional({ nullable: true })
    .trim()
    .escape(),
];

const updateAgencyValidator = [
  body('name')
    .optional()
    .trim()
    .escape()
    .notEmpty().withMessage('Le nom ne peut pas être vide.'),

  body('city')
    .optional()
    .trim()
    .escape()
    .notEmpty().withMessage('La ville ne peut pas être vide.'),

  body('address')
    .optional({ nullable: true })
    .trim()
    .escape(),
];

const agencyIdParamValidator = [
  param('id')
    .isInt({ gt: 0 }).withMessage('id doit être un entier positif.'),
];

module.exports = { createAgencyValidator, updateAgencyValidator, agencyIdParamValidator };
