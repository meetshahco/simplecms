"use client";
import { ReactNode } from "react";

export function HomeContainer({ children }: { children: ReactNode }) {
    return (
        <main className="min-h-screen bg-black selection:bg-blue-500/30 overflow-x-hidden w-full relative">
            {children}
        </main>
    );
}
