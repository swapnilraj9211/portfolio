"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import animationData from "../../public/lottie/login.json";
import styles from "../signup/Signup.module.scss";
import { useRouter } from "next/navigation";

type Role = "student" | "faculty" | "academics";

export default function SignupPage() {
  const [role, setRole] = useState<Role>("student");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    dob: "",
    fatherName: "",
    regNo: "",
    rollNo: "",
    password: "",
    course: "",
    branch: "",
    semester: "",
    session: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Signup failed");
      }

      setMessage("Registration Successful! Redirecting...");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error: any) {
        setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.sinup}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.container}
      >
        {/* LEFT – LOTTIE */}
        <div className={styles.left} >
          <Lottie animationData={animationData} loop />
        </div>

        {/* RIGHT – FORM */}
        <div className={styles.right}>
          <div className={styles.container}>
            {/* HEADER */}
            <div className={styles.header}>
              <h1>Create Account</h1>
              <p>Register as Student, Faculty, or Academics</p>
            </div>

            {/* ROLE SELECT */}
            <div className={styles.roleSelect}>
              {(["student", "faculty", "academics"] as Role[]).map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setRole(r)}
                  className={`${styles.roleBtn} ${
                    role === r ? styles.active : ""
                  }`}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>

            {/* FORM */}
            <form className={styles.form} onSubmit={handleSubmit}>
              <Field label="Full Name" name="name" value={formData.name} onChange={handleInputChange} />
              <Field label="Email Address" type="email" name="email" value={formData.email} onChange={handleInputChange} />
              <Field label="Mobile Number" type="tel" pattern="[0-9]{10}" name="mobile" value={formData.mobile} onChange={handleInputChange} />
              <Field label="Date of Birth" type="date" hasValue name="dob" value={formData.dob} onChange={handleInputChange} />
              <Field label="Father’s Name" name="fatherName" value={formData.fatherName} onChange={handleInputChange} />

              <AnimatePresence>
                {role !== "faculty" && role !== "academics" && (
                  <motion.div
                    className={styles.group}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Field label="Registration Number" name="regNo" value={formData.regNo} onChange={handleInputChange} />
                    <Field label="Roll Number" name="rollNo" value={formData.rollNo} onChange={handleInputChange} />
                    
                    <div style={{ marginTop: "1rem", marginBottom: "0.5rem", fontWeight: "bold", color: "#555" }}>Academic Details</div>
                    <Field label="Course (e.g., B.Tech, BCA)" name="course" value={formData.course} onChange={handleInputChange} />
                    <Field label="Branch / Department" name="branch" value={formData.branch} onChange={handleInputChange} />
                    <Field label="Semester" type="number" name="semester" value={formData.semester} onChange={handleInputChange} />
                    <Field label="Academic Year (e.g., 2021–2025)" name="session" value={formData.session} onChange={handleInputChange} />
                  </motion.div>
                )}
              </AnimatePresence>

              <Field label="Password" type="password" minLength={8} name="password" value={formData.password} onChange={handleInputChange} />

               {message && <p style={{ color: message.includes("Success") ? "green" : "red", fontSize:'0.9rem', marginBottom:'10px' }}>{message}</p>}

              <div className={styles.submitWrap}>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className={styles.submit}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Account"}
                </motion.button>
              </div>

              <p className={styles.note}>
                By registering, you agree to institutional policies.
              </p>
            </form>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ---------------- COMPONENT ---------------- */

function Field({
  label,
  type = "text",
  hasValue = false,
  ...props
}: {
  label: string;
  type?: string;
  hasValue?: boolean;
  [key: string]: any;
}) {
  return (
    <div className={styles.field}>
      <input type={type} required placeholder=" " {...props} />
      <label className={hasValue ? styles.fixedLabel : ""}>{label}</label>
    </div>
  );
}
