import { supabase } from "../../utils/supabase";

const handler = async (req, res) => {
  await supabase.auth.setSession(req, res);
};

export default handler;
