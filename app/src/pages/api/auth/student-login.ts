import type { NextApiRequest, NextApiResponse } from "next";
import { studentsDB } from "../../../lib/studentdummyS";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { regNo, password } = req.body;

  const cleanRegNo = regNo?.trim().toUpperCase();
  const cleanPassword = password?.trim();

  console.log("LOGIN INPUT =>", cleanRegNo, cleanPassword);

  const student = studentsDB.find(
    (s) =>
      s.regNo.toUpperCase() === cleanRegNo &&
      s.password === cleanPassword
  );

  if (!student) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  return res.status(200).json({
    message: "Login successful",
    student,
  });
}
