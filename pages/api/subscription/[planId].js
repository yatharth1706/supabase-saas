import { supabase } from "../../../utils/supabase";
const handler = async (req, res) => {
  const refreshToken = req.cookies["my-refresh-token"];
  const accessToken = req.cookies["my-access-token"];

  if (refreshToken && accessToken) {
    await supabase.auth.setSession({
      refresh_token: refreshToken,
      access_token: accessToken,
    });
  } else {
    // make sure you handle this case!
    res.status(401).send("User is not authenticated.");
  }
  const { data } = await supabase.auth.getUser();
  console.log(req.cookies);
  res.send(data);
};

export default handler;
