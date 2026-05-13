const Certificate = require('../models/Certificate');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

// @desc    Get certificate by ID
// @route   GET /api/certificates/:id
// @access  Public
const getCertificateById = async (req, res, next) => {
  try {
    const certificate = await Certificate.findOne({ 
      certificateId: { $regex: new RegExp(`^${req.params.id}$`, 'i') } 
    });

    if (certificate) {
      res.json(certificate);
    } else {
      res.status(404);
      throw new Error('Certificate not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Download certificate PDF
// @route   GET /api/certificates/:id/download
// @access  Public
const downloadCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findOne({ 
      certificateId: { $regex: new RegExp(`^${req.params.id}$`, 'i') } 
    });

    if (!certificate) {
      res.status(404);
      throw new Error('Certificate not found');
    }

    // Increment download count automatically
    certificate.downloadCount = (certificate.downloadCount || 0) + 1;
    await certificate.save();

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([800, 600]);
    const { width, height } = page.getSize();

    const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Draw borders
    page.drawRectangle({
      x: 20, y: 20,
      width: width - 40, height: height - 40,
      borderColor: rgb(0.1, 0.3, 0.5),
      borderWidth: 10,
    });

    page.drawRectangle({
      x: 35, y: 35,
      width: width - 70, height: height - 70,
      borderColor: rgb(0.8, 0.6, 0.2), // Gold
      borderWidth: 2,
    });

    // Content
    page.drawText('VERIFIED CREDENTIAL OF INTERNSHIP', {
      x: width / 2 - 200, y: height - 120,
      size: 28, font: titleFont, color: rgb(0.1, 0.3, 0.5),
    });

    page.drawText('This is to certify that', {
      x: width / 2 - 80, y: height - 200,
      size: 16, font: regularFont,
    });

    const studentName = certificate.studentName.toUpperCase();
    page.drawText(studentName, {
      x: width / 2 - (studentName.length * 8),
      y: height - 250,
      size: 24, font: titleFont, color: rgb(0.2, 0.2, 0.2),
    });

    page.drawText('has successfully completed an internship in the domain of', {
      x: width / 2 - 180, y: height - 310,
      size: 14, font: regularFont,
    });

    const domain = certificate.internshipDomain.toUpperCase();
    page.drawText(domain, {
      x: width / 2 - (domain.length * 6), y: height - 350,
      size: 20, font: titleFont, color: rgb(0.1, 0.3, 0.5),
    });

    const start = new Date(certificate.startDate).toLocaleDateString();
    const end = new Date(certificate.endDate).toLocaleDateString();
    page.drawText(`Duration: ${start} to ${end}`, {
      x: width / 2 - 100, y: height - 410,
      size: 14, font: regularFont,
    });

    const issue = new Date(certificate.issueDate).toLocaleDateString();
    page.drawText(`Date of Issue: ${issue}`, {
      x: 80, y: 80,
      size: 12, font: regularFont,
    });

    page.drawText(`Certificate ID: ${certificate.certificateId}`, {
      x: width - 250, y: 80,
      size: 12, font: regularFont,
    });

    const pdfBytes = await pdfDoc.save();

    res.contentType('application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="certificate_${certificate.certificateId}.pdf"`);
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    next(error);
  }
};

// @desc    Get global statistics for dashboard
// @route   GET /api/certificates/stats/summary
// @access  Public
const getGlobalStats = async (req, res, next) => {
  try {
    const totalCertificates = await Certificate.countDocuments();

    // Unique emails count
    const uniqueStudents = await Certificate.distinct('email');
    const totalStudents = uniqueStudents.length;

    // Total downloads sum
    const stats = await Certificate.aggregate([
      {
        $group: {
          _id: null,
          totalDownloads: { $sum: '$downloadCount' }
        }
      }
    ]);
    const totalDownloads = stats.length > 0 ? stats[0].totalDownloads : 0;

    // Recent uploads (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentUploads = await Certificate.countDocuments({
      issueDate: { $gte: sevenDaysAgo }
    });

    res.json({
      totalStudents,
      totalCertificates,
      totalDownloads,
      recentUploads
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Increment download count
const incrementDownloadCount = async (req, res, next) => {
  try {
    const certificate = await Certificate.findOneAndUpdate(
      { certificateId: req.params.id },
      { $inc: { downloadCount: 1 } },
      { new: true }
    );
    if (certificate) {
      res.json({ success: true, downloadCount: certificate.downloadCount });
    } else {
      res.status(404);
      throw new Error('Certificate not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get certificates for the logged in user
const getMyCertificates = async (req, res, next) => {
  try {
    const email = req.user.email;
    const certificates = await Certificate.find({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') } 
    }).sort({ issueDate: -1 });
    res.json(certificates);
  } catch (error) {
    next(error);
  }
};

module.exports = { getCertificateById, downloadCertificate, incrementDownloadCount, getGlobalStats, getMyCertificates };
