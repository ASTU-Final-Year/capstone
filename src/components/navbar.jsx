"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
export default function Navbar() {
    return (
        <nav className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-lg"><Image src="/logo.png" alt="ChoiceX Logo" width={32} height={32} /></span>
                    </div>
                    <span className="font-bold text-xl text-foreground">ChoiceX</span>
                </div>
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/about" className="text-muted-foreground hover:text-foreground transition">
                        About Us
                    </Link>
                    <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition">
                        Process
                    </Link>
                    <Link href="#activity" className="text-muted-foreground hover:text-foreground transition">
                        Activity
                    </Link>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/login">
                        <Button variant="ghost" className="text-foreground">
                         Log In
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    )
}