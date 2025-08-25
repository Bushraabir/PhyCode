import "@/styles/globals.css";                // Global CSS styles
import type { AppProps } from "next/app";     // Next.js App types
import Head from "next/head";                 // For SEO meta tags
import { RecoilRoot } from "recoil";          // State management
import { ToastContainer } from "react-toastify"; // Toast notifications
import "react-toastify/dist/ReactToastify.css";  // Toast styles
import React from "react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      {/* SEO and Head Metadata */}
      <Head>
        {/* Primary Title */}
        <title>PhyCode - Merge of Physics and Coding Concepts</title>

        {/* Primary Meta Tags */}
        <meta name="description" content="PhyCode is an innovative platform merging Physics problems with Coding challenges to enhance problem-solving skills." />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.png" />

        {/* Open Graph / Social Sharing */}
        <meta property="og:title" content="PhyCode - Physics meets Coding" />
        <meta property="og:description" content="Solve Physics-inspired coding problems and enhance your computational thinking with PhyCode." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://phy-code.vercel.app/" />
        <meta property="og:image" content="/favicon.png" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="PhyCode - Physics meets Coding" />
        <meta name="twitter:description" content="Solve Physics-inspired coding problems and enhance your computational thinking with PhyCode." />
        <meta name="twitter:image" content="/favicon.png" />
      </Head>

      {/* Toast Notification Container */}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Render the page component */}
      <Component {...pageProps} />
    </RecoilRoot>
  );
}
