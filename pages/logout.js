import React, { useEffect } from "react";
import { supabase } from "../utils/supabase";
import { useRouter } from "next/router";
import { useUser } from "../contexts/user";

function logout() {
  const router = useRouter();
  const { logout } = useUser();

  useEffect(() => {
    logout();
  }, []);

  return <div></div>;
}

export default logout;
