"use client";

import React, { useState, useEffect } from "react";
import { Paperclip } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

const MAX_CHARS = 280;

interface Post {
  id: string;
  author_name: string;
  text: string;
  image?: string;
  created_at: string;
}

const CreatePostCard = () => {
  const name = "Hanan Ramos";
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  // 🔵 Share handler
  const handleShare = async () => {
    if (!text.trim() && !image) return;

    let imageUrl: string | undefined = undefined;

    if (image) {
      const { data, error } = await supabase.storage
        .from("upload-images")
        .upload(`public/${Date.now()}-${image.name}`, image);

      if (error) {
        console.error("Image upload failed:", error.message);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("upload-images")
        .getPublicUrl(data.path);

      imageUrl = publicUrlData.publicUrl;
    }

    const { error } = await supabase.from("posts").insert({
      text: text.trim(),
      image: imageUrl,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Insert failed:", error.message);
    } else {
      setText("");
      setImage(null);
    }
  };

  // 🔵 Fetch latest posts
  const fetchPosts = async () => {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (data) setPosts(data as Post[]);
  };

  // 🔵 Realtime listener
  useEffect(() => {
    fetchPosts();

    const channel = supabase
      .channel("realtime-posts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        (payload) => {
          setPosts((prev) => [payload.new as Post, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="flex flex-col mt-4">
      <div className="flex flex-col gap-1 mb-2">
        <h1 className="text-2xl font-bold text-gray-800">{name}</h1>
        <p className="text-lg text-gray-500">Wall</p>
      </div>

      <div className="w-full">
        <div className="border p-3 rounded-md border-gray-400 space-y-3">
          <textarea
            placeholder="What's on your mind?"
            value={text}
            onChange={(e) => {
              if (e.target.value.length <= MAX_CHARS) {
                setText(e.target.value);
              }
            }}
            className="w-full p-3 border border-gray-400 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 border-dashed"
            rows={5}
          />

          <div className="flex justify-between items-center">
            <label className="flex items-center gap-2 text-sm text-gray-600 font-medium cursor-pointer">
              Attach <Paperclip className="w-4 h-4" />
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                        setImage(file);
                        }
                    }}
                    className="hidden"
                />
            </label>

            <div
              className={`text-sm ${
                MAX_CHARS - text.length === 0
                  ? "text-red-500"
                  : "text-gray-500"
              }`}
            >
              {MAX_CHARS - text.length} characters remaining
            </div>
          </div>

          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              className="w-full max-w-md max-h-[400px] object-contain mt-2 rounded-md"
            />
          )}
        </div>

        <div className="flex justify-end mt-3">
          <button
            onClick={handleShare}
            disabled={!text.trim() && !image}
            className={`text-white text-sm px-4 py-2 rounded-md transition ${
              !text.trim() && !image
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            Share
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-6 mb-10">
        {posts.map((post) => (
          <div key={post.id} className="border-b border-gray-300 pb-3">
            <div className="flex flex-row justify-between items-center">
              <p className="font-bold text-[15px] text-gray-900 leading-tight">
                {name}
              </p>

              <p className="text-[14px] text-gray-500 mt-1">
                {`${new Intl.DateTimeFormat("en-US", {
                  dateStyle: "medium",
                }).format(new Date(post.created_at))} at ${new Intl.DateTimeFormat(
                  "en-US",
                  { timeStyle: "short" }
                ).format(new Date(post.created_at))}`}
              </p>
            </div>

            {post.text && (
              <p className="text-[14px] text-gray-800 mt-1">{post.text}</p>
            )}

            {post.image && (
              <img
                src={post.image}
                alt="Post"
                className="max-h-60 w-auto mt-2 max-w-xs rounded-md"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreatePostCard;