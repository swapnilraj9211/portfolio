"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "../academic/bonafide/academic.module.scss";

type ServiceType =
  | ""
  | "BONAFIDE"
  | "FEE_STRUCTURE"
  | "NO_DUES"
  | "TRANSFER"
  | "CHARACTER";

const ServiceRedirectPage = () => {
  const router = useRouter();
  const [service, setService] = useState<ServiceType>("");
  const [animate, setAnimate] = useState(false);

  const handleServiceChange = (value: ServiceType) => {
    setService(value);
    setAnimate(true);

    setTimeout(() => {
      switch (value) {
        case "BONAFIDE":
          router.push("/academic/bonafide");
          break;
        case "FEE_STRUCTURE":
          router.push("/academic/fee-receipt");
          break;
        case "NO_DUES":
          router.push("/academic/no-dues");
          break;
        case "TRANSFER":
          router.push("/academic/transfer");
          break;
        case "CHARACTER":
          router.push("/academic/character");
          break;
        default:
          break;
      }
    }, 350);
  };

  return (
    <div className={`${styles.container1} ${animate ? styles.fadeOut : ""}`}>
      <h1 className={styles.heading}>Academic Section – Certificate Services</h1>

      <div className={styles.group}>
        <label>Select Service</label>
        <select
          value={service}
          onChange={(e) =>
            handleServiceChange(e.target.value as ServiceType)
          }
        >
          <option value="">-- Select Service --</option>
          <option value="BONAFIDE">Bonafide Certificate</option>
          <option value="FEE_STRUCTURE">Fee Structure</option>
          <option value="NO_DUES">No Dues Certificate</option>
          <option value="TRANSFER">Transfer / Leaving Certificate</option>
          <option value="CHARACTER">Character Certificate</option>
        </select>
      </div>
    </div>
  );
};

export default ServiceRedirectPage;
