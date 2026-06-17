const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const validateRequest = require('../middleware/validateRequest');
const { createAgencyValidator, updateAgencyValidator, agencyIdParamValidator } = require('../middleware/validators/agencyValidators');
const {
  getAllAgencies,
  getAgencyById,
  createAgency,
  updateAgency,
  deleteAgency,
} = require('../controllers/agencyController');

router.get('/',       getAllAgencies);
router.get('/:id',    agencyIdParamValidator, validateRequest, getAgencyById);
router.post('/',      authMiddleware, roleMiddleware('admin'), createAgencyValidator, validateRequest, createAgency);
router.put('/:id',    authMiddleware, roleMiddleware('admin'), agencyIdParamValidator, updateAgencyValidator, validateRequest, updateAgency);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), agencyIdParamValidator, validateRequest, deleteAgency);

module.exports = router;
