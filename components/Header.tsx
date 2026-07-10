import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.scss";
import { FiLayers,FiBookOpen, FiUser, FiHome, FiAward, FiTool, FiInfo, FiBriefcase, FiBook, FiLogIn, FiBell } from "react-icons/fi";
import { FaGraduationCap } from "react-icons/fa";
import { MdSchool } from "react-icons/md";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>

        {/* LEFT: LOGOS + NAME */}
        <Link href="/" className={styles.logoArea}>
          <Image
            src="/logos/college-logo.png"
            alt="G.E.C Vaishali Logo"
            width={45}
            height={45}
            priority
          />

          <span className={styles.collegeName}>G.E.C Vaishali</span>
        </Link>

        {/* RIGHT: NAVIGATION */}
        <nav className={styles.nav}>
          <Link href="/">Home</Link>
          <a
          href="https://www.gecvaishali.ac.in/"
          target="_blank"
          rel="noopener noreferrer">College</a>

          <Link href="/about" > About</Link>
          <div className={styles.dropdown}>
          <span className={styles.navItem} style={{ fontWeight: 700 }}>
             Department
          </span>

          <div className={styles.dropdownMenu}>
            <Link href="#"><FaGraduationCap/> M.Tech</Link>
            <Link href="#"><MdSchool/> B.Tech</Link>
            
          </div>
        </div>
          <div className={styles.dropdown}>
          <span className={styles.navItem} style={{ fontWeight: 700 }}>
             Services
          </span>

          <div className={styles.dropdownMenu}>
            <Link href="/hostel-services"><FiHome /> Hostel</Link>
            <Link href="/academic"><FiAward /> Academics</Link>
            <Link href="#"><FiUser /> Student</Link>
            <Link href="#"><FiBookOpen /> Library</Link>
          </div>
        </div>
          <Link href="/noticeBoard"> Notice Board</Link>

          <Link href="/login"> Login</Link>
        </nav>

      </div>
    </header>
  );
}
