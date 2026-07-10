import styles from "../components/ServiceCard.module.scss";
import Link from "next/link";

const services = [
  {
    title: "Hostel Services",
    desc: "Accommodation facilities for students with security and comfort.",
    icon: "🏠",
    link: "/hostel-services",
  },
  {
    title: "Academic Services",
    desc: "Academic resources, syllabus, and examination support.",
    icon: "📘",
    link: "/login",
  },
  {
    title: "Student Section",
    desc: "Student related services, forms, and announcements.",
    icon: "🎓",
    link: "/login",
  },
  {
    title: "Library",
    desc: "Access to books, journals, and digital resources.",
    icon: "📚",
    link: "#",
  },
  {
    title: "Notice Board",
    desc: "Latest notices, circulars, and announcements.",
    icon: "📢",
    link: "/noticeBoard",
  },
];

export default function Services() {
  return (
    <section className={styles.services}>
      <div className={styles.heading}>
        <h2>College Services</h2>
        <p>Quick access to essential college facilities</p>
      </div>

      <div className={styles.grid}>
        {services.map((service, index) => (
          <Link href={service.link} key={index} className={styles.card}>
            <div className={styles.icon}>{service.icon}</div>
            <div className={styles.title}>{service.title}</div>
            <div className={styles.desc}>{service.desc}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
