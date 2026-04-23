import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getBlogPostBySlug, getBlogPosts, getRecentBlogPosts } from "@/lib/queries";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Link from "next/link";

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt,
    openGraph: { images: [{ url: post.featured_image_url }] },
  };
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) notFound();

  const recentPosts = await getRecentBlogPosts(3);
  const relatedPosts = recentPosts.filter((p) => p.id !== post.id);

  return (
    <div className="pt-28 pb-16">
      <div className="section-container">
        <div className="max-w-3xl mx-auto">
          <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: post.title }]} />

          {/* Hero image */}
          <div className="rounded-xl overflow-hidden mb-8 aspect-[2/1]">
            <img
              src={post.featured_image_url}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Meta */}
          <div className="mb-6">
            <p className="text-sm text-primary mb-3">
              {new Date(post.published_at).toLocaleDateString("id-ID", {
                day: "numeric", month: "long", year: "numeric",
              })}
              {" · "}
              <span className="text-muted-foreground">{post.author_name}</span>
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">{post.title}</h1>
            <p className="text-muted-foreground">{post.excerpt}</p>
          </div>

          {/* Content */}
          <article
            className="prose prose-invert prose-dark max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: post.content_html }}
          />

          {/* Related */}
          {relatedPosts.length > 0 && (
            <div className="border-t border-surface-border pt-10">
              <h3 className="text-lg font-bold text-foreground mb-6">Artikel Terkait</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedPosts.slice(0, 2).map((rp) => (
                  <Link
                    key={rp.id}
                    href={`/blog/${rp.slug}`}
                    className="glass-card-hover group overflow-hidden flex"
                  >
                    <div className="w-32 h-24 shrink-0 overflow-hidden">
                      <img src={rp.featured_image_url} alt={rp.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3 flex flex-col justify-center">
                      <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {rp.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(rp.published_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
