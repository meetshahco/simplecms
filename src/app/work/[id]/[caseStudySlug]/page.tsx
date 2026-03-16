import { Suspense } from "react";
export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { getCaseStudy, getCaseStudyContent, getProject, listCaseStudies } from "@/lib/cms/storage";
import { FooterMinimal } from "@/components/Footer";
import { CaseStudyReader } from "@/components/CaseStudyReader";

export default async function CaseStudyPage(props: {
    params: Promise<{ id: string; caseStudySlug: string }>;
}) {
    const { id, caseStudySlug } = await props.params;

    const [caseStudy, content, project, allCaseStudies] = await Promise.all([
        getCaseStudy(caseStudySlug),
        getCaseStudyContent(caseStudySlug),
        getProject(id),
        listCaseStudies(id),
    ]);

    if (!caseStudy) {
        notFound();
    }

    const currentIndex = allCaseStudies.findIndex((cs) => cs.slug === caseStudySlug);
    const prevCaseStudy = currentIndex > 0 ? allCaseStudies[currentIndex - 1] : null;
    const nextCaseStudy = currentIndex < allCaseStudies.length - 1 ? allCaseStudies[currentIndex + 1] : null;

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
                    prevCaseStudy={prevCaseStudy ? { slug: prevCaseStudy.slug, title: prevCaseStudy.title } : undefined}
                    nextCaseStudy={nextCaseStudy ? { slug: nextCaseStudy.slug, title: nextCaseStudy.title } : undefined}
                />
            </Suspense>
            <FooterMinimal />
        </>
    );
}
