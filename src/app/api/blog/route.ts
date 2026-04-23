import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "database", "blog-posts.json");

function readPosts(): any[] {
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}
function writePosts(data: any[]) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const posts = readPosts();
  if (id) {
    const post = posts.find((p) => p.id === id);
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(post);
  }
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const posts = readPosts();
    const newPost = {
      id: `blog-${Date.now()}`,
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt || "",
      content_html: body.content_html || "",
      featured_image_url: body.featured_image_url || "",
      author_name: body.author_name || "Admin",
      is_published: body.is_published ?? true,
      published_at: body.is_published ? new Date().toISOString() : "",
      seo_title: body.seo_title || body.title,
      seo_description: body.seo_description || body.excerpt || "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    posts.push(newPost);
    writePosts(posts);
    return NextResponse.json(newPost, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const posts = readPosts();
    const idx = posts.findIndex((p) => p.id === id);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    posts[idx] = { ...posts[idx], ...updates, updated_at: new Date().toISOString() };
    writePosts(posts);
    return NextResponse.json(posts[idx]);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    let posts = readPosts();
    posts = posts.filter((p) => p.id !== id);
    writePosts(posts);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
