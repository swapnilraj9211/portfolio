import { jsPDF } from "jspdf";
export interface FeeReceiptData {
  institute: string;
  studentName: string;
    fatherName: string; 
    rollNo: string;
    regNo: string;
    course: string;
    session: string;
    
    paymentDate: string;
    paymentMode: string;
    transactionId: string;
}

const numberToWords = (num: number): string => {

  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six",
    "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve",
    "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen",
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  if (num === 0) return "Zero";
  if (num < 20) return a[num];
  if (num < 100) {
    return b[Math.floor(num / 10)] + (num % 10 !== 0 ? " " + a[num % 10] : "");
  }
  if (num < 1000) {
    return a[Math.floor(num / 100)] + " Hundred" + (num % 100 !== 0 ? " " + numberToWords(num % 100) : "");
  }
  if (num < 100000) {
    return numberToWords(Math.floor(num / 1000)) + " Thousand" + (num % 1000 !== 0 ? " " + numberToWords(num % 1000) : "");
  }

  return "";
};

export const generateFeeReceiptPDF = async (data: any) => {
  const doc = new jsPDF();

  const collegeLogo = await loadImage("/logos/college-logo.png");
  const biharLogo = await loadImage("/logos/bihar-sarkar.png");

  doc.addImage(collegeLogo, "PNG", 20, 10, 25, 25);
  doc.addImage(biharLogo, "PNG", 165, 10, 25, 25);
  
  doc.setFont("times", "bold");
  doc.setFontSize(12);
  doc.text("Department of Science & Technology, Govt of Bihar", 105, 12, { align: "center" });
  doc.text("GOVERNMENT ENGINEERING COLLEGE,VAISHALI", 105, 18, { align: "center" });
  doc.text("Shyampur, Mansurpur, Bidupur, Vaishali-844115", 105, 24, { align: "center" });
  doc.setFontSize(10);
  doc.text("Email Id: principalgecvaishali@gmail.com", 105, 30, { align: "center" });
  
  doc.text("Website: www.gecvaishali.ac.in", 105, 36, { align: "center" });

  doc.line(30,45, 180, 45);
  
  // Underline after header
  doc.line(30, 45, 180, 45);

  // META
  let y = 55;
  doc.setFontSize (10);
  doc.text(`Letter No: GEC/ACAD/PMS/${data.regNo}`, 20, y);
  doc.text(`Date: ${new Date().toLocaleDateString("en-GB")}`, 150, y);

  y += 10;
  doc.setFont("times", "bold");
  const receiptText = "FEE RECEIPT";
  const receiptX = 105;
  const receiptY = y;

  doc.text(receiptText, receiptX, receiptY, { align: "center" });

  const receiptWidth = doc.getTextWidth(receiptText);
  doc.line(
    receiptX - receiptWidth / 2,
    receiptY + 2,
    receiptX + receiptWidth / 2,
    receiptY + 2
  );

  y += 12;
  doc.setFont("times", "normal");
  doc.setFontSize(10);

  // Student Details
  doc.text(`Name and address of the Institute: ${data.institute}`, 20, y); y += 7;
  doc.text(`Name of the Student: ${data.studentName}`, 20, y); y += 7;
  doc.text(`Father's Name: ${data.fatherName}`, 20, y); y += 7;
  doc.text(`Roll No: ${data.rollNo}`, 20, y); y += 7;
  doc.text(`Registration No: ${data.regNo}`, 20, y); y += 7;
  doc.text(`Course: ${data.course}`, 20, y); y += 7;
  doc.text(`Session: ${data.session}`, 20, y); y += 10;

  // FEE DETAILS HEADER - Underline only the text (FIX #1)
  doc.setFont("times", "bold");
  doc.setFontSize(11);
  const feeHeaderText = "DETAILS OF THE FEE";
  const feeHeaderX = 105;
  const feeHeaderY = y;

  doc.text(feeHeaderText, feeHeaderX, feeHeaderY, { align: "center" });

  // Calculate width of text and underline only it
  const feeHeaderWidth = doc.getTextWidth(feeHeaderText);
  doc.line(
    feeHeaderX - feeHeaderWidth / 2,
    feeHeaderY + 2,
    feeHeaderX + feeHeaderWidth / 2,
    feeHeaderY + 2
  );

  doc.setFont("times", "normal");
  doc.setFontSize(10);
  y += 10;

  doc.text(`Date of Payment: ${data.paymentDate}`, 20, y); y += 7;
  doc.text(`Mode of Payment: ${data.paymentMode}`, 20, y); y += 7;
  doc.text(`Transaction ID: ${data.transactionId}`, 20, y); y += 10;

  // FEE TABLE (FIX #2 - Removed numbering, fixed font for amounts)
  const fees = [
    ["Admission Fee", data.admissionFee],
    ["Tuition Fee", data.tuitionFee],
    ["Registration Fee", data.registrationFee],
    ["Exam Fee", data.examFee],
    ["Development Fee", data.developmentFee],
    ["Other Charges", data.otherFee],
  ];

  let total = 0;
  const startY = y;

  fees.forEach((f) => {
    const amt = Number(f[1] || 0);
    
    // Fee name (left aligned)
    doc.setFont("times", "normal");
    doc.text(`${f[0]}`, 30, y);
    
    // Amount (right aligned) - Use consistent font
    
    doc.setFont("times", "normal"); // or "helvetica"
    doc.setFontSize(10);
    doc.text(`Rs. ${amt.toFixed(2)}`, 175, y, { align: "right" });

    
    doc.setFontSize(10);
    total += amt;
    y += 7;
  });

  // Separator line before total
  y += 3;
  doc.line(30, y, 180, y);
  y += 5;

  // TOTAL AMOUNT - Bold and properly formatted
  doc.setFont("times", "bold");
  doc.setFontSize(11);
  doc.text(`Total Amount: `, 30, y);
  
  doc.setFont("times", "bold");
  doc.setFontSize(11);
  doc.text(`Rs. ${total.toFixed(2)}`, 175, y, { align: "right" });


  y += 8;
  doc.setFont("times", "normal");
  doc.setFontSize(10);
  
  // Amount in words - Only show if greater than 0
  if (total > 0) {
    const amountInWords = numberToWords(Math.floor(total));
    doc.text(`In words: ${amountInWords} only`, 30, y);
  }

  // Footer - Signature
  y = 265;
  doc.setFont("times", "normal");
  doc.setFontSize(9);
  doc.text("Signature of the competent authority", 120, y);
  doc.text("Seal", 145, y + 5);

  doc.save(`Fee_Receipt_${data.studentName}.pdf`);
};


const loadImage = (src: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Canvas error");
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = src;
  });
};