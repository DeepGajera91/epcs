import Head from "next/head";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import styles from "./index.module.css";
import ProductView from "../components/ProductView";
import Populer from "../components/Populer";
import Loading from "../components/Loading";
import Link from "next/link";

import { useRouter } from "next/router";

import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import ClearSharpIcon from "@mui/icons-material/ClearSharp";
import AccountCircleSharpIcon from "@mui/icons-material/AccountCircleSharp";
import CompareSharpIcon from "@mui/icons-material/CompareSharp";

export default function Home() {
  const [content, setContent] = useState({});
  const [populerdeal, setPopulerdeal] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const [isloggedin, setisLoggedIn] = useState("false");

  const router = useRouter();

  useEffect(() => {
    const islog = localStorage.getItem("isloggedin");
    setisLoggedIn(islog);

    const fetchData = async () => {
      setLoading(true);
      setPopulerdeal([]);
      await axios
        .get("http://127.0.0.1:8000/populer/")
        .then((response) => {
          setLoading(false);
          setPopulerdeal(response.data);
          console.log(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setContent({});
    let data = new FormData();
    data.append("product_name", inputRef.current.value);

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

  const handlelogout = () => {
    localStorage.setItem("isloggedin", "false");
    setisLoggedIn("false");
  };

  return (
    <div className="container">
      <Head>
        <title>EPCS</title>
        <meta name="description" content="EPCS" />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <div className={styles.navbar}>
          <h1 className={styles.title}>
            <CompareSharpIcon fontSize="large" />
            EPCS
          </h1>
          <div className={styles.searchContainer}>
            <input
              type="text"
              id="name"
              name="name"
              ref={inputRef}
              placeholder="Enter product name..."
            />
            <button
              onClick={(e) => handleSubmit(e)}
              className={styles.searchButton}
            >
              <SearchSharpIcon />
            </button>

            <button
              onClick={(e) => {
                setContent({});
                setLoading(false);
              }}
              className={styles.searchButton}
            >
              <ClearSharpIcon />
            </button>
          </div>
          {isloggedin === "true" ? (
            <div className={styles.signContainer}>
              <button
                className={styles.searchButton}
                onClick={() => handlelogout()}
              >
                Logout
              </button>
              <div className={styles.profile}>
                <AccountCircleSharpIcon />
                {localStorage.getItem("username")}
              </div>
            </div>
          ) : (
            <div className={styles.signContainer}>
              <Link href="/signup">
                <button className={styles.searchButton}>Sign up</button>
              </Link>
              <Link href="/login">
                <button className={styles.searchButton}>Sign In</button>
              </Link>
            </div>
          )}
        </div>
        <div className={styles.category_container}>
          <div
            className={styles.category}
            onClick={() => router.push("/product/laptop")}
          >
            Laptops
          </div>
          <div
            className={styles.category}
            onClick={() => router.push("/product/mobile")}
          >
            Mobiles
          </div>
          <div
            className={styles.category}
            onClick={() => router.push("/product/air+conditioner")}
          >
            Air Conditioners
          </div>
          <div
            className={styles.category}
            onClick={() => router.push("/product/television")}
          >
            Televisions
          </div>
          <div
            className={styles.category}
            onClick={() => router.push("/product/refrigerator")}
          >
            Refrigerator
          </div>
          <div
            className={styles.category}
            onClick={() => router.push("/product/electronic")}
          >
            Electronics
          </div>
          <div
            className={styles.category}
            onClick={() => router.push("/product/furniture")}
          >
            Furnitures
          </div>
        </div>
        {loading ? (
          <Loading />
        ) : JSON.stringify(content) === "{}" ? (
          <Populer populerdeal={populerdeal} />
        ) : (
          <ProductView content={content} isloggedin={isloggedin} />
        )}
      </main>
    </div>
  );
}
