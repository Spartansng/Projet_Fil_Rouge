const { body } = require('express-validator');

const registerValidator = [
  body('username')
    .trim()
    .escape()
    .notEmpty().withMessage("Le nom d'utilisateur est requis.")
    .isLength({ min: 3, max: 100 }).withMessage("Le nom d'utilisateur doit contenir entre 3 et 100 caractères."),

  body('email')
    .trim()
    .notEmpty().withMessage("L'email est requis.")
    .isEmail().withMessage('Adresse email invalide.')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Le mot de passe est requis.')
    .isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères.')
    .matches(/\d/).withMessage('Le mot de passe doit contenir au moins un chiffre.'),

  body('role')
    .optional()
    .isIn(['acheteur', 'vendeur']).withMessage('Rôle invalide.'),
];

const loginValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage("L'email est requis.")
    .isEmail().withMessage('Adresse email invalide.')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Le mot de passe est requis.'),
];

module.exports = { registerValidator, loginValidator };
