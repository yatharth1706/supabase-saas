import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { createContext, useContext } from "react";
import { supabase } from "../utils/supabase";

const UserContext = createContext();

export default function Provider({ children }) {
  const [user, setUser] = useState("Initial user");
  const router = useRouter();

  useEffect(() => {
    saveUser();
    changeUserOnAuthChange();
  }, []);

  function login() {
    supabase.auth.signInWithOAuth({
      provider: "github",
    });
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  function changeUserOnAuthChange() {
    supabase.auth.onAuthStateChange(() => {
      saveUser();
    });
  }

  async function getUserProfile(res) {
    const user = res?.user;

    if (user) {
      const { data: profile } = await supabase
        .from("profile")
        .select("*")
        .eq("id", user?.id)
        .single();
      console.log(user);
      console.log(profile);
      setUser({ ...user, ...profile });
    } else {
      setUser({ ...user });
    }
  }

  function saveUser() {
    supabase.auth
      .getUser()
      .then((userRes) => getUserProfile(userRes.data))
      .catch((e) => setUser(e));
  }

  const toExpose = {
    user,
    login,
    logout,
  };

  return <UserContext.Provider value={toExpose}>{children}</UserContext.Provider>;
}

export const useUser = () => useContext(UserContext);
