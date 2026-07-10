export interface StudentRecord {
  regNo: string;
  password: string;
  name: string;
  email: string;
  mobile: string;
  fatherName: string;
  motherName: string;
  dob: string;
  yearOfAdmission: string;
  branch: string;
}

export const studentsDB: StudentRecord[] = Array.from({ length: 20 }).map(
  (_, i) => {
    const index = i + 1;
    return {
      regNo: `GECV202${index}CS0${index}`,
      password: "student@123",
      name: `Student ${index}`,
      email: `student${index}@college.edu`,
      mobile: `98765432${index.toString().padStart(2, "0")}`,
      fatherName: `Father ${index}`,
      motherName: `Mother ${index}`,
      dob: `200${index % 10}-0${(index % 9) + 1}-15`,
      yearOfAdmission: `202${index % 4}`,
      branch: "Computer Science",
    };
  }
);

