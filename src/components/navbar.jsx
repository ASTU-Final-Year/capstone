"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dashboardPage, setDashboardPage] = useState("/dashboard");
  useEffect(() => {
    if (!isLoggedIn) {
      fetch("/api/session", { credentials: "include" }).then(async (res) => {
        if (res.ok) {
          const session = await res.json();
          // console.log(session);
          setDashboardPage(
            `/dashboard/${(() => {
              switch (session.user.role) {
                case "super_admin":
                  return "admin";
                case "region_admin":
                  return "region";
                case "city_admin":
                  return "city";
                case "school_admin":
                  return "school";
                case "university_admin":
                  return "university";
                default:
                  return "student";
              }
            })()}`,
          );
          setIsLoggedIn(true);
        }
      });
    }
  }, [isLoggedIn]);
  return (
    <nav className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">
              <Image
                src="/logo.png"
                alt="ChoiceX Logo"
                width={32}
                height={32}
              />
            </span>
          </div>
          <span className="font-bold text-xl text-foreground">ChoiceX</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground transition"
          >
            Home
          </Link>
          {isLoggedIn && (
            <Link
              href={dashboard_page}
              className="text-muted-foreground hover:text-foreground transition"
            >
              Dashboard
            </Link>
          )}
          <Link
            href="/about"
            className="text-muted-foreground hover:text-foreground transition"
          >
            About Us
          </Link>
          <Link
            href="/support"
            className="text-muted-foreground hover:text-foreground transition"
          >
            Support
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
  );
}
