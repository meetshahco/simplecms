import { Navbar } from "@/components/Navbar";
export const dynamic = "force-dynamic";
import { ContactAnimationProvider } from "@/context/ContactAnimationContext";
import { getSettings } from "@/lib/cms/storage";
import { AboutClient } from "./AboutClient";
import { FooterMain } from "@/components/Footer";

export default async function AboutPage() {
    const settings = await getSettings();

    return (
        <ContactAnimationProvider>
            <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">
                <Navbar siteTitle={settings.siteTitle} />

                {/* Background ambient glow matching hero */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

                <AboutClient />
            </main>
            <FooterMain />
        </ContactAnimationProvider>
    );
}
