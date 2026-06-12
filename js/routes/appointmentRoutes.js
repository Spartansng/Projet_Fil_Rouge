const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getAll,
  getById,
  create,
  update,
  remove,
} = require('../controllers/appointmentController');

router.get('/',       authMiddleware, getAll);
router.get('/:id',    authMiddleware, getById);
router.post('/',      authMiddleware, create);
router.put('/:id',    authMiddleware, update);
router.delete('/:id', authMiddleware, remove);

module.exports = router;