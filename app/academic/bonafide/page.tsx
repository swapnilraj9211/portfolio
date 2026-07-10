"use client";

import { useState } from "react";
import styles from "../bonafide/Bonafide.module.scss";
import { generateBonafidePDF } from "../../utils/generateBonafidePDF";

const BonafidePage = () => {
  const [formData, setFormData] = useState({
    name: "",
    registrationNo: "",
    course: "B.Tech",
    branch: "",
    semester: "",
    year: "",
    session: "",
    dob: "",
    fatherName: "",
    motherName: "",
    admissionDate: "",
    expectedCompletionYear: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ------------ VALIDATION ------------ */
  const validateForm = () => {
    const err: Record<string, string> = {};
    const today = new Date();

    if (!/^[A-Z\s]{3,}$/.test(formData.name))
      err.name = "Name must be in CAPITAL letters";

    if (!/^\d{11}$/.test(formData.registrationNo))
      err.registrationNo = "Registration No must be exactly 11 digits";

    if (!/^[A-Z\s]+$/.test(formData.branch))
      err.branch = "Branch must be in CAPITAL letters";

    if (+formData.semester < 1 || +formData.semester > 8)
      err.semester = "Semester must be between 1 and 8";

    if (+formData.year < 1 || +formData.year > 4)
      err.year = "Year must be between 1 and 4";

    if (!/^\d{4}-\d{4}$/.test(formData.session))
      err.session = "Session format: YYYY-YYYY";

    if (!formData.dob || new Date(formData.dob) >= today)
      err.dob = "Date of Birth must be in the past";

    if (!/^[A-Z\s]+$/.test(formData.fatherName))
      err.fatherName = "Father's name must be CAPITAL letters";

    if (!/^[A-Z\s]+$/.test(formData.motherName))
      err.motherName = "Mother's name must be CAPITAL letters";

    if (!formData.admissionDate || new Date(formData.admissionDate) >= today)
      err.admissionDate = "Admission date must be in the past";

    if (
      !/^\d{4}$/.test(formData.expectedCompletionYear) ||
      +formData.expectedCompletionYear < today.getFullYear()
    )
      err.expectedCompletionYear = "Enter a valid future year";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  /* ------------ CHANGE HANDLER ------------ */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Auto uppercase for alphabetic fields
    const upperCaseFields = [
      "name",
      "branch",
      "fatherName",
      "motherName",
    ];

    setFormData({
      ...formData,
      [name]: upperCaseFields.includes(name)
        ? value.toUpperCase()
        : value,
    });
  };

  /* ------------ SUBMIT ------------ */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    generateBonafidePDF(formData);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Bonafide Certificate Application</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="STUDENT NAME"
          onChange={handleChange}
        />
        {errors.name && <p className={styles.error}>{errors.name}</p>}

        <input
          name="registrationNo"
          placeholder="REGISTRATION NO (11 DIGITS)"
          maxLength={11}
          onChange={handleChange}
        />
        {errors.registrationNo && (
          <p className={styles.error}>{errors.registrationNo}</p>
        )}

        <input
          name="branch"
          placeholder="BRANCH"
          onChange={handleChange}
        />
        {errors.branch && <p className={styles.error}>{errors.branch}</p>}

        <div className={styles.row}>
          <input
            type="number"
            name="semester"
            min={1}
            max={8}
            placeholder="SEMESTER"
            onChange={handleChange}
          />
          <input
            type="number"
            name="year"
            min={1}
            max={4}
            placeholder="YEAR"
            onChange={handleChange}
          />
        </div>
        {errors.semester && <p className={styles.error}>{errors.semester}</p>}
        {errors.year && <p className={styles.error}>{errors.year}</p>}

        <input
          name="session"
          placeholder="ACADEMIC SESSION (2025-2026)"
          onChange={handleChange}
        />
        {errors.session && <p className={styles.error}>{errors.session}</p>}

        <label>Date of Birth</label>
        <input type="date" name="dob" onChange={handleChange} />
        {errors.dob && <p className={styles.error}>{errors.dob}</p>}

        <input
          name="fatherName"
          placeholder="FATHER'S NAME"
          onChange={handleChange}
        />
        {errors.fatherName && <p className={styles.error}>{errors.fatherName}</p>}

        <input
          name="motherName"
          placeholder="MOTHER'S NAME"
          onChange={handleChange}
        />
        {errors.motherName && <p className={styles.error}>{errors.motherName}</p>}

        <label>Date of Admission</label>
        <input type="date" name="admissionDate" onChange={handleChange} />
        {errors.admissionDate && (
          <p className={styles.error}>{errors.admissionDate}</p>
        )}

        <input
          name="expectedCompletionYear"
          placeholder="EXPECTED COMPLETION YEAR (YYYY)"
          maxLength={4}
          onChange={handleChange}
        />
        {errors.expectedCompletionYear && (
          <p className={styles.error}>{errors.expectedCompletionYear}</p>
        )}

        <button type="submit">Download Bonafide Certificate</button>
      </form>
    </div>
  );
};

export default BonafidePage;
