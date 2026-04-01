import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import HighlightsSection from "@/components/HighlightsSection";
import GallerySection from "@/components/GallerySection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

import { getContent, getStats, getHighlights, getGallery } from "@/lib/db";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const heroContent = await getContent("hero");
  const stats = await getStats();
  const highlights = await getHighlights();
  const gallery = await getGallery();

  return (
    <>
      <HeroSection
        firstName={heroContent.firstName || ''}
        lastName={heroContent.lastName || ''}
        badge={heroContent.badge || ''}
        tagline={heroContent.tagline || ''}
        instagramUrl={heroContent.instagramUrl || ''}
      />
      <StatsSection stats={stats} />
      <HighlightsSection highlights={highlights} />
      <GallerySection photos={gallery} />
      <ContactSection />
      <Footer />
    </>
  );
}