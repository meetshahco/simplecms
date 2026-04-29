import { Node, mergeAttributes } from "@tiptap/core";

export const Figure = Node.create({
    name: "figure",
    group: "block",
    content: "inline*",
    draggable: true,
    isolating: true,

    addAttributes() {
        return {
            src: {
                default: null,
                parseHTML: (element) => element.querySelector("img")?.getAttribute("src"),
            },
            alt: {
                default: null,
                parseHTML: (element) => element.querySelector("img")?.getAttribute("alt"),
            },
            title: {
                default: null,
                parseHTML: (element) => element.querySelector("img")?.getAttribute("title"),
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: "figure",
                contentElement: "figcaption",
            },
            {
                tag: "img",
                getAttrs: (node) => {
                    const el = node as HTMLElement;
                    // If an img is wrapped in a figure already, it's handled by the rule above.
                    // If it's a standalone img, parse it into a figure.
                    if (el.closest('figure')) return false;
                    return {
                        src: el.getAttribute('src'),
                        alt: el.getAttribute('alt'),
                        title: el.getAttribute('title'),
                    };
                },
            }
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            "figure",
            { class: "image-figure" },
            [
                "img",
                mergeAttributes(HTMLAttributes, {
                    draggable: false,
                    contenteditable: false,
                }),
            ],
            ["figcaption", 0],
        ];
    },
});
