import React, { useEffect } from "react";
import { supabase } from "../utils/supabase";

function login() {
  useEffect(() => {
    supabase.auth.signInWithOAuth({
      provider: "github",
    });
  }, []);

  return <div></div>;
}

export default login;
