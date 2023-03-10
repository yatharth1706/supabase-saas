import type { NextPage } from "next";
import { supabase } from "../utils/supabase";
import Link from "next/link";
import { useUser } from "../contexts/user";

export default function Home({ lessons }: any) {
  const { user } = useUser();
  console.log(user);

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto py-16 px-8">
      {lessons.map((lesson) => (
        <Link className="text-xl mb-6" key={lesson.id} href={`/${lesson.id}`}>
          {lesson.title}
        </Link>
      ))}
    </div>
  );
}

export const getStaticProps = async () => {
  const { data: lessons } = await supabase.from("lesson").select("*");

  return {
    props: {
      lessons,
    },
  };
};
