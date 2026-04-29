import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getCategoryBySlug, searchHotels, getCategories } from "@/lib/queries";

import Breadcrumbs from "@/components/ui/Breadcrumbs";
import HotelCard from "@/components/ui/HotelCard";
import SectionHeader, { HotelGrid } from "@/components/ui/SectionHeader";
import FAQSection from "@/components/ui/FAQSection";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);
  if (!category) return {};
  return {
    title: category.seo_title || category.name,
    description: category.seo_description || category.description,
  };
}

export default async function CategoryDetailPage({ params }: { params: { slug: string } }) {
  const category = await getCategoryBySlug(params.slug);
  if (!category) notFound();

  const { data: allHotels } = await searchHotels({ category_slug: params.slug, per_page: 100 });

  const faqItems = [
    {
      question: `Apa itu ${category.name}?`,
      answer: category.description,
    },
    {
      question: `Bagaimana cara mencari ${category.name.toLowerCase()}?`,
      answer: `Gunakan halaman ini untuk melihat daftar ${category.name.toLowerCase()} di seluruh Indonesia. Anda bisa membandingkan harga melalui partner booking kami.`,
    },
    {
      question: `Berapa harga ${category.name.toLowerCase()}?`,
      answer: `Harga bervariasi tergantung kota, bintang, dan fasilitas hotel. Klik detail hotel untuk melihat kisaran harga dan booking melalui partner kami.`,
    },
  ];

  return (
    <div className="pt-28 pb-16">
      <div className="section-container">
        <Breadcrumbs
          items={[{ label: "Kategori", href: "/kategori" }, { label: category.name }]}
        />

        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            {category.name}
          </h1>
          <p className="text-muted-foreground max-w-2xl">{category.description}</p>
        </div>

        {/* Hotels */}
        <HotelGrid>
          {allHotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </HotelGrid>

        {/* FAQ */}
        <div className="mt-16">
          <FAQSection items={faqItems} />
        </div>
      </div>
    </div>
  );
}
