import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
    <Head>

      <title>PhyCode</title>
      <meta name="description" content="Merge of Physics and Coding concepts" />
      <link rel="icon" href="/favicon.ico" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="UTF-8" />

    </Head>
    <Component {...pageProps} />
    </>
  );
}
