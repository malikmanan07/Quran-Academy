import jsPDF from 'jspdf';

const generateCertificate = (studentName, courseName, date, academyName = 'Quran Academy') => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  // Background
  doc.setFillColor(27, 58, 92);
  doc.rect(0, 0, w, h, 'F');

  // Inner white area
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(15, 15, w - 30, h - 30, 4, 4, 'F');

  // Decorative border
  doc.setDrawColor(0, 180, 216);
  doc.setLineWidth(2);
  doc.roundedRect(20, 20, w - 40, h - 40, 3, 3, 'S');
  doc.setLineWidth(0.5);
  doc.roundedRect(24, 24, w - 48, h - 48, 2, 2, 'S');

  // Corner decorations
  const corners = [[28, 28], [w - 28, 28], [28, h - 28], [w - 28, h - 28]];
  doc.setFillColor(0, 180, 216);
  corners.forEach(([x, y]) => doc.circle(x, y, 3, 'F'));

  // Header icon area
  doc.setFillColor(27, 67, 50);
  doc.circle(w / 2, 48, 12, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text('QA', w / 2, 51, { align: 'center' });

  // Academy name
  doc.setTextColor(27, 58, 92);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(academyName, w / 2, 72, { align: 'center' });

  // Certificate title
  doc.setFontSize(32);
  doc.setTextColor(0, 180, 216);
  doc.text('Certificate of Completion', w / 2, 88, { align: 'center' });

  // Decorative line
  doc.setDrawColor(0, 180, 216);
  doc.setLineWidth(1);
  doc.line(w / 2 - 50, 94, w / 2 + 50, 94);

  // Award text
  doc.setFontSize(12);
  doc.setTextColor(74, 85, 104);
  doc.setFont('helvetica', 'normal');
  doc.text('This certificate is proudly presented to', w / 2, 108, { align: 'center' });

  // Student name
  doc.setFontSize(28);
  doc.setTextColor(27, 58, 92);
  doc.setFont('helvetica', 'bold');
  doc.text(studentName, w / 2, 124, { align: 'center' });

  // Line under name
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(w / 2 - 60, 128, w / 2 + 60, 128);

  // Course completion text
  doc.setFontSize(12);
  doc.setTextColor(74, 85, 104);
  doc.setFont('helvetica', 'normal');
  doc.text('for successfully completing the course', w / 2, 140, { align: 'center' });

  // Course name
  doc.setFontSize(20);
  doc.setTextColor(0, 180, 216);
  doc.setFont('helvetica', 'bold');
  doc.text(courseName, w / 2, 154, { align: 'center' });

  // Date
  doc.setFontSize(11);
  doc.setTextColor(74, 85, 104);
  doc.setFont('helvetica', 'normal');
  doc.text(`Completed on: ${date}`, w / 2, 168, { align: 'center' });

  // Seal
  doc.setDrawColor(27, 67, 50);
  doc.setLineWidth(1.5);
  doc.circle(w / 2, h - 50, 15, 'S');
  doc.setFillColor(27, 67, 50);
  doc.circle(w / 2, h - 50, 11, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('VERIFIED', w / 2, h - 49, { align: 'center' });
  doc.text('SEAL', w / 2, h - 45, { align: 'center' });

  doc.save(`${studentName}_${courseName}_Certificate.pdf`);
};

export default generateCertificate;
