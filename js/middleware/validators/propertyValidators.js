const { body } = require('express-validator');

const createPropertyValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Le titre est requis.')
    .isLength({ max: 255 }).withMessage('Le titre ne doit pas dépasser 255 caractères.'),

  body('description')
    .optional({ nullable: true })
    .isString().withMessage('La description doit être une chaîne de caractères.'),

  body('price')
    .notEmpty().withMessage('Le prix est requis.')
    .isFloat({ gt: 0 }).withMessage('Le prix doit être un nombre positif.'),

  body('surface')
    .optional({ nullable: true })
    .isFloat({ gt: 0 }).withMessage('La surface doit être un nombre positif.'),

  body('city')
    .trim()
    .notEmpty().withMessage('La ville est requise.'),

  body('postal_code')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 20 }).withMessage('Le code postal est trop long.'),

  body('address')
    .trim()
    .notEmpty().withMessage("L'adresse est requise."),

  body('district')
    .trim()
    .notEmpty().withMessage('Le quartier est requis.'),

  body('type_id')
    .notEmpty().withMessage('Le type de bien est requis.')
    .isInt({ gt: 0 }).withMessage('type_id doit être un entier positif.'),

  body('agency_id')
    .optional({ nullable: true })
    .isInt({ gt: 0 }).withMessage('agency_id doit être un entier positif.'),

  body('status_id')
    .notEmpty().withMessage('Le statut est requis.')
    .isInt({ gt: 0 }).withMessage('status_id doit être un entier positif.'),
];

const updatePropertyValidator = [
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Le titre ne peut pas être vide.')
    .isLength({ max: 255 }).withMessage('Le titre ne doit pas dépasser 255 caractères.'),

  body('description')
    .optional({ nullable: true })
    .isString().withMessage('La description doit être une chaîne de caractères.'),

  body('price')
    .optional()
    .isFloat({ gt: 0 }).withMessage('Le prix doit être un nombre positif.'),

  body('surface')
    .optional({ nullable: true })
    .isFloat({ gt: 0 }).withMessage('La surface doit être un nombre positif.'),

  body('city')
    .optional()
    .trim()
    .notEmpty().withMessage('La ville ne peut pas être vide.'),

  body('postal_code')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 20 }).withMessage('Le code postal est trop long.'),

  body('address')
    .optional()
    .trim()
    .notEmpty().withMessage("L'adresse ne peut pas être vide."),

  body('district')
    .optional()
    .trim()
    .notEmpty().withMessage('Le quartier ne peut pas être vide.'),

  body('type_id')
    .optional()
    .isInt({ gt: 0 }).withMessage('type_id doit être un entier positif.'),

  body('agency_id')
    .optional()
    .isInt({ gt: 0 }).withMessage('agency_id doit être un entier positif.'),

  body('status_id')
    .optional()
    .isInt({ gt: 0 }).withMessage('status_id doit être un entier positif.'),
];

module.exports = { createPropertyValidator, updatePropertyValidator };