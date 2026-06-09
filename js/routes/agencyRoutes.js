const express        = require('express');
const router         = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getAllAgencies,
  getAgencyById,
  createAgency,
  updateAgency,
  deleteAgency,
} = require('../controllers/agencyController');

router.get('/',       getAllAgencies);
router.get('/:id',    getAgencyById);
router.post('/',      authMiddleware, createAgency);
router.put('/:id',    authMiddleware, updateAgency);
router.delete('/:id', authMiddleware, deleteAgency);

module.exports = router;