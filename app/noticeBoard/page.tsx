import styles from "../../components/NoticeBoard.module.scss";

const notices = [
  {
    title: "Mid-Semester Examination Schedule",
    content:
      "The mid-semester examination for B.Tech 2nd and 4th semester will commence from 15th February 2026. Students are advised to check the detailed schedule.",
    date: "10 Feb 2026",
    category: "Academics",
  },
  {
    title: "Hostel Fee Submission Notice",
    content:
      "All hostel students must submit the hostel fees before 20th February 2026 to avoid late penalties.",
    date: "8 Feb 2026",
    category: "Hostel",
  },
  {
    title: "Library Timings Updated",
    content:
      "The central library will remain open from 9:00 AM to 8:00 PM on all working days with immediate effect.",
    date: "5 Feb 2026",
    category: "Library",
  },
  {
    title: "Scholarship Verification",
    content:
      "Students who have applied for state or national scholarships must complete document verification by 18th February 2026.",
    date: "3 Feb 2026",
    category: "Student",
  },
];

export default function NoticeBoardPage() {
  return (
    <section className={styles.noticePage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Notice Board</h1>
          <p>Latest academic and administrative announcements</p>
        </div>

        <div className={styles.noticeList}>
          {notices.map((notice, index) => (
            <div className={styles.noticeCard} key={index}>
              <div className={styles.top}>
                <div className={styles.title}>{notice.title}</div>
                <span className={styles.tag}>{notice.category}</span>
              </div>

              <div className={styles.content}>{notice.content}</div>

              <div className={styles.footer}>
                Published on: {notice.date}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
