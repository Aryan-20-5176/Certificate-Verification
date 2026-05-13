const mongoose = require('mongoose');

const certificateSchema = mongoose.Schema(
  {
    certificateId: { type: String, required: true, unique: true },
    studentName: { type: String, required: true },
    email: { type: String },
    internshipDomain: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    issueDate: { type: Date, default: Date.now },
    downloadCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Certificate = mongoose.model('Certificate', certificateSchema);
module.exports = Certificate;
