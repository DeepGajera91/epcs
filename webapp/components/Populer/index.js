import styles from "./populer.module.css";
import Link from "next/link";

export default function Index({ populerdeal }) {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.title}>Popular Deals</div>
        <div className={styles.inner_container}>
          {populerdeal.map((item, Index) => {
            return (
              <div key={Index} className={styles.item_container}>
                <img src={item.imag_url} alt="Image" />
                <div>{item.name}</div>
                <h3>From {item.des}</h3>
                <Link href={item.link}>
                  <a target="_blank">View Details</a>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
