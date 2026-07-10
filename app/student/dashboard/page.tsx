"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./StudentDashboard.module.scss";
import { Bell, LogOut, X, Lock, Download, CheckCircle, XCircle, Clock, Upload, Trash2, Camera } from "lucide-react";
import { useRouter } from "next/navigation";
import { generateBonafidePDF } from "../../utils/generateBonafidePDF";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

// Types
interface Student {
  _id: string;
  name: string;
  regNo: string;
  course: string;
  branch: string;
  mobile: string;
  email: string;
  fatherName?: string;
  motherName?: string;
  dob?: string;
  session?: string;
  semester?: number;
  year?: number;
  admissionDate?: string;
  expectedCompletionYear?: string;
  photo?: string;
}

interface ServiceRequest {
  _id: string;
  serviceType: string;
  status: "Pending" | "Approved" | "Rejected";
  purpose: string;
  rejectionReason?: string;
  createdAt: string;
  approvedAt?: string;
  studentId?: Student;
}

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: "approval" | "rejection" | "info";
  read: boolean;
  createdAt: string;
  relatedRequestId?: { serviceType: string; status: string };
}

interface HostelApplication {
  _id: string;
  hostelType: string;
  roomPreference: string;
  status: "Pending" | "Approved" | "Rejected";
  rejectionReason?: string;
  createdAt: string;
}

