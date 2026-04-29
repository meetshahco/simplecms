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
        figures.forEach(figure => {
            figure.className = "flex flex-col items-center my-10 w-full";
            const img = figure.querySelector("img");
            if (img) {
                const existingClasses = img.getAttribute("class") || "";
                if (!existingClasses.includes("w-full")) {
                    img.className = `${existingClasses} mb-2 w-full object-cover rounded-[24px] md:rounded-[32px]`;
                }
            }
            const figcaption = figure.querySelector("figcaption");
            if (figcaption) {
                figcaption.className = "text-center text-sm md:text-base text-neutral-400 mt-2 max-w-2xl px-4 font-medium tracking-wide";
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
                figure.className = "flex flex-col items-center my-10 w-full";
                
                const newImg = img.cloneNode(true) as HTMLImageElement;
                // Preserve original classes but add centering and margin
                const existingClasses = img.getAttribute("class") || "rounded-[24px] md:rounded-[32px]";
                newImg.className = `${existingClasses} mb-2 w-full object-cover`;
                
                const caption = document.createElement("figcaption");
                // Medium-style caption: centered, muted text, slightly smaller
                caption.className = "text-center text-sm md:text-base text-neutral-400 mt-2 max-w-2xl px-4 font-medium tracking-wide";
                caption.textContent = altText;
                
                figure.appendChild(newImg);
                figure.appendChild(caption);
                
                // Replace img with figure
                img.parentNode?.replaceChild(figure, img);
            }
        });
    }, [content]);

    const Component = as as any;
    const baseProseClasses = "prose prose-invert prose-lg md:prose-xl max-w-none prose-reading prose-headings:font-heading prose-headings:font-bold prose-headings:text-white prose-a:text-white prose-a:underline prose-img:rounded-[24px] md:prose-img:rounded-[32px]";

    return (
        <Component 
            ref={containerRef}
            className={`${baseProseClasses} ${className}`}
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
}
