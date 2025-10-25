const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

async function generatePDF(complaint) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const buffers = [];
    
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });
    
    doc.on('error', reject);
    
    // Add content to PDF
    doc.fontSize(20).text('Crime Complaint Report', { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(14).text(`Complaint ID: ${complaint._id}`);
    doc.text(`Date: ${new Date(complaint.createdAt).toLocaleDateString()}`);
    doc.text(`Category: ${complaint.category}`);
    doc.text(`Status: ${complaint.status}`);
    doc.moveDown();
    
    doc.text('Description:');
    doc.text(complaint.description, { align: 'left' });
    doc.moveDown();
    
    doc.text('Location:');
    doc.text(`Address: ${complaint.location.address}`);
    doc.text(`Coordinates: ${complaint.location.coordinates[1]}, ${complaint.location.coordinates[0]}`);
    doc.moveDown();
    
    // Add evidence images if they exist
    if (complaint.evidence && complaint.evidence.length > 0) {
      doc.text('Evidence:');
      complaint.evidence.forEach((imagePath, index) => {
        try {
          const fullPath = path.join(__dirname, '..', imagePath);
          if (fs.existsSync(fullPath)) {
            doc.moveDown();
            doc.image(fullPath, { width: 400, align: 'center' });
          }
        } catch (err) {
          console.error(`Error adding image to PDF: ${err.message}`);
        }
      });
    }
    
    doc.end();
  });
}

module.exports = generatePDF;