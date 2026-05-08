"use client";

import { useEffect, useRef } from "react";

interface RichTextProps {
    content: string;
    className?: string;
    as?: "div" | "article";
}

export function RichText({ content, className = "", as = "div" }: RichTextProps) {
    const containerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        
        // 1. Process CMS-generated figures
        const figures = containerRef.current.querySelectorAll("figure");
        console.log(`[RichText] Processing ${figures.length} figures`);
        figures.forEach(figure => {
            // Use !gap-2 for very tight editorial spacing and ensure children are centered
            figure.className = "flex flex-col items-center !gap-2 my-12 w-full not-prose";
            const img = figure.querySelector("img");
            if (img) {
                const existingClasses = img.getAttribute("class") || "";
                // Remove any pre-existing margins and force !mb-0
                const cleanClasses = existingClasses.replace(/\b(mb|mt|my|m)-[0-9]+\b/g, "").trim();
                img.className = `${cleanClasses} w-full object-cover rounded-xl md:rounded-2xl !mb-0`;
            }
            const figcaption = figure.querySelector("figcaption");
            if (figcaption) {
                // Use !text-center and !w-full to force alignment
                figcaption.className = "!text-center text-xs text-neutral-500 !mt-0 px-4 font-normal tracking-wide !w-full max-w-xl";
            }
        });

        // 2. Process legacy standalone images with alt text
        const images = containerRef.current.querySelectorAll("img");
        images.forEach(img => {
            // Only process if it has alt text and isn't already in a figure
            if (img.closest('figure')) return;
            
            const altText = img.getAttribute("alt");
            if (altText && altText.trim() !== "") {
                const figure = document.createElement("figure");
                figure.className = "flex flex-col items-center !gap-2 my-12 w-full not-prose";
                
                const newImg = img.cloneNode(true) as HTMLImageElement;
                const existingClasses = img.getAttribute("class") || "rounded-xl md:rounded-2xl";
                const cleanClasses = existingClasses.replace(/\b(mb|mt|my|m)-[0-9]+\b/g, "").trim();
                newImg.className = `${cleanClasses} w-full object-cover !mb-0`;
                
                const caption = document.createElement("figcaption");
                caption.className = "!text-center text-xs text-neutral-500 !mt-0 px-4 font-normal tracking-wide !w-full max-w-xl";
                caption.textContent = altText;
                
                figure.appendChild(newImg);
                figure.appendChild(caption);
                
                // Replace img with figure
                img.parentNode?.replaceChild(figure, img);
            }
        });
    }, [content]);

    const Component = as as any;
    const baseProseClasses = "prose prose-invert prose-lg md:prose-xl max-w-none prose-reading prose-headings:font-heading prose-headings:font-bold prose-headings:text-white prose-p:text-neutral-300 prose-p:my-1 prose-p:leading-relaxed prose-a:text-white prose-a:underline prose-img:rounded-xl md:prose-img:rounded-2xl prose-headings:mb-2 prose-headings:mt-6";

    return (
        <Component 
            ref={containerRef}
            className={`${baseProseClasses} ${className}`}
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
}
