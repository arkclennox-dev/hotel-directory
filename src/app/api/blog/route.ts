import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { checkApiKey } from "@/lib/api-auth";
import { BlogPost } from "@/lib/types";

export async function POST(request: Request) {
  const authResponse = checkApiKey(request);
  if (authResponse) return authResponse;

  try {
    const payload = await request.json();
    
    // Read current DB
    const dbPath = path.join(process.cwd(), "database", "blog-posts.json");
    const rawData = fs.readFileSync(dbPath, "utf-8");
    const posts: BlogPost[] = JSON.parse(rawData);

    // AI Payload shape mapping
    const newPost: BlogPost = {
      id: "blog-" + Date.now().toString(),
      title: payload.title,
      slug: payload.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      excerpt: payload.excerpt || payload.content_html.substring(0, 150) + "...",
      content_html: payload.content_html,
      featured_image_url: payload.featured_image_url || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=500&fit=crop",
      author_name: payload.author_name || "AI Agent",
      is_published: true,
      published_at: new Date().toISOString(),
      seo_title: payload.title,
      seo_description: payload.excerpt || payload.content_html.substring(0, 120),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    posts.unshift(newPost); // Add to beginning

    // Serialize and Write Back
    fs.writeFileSync(dbPath, JSON.stringify(posts, null, 2), "utf-8");

    return NextResponse.json({ success: true, post: newPost }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Invalid payload or internal error: " + error.message }, { status: 400 });
  }
}
