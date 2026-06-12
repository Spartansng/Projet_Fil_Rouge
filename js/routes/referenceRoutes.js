const express        = require('express');
const router         = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const {
  getAllTypes,   createType,   updateType,   deleteType,
  getAllStatus,  createStatus, updateStatus, deleteStatus,
} = require('../controllers/referenceController');

router.get(   '/property-types',     getAllTypes);
router.post(  '/property-types',     authMiddleware, roleMiddleware('admin'), createType);
router.put(   '/property-types/:id', authMiddleware, roleMiddleware('admin'), updateType);
router.delete('/property-types/:id', authMiddleware, roleMiddleware('admin'), deleteType);

router.get(   '/property-status',     getAllStatus);
router.post(  '/property-status',     authMiddleware, roleMiddleware('admin'), createStatus);
router.put(   '/property-status/:id', authMiddleware, roleMiddleware('admin'), updateStatus);
router.delete('/property-status/:id', authMiddleware, roleMiddleware('admin'), deleteStatus);

module.exports = router;