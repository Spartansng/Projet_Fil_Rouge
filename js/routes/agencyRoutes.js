const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const {
  getAllAgencies,
  getAgencyById,
  createAgency,
  updateAgency,
  deleteAgency,
} = require('../controllers/agencyController');

router.get('/',       getAllAgencies);
router.get('/:id',    getAgencyById);
router.post('/',      authMiddleware, roleMiddleware('admin'), createAgency);
router.put('/:id',    authMiddleware, roleMiddleware('admin'), updateAgency);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteAgency);

module.exports = router;