import { useEffect } from "react";
import { useState } from "react";
import { supabase } from "../utils/supabase";
import Video from "react-player";

const LessonDetails = ({ lesson }) => {
  const [premiumUrl, setPremiumUrl] = useState("");

  useEffect(() => {
    getPremiumContent();
  });

  const getPremiumContent = async () => {
    const { data: premiumContentRecord } = await supabase
      .from("premium_content")
      .select("premium_url")
      .eq("id", lesson?.id)
      .single();

    setPremiumUrl(premiumContentRecord?.premium_url);
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-16 px-8">
      <h1 className="text-3xl mb-6">{lesson.title}</h1>
      <p className="mb-4">{lesson.description}</p>
      <p>{premiumUrl && <Video url={premiumUrl} width="100" />}</p>
    </div>
  );
};

export const getStaticPaths = async () => {
  const { data: lessons } = await supabase.from("lesson").select("id");
  console.log(lessons);

  const paths = lessons.map(({ id }) => ({
    params: {
      id: id.toString(),
    },
  }));

  console.log(paths);

  return { paths, fallback: false };
};

export const getStaticProps = async ({ params: { id } }) => {
  const { data: lesson } = await supabase.from("lesson").select("*").eq("id", id).single();

  return {
    props: {
      lesson,
    },
  };
};

export default LessonDetails;
