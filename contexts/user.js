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
    supabase.auth.onAuthStateChange((event, session) => {
      saveUser();
      if (event === "SIGNED_OUT" || event === "USER_DELETED") {
        // delete cookies on sign out
        const expires = new Date(0).toUTCString();
        document.cookie = `my-access-token=; path=/; expires=${expires}; SameSite=Lax; secure`;
        document.cookie = `my-refresh-token=; path=/; expires=${expires}; SameSite=Lax; secure`;
      } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        const maxAge = 100 * 365 * 24 * 60 * 60; // 100 years, never expires
        document.cookie = `my-access-token=${session.access_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`;
        document.cookie = `my-refresh-token=${session.refresh_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`;
      }
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
