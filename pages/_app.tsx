import "../styles/globals.css";
import type { AppProps } from "next/app";
import UserProvider from "./../contexts/user";
import Nav from "../components/nav";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Nav />
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default MyApp;
