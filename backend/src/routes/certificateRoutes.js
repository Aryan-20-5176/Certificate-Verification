const express = require('express');
const router = express.Router();
const { getCertificateById, downloadCertificate, incrementDownloadCount, getGlobalStats, getMyCertificates } = require('../controllers/certificateController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/stats/summary', getGlobalStats);
router.get('/my-certificates', protect, getMyCertificates);
router.get('/:id', getCertificateById);
router.get('/:id/download', downloadCertificate);
router.patch('/:id/download', incrementDownloadCount);

module.exports = router;
