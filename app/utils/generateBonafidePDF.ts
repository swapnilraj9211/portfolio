import { jsPDF } from "jspdf";


export interface BonafideData {
  name: string;
  registrationNo: string;
  course: string;
  branch: string;
  semester: string;
  year: string;
  session: string;
  dob?: string;
  fatherName?: string;
  motherName?: string;
  admissionDate?: string;
  expectedCompletionYear?: string;
}

export const generateBonafidePDF = async (data: BonafideData) => {
  const doc = new jsPDF();

  /* ================= LOAD LOGOS ================= */
  const collegeLogo = await loadImage("/logos/college-logo.png");
  const biharLogo = await loadImage("/logos/bihar-sarkar.png");

  doc.addImage(collegeLogo, "PNG", 20, 10, 25, 25);
  doc.addImage(biharLogo, "PNG", 165, 10, 25, 25);

  /* ================= HEADER ================= */
  doc.setFont("times", "bold");
  doc.setFontSize(12);
  doc.text("Department of Science & Technology, Govt of Bihar", 105, 12, { align: "center" });
  doc.text("GOVERNMENT ENGINEERING COLLEGE,VAISHALI", 105, 18, { align: "center" });
  doc.text("Shyampur, Mansurpur, Bidupur, Vaishali-844115", 105, 24, { align: "center" });
  doc.setFontSize(10);
  doc.text("Email Id: principalgecvaishali@gmail.com", 105, 30, { align: "center" });
  
  doc.text("Website: www.gecvaishali.ac.in", 105, 36, { align: "center" });

  doc.line(30,45, 180, 45);
  

  /* ================= LETTER / DATE ================= */
  doc.setFontSize(10);
  doc.setFont("times", "normal");
  doc.text("Letter No: GEC/ACAD/BD/" + data.registrationNo, 20, 55);
  doc.text(`Date: ${new Date().toLocaleDateString("en-GB")}`, 150, 55);

  /* ================= TITLE ================= */
  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.text("BONAFIDE CERTIFICATE", 105, 67, { align: "center" });

  const titleWidth = doc.getTextWidth("BONAFIDE CERTIFICATE");
  doc.line(105 - titleWidth / 2, 69, 105 + titleWidth / 2, 69);

  /* ================= BODY ================= */
  doc.setFont("times", "normal");
  doc.setFontSize(11);

  let y = 80;
  doc.setFontSize(13);

  doc.text(
    `This is to certify that Mr./Ms. ${data.name || "__________"}, bearing Registration `,
    35,
    y
  ); y += 8;

  doc.text(
    `No. ${data.registrationNo || "__________"} is a bonafide student of this institute and is currently studying in`,
    35,
    y
  ); y += 8;


  doc.text(
     `${data.course || "__________"} (${data.branch || "__________"}) Semester ${data.semester || "___"}, Year ${data.year || "___"} during the Academic Session ${data.session || "__________"}.`,
    35,
    y
  ); y += 20;

  doc.text("As per institute records, the details are:", 35, y); 
  y += 10;

  doc.text(`Date of Birth           : ${data.dob || "N/A"}`, 35, y); y += 7;
  doc.text(`Father's Name          : ${data.fatherName || "N/A"}`, 35, y); y += 7;
  doc.text(`Mother's Name          : ${data.motherName || "N/A"}`, 35, y); y += 7;
  doc.text(`Date of Admission      : ${data.admissionDate || "N/A"}`, 35, y); y += 7;
  doc.text(
    `Expected Completion Yr : ${data.expectedCompletionYear || "N/A"}`,
    35,
    y
  );

  /* ================= SIGNATURE ================= */
  y = 230;
  doc.setFont("times", "bold");
  doc.text("Authorized Signatory", 130, y);
  doc.setFont("times", "normal");
  doc.text("Name :", 130, y + 8);
  doc.text("Designation :", 130, y + 16);
  doc.text("Seal & Signature", 130, y + 24);

  /* ================= SAVE ================= */
  doc.save(`BONAFIDE_${data.registrationNo}.pdf`);
};

/* ================= IMAGE LOADER ================= */
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
