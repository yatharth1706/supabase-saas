import React, { useEffect } from "react";
import { supabase } from "../utils/supabase";
import { useRouter } from "next/router";

function logout() {
  const router = useRouter();
  useEffect(() => {
    const logout = async () => {
      await supabase.auth.signOut();
      router.push("/");
    };
    logout();
  }, []);

  return <div></div>;
}

export default logout;
