import { supabase } from "../../../utils/supabase";
const handler = async (req, res) => {
  const accessToken = req.cookies["my-access-token"];

  if (!accessToken) {
    // make sure you handle this case!
    res.status(401).send("User is not authenticated.");
  }
  const { data } = await supabase.auth.getUser(accessToken);
  console.log(req.cookies);
  res.send(data);
};

export default handler;