export default function StudentDashboard() {
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [hostelApps, setHostelApps] = useState<HostelApplication[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [hostelAppsLoading, setHostelAppsLoading] = useState(true);

  // Modal State
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [purpose, setPurpose] = useState("");

  // Fee input state for Fee Structure
  const [paymentDate, setPaymentDate] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [admissionFee, setAdmissionFee] = useState("");
  const [tuitionFee, setTuitionFee] = useState("");
  const [registrationFee, setRegistrationFee] = useState("");
  const [examFee, setExamFee] = useState("");
  const [developmentFee, setDevelopmentFee] = useState("");
  const [otherCharges, setOtherCharges] = useState("");
  
  // Service Specific State
  const [purposeType, setPurposeType] = useState<string>("");
  const [academicYear, setAcademicYear] = useState<string>("");
  const [reasonForLeaving, setReasonForLeaving] = useState<string>("");
  const [lastSemesterCompleted, setLastSemesterCompleted] = useState<string>("");
  const [organizationName, setOrganizationName] = useState<string>("");
  const [departmentClearances, setDepartmentClearances] = useState({
    library: false,
    hostel: false,
    lab: false,
    accounts: false,
    sports: false,
  });

  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  // Notifications Dropdown
  const [showNotifications, setShowNotifications] = useState(false);

  // Password Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Photo Upload State
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [photoSuccess, setPhotoSuccess] = useState("");

  // Fetch user data
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }

    const userData = JSON.parse(storedUser);
    setStudent(userData);
    setLoading(false);

    // Fetch service requests
    fetchRequests();
    // Fetch hostel applications
    fetchHostelApps();
    // Fetch notifications
    fetchNotifications();
  }, [router]);

  const getToken = () => localStorage.getItem("token");

  const fetchRequests = async () => {
    setRequestsLoading(true);
    try {
      const res = await fetch("/api/service-requests", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (res.ok) {
        setRequests(data.requests || []);
      }
    } catch (err) {
      console.error("Failed to fetch requests");
    } finally {
      setRequestsLoading(false);
    }
  };

  const fetchHostelApps = async () => {
    setHostelAppsLoading(true);
    try {
      const res = await fetch("/api/hostel-applications", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (res.ok) {
        setHostelApps(data.applications || []);
      }
    } catch (err) {
      console.error("Failed to fetch hostel applications");
    } finally {
      setHostelAppsLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (res.ok) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error("Failed to fetch notifications");
    }
  };

const fileInputRef = useRef<HTMLInputElement>(null);

  const markNotificationsRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ markAllRead: true }),
      });
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark notifications as read");
    }
  };

  // Service type mapping for display
  const serviceLabels: Record<string, string> = {
    Bonafide: "Bonafide Certificate",
    FeeStructure: "Fee Structure",
    TC: "Transfer Certificate",
    CharacterCertificate: "Character Certificate",
    NOC: "No Objection Certificate",
    NoDues: "No Dues Certificate",
  };

  // Send Request Handler
  const handleSendRequest = async () => {
    // Basic validation
    if (!selectedService) return;
    
    // Service-specific validation
    if (selectedService === "Bonafide" && !purposeType) { setSubmitError("Please select a purpose type"); return; }
    if (selectedService === "FeeStructure") {
      if (!academicYear) { setSubmitError("Please enter academic year"); return; }
      if (!purposeType) { setSubmitError("Please select purpose"); return; }
      const yearMatch = academicYear.match(/^(\d{4})-(\d{4})$/);
      if (!yearMatch) { setSubmitError("Academic year must be in YYYY-YYYY format"); return; }
      const start = parseInt(yearMatch[1]);
      const end = parseInt(yearMatch[2]);
      if (end <= start) { setSubmitError("End year must be greater than start year"); return; }
    }
    if (selectedService === "TC" && (!reasonForLeaving || !lastSemesterCompleted)) { setSubmitError("Please fill all required fields"); return; }
    if (selectedService === "NOC" && (!purposeType || !organizationName)) { setSubmitError("Please fill all required fields"); return; }
    if (selectedService === "CharacterCertificate" && !purposeType) { setSubmitError("Please select a purpose type"); return; }

    setSubmitLoading(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      const res = await fetch("/api/service-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          serviceType: selectedService,
          purpose: purpose.trim(),
          // Send all fields (server will ignore irrelevant ones)
          purposeType,
          academicYear,
          reasonForLeaving,
          lastSemesterCompleted: Number(lastSemesterCompleted),
          organizationName,
          departmentClearances: selectedService === "NoDues" ? departmentClearances : undefined,
          // Fee fields for Fee Structure
          admissionFee: selectedService === "FeeStructure" ? admissionFee : undefined,
          tuitionFee: selectedService === "FeeStructure" ? tuitionFee : undefined,
          registrationFee: selectedService === "FeeStructure" ? registrationFee : undefined,
          examFee: selectedService === "FeeStructure" ? examFee : undefined,
          developmentFee: selectedService === "FeeStructure" ? developmentFee : undefined,
          otherCharges: selectedService === "FeeStructure" ? otherCharges : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setSubmitSuccess("Request submitted successfully!");
      fetchRequests();
      setTimeout(() => {
        setSelectedService(null);
        setPurpose("");
        setPurposeType("");
        setAcademicYear("");
        setReasonForLeaving("");
        setLastSemesterCompleted("");
        setOrganizationName("");
        setDepartmentClearances({
          library: false,
          hostel: false,
          lab: false,
          accounts: false,
          sports: false,
        });
        setAdmissionFee("");
        setTuitionFee("");
        setRegistrationFee("");
        setExamFee("");
        setDevelopmentFee("");
        setOtherCharges("");
        setSubmitSuccess("");
      }, 1500);
    } catch (err: unknown) {
      const error = err as Error;
      setSubmitError(error.message || "Failed to submit request");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Download approved document
  const handleDownload = (request: ServiceRequest) => {
    if (!student) return;

    // Generate PDF based on service type
    if (request.serviceType === "Bonafide") {
      generateBonafidePDF({
        name: student.name,
        registrationNo: student.regNo,
        course: student.course || "B.Tech",
        branch: student.branch || "",
        semester: String(student.semester || ""),
        year: String(student.year || ""),
        session: student.session || "",
        dob: student.dob ? new Date(student.dob).toLocaleDateString() : "",
        fatherName: student.fatherName || "",
        motherName: student.motherName || "",
        admissionDate: student.admissionDate ? new Date(student.admissionDate).toLocaleDateString() : "",
        expectedCompletionYear: student.expectedCompletionYear || "",
      });
    }
    // Add other document types as needed
  };

// Photo Upload Handler - removed as UploadButton is used instead

  // Remove Photo Handler
  const handleRemovePhoto = async () => {
    if (!confirm("Are you sure you want to remove your photo?")) return;

    setPhotoLoading(true);
    setPhotoError("");
    setPhotoSuccess("");

    try {
      const res = await fetch("/api/users/update-photo", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to remove photo");
      }

      setPhotoSuccess("Photo removed successfully!");
      setStudent(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));

      setTimeout(() => setPhotoSuccess(""), 3000);
    } catch (err: unknown) {
      const error = err as Error;
      setPhotoError(error.message || "Failed to remove photo");
      setTimeout(() => setPhotoError(""), 3000);
    } finally {
      setPhotoLoading(false);
    }
  };

  // Change Password Handler
  const handleChangePassword = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    setPasswordLoading(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      setPasswordSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setShowPasswordModal(false), 1500);
    } catch (err: unknown) {
      const error = err as Error;
      setPasswordError(error.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/login");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.dashboard}>
      {/* TOP BAR */}
      <div className={styles.topBar}>
        <h2 className={styles.title}>Student Dashboard</h2>

        <div className={styles.rightSection}>
          {/* Notifications */}
          <div className={styles.notificationWrapper}>
            <button
              className={styles.notification}
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications && unreadCount > 0) {
                  markNotificationsRead();
                }
              }}
            >
              <Bell size={22} />
              {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
            </button>

            {showNotifications && (
              <div className={styles.notificationDropdown}>
                <div className={styles.notificationHeader}>
                  <h4>Notifications</h4>
                  <button onClick={() => setShowNotifications(false)}>
                    <X size={18} />
                  </button>
                </div>
                <div className={styles.notificationList}>
                  {notifications.length === 0 ? (
                    <p className={styles.noNotifications}>No notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n._id}
                        className={`${styles.notificationItem} ${!n.read ? styles.unread : ""} ${styles[n.type]}`}
                      >
                        <div className={styles.notificationIcon}>
                          {n.type === "approval" ? (
                            <CheckCircle size={18} />
                          ) : n.type === "rejection" ? (
                            <XCircle size={18} />
                          ) : (
                            <Bell size={18} />
                          )}
                        </div>
                        <div className={styles.notificationContent}>
                          <p className={styles.notificationTitle}>{n.title}</p>
                          <p className={styles.notificationMessage}>{n.message}</p>
                          <span className={styles.notificationDate}>{formatDate(n.createdAt)}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {student && (
            <div className={styles.profile}>
              <div className={styles.avatar}>{student.name ? student.name.charAt(0).toUpperCase() : "?"}</div>
              <div>
                <p className={styles.name}>{student.name || "Student"}</p>
                <button className={styles.logout} onClick={handleLogout}>
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Student Info */}
      <div className={styles.profileHeader}>
        <h2>Profile Information</h2>
        <button
          className={styles.changePasswordBtn}
          onClick={() => setShowPasswordModal(true)}
        >
          <Lock size={16} /> Change Password
        </button>
      </div>

      <section className={styles.studentInfo}>
        {/* Student Details Card */}
        <div className={styles.studentDetailsCard}>
          <h3>Student Details</h3>
          
          <div className={styles.studentDetailsContent}>
            {/* Photo Section */}
            <div className={styles.studentPhotoSection}>
              <div className={styles.photoContainer}>
                {student?.photo ? (
                  <>
                    <img 
                      src={`${student.photo}?t=${Date.now()}`} 
                      alt="Student Photo" 
                      className={styles.studentPhoto}
                      onError={(e) => console.error("Image load error:", e)}
                    />
                    <div className={styles.photoOverlay}>
                      <button
                        className={styles.changePhotoBtn}
                        onClick={() => fileInputRef.current?.click()}
                        disabled={photoLoading}
                        title="Change photo"
                      >
                        <Camera size={18} />
                      </button>
                      <button
                        className={styles.removePhotoBtn}
                        onClick={handleRemovePhoto}
                        disabled={photoLoading}
                        title="Remove photo"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className={styles.photoPlaceholder}>
                    <span className={styles.avatarLarge}>{student?.name.charAt(0).toUpperCase()}</span>
                    <button
                      className={styles.uploadPhotoBtn}
                      onClick={() => fileInputRef.current?.click()}
                      disabled={photoLoading}
                    >
                      <Upload size={16} />
                    </button>
                  </div>
                )}
               <UploadButton<OurFileRouter, "profileImage">
  endpoint="profileImage"
  onUploadBegin={() => {
    setPhotoLoading(true);
    setPhotoError("");
    setPhotoSuccess("");
  }}
  onClientUploadComplete={async (res) => {
    try {
     
      const imageUrl = res[0].ufsUrl;

      // 🔥 Save to your backend
      const response = await fetch("/api/users/update-photo", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ photo: imageUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save photo");
      }

      setStudent(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));

      setPhotoSuccess("Photo updated successfully!");
    } catch (err: any) {
      setPhotoError(err.message);
    } finally {
      setPhotoLoading(false);
      setTimeout(() => setPhotoSuccess(""), 3000);
    }
  }}
  onUploadError={(error: Error) => {
    setPhotoError(error.message);
    setPhotoLoading(false);
  }}
/>
              </div>
              {photoError && <p className={styles.photoError}>{photoError}</p>}
              {photoSuccess && <p className={styles.photoSuccess}>{photoSuccess}</p>}
              {photoLoading && <p className={styles.photoLoading}>Processing...</p>}
            </div>

            {/* Details Grid */}
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Name</span>
                <span className={styles.detailValue}>{student?.name}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Registration No</span>
                <span className={styles.detailValue}>{student?.regNo}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Email</span>
                <span className={styles.detailValue}>{student?.email || "N/A"}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Mobile</span>
                <span className={styles.detailValue}>{student?.mobile || "N/A"}</span>
              </div>
              {student?.dob && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Date of Birth</span>
                  <span className={styles.detailValue}>{new Date(student.dob).toLocaleDateString("en-IN")}</span>
                </div>
              )}
              {student?.fatherName && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Father's Name</span>
                  <span className={styles.detailValue}>{student.fatherName}</span>
                </div>
              )}
              {student?.motherName && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Mother's Name</span>
                  <span className={styles.detailValue}>{student.motherName}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Academic Information Card */}
        <div className={styles.academicInfoCard}>
          <h3>Academic Information</h3>
          
          <div className={styles.academicDetailsGrid}>
            <div className={styles.academicDetailItem}>
              <span className={styles.academicDetailLabel}>Course</span>
              <span className={styles.academicDetailValue}>{student?.course || "N/A"}</span>
            </div>
            <div className={styles.academicDetailItem}>
              <span className={styles.academicDetailLabel}>Branch</span>
              <span className={styles.academicDetailValue}>{student?.branch || "N/A"}</span>
            </div>
            <div className={styles.academicDetailItem}>
              <span className={styles.academicDetailLabel}>Session</span>
              <span className={styles.academicDetailValue}>{student?.session || "N/A"}</span>
            </div>
            <div className={styles.academicDetailItem}>
              <span className={styles.academicDetailLabel}>Semester</span>
              <span className={styles.academicDetailValue}>{student?.semester || "N/A"}</span>
            </div>
            <div className={styles.academicDetailItem}>
              <span className={styles.academicDetailLabel}>Year</span>
              <span className={styles.academicDetailValue}>{student?.year || "N/A"}</span>
            </div>
            {student?.admissionDate && (
              <div className={styles.academicDetailItem}>
                <span className={styles.academicDetailLabel}>Admission Date</span>
                <span className={styles.academicDetailValue}>{new Date(student.admissionDate).toLocaleDateString("en-IN")}</span>
              </div>
            )}
            {student?.expectedCompletionYear && (
              <div className={styles.academicDetailItem}>
                <span className={styles.academicDetailLabel}>Expected Completion</span>
                <span className={styles.academicDetailValue}>{student.expectedCompletionYear}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className={styles.services}>
        <div className={styles.servicesHeader}>
          <h2>Apply for Services</h2>
          <p className={styles.servicesSubtitle}>Select a service to apply for certificates and official documents</p>
        </div>
        <div className={styles.serviceGrid}>
          {Object.entries(serviceLabels).map(([key, label]) => (
            <button
              key={key}
              className={`${styles.serviceCard} ${styles[`service-${key}`]}`}
              onClick={() => setSelectedService(key)}
              title={`Apply for ${label}`}
            >
              <div className={styles.serviceCardContent}>
                <h3>{label}</h3>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Service Request Modal */}
      {selectedService && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Apply for {serviceLabels[selectedService]}</h3>
              <button onClick={() => setSelectedService(null)}>
                <X />
              </button>
            </div>

            {/* Dynamic Fields based on Service Type */}
            
            {/* Bonafide Certificate */}
            {selectedService === "Bonafide" && (
              <>
                <label>Purpose Type *</label>
                <select 
                  value={purposeType} 
                  onChange={(e) => setPurposeType(e.target.value)}
                  className={styles.selectInput}
                  required
                >
                  <option value="">Select Purpose</option>
                  <option value="Education">Education Loan</option>
                  <option value="Scholarship">Scholarship</option>
                  <option value="Internship">Internship</option>
                  <option value="Other">Other</option>
                </select>
              </>
            )}

            {/* Fee Structure */}
            {selectedService === "FeeStructure" && (
              <>
                <label>Academic Year *</label>
                <input
                  type="text"
                  placeholder="e.g., 2025-2026"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className={styles.textInput}
                  pattern="^\d{4}-\d{4}$"
                  title="Academic year must be in YYYY-YYYY format"
                  required
                />
                <label>Purpose *</label>
                <select 
                  value={purposeType} 
                  onChange={(e) => setPurposeType(e.target.value)}
                  className={styles.selectInput}
                  required
                >
                  <option value="">Select Purpose</option>
                  <option value="State Level">State Level PMS</option>
                  <option value="Central Level">Central Level NSP</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Bank Loan">Bank Loan</option>
                </select>

                {/* Fee Input Form - visible after purpose is selected */}
                {purposeType && (
                  <div style={{marginTop: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: 8}}>
                    <h4 style={{marginBottom: 8}}>Enter Fee Details</h4>
                    <label>paymentDate</label>
                    <input type="date" className={styles.textInput} value={paymentDate} onChange={e => setPaymentDate(e.target.value)} required />
                    <label>Transaction ID</label>
                    <input type="string" min="0" className={styles.textInput} placeholder="Transaction ID" value={transactionId} onChange={e => setTransactionId(e.target.value)} required />
                    <label>Admission Fee</label>
                    <input type="number" min="0" className={styles.textInput} placeholder="Admission Fee" value={admissionFee} onChange={e => setAdmissionFee(e.target.value)} required />
                    <label>Tuition Fee</label>
                    <input type="number" min="0" className={styles.textInput} placeholder="Tuition Fee" value={tuitionFee} onChange={e => setTuitionFee(e.target.value)} required />
                    <label>Registration Fee</label>
                    <input type="number" min="0" className={styles.textInput} placeholder="Registration Fee" value={registrationFee} onChange={e => setRegistrationFee(e.target.value)} required />
                    <label>Exam Fee</label>
                    <input type="number" min="0" className={styles.textInput} placeholder="Exam Fee" value={examFee} onChange={e => setExamFee(e.target.value)} required />
                    <label>Development Fee</label>
                    <input type="number" min="0" className={styles.textInput} placeholder="Development Fee" value={developmentFee} onChange={e => setDevelopmentFee(e.target.value)} required />
                    <label>Other Charges</label>
                    <input type="number" min="0" className={styles.textInput} placeholder="Other Charges" value={otherCharges} onChange={e => setOtherCharges(e.target.value)} required />
                  </div>
                )}
              </>
            )}
{/* // Fee input state for Fee Structure
  const [admissionFee, setAdmissionFee] = useState("");
  const [tuitionFee, setTuitionFee] = useState("");
  const [registrationFee, setRegistrationFee] = useState("");
  const [examFee, setExamFee] = useState("");
  const [developmentFee, setDevelopmentFee] = useState("");
  const [otherCharges, setOtherCharges] = useState(""); */}

            {/* Transfer Certificate */}
            {selectedService === "TC" && (
              <>
                <label>Reason for Leaving *</label>
                <textarea
                  placeholder="Reason for applying for TC..."
                  value={reasonForLeaving}
                  onChange={(e) => setReasonForLeaving(e.target.value)}
                  required
                  minLength={10}
                />
                <label>Last Semester Completed *</label>
                <input
                  type="number"
                  placeholder="e.g., 8"
                  value={lastSemesterCompleted}
                  onChange={(e) => setLastSemesterCompleted(e.target.value)}
                  className={styles.textInput}
                  required
                  min="1"
                  max="8"
                />
              </>
            )}

            {/* Character Certificate */}
            {selectedService === "CharacterCertificate" && (
              <>
                <label>Purpose Type *</label>
                <select 
                  value={purposeType} 
                  onChange={(e) => setPurposeType(e.target.value)}
                  className={styles.selectInput}
                  required
                >
                  <option value="">Select Purpose</option>
                  <option value="HigherStudies">Higher Studies</option>
                  <option value="Job">Job Application</option>
                  <option value="Other">Other</option>
                </select>
              </>
            )}

            {/* NOC */}
            {selectedService === "NOC" && (
              <>
                <label>Purpose Type *</label>
                <select 
                  value={purposeType} 
                  onChange={(e) => setPurposeType(e.target.value)}
                  className={styles.selectInput}
                  required
                >
                  <option value="">Select Purpose</option>
                  <option value="Internship">Internship</option>
                  <option value="Event">Event Participation</option>
                  <option value="Visit">Industrial Visit</option>
                </select>
                <label>Organization Name *</label>
                <input
                  type="text"
                  placeholder="Name of organization/company"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  className={styles.textInput}
                  required
                />
              </>
            )}

            {/* No Dues */}
            {selectedService === "NoDues" && (
              <>
                <label>Department Clearances</label>
                <div className={styles.checkboxGroup}>
                  {Object.entries(departmentClearances).map(([key, checked]) => (
                    <label key={key} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) =>
                          setDepartmentClearances((prev) => ({
                            ...prev,
                            [key]: e.target.checked,
                          }))
                        }
                      />
                      {key.charAt(0).toUpperCase() + key.slice(1)} Clearance
                    </label>
                  ))}
                </div>
              </>
            )}

            {/* Generic Purpose Field (always visible as Description/Remarks) */}
            <label>
              {selectedService === "TC" ? "Additional Remarks" : 
               selectedService === "NoDues" ? "Purpose of No Dues" :
               "Description / Purpose *"}
            </label>
            <textarea
              placeholder="Enter details..."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              required
              minLength={10}
            />

            {submitError && <p className={styles.errorMsg}>{submitError}</p>}
            {submitSuccess && <p className={styles.successMsg}>{submitSuccess}</p>}

            <button
              className={styles.sendBtn}
              onClick={handleSendRequest}
              disabled={submitLoading}
            >
              {submitLoading ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </div>
      )}

      {/* Request Status */}
      <section className={styles.status}>
        <h2>Request Status</h2>
        {requestsLoading ? (
          <p>Loading requests...</p>
        ) : requests.length === 0 ? (
          <p className={styles.noData}>No service requests yet. Apply for a service above.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Service</th>
                <th>Purpose</th>
                <th>Applied On</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req._id}>
                  <td>{serviceLabels[req.serviceType] || req.serviceType}</td>
                  <td className={styles.purposeCell}>{req.purpose}</td>
                  <td>{formatDate(req.createdAt)}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[req.status.toLowerCase()]}`}>
                      {req.status === "Pending" && <Clock size={14} />}
                      {req.status === "Approved" && <CheckCircle size={14} />}
                      {req.status === "Rejected" && <XCircle size={14} />}
                      {req.status}
                    </span>
                    {req.status === "Rejected" && req.rejectionReason && (
                      <p className={styles.rejectionReason}>Reason: {req.rejectionReason}</p>
                    )}
                  </td>
                  <td>
                    {req.status === "Approved" && (
                      <button
                        className={styles.downloadBtn}
                        onClick={() => handleDownload(req)}
                      >
                        <Download size={16} /> Download
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Hostel Applications Status */}
      <section className={styles.hostelStatus}>
        <div className={styles.statusHeader}>
          <h2>Hostel Application Status</h2>
          <p className={styles.statusSubtitle}>Track your hostel applications and view approval status</p>
        </div>
        {hostelAppsLoading ? (
          <p className={styles.loadingText}>Loading hostel applications...</p>
        ) : hostelApps.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 4L4 14v16c0 8 20 12 20 12s20-4 20-12V14L24 4z" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className={styles.emptyStateText}>No hostel applications submitted yet</p>
            <p className={styles.emptyStateDescription}>Apply for hostel accommodation to get started</p>
            <button 
              className={styles.applyHostelBtn}
              onClick={() => router.push('/hostel-services')}
            >
              <span>+ Apply for Hostel</span>
            </button>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.hostelTable}>
              <thead>
                <tr>
                  <th>Hostel Type</th>
                  <th>Room Preference</th>
                  <th>Applied On</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {hostelApps.map((app) => (
                  <tr key={app._id}>
                    <td className={styles.hostelTypeCell}>{app.hostelType}</td>
                    <td>{app.roomPreference}</td>
                    <td>{formatDate(app.createdAt)}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[app.status.toLowerCase()]}`}>
                        {app.status === "Pending" && <Clock size={14} />}
                        {app.status === "Approved" && <CheckCircle size={14} />}
                        {app.status === "Rejected" && <XCircle size={14} />}
                        {app.status}
                      </span>
                      {app.status === "Rejected" && app.rejectionReason && (
                        <p className={styles.rejectionReason}>Reason: {app.rejectionReason}</p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Change Password</h3>
              <button onClick={() => setShowPasswordModal(false)}>
                <X />
              </button>
            </div>

            <label>Current Password *</label>
            <input
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <label>New Password *</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <label>Confirm New Password *</label>
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {passwordError && <p className={styles.errorMsg}>{passwordError}</p>}
            {passwordSuccess && <p className={styles.successMsg}>{passwordSuccess}</p>}

            <button
              className={styles.sendBtn}
              onClick={handleChangePassword}
              disabled={passwordLoading}
            >
              {passwordLoading ? "Changing..." : "Change Password"}
            </button>
          </div>
        </div>
      )}      
    </div>
  );
}


