"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Users, Zap, BarChart3, TrendingUp, CheckCircle2 } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import Image from "next/image"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight mb-6 text-balance">
              Transform Education Placement
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Digitize the entire student placement process. Connect schools, students, and government in one unified
              platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-8">
              Trusted by schools and education ministries across Ethiopia
            </p>
          </div>
          <Image
            src="/hero-removebg-preview.png"
            alt="ChoiceX platform dashboard preview"
            width={900}
            height={900}
            priority
            className="w-full h-auto max-w-lg mx-auto"
          />
        </div>
      </section>

      <section id="analytics" className="bg-card border-y border-border py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">2025 Placement Overview</h2>
          <p className="text-lg text-muted-foreground mb-16">
            See the impact of intelligent placement across Ethiopia's education system
          </p>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Bar Chart - Placements by Region */}
            <div className="bg-background border border-border rounded-lg p-6">
              <h3 className="text-lg font-bold text-foreground mb-6">Student Placements by Region</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={placementByRegion}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="region" stroke="var(--color-muted-foreground)" />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                    }}
                    cursor={{ fill: "var(--color-primary)" }}
                  />
                  <Bar dataKey="placements" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Line Chart - School Choices */}
            <div className="bg-background border border-border rounded-lg p-6">
              <h3 className="text-lg font-bold text-foreground mb-6">Student Preferences Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={choicesDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="choice" stroke="var(--color-muted-foreground)" />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="students"
                    stroke="var(--color-accent)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-accent)", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mt-12">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-background border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-2">{stat.change}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">Powerful Features</h2>
        <p className="text-lg text-muted-foreground mb-16 max-w-2xl">
          Everything you need to streamline student placement across your education system
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition">
              <feature.icon className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-bold text-lg text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="activity" className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">Recent Activity</h2>
        <p className="text-lg text-muted-foreground mb-12">
          Real-time updates from schools and students across the platform
        </p>

        <div className="space-y-4">
          {activities.map((activity, idx) => (
            <div key={idx} className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <activity.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-foreground font-semibold">{activity.title}</p>
                  <p className="text-muted-foreground text-sm mt-1">{activity.description}</p>
                  <p className="text-xs text-muted-foreground mt-3">{activity.timestamp}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stakeholders Section */}
      <section className="bg-card border-y border-border py-24 mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">Built for Everyone</h2>
          <p className="text-lg text-muted-foreground mb-16">
            Tailored experiences for each stakeholder in the education system
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stakeholders.map((stakeholder, idx) => (
              <div key={idx} className="bg-background border border-border rounded-lg p-6">
                <div className="text-3xl mb-4">{stakeholder.icon}</div>
                <h3 className="font-bold text-lg text-foreground mb-2">{stakeholder.name}</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {stakeholder.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="bg-gradient-to-r from-primary to-accent rounded-xl p-12 md:p-16 text-center">
          <h2 className="text-4xl font-bold text-primary-foreground mb-4 text-balance">
            Ready to Transform Your Education System?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
            Join schools and education ministries modernizing student placement. Get started in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              Start Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

const features = [
  {
    title: "School Management",
    description: "Register schools, manage student data, and track placements in real-time",
    icon: BookOpen,
  },
  {
    title: "Student Portal",
    description: "Self-registration, document verification, and placement status tracking",
    icon: Users,
  },
  {
    title: "Placement Results",
    description: "Automated result processing for optimal placements",
    icon: Zap,
  },
  {
    title: "Analytics & Reports",
    description: "Comprehensive dashboards for monitoring system performance and outcomes",
    icon: BarChart3,
  },
]

const steps = [
  {
    title: "Schools Register",
    description: "Schools create accounts and verify credentials",
    details: ["Upload school details", "Provide capacity information", "Set entry requirements"],
  },
  {
    title: "Students Apply",
    description: "Students self-register and express preferences",
    details: ["Complete registration", "Upload documents", "Select school choices"],
  },
  {
    title: "MoE Review",
    description: "Ministry verifies data and approves applications",
    details: ["Validate school info", "Approve students", "Monitor compliance"],
  },
  {
    title: "EAES Process",
    description: "Results processed and placements finalized",
    details: ["Run algorithm", "Generate results", "Send notifications"],
  },
]

const stats = [
  {
    label: "Total Placements",
    value: "487,234",
    change: "+12% from last year",
  },
  {
    label: "Schools Active",
    value: "1,242",
    change: "+15% year-over-year",
  },
  {
    label: "Success Rate",
    value: "94.8%",
    change: "Students placed successfully",
  },
  {
    label: "Processing Time",
    value: "2.3 days",
    change: "Average from submission to result",
  },
]

const placementByRegion = [
  { region: "Addis Ababa", placements: 45200 },
  { region: "Oromia", placements: 78900 },
  { region: "Amhara", placements: 92100 },
  { region: "SNNPR", placements: 68300 },
  { region: "Tigray", placements: 54200 },
  { region: "Others", placements: 148534 },
]

const choicesDistribution = [
  { choice: "1st Choice", students: 68400 },
  { choice: "2nd Choice", students: 54200 },
  { choice: "3rd Choice", students: 42100 },
  { choice: "4th Choice", students: 31800 },
  { choice: "5th Choice", students: 28340 },
]

const activities = [
  {
    title: "Addis Ababa University",
    description: "Successfully placed 2,450 students in engineering programs",
    timestamp: "2 hours ago",
    icon: CheckCircle2,
  },
  {
    title: "Hawassa University",
    description: "Completed verification for 1,890 applicants",
    timestamp: "5 hours ago",
    icon: Users,
  },
  {
    title: "Regional Office - Oromia",
    description: "Approved 5,230 student registrations from 45 schools",
    timestamp: "8 hours ago",
    icon: BarChart3,
  },
  {
    title: "Bahir Dar Institute of Technology",
    description: "Enrolled 1,340 students for 2026 academic year",
    timestamp: "12 hours ago",
    icon: CheckCircle2,
  },
  {
    title: "System Alert",
    description: "All placement processing completed for Addis Ababa region",
    timestamp: "1 day ago",
    icon: TrendingUp,
  },
]

const stakeholders = [
  {
    name: "Schools",
    icon: "🏫",
    benefits: ["Manage enrollments", "Track placements", "Real-time reports"],
  },
  {
    name: "Students",
    icon: "👨‍🎓",
    benefits: ["Easy registration", "Track status", "Clear results"],
  },
  {
    name: "Ministry (MoE)",
    icon: "🏛️",
    benefits: ["Monitor system", "Approve schools", "Generate reports"],
  },
  {
    name: "EAES",
    icon: "📋",
    benefits: ["Process results", "Manage placements", "Send notifications"],
  },
]
