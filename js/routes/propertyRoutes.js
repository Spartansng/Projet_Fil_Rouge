const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, remove } = require('../controllers/propertyController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const validateRequest = require('../middleware/validateRequest');
const { createPropertyValidator, updatePropertyValidator } = require('../middleware/validators/propertyValidators');

router.get('/',      getAll);
router.get('/:id',   getById);
router.post('/',     authMiddleware, roleMiddleware('admin', 'agent'), createPropertyValidator, validateRequest, create);
router.put('/:id',   authMiddleware, roleMiddleware('admin', 'agent'), updatePropertyValidator, validateRequest, update);
router.delete('/:id',authMiddleware, roleMiddleware('admin', 'agent'), remove);

module.exports = router;