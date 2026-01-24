"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Mail, Lock, School, User } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
    role: "student", // "student", "school", "admin", "government"
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!formData.email || !formData.password) {
        toast.error("Please provide email and password");
        setIsLoading(false);
        return;
      }

      // 1) POST to create session (backend should set httpOnly cookie)
      const loginRes = await fetch("/api/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const loginData = await loginRes.json().catch(() => ({}));

      if (!loginRes.ok) {
        const msg = loginData?.error || `Login failed (${loginRes.status})`;
        toast.error(msg);
        setIsLoading(false);
        return;
      }

      api.setToken(loginData.sessionId);
      // Decide redirect path: prefer serverRole, else fall back to selected role
      const effectiveRole = loginData?.user?.role || "student";
      toast.success("Login successful! Redirecting...");
      console.log(loginData, effectiveRole);
      const page = (() => {
        switch (effectiveRole) {
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
      })();
      router.push(`/dashboard/${page}`);
    } catch (err) {
      console.error("Login error", err);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRoleChange = (role) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2 mb-4">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <School className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-foreground">ChoiceX</span>
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
        <p className="text-muted-foreground mt-2">
          Sign in to your account to continue
        </p>
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-md shadow-lg border-border">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Sign In</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Role Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-center">
                {[].map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleRoleChange(role.id)}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all ${
                      formData.role === role.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <role.icon
                      className={`w-5 h-5 mb-2 ${
                        formData.role === role.id
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        formData.role === role.id
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      {role.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:text-primary/80"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Demo Info */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, rememberMe: checked }))
                  }
                />
                <Label htmlFor="rememberMe" className="text-sm font-normal">
                  Remember me
                </Label>
              </div>
            </div>

            {/* Demo Credentials Alert */}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <Separator className="my-4" />

            <div className="text-center text-sm text-muted-foreground"></div>
          </CardFooter>
        </form>
      </Card>

      {/* Footer Links */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/privacy" className="hover:text-foreground transition">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-foreground transition">
            Terms of Service
          </Link>
          <span>•</span>
          <Link href="/support" className="hover:text-foreground transition">
            Support
          </Link>
        </div>
        <p className="mt-4">© 2024 ChoiceX. All rights reserved.</p>
      </div>
    </div>
  );
}
