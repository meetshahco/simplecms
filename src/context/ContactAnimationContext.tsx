"use client";
import React, { createContext, useContext, useState, useRef, MutableRefObject, ReactNode } from "react";

type AnimationStartData = {
    x: number;
    y: number;
};

interface ContactAnimationContextType {
    isContactCta: boolean;
    setIsContactCta: (val: boolean) => void;
    contactRef: MutableRefObject<HTMLAnchorElement | null>;
    isViewDeckCta: boolean;
    setIsViewDeckCta: (val: boolean) => void;
    viewDeckRef: MutableRefObject<HTMLAnchorElement | null>;
    planePathStart: AnimationStartData | null;
    triggerPlaneAnimation: (data: AnimationStartData) => void;
    resetAnimation: () => void;
}

const ContactAnimationContext = createContext<ContactAnimationContextType | undefined>(undefined);

export function ContactAnimationProvider({ children, initialContactCta = false }: { children: ReactNode, initialContactCta?: boolean }) {
    const [isContactCta, setIsContactCta] = useState(initialContactCta);
    const [isViewDeckCta, setIsViewDeckCta] = useState(initialContactCta);
    const [planePathStart, setPlanePathStart] = useState<AnimationStartData | null>(null);
    const contactRef = useRef<HTMLAnchorElement>(null);
    const viewDeckRef = useRef<HTMLAnchorElement>(null);

    const triggerPlaneAnimation = (data: AnimationStartData) => {
        setPlanePathStart(data);
    };

    const resetAnimation = () => {
        setPlanePathStart(null);
    };

    return (
        <ContactAnimationContext.Provider
            value={{
                isContactCta,
                setIsContactCta,
                contactRef,
                isViewDeckCta,
                setIsViewDeckCta,
                viewDeckRef,
                planePathStart,
                triggerPlaneAnimation,
                resetAnimation
            }}
        >
            {children}
        </ContactAnimationContext.Provider>
    );
}

export function useContactAnimation() {
    const context = useContext(ContactAnimationContext);
    if (!context) {
        throw new Error("useContactAnimation must be used within a ContactAnimationProvider");
    }
    return context;
}
