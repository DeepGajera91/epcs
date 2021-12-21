import styles from "./productview.module.css";
import Link from "next/link";
import Image from "next/image";
import AmazonLogo from "../../assets/Amazon_logo.svg";
import FlipkartLogo from "../../assets/flipkart.svg";
import CromaLogo from "../../assets/Croma_Logo.png";

import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure();

export default function Index({ content, isloggedin }) {
  const handleAlert = async () => {
    if (isloggedin === "true") {
      let data = new FormData();
      data.append("username", localStorage.getItem("username"));
      data.append("name", content.des);
      data.append("priceA", content.priceA);
      data.append("priceF", content.priceF);
      data.append("priceC", content.priceC);
      data.append("linkA", content.linkA);
      data.append("linkF", content.linkF);
      data.append("linkC", content.linkC);
      await axios
        .post("http://127.0.0.1:8000/email/", data)
        .then((response) => {
          console.log(response.data);
          toast.success(response.data, {
            position: "top-center",
            autoClose: 3500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      toast.error("Please Log In!", {
        position: "top-center",
        autoClose: 3500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.pname}>{content.pname}</div>
      <div className={styles.pdetail}>
        <img src={content.imagurl} alt="Image" />
        <div className={styles.desContainer}>
          <div className={styles.des}>{content.des}</div>
          {content.detail.map((d, Index) => {
            return (
              <div className={styles.desList} key={Index}>
                - {d}
              </div>
            );
          })}
          <div className={styles.price_alert} onClick={() => handleAlert()}>
            Set Price Alert
          </div>
        </div>
      </div>
      <div className={styles.price_container}>
        <div className={styles.price_list_item}>
          <Image
            src={AmazonLogo}
            alt="logo"
            height="64px"
            width="64px"
            layout="fixed"
          />
          <div>Rs.{content.priceA}</div>
          <Link href={content.linkA}>
            <a target="_blank">View Details</a>
          </Link>
        </div>
        <div className={styles.price_list_item}>
          <Image
            src={FlipkartLogo}
            alt="logo"
            height="64px"
            width="64px"
            layout="fixed"
          />
          <div>Rs.{content.priceF}</div>
          <Link href={content.linkF}>
            <a target="_blank">View Details</a>
          </Link>
        </div>
        <div className={styles.price_list_item}>
          <Image
            src={CromaLogo}
            alt="logo"
            height="64px"
            width="64px"
            layout="fixed"
          />
          <div>Rs.{content.priceC}</div>
          <Link href={content.linkC}>
            <a target="_blank">View Details</a>
          </Link>
        </div>
      </div>
    </div>
  );
}
