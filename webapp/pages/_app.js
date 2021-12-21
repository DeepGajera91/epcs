import "../styles/globals.css";
import React from "react";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Wrapper Component={Component} pageProps={pageProps} />
    </>
  );
}

function Wrapper({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
