const Certificate = require('../models/Certificate');
const xlsx = require('xlsx');
const sendEmail = require('../utils/sendEmail');

// @desc    Upload bulk student data via Excel
// @route   POST /api/admin/upload-excel
// @access  Private/Admin
const uploadExcelData = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('Please upload an excel file');
    }

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer', cellDates: true });
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    let importedCount = 0;

    for (const row of data) {
      const normalizedRow = {};
      for (const key in row) {
        // Clean the key: trim, lowercase, remove spaces and special chars
        const cleanKey = key.toString().trim().toLowerCase().replace(/[^a-z0-9]/g, '');
        normalizedRow[cleanKey] = row[key];
      }

      console.log('Processing row:', normalizedRow);

      const certId = normalizedRow.certificateid || normalizedRow.id || normalizedRow.certid;
      const sName = normalizedRow.studentname || normalizedRow.name || normalizedRow.fullname;
      const iDomain = normalizedRow.internshipdomain || normalizedRow.domain || normalizedRow.field;
      const sDate = normalizedRow.startdate || normalizedRow.joiningdate;
      const eDate = normalizedRow.enddate || normalizedRow.completiondate;
      const email = normalizedRow.email || '';

      if (certId && sName && iDomain) {
        console.log(`Found valid data for: ${sName}. Saving...`);
        // Find or create
        await Certificate.findOneAndUpdate(
          { certificateId: String(certId) },
          {
            studentName: sName,
            email: email,
            internshipDomain: iDomain,
            startDate: sDate ? new Date(sDate) : new Date(),
            endDate: eDate ? new Date(eDate) : new Date(),
            issueDate: Date.now(),
          },
          { upsert: true, new: true }
        );
        importedCount++;

        // Send Email Notification
        if (email) {
          try {
            await sendEmail({
              email: email,
              subject: 'Internship Certificate Available - CertiVerify',
              message: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; border: 1px solid #e5e7eb; border-radius: 12px; max-width: 600px;">
                  <h2 style="color: #0d9488;">Congratulations!</h2>
                  <p>Dear <b>${sName}</b>,</p>
                  <p>We are pleased to inform you that your internship completion certificate for <b>${iDomain}</b> is now available on our portal.</p>
                  <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0; font-size: 14px;"><b>Certificate ID:</b> <code style="background: #fff; padding: 2px 5px; border-radius: 4px;">${certId}</code></p>
                    <p style="margin: 10px 0 0 0; font-size: 14px;"><b>Login to Download:</b> <a href="http://localhost:5173/login" style="color: #0d9488; font-weight: bold;">CertiVerify Portal</a></p>
                  </div>
                  <p>Simply register/login with this email address to view and download your verified credential.</p>
                  <p style="font-size: 12px; color: #666; margin-top: 30px; border-top: 1px solid #eee; pt: 10px;">Best Regards,<br><b>CertiVerify Team</b></p>
                </div>
              `
            });
            console.log(`Email sent successfully to ${email}`);
          } catch (mailErr) {
            console.error(`Failed to send email to ${email}:`, mailErr.message);
          }
        }
      } else {
        console.log('Row skipped due to missing fields:', { certId, sName, iDomain });
      }
    }

    res.status(200).json({ message: `Successfully imported/updated ${importedCount} certificates.` });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all certificates
// @route   GET /api/admin/certificates
// @access  Private/Admin
const getAllCertificates = async (req, res, next) => {
  try {
    const certificates = await Certificate.find({}).sort({ createdAt: -1 });
    res.json(certificates);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a certificate
// @route   DELETE /api/admin/certificates/:id
// @access  Private/Admin
const deleteCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    if (certificate) {
      await certificate.deleteOne();
      res.json({ message: 'Certificate removed' });
    } else {
      res.status(404);
      throw new Error('Certificate not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadExcelData, getAllCertificates, deleteCertificate };
