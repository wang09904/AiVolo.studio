import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `模型详情 - ${slug}`,
    description: `查看 ${slug} 模型的详细信息`,
  };
}

export default async function ModelDetailPage({ params }: Props) {
  const { slug } = await params;
  return (
    <main className="min-h-screen">
      <h1 className="text-3xl font-bold">模型: {slug}</h1>
      <p className="mt-4 text-gray-600">模型详情页</p>
    </main>
  );
}
