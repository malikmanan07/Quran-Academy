import { jsPDF } from 'jspdf';

export const downloadCertificate = (data) => {
  const {
    studentName,
    courseName,
    teacherName,
    completionDate,
    certificateNumber,
  } = data;

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const W = 297; // page width
  const H = 210; // page height

  // ━━━━━━━━━━━━━━━━━━━
  // BACKGROUND
  // ━━━━━━━━━━━━━━━━━━━
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, W, H, 'F');

  // SUBTLE DIAGONAL PATTERN (Watermark effect)
  doc.setDrawColor(250, 245, 225); // Very light gold
  doc.setLineWidth(0.2);
  for (let i = -H; i < W + H; i += 15) {
    doc.line(i, 0, i + H, H);
  }

  // ━━━━━━━━━━━━━━━━━━━
  // BORDERS (Navy + Gold)
  // ━━━━━━━━━━━━━━━━━━━
  doc.setDrawColor(27, 58, 92); // #1B3A5C
  doc.setLineWidth(4);
  doc.rect(8, 8, W - 16, H - 16);

  doc.setDrawColor(212, 175, 55); // Gold
  doc.setLineWidth(1.5);
  doc.rect(12, 12, W - 24, H - 24);

  // ━━━━━━━━━━━━━━━━━━━
  // CORNER DIAMONDS
  // ━━━━━━━━━━━━━━━━━━━
  const drawDiamond = (x, y, size) => {
    doc.setFillColor(212, 175, 55);
    doc.lines(
      [[size, size], [size, -size], [-size, -size], [-size, size]],
      x - size, y, [1, 1], 'F', true
    );
  };
  drawDiamond(20, 20, 5);
  drawDiamond(W - 20, 20, 5);
  drawDiamond(20, H - 20, 5);
  drawDiamond(W - 20, H - 20, 5);

  // ━━━━━━━━━━━━━━━━━━━
  // TOP NAVY BANNER
  // ━━━━━━━━━━━━━━━━━━━
  doc.setFillColor(27, 58, 92);
  doc.rect(12, 12, W - 24, 24, 'F');

  // BISMILLAH (English)
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(
    'In the Name of Allah, the Most Gracious, the Most Merciful',
    W / 2, 28,
    { align: 'center' }
  );

  // CRESCENT & STAR (Top Left)
  // Simple elegant crescent
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(2);
  doc.circle(32, 24, 8, 'S'); // Moon
  doc.setFillColor(27, 58, 92); // Hide inner to make crescent
  doc.circle(36, 22, 7, 'F');

  // Star
  doc.setFillColor(212, 175, 55);
  doc.circle(44, 21, 1.5, 'F');

  // OFFICIAL SEAL (Top Right)
  const drawSeal = (x, y) => {
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(1.5);
    doc.circle(x, y, 14, 'S');
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.8);
    doc.circle(x, y, 11, 'S');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('QA', x, y + 1, { align: 'center' });
    doc.setFontSize(5);
    doc.text('OFFICIAL', x, y + 6, { align: 'center' });
  };
  drawSeal(W - 35, 24);

  // ━━━━━━━━━━━━━━━━━━━
  // CONTENT AREA
  // ━━━━━━━━━━━━━━━━━━━
  doc.setTextColor(27, 58, 92); // Navy
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('QURAN ACADEMY', W / 2, 54, { align: 'center' });

  doc.setTextColor(212, 175, 55); // Gold
  doc.setFontSize(36);
  doc.setFont('helvetica', 'bold');
  doc.text('CERTIFICATE', W / 2, 74, { align: 'center' });

  doc.setTextColor(100, 100, 100); // Gray
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('O F   C O M P L E T I O N', W / 2, 82, { align: 'center' });

  // ━━━━━━━━━━━━━━━━━━━
  // STUDENT SECTION
  // ━━━━━━━━━━━━━━━━━━━
  doc.setTextColor(80, 80, 80);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'italic');
  doc.text('This is to certify that', W / 2, 96, { align: 'center' });

  // Elegant Student Name Box
  doc.setFillColor(248, 244, 225); // Cream
  doc.roundedRect(W / 2 - 90, 100, 180, 18, 4, 4, 'F');
  doc.setFillColor(212, 175, 55); // Gold top/bottom borders
  doc.rect(W / 2 - 90, 100, 180, 2, 'F');
  doc.rect(W / 2 - 90, 116, 180, 2, 'F');

  doc.setTextColor(27, 58, 92);
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.text(studentName?.toUpperCase() || 'STUDENT NAME', W / 2, 113, { align: 'center' });

  doc.setTextColor(80, 80, 80);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'normal');
  doc.text('has successfully completed the course in', W / 2, 128, { align: 'center' });

  // ━━━━━━━━━━━━━━━━━━━
  // COURSE NAME
  // ━━━━━━━━━━━━━━━━━━━
  doc.setTextColor(27, 58, 92);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(courseName || 'Course Name', W / 2, 142, { align: 'center' });

  // Decorative Dots
  const drawDots = (y) => {
    doc.setFillColor(212, 175, 55);
    for (let i = 0; i < 7; i++) {
       doc.circle(W / 2 - 30 + (i * 10), y, 1, 'F');
    }
  };
  drawDots(148);

  doc.setTextColor(120, 120, 120);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.text('Demonstrating exceptional commitment and excellence in Quranic education', W / 2, 156, { align: 'center' });

  // ━━━━━━━━━━━━━━━━━━━
  // BOTTOM SEALS / SIGNATURES
  // ━━━━━━━━━━━━━━━━━━━
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.5);
  doc.line(30, 164, W - 30, 164);

  // THREE COLUMNS
  // Column 1: Date
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Date of Completion', 60, 172, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(27, 58, 92);
  const formattedDate = completionDate ? new Date(completionDate).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  }) : new Date().toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
  doc.text(formattedDate, 60, 179, { align: 'center' });

  // Column 2: Cert No (Center)
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Certificate No.', W / 2, 172, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(212, 175, 55);
  doc.setFontSize(11);
  doc.text(certificateNumber || 'QA-2026-00001', W / 2, 179, { align: 'center' });

  // Column 3: Instructor
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Instructor Name', W - 60, 172, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(27, 58, 92);
  doc.text(teacherName || 'Academy Teacher', W - 60, 179, { align: 'center' });

  // Signature lines
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.3);
  doc.line(30, 174, 90, 174);
  doc.line(W - 90, 174, W - 30, 174);

  // ━━━━━━━━━━━━━━━━━━━
  // FOOTER BANNER
  // ━━━━━━━━━━━━━━━━━━━
  doc.setFillColor(27, 58, 92);
  doc.rect(12, H - 28, W - 24, 16, 'F');

  // Small Mosque (Center Footer)
  const drawMosque = (x, y, scale = 1) => {
    doc.setFillColor(255, 255, 255);
    // Main dome
    doc.circle(x, y, 6 * scale, 'F');
    // Building
    doc.rect(x - 8 * scale, y, 16 * scale, 8 * scale, 'F');
    // Minarets
    doc.rect(x - 12 * scale, y - 4 * scale, 3 * scale, 12 * scale, 'F');
    doc.rect(x + 9 * scale, y - 4 * scale, 3 * scale, 12 * scale, 'F');
    // Top minaret caps (triangles)
    doc.triangle(
      x - 12 * scale, y - 4 * scale,
      x - 9 * scale, y - 4 * scale,
      x - 10.5 * scale, y - 7 * scale,
      'F'
    );
    doc.triangle(
      x + 9 * scale, y - 4 * scale,
      x + 12 * scale, y - 4 * scale,
      x + 10.5 * scale, y - 7 * scale,
      'F'
    );
  };
  drawMosque(W / 2, H - 25, 0.7);

  doc.setTextColor(212, 175, 55); // Gold
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(
    'Quran Academy  |  Excellence in Quranic Education  |  info@quranacademy.com',
    W / 2, H - 16,
    { align: 'center' }
  );

  // ━━━━━━━━━━━━━━━━━━━
  // SAVE PDF
  // ━━━━━━━━━━━━━━━━━━━
  doc.save(`Certificate_${studentName}_${courseName}.pdf`);
};
