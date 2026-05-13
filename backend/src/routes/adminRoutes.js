const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect, admin } = require('../middlewares/authMiddleware');
const { uploadExcelData, getAllCertificates, deleteCertificate } = require('../controllers/adminController');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload-excel', protect, admin, upload.single('file'), uploadExcelData);
router.get('/certificates', protect, admin, getAllCertificates);
router.delete('/certificates/:id', protect, admin, deleteCertificate);

module.exports = router;
