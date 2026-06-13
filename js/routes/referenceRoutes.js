const express        = require('express');
const router         = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const validateRequest = require('../middleware/validateRequest');
const { referenceNameValidator, referenceIdParamValidator } = require('../middleware/validators/referenceValidators');
const {
  getAllTypes,   createType,   updateType,   deleteType,
  getAllStatus,  createStatus, updateStatus, deleteStatus,
} = require('../controllers/referenceController');

router.get(   '/property-types',     getAllTypes);
router.post(  '/property-types',     authMiddleware, roleMiddleware('admin'), referenceNameValidator, validateRequest, createType);
router.put(   '/property-types/:id', authMiddleware, roleMiddleware('admin'), referenceIdParamValidator, referenceNameValidator, validateRequest, updateType);
router.delete('/property-types/:id', authMiddleware, roleMiddleware('admin'), referenceIdParamValidator, validateRequest, deleteType);

router.get(   '/property-status',     getAllStatus);
router.post(  '/property-status',     authMiddleware, roleMiddleware('admin'), referenceNameValidator, validateRequest, createStatus);
router.put(   '/property-status/:id', authMiddleware, roleMiddleware('admin'), referenceIdParamValidator, referenceNameValidator, validateRequest, updateStatus);
router.delete('/property-status/:id', authMiddleware, roleMiddleware('admin'), referenceIdParamValidator, validateRequest, deleteStatus);

module.exports = router;
