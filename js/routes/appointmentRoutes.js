const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const { createAppointmentValidator, updateAppointmentValidator } = require('../middleware/validators/appointmentValidators');
const {
  getAll,
  getById,
  create,
  update,
  remove,
} = require('../controllers/appointmentController');

router.get('/',       authMiddleware, getAll);
router.get('/:id',    authMiddleware, getById);
router.post('/',      authMiddleware, createAppointmentValidator, validateRequest, create);
router.put('/:id',    authMiddleware, updateAppointmentValidator, validateRequest, update);
router.delete('/:id', authMiddleware, remove);

module.exports = router;