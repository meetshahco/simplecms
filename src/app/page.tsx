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
import { listProjects, getSettings, listCaseStudies } from "@/lib/cms/storage";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home({ searchParams }: Props) {
  const [projects, settings, caseStudies] = await Promise.all([
    listProjects(),
    getSettings(),
    listCaseStudies()
  ]);

  // Inject case study counts
  const projectsWithCounts = projects.map(p => ({
    ...p,
    caseStudyCount: caseStudies.filter(c => c.parentProject === p.id && c.status === 'published').length
  }));

  // Parse dynamic URL parameters
  const resolvedSearchParams = await searchParams;
  const heroParam = resolvedSearchParams?.hero as string | undefined;

  // Filter only published and starred projects for the homepage gallery
  const featuredProjects = projectsWithCounts.filter(p => p.status === 'published' && p.starred);

  // Dynamic Hero Selection Logic
  let heroProject = undefined;
  if (heroParam) {
    heroProject = featuredProjects.find(p => p.id === heroParam);
  }
  
  // Fallback to Kwikpay by default, or the first featured project if the URL param is missing/invalid
  if (!heroProject && featuredProjects.length > 0) {
    heroProject = featuredProjects.find(p => p.id === "heading-country-s-first-digital-ewallet-and-payments-platform") || featuredProjects[0];
  }

  // Filter out the selected Hero project from the "Coming Up Next" gallery
  const comingUpNextProjects = featuredProjects.filter(p => p.id !== heroProject?.id);

  return (
    <ContactAnimationProvider>
      <GlobalLoader />
      <PlaneOverlay />
      <HomeContainer>
        <Navbar siteTitle={settings.siteTitle} />
        <Hero featuredProject={heroProject} />
        <FeaturedProjectGallery projects={comingUpNextProjects} />
        <AboutMe />
        <FooterMain />
      </HomeContainer>
    </ContactAnimationProvider>
  );
}
