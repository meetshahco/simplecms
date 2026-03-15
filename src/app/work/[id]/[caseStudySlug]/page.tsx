import { Suspense } from "react";
export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { getCaseStudy, getCaseStudyContent, getProject } from "@/lib/cms/storage";
import { Footer } from "@/components/Footer";
import { CaseStudyReader } from "@/components/CaseStudyReader";

export default async function CaseStudyPage(props: {
    params: Promise<{ id: string; caseStudySlug: string }>;
}) {
    const { id, caseStudySlug } = await props.params;

    const [caseStudy, content, project] = await Promise.all([
        getCaseStudy(caseStudySlug),
        getCaseStudyContent(caseStudySlug),
        getProject(id),
    ]);

    if (!caseStudy) {
        notFound();
    }

    const projectName = project?.title || id;

    return (
        <>
            <Suspense fallback={null}>
                <CaseStudyReader
                    projectId={id}
                    projectName={projectName}
                    title={caseStudy.title}
                    description={caseStudy.description}
                    coverImage={caseStudy.coverImage}
                    publishedAt={caseStudy.publishedAt}
                    content={content || ""}
                />
            </Suspense>
            <Footer />
        </>
    );
}
