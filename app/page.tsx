"use client";
import Link from "next/link";
import Lottie from "lottie-react";
import styles from "../app/Hero/Hero.module.scss";
import animationData from "../public/lottie/education.json";
import Services from "../components/ServiceCard";

export default function HomePage() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>

        {/* TEXT */}
        <div className={styles.text}>
          <h1>G.E.C Vaishali</h1>
          <p>
            Government Engineering College Vaishali is dedicated to quality
            technical education, innovation, and student excellence.
          </p>

          <div className={styles.buttons}>
            <a href="/about" className={styles.primary}>
              Explore College
            </a>
            <Link href="/noticeBoard" className={styles.secondary}>
              View Notices
            </Link>
          
          </div>
        </div>

        {/* LOTTIE */}
        <div className={styles.lottie}>
          <Lottie animationData={animationData} loop />
        </div>

      </div><Services/>

    </section>
    
  );
}
