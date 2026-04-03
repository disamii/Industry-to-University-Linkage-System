"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PostForm } from "@/components/dashboard/posts/post-form";

export default function CreatePostPage() {
  const router = useRouter();

  const handleCreate = (data: any) => {
    console.log("Creating new post:", data);
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
          Discard & Return
        </button>
        <h1 className="font-bold text-foreground text-3xl md:text-4xl tracking-tight">
          Compose New Post
        </h1>
      </div>
      <PostForm onSubmit={handleCreate} />
    </div>
  );
}
