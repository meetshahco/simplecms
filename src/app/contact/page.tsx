import { getSettings } from "@/lib/cms/storage";
import { ContactClient } from "@/components/v2/ContactClient";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
    const settings = await getSettings().catch(() => ({}));

    return (
        <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">
            {/* Ambient Background glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/[0.03] rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

            <ContactClient settings={settings} />
        </main>
    );
}
