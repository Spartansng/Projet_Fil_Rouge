const express        = require('express');
const router         = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getAllTypes,   createType,   updateType,   deleteType,
  getAllStatus,  createStatus, updateStatus, deleteStatus,
} = require('../controllers/referenceController');

router.get(   '/property-types',     getAllTypes);
router.post(  '/property-types',     authMiddleware, createType);
router.put(   '/property-types/:id', authMiddleware, updateType);
router.delete('/property-types/:id', authMiddleware, deleteType);

router.get(   '/property-status',     getAllStatus);
router.post(  '/property-status',     authMiddleware, createStatus);
router.put(   '/property-status/:id', authMiddleware, updateStatus);
router.delete('/property-status/:id', authMiddleware, deleteStatus);

module.exports = router;