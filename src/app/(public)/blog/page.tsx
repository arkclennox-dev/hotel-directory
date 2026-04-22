import { Metadata } from "next";
import Link from "next/link";
import { getBlogPosts } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Blog — Tips & Rekomendasi Hotel Indonesia",
  description: "Baca artikel tips, rekomendasi, dan panduan menginap di hotel terbaik di Indonesia.",
};

export default function BlogIndexPage() {
  const posts = getBlogPosts();
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="pt-28 pb-16">
      <div className="section-container">
        <div className="text-center mb-14">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Blog & <span className="gradient-text">Artikel</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Tips, rekomendasi, dan panduan menginap di hotel terbaik di Indonesia
          </p>
        </div>

        {/* Featured post */}
        {featured && (
          <Link
            href={`/blog/${featured.slug}`}
            className="glass-card-hover group overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-0 mb-10"
          >
            <div className="h-64 md:h-auto overflow-hidden">
              <img
                src={featured.featured_image_url}
                alt={featured.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <p className="text-xs text-primary mb-3">
                {new Date(featured.published_at).toLocaleDateString("id-ID", {
                  day: "numeric", month: "long", year: "numeric",
                })}
              </p>
              <h2 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors mb-3">
                {featured.title}
              </h2>
              <p className="text-sm text-muted-foreground line-clamp-3">{featured.excerpt}</p>
              <span className="text-sm text-primary mt-4 font-medium">Baca selengkapnya →</span>
            </div>
          </Link>
        )}

        {/* Rest */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="glass-card-hover group overflow-hidden"
            >
              <div className="h-44 overflow-hidden">
                <img
                  src={post.featured_image_url}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-5">
                <p className="text-xs text-primary mb-2">
                  {new Date(post.published_at).toLocaleDateString("id-ID", {
                    day: "numeric", month: "long", year: "numeric",
                  })}
                </p>
                <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
