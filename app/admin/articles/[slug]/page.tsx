import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

type Props = {
  params: {
    slug: string;
  };
};

export default async function ArticlePage({ params }: Props) {
  const { data: article } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!article) {
    return (
      <div className="p-20 text-center text-gray-500">
        文章不存在
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">

      <h1 className="text-3xl font-bold mb-6">
        {article.title}
      </h1>

      <div className="text-gray-400 mb-8">
        {new Date(article.created_at).toLocaleDateString()}
      </div>

      <div className="prose max-w-none">
        {article.content}
      </div>

    </div>
  );
}