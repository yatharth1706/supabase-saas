import Link from "next/link";
import React from "react";
import { useUser } from "../contexts/user";

function nav() {
  const { user } = useUser();
  console.log(user);
  return (
    <div className="flex w-full border-b border-gray-200 px-6 py-6">
      <Link className="mr-4" href="/">
        Home
      </Link>
      <Link href="/">Pricing</Link>
      <Link className="ml-auto" href={user && Object.keys(user).length > 0 ? "/logout" : "/login"}>
        {user && Object.keys(user).length > 0 ? "Logout" : "Login"}
      </Link>
    </div>
  );
}

export default nav;
