import { getSettings } from "@/lib/cms/storage";
import { FooterClient } from "./FooterClient";

export async function FooterMain() {
    const settings = await getSettings();
    return <FooterClient settings={settings} variant="main" />;
}

export async function FooterMinimal() {
    const settings = await getSettings();
    return <FooterClient settings={settings} variant="minimal" />;
}
