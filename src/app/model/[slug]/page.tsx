import { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${slug} model details`,
    description: `${slug} model details are not available in the first-stage MVP.`,
  };
}

export default async function ModelDetailPage({ params }: Props) {
  await params;
  notFound();
}
