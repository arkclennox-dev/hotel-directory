"use client";

import { ExternalLink } from "lucide-react";
import { AffiliateLink } from "@/lib/types";

interface CTAButtonsAffiliateProps {
  links: AffiliateLink[];
  hotelName: string;
}

const providerConfig: Record<string, { label: string; className: string }> = {
  traveloka: {
    label: "Cek di Traveloka",
    className: "btn-traveloka",
  },
  tiketcom: {
    label: "Cek di tiket.com",
    className: "btn-tiketcom",
  },
  agoda: {
    label: "Cek di Agoda",
    className: "btn-agoda",
  },
};

export default function CTAButtonsAffiliate({ links, hotelName }: CTAButtonsAffiliateProps) {
  const activeLinks = links.filter((l) => l.is_active);

  if (activeLinks.length === 0) return null;

  const handleClick = (link: AffiliateLink) => {
    // Track affiliate click event
    if (typeof window !== "undefined") {
      console.log("[Affiliate Click]", {
        provider: link.provider,
        hotel: hotelName,
        timestamp: new Date().toISOString(),
      });
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">Bandingkan Harga & Booking</h3>
      <div className="flex flex-col gap-3">
        {activeLinks.map((link) => {
          const config = providerConfig[link.provider];
          if (!config) return null;

          return (
            <a
              key={link.id}
              href={link.affiliate_url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              onClick={() => handleClick(link)}
              className={`${config.className} w-full py-3`}
            >
              <span className="flex items-center gap-1.5">
                {config.label}
                <ExternalLink className="w-3.5 h-3.5" />
              </span>
            </a>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        * Harga dapat berubah. Klik tombol di atas untuk melihat harga terkini.
      </p>
    </div>
  );
}
