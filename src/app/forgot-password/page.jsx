// src/app/forgot-password/page.jsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, ArrowLeft, CheckCircle, School, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"

export default function ForgotPasswordPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [step, setStep] = useState(1) // 1: Email input, 2: Verification code, 3: New password
    const [verificationCode, setVerificationCode] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const handleSendResetLink = async (e) => {
        e.preventDefault()
        
        if (!email) {
            toast.error("Please enter your email address")
            return
        }

        setIsLoading(true)

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
            toast.success("Reset link sent to your email!")
            setStep(2) // Move to verification step
        }, 1500)
    }

    const handleVerifyCode = async (e) => {
        e.preventDefault()

        if (!verificationCode) {
            toast.error("Please enter the verification code")
            return
        }

        setIsLoading(true)

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
            toast.success("Code verified successfully!")
            setStep(3) // Move to password reset step
        }, 1500)
    }

    const handleResetPassword = async (e) => {
        e.preventDefault()

        if (!newPassword || !confirmPassword) {
            toast.error("Please enter both password fields")
            return
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match")
            return
        }

        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters long")
            return
        }

        setIsLoading(true)

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
            toast.success("Password reset successfully!")
            
            // Show success and redirect
            setTimeout(() => {
                router.push("/login")
            }, 2000)
        }, 1500)
    }

    const handleBackToLogin = () => {
        router.push("/login")
    }

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
                <h1 className="text-3xl font-bold text-foreground">
                    {step === 1 && "Reset Your Password"}
                    {step === 2 && "Verify Your Identity"}
                    {step === 3 && "Create New Password"}
                </h1>
                <p className="text-muted-foreground mt-2">
                    {step === 1 && "Enter your email to receive a reset link"}
                    {step === 2 && "Enter the verification code sent to your email"}
                    {step === 3 && "Create a new secure password for your account"}
                </p>
            </div>

            {/* Progress Indicator */}
            <div className="w-full max-w-md mb-8">
                <div className="flex items-center justify-between">
                    {[1, 2, 3].map((stepNum) => (
                        <div key={stepNum} className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= stepNum ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                {step > stepNum ? <CheckCircle className="w-4 h-4" /> : stepNum}
                            </div>
                            <span className="text-xs mt-2 text-muted-foreground">
                                {stepNum === 1 && "Email"}
                                {stepNum === 2 && "Verify"}
                                {stepNum === 3 && "Reset"}
                            </span>
                        </div>
                    ))}
                    <div className={`flex-1 h-0.5 ${step >= 2 ? 'bg-primary' : 'bg-muted'} -mt-4`}></div>
                    <div className={`flex-1 h-0.5 ${step >= 3 ? 'bg-primary' : 'bg-muted'} -mt-4`}></div>
                </div>
            </div>

            {/* Reset Card */}
            <Card className="w-full max-w-md shadow-lg border-border">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-xl text-center">
                        {step === 1 && "Forgot Password"}
                        {step === 2 && "Enter Verification Code"}
                        {step === 3 && "New Password"}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {step === 1 && "We'll send a reset link to your email"}
                        {step === 2 && "Check your email for the 6-digit code"}
                        {step === 3 && "Create a strong password for security"}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {step === 1 && (
                        <form onSubmit={handleSendResetLink} className="space-y-4">
                            <Alert className="bg-blue-50 border-blue-200">
                                <AlertCircle className="h-4 w-4 text-blue-600" />
                                <AlertDescription className="text-blue-700 text-sm">
                                    Enter the email address associated with your account to receive password reset instructions.
                                </AlertDescription>
                            </Alert>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        className="pl-10"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? "Sending..." : "Send Reset Link"}
                            </Button>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleVerifyCode} className="space-y-4">
                            <Alert className="bg-blue-50 border-blue-200">
                                <AlertCircle className="h-4 w-4 text-blue-600" />
                                <AlertDescription className="text-blue-700 text-sm">
                                    We've sent a 6-digit verification code to <strong>{email}</strong>. The code will expire in 15 minutes.
                                </AlertDescription>
                            </Alert>

                            <div className="space-y-2">
                                <Label htmlFor="verificationCode">Verification Code</Label>
                                <div className="flex gap-2">
                                    {[0, 1, 2, 3, 4, 5].map((index) => (
                                        <Input
                                            key={index}
                                            id={`code-${index}`}
                                            type="text"
                                            maxLength={1}
                                            className="w-12 h-12 text-center text-lg font-bold"
                                            value={verificationCode[index] || ""}
                                            onChange={(e) => {
                                                const value = e.target.value
                                                if (value.match(/^[0-9]?$/)) {
                                                    const newCode = verificationCode.split('')
                                                    newCode[index] = value
                                                    setVerificationCode(newCode.join(''))
                                                    
                                                    // Auto-focus next input
                                                    if (value && index < 5) {
                                                        document.getElementById(`code-${index + 1}`)?.focus()
                                                    }
                                                }
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
                                                    document.getElementById(`code-${index - 1}`)?.focus()
                                                }
                                            }}
                                        />
                                    ))}
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Enter the 6-digit code from your email
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => {
                                        setVerificationCode("")
                                        setStep(1)
                                    }}
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1"
                                    disabled={isLoading || verificationCode.length !== 6}
                                >
                                    {isLoading ? "Verifying..." : "Verify Code"}
                                </Button>
                            </div>

                            <div className="text-center">
                                <Button
                                    variant="link"
                                    className="text-sm"
                                    onClick={() => toast.info("New code sent!")}
                                >
                                    Didn't receive code? Resend
                                </Button>
                            </div>
                        </form>
                    )}

                    {step === 3 && (
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <Alert className="bg-green-50 border-green-200">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <AlertDescription className="text-green-700 text-sm">
                                    Identity verified! Now create your new password.
                                </AlertDescription>
                            </Alert>

                            <div className="space-y-2">
                                <Label htmlFor="newPassword">New Password</Label>
                                <Input
                                    id="newPassword"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    Must be at least 8 characters long
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="showPassword"
                                    checked={showPassword}
                                    onChange={(e) => setShowPassword(e.target.checked)}
                                    className="rounded border-gray-300"
                                />
                                <Label htmlFor="showPassword" className="text-sm font-normal">
                                    Show password
                                </Label>
                            </div>

                            <div className="space-y-2 pt-2">
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => setStep(2)}
                                    >
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Back
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-1"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Resetting..." : "Reset Password"}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    )}
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                    <div className="text-center text-sm text-muted-foreground">
                        Remember your password?{" "}
                        <Link
                            href="/login"
                            className="text-primary hover:text-primary/80 font-medium"
                        >
                            Sign in instead
                        </Link>
                    </div>
                </CardFooter>
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
    )
}