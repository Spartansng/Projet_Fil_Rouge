const { body, param } = require('express-validator');

const referenceNameValidator = [
  body('name')
    .trim()
    .escape()
    .notEmpty().withMessage('Le champ name est obligatoire.'),
];

const referenceIdParamValidator = [
  param('id')
    .isInt({ gt: 0 }).withMessage('id doit être un entier positif.'),
];

module.exports = { referenceNameValidator, referenceIdParamValidator };
