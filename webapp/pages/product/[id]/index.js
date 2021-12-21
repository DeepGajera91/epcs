import Head from "next/head";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Loading from "../../../components/Loading";
import styles from "./product.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ProductView from "../../../components/ProductView";

export default function Home() {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState({});
  const [isloggedin, setisLoggedIn] = useState("false");

  useEffect(() => {
    const islog = localStorage.getItem("isloggedin");
    console.log(islog);
    setisLoggedIn(islog);
    const fetchData = async () => {
      setLoading(true);
      await axios
        .get(`http://127.0.0.1:8000/product/${id}`)
        .then((response) => {
          console.log(response.data);
          setLoading(false);
          setData(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchData();
  }, []);

  const handleSubmit = async (d) => {
    console.log(d);
    setLoading(true);
    setContent({});
    let data = new FormData();
    data.append("product_name", d.des.substring(0, 20));

    await axios
      .post("http://127.0.0.1:8000/", data)
      .then((response) => {
        console.log(response);
        setLoading(false);
        setContent(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <Head>
        <title>EPCS</title>
        <meta name="description" content="EPCS" />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main_container}>
        <div className={styles.back_container}>
          <Link href="/">
            <div className={styles.back}>
              <ArrowBackIcon />
              back
            </div>
          </Link>
        </div>
        {loading ? (
          <Loading />
        ) : JSON.stringify(content) === "{}" ? (
          <div className={styles.container}>
            {data.map((d, Index) => {
              return (
                <div key={Index} className={styles.item}>
                  <img src={d.imag_url} alt="img" />
                  <div className={styles.detail}>
                    <div className={styles.title}>{d.des}</div>
                    <div className={styles.price_container}>
                      <div className={styles.price}>price ₹{d.price}</div>
                      <div
                        className={styles.link}
                        onClick={() => handleSubmit(d)}
                      >
                        View Details
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <ProductView content={content} isloggedin={isloggedin} />
        )}
      </main>
    </div>
  );
}
