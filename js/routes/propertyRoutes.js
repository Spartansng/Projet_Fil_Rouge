const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, remove } = require('../controllers/propertyController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/',     getAll);
router.get('/:id',  getById);
router.post('/',    authMiddleware, create);
router.put('/:id',  authMiddleware, update);
router.delete('/:id', authMiddleware, remove);

module.exports = router;