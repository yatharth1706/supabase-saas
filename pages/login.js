import React, { useEffect } from "react";
import { supabase } from "../utils/supabase";
import { useUser } from "./../contexts/user";

function login() {
  const { login } = useUser();

  useEffect(() => {
    login();
  }, []);

  return <div></div>;
}

export default login;
