// Triggering fresh deck build
import { Navbar } from "@/components/Navbar";
export const dynamic = "force-dynamic";

import { Hero } from "@/components/Hero";
import { FeaturedProjectGallery } from "@/components/FeaturedProjectGallery";
import { GlobalLoader } from "@/components/GlobalLoader";
import { HomeContainer } from "@/components/HomeContainer";
import { AboutMe } from "@/components/AboutMe";
import { FooterMain } from "@/components/Footer";
import { ContactAnimationProvider } from "@/context/ContactAnimationContext";
import { PlaneOverlay } from "@/components/PlaneOverlay";
import { listProjects, getSettings } from "@/lib/cms/storage";

export default async function Home() {
  const [projects, settings] = await Promise.all([
    listProjects(),
    getSettings()
  ]);

  // Filter only published and starred projects for the homepage gallery
  const featuredProjects = projects.filter(p => p.status === 'published' && p.starred);

  return (
    <ContactAnimationProvider>
      <GlobalLoader />
      <PlaneOverlay />
      <HomeContainer>
        <Navbar siteTitle={settings.siteTitle} />
        <Hero />
        <FeaturedProjectGallery projects={featuredProjects} />
        <AboutMe />
        <FooterMain />
      </HomeContainer>
    </ContactAnimationProvider>
  );
}
