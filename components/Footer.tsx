import styles from "./Footer.module.scss";
import Link from "next/link";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaLinkedin,
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";


export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>

        {/* COLLEGE INFO */}
        <div className={styles.section}>
          <h3>G.E.C Vaishali</h3>
          <p>
            Government Engineering College Vaishali <br />
            Bihar, India
          </p>

          <div className={styles.social}>
            <a href="https://www.facebook.com/Gecvaishaliofficial" aria-label="Facebook"><FaFacebook /></a>
            
            <a href="https://twitter.com/gec_vaishali/" aria-label="Twitter"><FaTwitter /></a>
            
            <a href="http://www.linkedin.com/company/gec-vaishali-official" aria-label="LinkedIn"><FaLinkedin /></a>
            
            <a href="https://www.instagram.com/gecvaishaliofficial" aria-label="Instagram"><FaInstagram /></a>
            
            <a href="https://www.youtube.com/@GECVaishali" aria-label="YouTube"><FaYoutube /></a>
          
          </div>
        </div>

        {/* QUICK LINKS */}
        <div className={styles.section}>
          <h3>Quick Links</h3>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/college">The College</Link></li>
            <li><Link href="/departments">Departments</Link></li>
            <li><Link href="/services">Services</Link></li>
          </ul>
        </div>

        {/* SERVICES */}
        <div className={styles.section}>
          <h3>Services</h3>
          <ul>
            <li><Link href="/hostel">Hostel Services</Link></li>
            <li><Link href="/library">Library</Link></li>
            <li><Link href="/student">Student Section</Link></li>
            <li><Link href="/notices">Notice Board</Link></li>
          </ul>
        </div>

        {/* CONTACT */}
        <div className={styles.section}>
          <h3>Contact</h3>
          <p>
            📞 +91-6229-297002 <br />
            ✉️ principalgecvaishali@gmail.com
          </p>
        </div>

      </div>

      <div className={styles.bottom}>
        © {new Date().getFullYear()} <Link href="https://www.raghudhan.com/" target="_blank" rel="noopener noreferrer">
          RAGHUDHAN PVT LTD
        </Link> | All Rights Reserved
      </div>
    </footer>
  );
}
