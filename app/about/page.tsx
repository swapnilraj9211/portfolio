"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";
import styles from "../About.module.scss";
import Lottie from "lottie-react";
import Image from "next/image";
import animationData from "../../public/lottie/register.json";

export default function AboutPage() {
  return (
    <section className={styles.aboutPage}>

      {/* HERO */}
      <section className={styles.hero}>
        <motion.div
          className={styles.heroText}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Government Engineering College Vaishali</h1>
          <p className={styles.heroTagline}>
            A premier institution established by the Government of Bihar,
            committed to academic excellence, innovation, and ethical engineering
            education.
          </p>
          <p>
            Empowering students with technical competence, professional
            integrity, and a vision for national and global impact.
          </p>
          <a
    href="/brochure/gec-vaishali-brochure.pdf"
    download
    className={styles.heroBrochureBtn}
  >
    📄 Download Brochure
  </a>
        </motion.div>

        <motion.div
          className={styles.heroLottie}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Lottie animationData={animationData} loop />
        </motion.div>
      </section>
      {/* PRINCIPAL MESSAGE */}
      <div className={`${styles.section} ${styles.principalSection}`}>
  <h2 className={styles.sectionTitle}>Principal’s Message</h2>

  <div className={styles.principal}>
    <div className={styles.principalImage}>
      <Image
        src="/principal/principal.jpg"
        alt="Principal GEC Vaishali"
        width={240}
        height={300}
        style={{ borderRadius: "16px" }}
      />
    </div>

    <div className={styles.principalText}>
      <p>
        Welcome to Government Engineering College Vaishali. Our objective is
        to impart quality technical education blended with ethics, innovation,
        and discipline. We aim to prepare students to become responsible
        professionals and nation builders.
      </p>
      <strong>— Principal, G.E.C Vaishali</strong>
    </div>
  </div>
</div>

      {/* ABOUT */}
      <div className={styles.section}>
        <h2>About the Institution</h2>
        <h3>Government Engineering College (GEC)</h3>
        <p>
          Government Engineering College (GEC), Vaishali is a government engineering institute established in 2018 under the Department of Science, Technology and Technical Education, Government of Bihar. It focuses on innovation, skill-based learning, and creating engineers with strong social responsibility. 
          <br />Vaishali is a government engineering institute established in 2018 under the Department of Science, Technology and Technical Education, Government of Bihar. Located near Patna on the historic land of Vaishali, the college aims to provide quality technical education with a strong focus on innovation, practical skills, and societal impact. Starting with an intake of 240 students across four B.Tech branches, it has now grown to seven undergraduate branches with 420 seats and five M.Tech programmes with 102 seats under the guidance of its Principal, Prof. Anant Kumar
        </p>
      </div>

      {/* BROCHURE */}
    

      {/* TIMELINE */}
      <div className={styles.section}>
        <h2>College Timeline</h2>
        <ul className={styles.timeline}>
          <li><span>2018</span> College Established</li>
          <li><span>2019</span> Academic Session Started</li>
          <li><span>2021</span> New Branches Introduced</li>
          <li><span>2023</span> PG Programs Launched</li>
        </ul>
      </div>

      {/* STATS */}
      <div className={styles.stats}>
        <div>
          <h3><CountUp end={7} duration={2} />+</h3>
          <p>Departments</p>
        </div>
        <div>
          <h3><CountUp end={1200} duration={2} />+</h3>
          <p>Active Students</p>
        </div>
        <div>
          <h3><CountUp end={80} duration={2} />+</h3>
          <p>Faculty</p>
        </div>
        <div>
          <h3><CountUp end={12} duration={2} />+</h3>
          <p>Acres Campus</p>
        </div>
      </div>

      {/* ACCREDITATION */}
      <div className={styles.section}>
        <h2>Accreditation & Approvals</h2>
        <ul className={styles.approvals}>
          <li>✔ AICTE Approved</li>
          <li>✔ Affiliated to AKU, Patna</li>
          <li>✔ Government of Bihar</li>
        </ul>
      </div>

      {/* GALLERY */}
      <div className={styles.gallerySection}>
        <h2>Campus Gallery</h2>
        <p className={styles.galleryText}>
          A glimpse of campus life and infrastructure at GEC Vaishali.
        </p>

        <div className={styles.gallery}>
          <img src="/gallery/campus-1.jpg" alt="Campus 1" />
          <img src="/gallery/campus-2.jpg" alt="Campus 2" />
          <img src="/gallery/campus-3.jpg" alt="Campus 3" />
        </div>
      </div>

    </section>
  );
}
