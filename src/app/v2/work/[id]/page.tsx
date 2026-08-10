import { redirect } from "next/navigation";

export default async function V2WorkIdRedirect({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    redirect(`/work/${id}`);
}
