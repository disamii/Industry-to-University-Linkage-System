"use client";

import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PostForm } from "@/components/dashboard/posts/post-form";

export default function EditPostPage() {
  const { id } = useParams();
  const router = useRouter();

  // Mock fetching existing post data
  const existingPost = {
    title: "AI Research Initiative Launch",
    description: "We are excited to announce a new AI research initiative...",
    type: "research",
    status: "published",
  };

  const handleUpdate = (data: any) => {
    console.log(`Updating post ${id}:`, data);
    router.push("/dashboard/office/posts");
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="space-y-2">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 font-bold text-[10px] text-muted-foreground hover:text-primary uppercase tracking-widest transition-all"
        >
          <ArrowLeft
            size={14}
            className="transition-transform group-hover:-translate-x-1"
          />
          Back to Post
        </button>
        <h1 className="font-bold text-foreground text-3xl md:text-4xl tracking-tight">
          Update Content
        </h1>
      </div>
      <PostForm initialData={existingPost} onSubmit={handleUpdate} />
    </div>
  );
}
