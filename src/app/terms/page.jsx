"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, FileText, Scale, AlertTriangle, BookOpen, Users, Shield, Globe } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"

export default function TermsOfServicePage() {
  const [openSection, setOpenSection] = useState<string | null>("acceptance")

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-28">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <Scale className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Terms of Service</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Effective Date: December 1, 2024. These Terms govern your use of the ChoiceX platform and services.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div className="bg-card border border-border rounded-xl p-8 mb-8">
            <p className="text-muted-foreground mb-6">
              Welcome to ChoiceX. By accessing or using our platform, you agree to be bound by these Terms of Service. Please read them carefully.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 bg-background rounded-lg">
                <Users className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="font-medium text-sm">User Responsibilities</p>
              </div>
              <div className="text-center p-4 bg-background rounded-lg">
                <Shield className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="font-medium text-sm">Platform Rules</p>
              </div>
              <div className="text-center p-4 bg-background rounded-lg">
                <AlertTriangle className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="font-medium text-sm">Prohibited Actions</p>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <p className="text-amber-800 dark:text-amber-200 text-sm">
                <strong>Important:</strong> These terms affect your legal rights. If you do not agree to these terms, do not use the ChoiceX platform.
              </p>
            </div>
          </div>

          {/* Expandable Sections */}
          <div className="space-y-4">
            {sections.map((section) => (
              <div key={section.id} className="border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-6 text-left bg-card hover:bg-card/50 transition"
                >
                  <div className="flex items-center gap-4">
                    <section.icon className="w-5 h-5 text-primary" />
                    <h3 className="text-xl font-bold text-foreground">{section.title}</h3>
                  </div>
                  {openSection === section.id ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
                
                {openSection === section.id && (
                  <div className="p-6 pt-2 bg-background border-t border-border">
                    <div className="space-y-6">
                      {section.content.map((content, idx) => (
                        <div key={idx}>
                          {content.title && (
                            <h4 className="font-bold text-foreground mb-3">{content.title}</h4>
                          )}
                          <p className="text-muted-foreground mb-3">{content.text}</p>
                          {content.list && (
                            <ul className="mt-2 space-y-2 text-muted-foreground">
                              {content.list.map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                  <span className="text-primary mt-1">{i + 1}.</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* User Types */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              Platform Users & Responsibilities
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              {userTypes.map((type, idx) => (
                <div key={idx} className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      {type.icon}
                    </div>
                    <h4 className="font-bold text-foreground">{type.title}</h4>
                  </div>
                  <ul className="space-y-2">
                    {type.responsibilities.map((resp, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">✓</span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Legal Section */}
          <div className="mt-12 bg-card border border-border rounded-xl p-8">
            <h3 className="text-2xl font-bold text-foreground mb-4">Legal Information</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-foreground mb-3">Governing Law</h4>
                <p className="text-muted-foreground">
                  These Terms are governed by and construed in accordance with the laws of the Federal Democratic Republic of Ethiopia.
                  Any disputes shall be resolved in the courts of Addis Ababa.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-3">Modifications</h4>
                <p className="text-muted-foreground">
                  We may update these Terms periodically. We will notify users of significant changes via email or platform notifications.
                  Continued use after changes constitutes acceptance.
                </p>
              </div>
            </div>
          </div>

          {/* Contact & Support */}
          <div className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h4 className="font-bold text-foreground mb-2">Questions About These Terms?</h4>
                <p className="text-muted-foreground text-sm">
                  Contact our legal team at legal@choicex.edu.et
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/privacy-policy">
                  View Privacy Policy
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

const sections = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    icon: FileText,
    content: [
      {
        text: "By accessing or using the ChoiceX platform, you confirm that you have read, understood, and agree to be bound by these Terms of Service."
      },
      {
        title: "Eligibility Requirements",
        list: [
          "You must be at least 13 years old to use the platform",
          "Students must provide accurate academic information",
          "Schools must be registered educational institutions",
          "Government users must have proper authorization"
        ]
      },
      {
        title: "Account Creation",
        text: "To access certain features, you must create an account and agree to:",
        list: [
          "Provide accurate and complete information",
          "Maintain the security of your account",
          "Promptly update any changes to your information",
          "Notify us immediately of unauthorized access"
        ]
      }
    ]
  },
  {
    id: "platform-use",
    title: "Platform Use & Restrictions",
    icon: BookOpen,
    content: [
      {
        text: "ChoiceX grants you a limited, non-exclusive, non-transferable license to use the platform for its intended educational purposes."
      },
      {
        title: "Permitted Uses",
        list: [
          "Student registration and application submission",
          "School data management and student tracking",
          "University placement processing",
          "Government monitoring and reporting",
          "Accessing educational resources and information"
        ]
      },
      {
        title: "Prohibited Activities",
        text: "You agree not to:",
        list: [
          "Submit false or misleading information",
          "Attempt to manipulate placement results",
          "Access accounts or data without authorization",
          "Use automated systems to interact with the platform",
          "Distribute malware or harmful code",
          "Reverse engineer or decompile platform software"
        ]
      }
    ]
  },
  {
    id: "user-content",
    title: "User Content & Data",
    icon: Shield,
    content: [
      {
        text: "You retain ownership of content you submit to the platform, but grant us certain rights to use it for platform operations."
      },
      {
        title: "Your Responsibilities",
        list: [
          "Ensure all submitted information is accurate and complete",
          "Obtain necessary permissions for shared data",
          "Comply with data protection regulations",
          "Respect intellectual property rights of others"
        ]
      },
      {
        title: "Our Rights",
        text: "By submitting content, you grant ChoiceX:",
        list: [
          "License to use, store, and process the data",
          "Right to share with authorized educational institutions",
          "Permission to anonymize data for research purposes",
          "Authority to remove inappropriate content"
        ]
      }
    ]
  },
  {
    id: "placement-process",
    title: "Placement Process & Results",
    icon: Scale,
    content: [
      {
        text: "The placement process follows established algorithms and Ministry of Education guidelines."
      },
      {
        title: "Process Overview",
        list: [
          "Student applications are verified by schools",
          "Data is validated by regional education bureaus",
          "Placement algorithm processes applications",
          "Results are reviewed and approved",
          "Notifications are sent to all stakeholders"
        ]
      },
      {
        title: "Result Finality",
        text: "Important considerations:",
        list: [
          "Placement decisions are final and binding",
          "Appeals must follow official procedures",
          "Errors in submitted data may affect placement",
          "Capacity constraints may impact choices"
        ]
      }
    ]
  },
  {
    id: "liability",
    title: "Limitations of Liability",
    icon: AlertTriangle,
    content: [
      {
        text: "ChoiceX provides the platform on an 'as-is' basis with certain limitations."
      },
      {
        title: "Service Availability",
        list: [
          "We strive for 99.9% uptime but cannot guarantee uninterrupted service",
          "Scheduled maintenance may cause temporary unavailability",
          "We are not liable for internet connectivity issues",
          "Service may be suspended for security or legal reasons"
        ]
      },
      {
        title: "Liability Limitations",
        text: "To the extent permitted by law:",
        list: [
          "We are not liable for indirect or consequential damages",
          "Total liability is limited to fees paid for services",
          "We are not responsible for user errors or omissions",
          "We do not guarantee specific placement outcomes"
        ]
      }
    ]
  },
  {
    id: "termination",
    title: "Termination & Suspension",
    icon: Globe,
    content: [
      {
        text: "We reserve the right to terminate or suspend accounts for violations of these Terms."
      },
      {
        title: "Grounds for Termination",
        list: [
          "Violation of these Terms of Service",
          "Submission of fraudulent information",
          "Unauthorized access or use",
          "Legal or regulatory requirements",
          "Extended account inactivity"
        ]
      },
      {
        title: "User Termination",
        text: "You may terminate your account by:",
        list: [
          "Submitting a deletion request",
          "Ceasing all use of the platform",
          "Following account closure procedures",
          "Note: Some data may be retained for legal purposes"
        ]
      }
    ]
  }
]

const userTypes = [
  {
    title: "Students",
    icon: <Users className="w-5 h-5 text-primary" />,
    responsibilities: [
      "Provide accurate academic information",
      "Submit documents before deadlines",
      "Make informed university choices",
      "Accept placement results"
    ]
  },
  {
    title: "Schools",
    icon: <BookOpen className="w-5 h-5 text-primary" />,
    responsibilities: [
      "Verify student information",
      "Submit accurate school data",
      "Meet reporting deadlines",
      "Communicate with parents/students"
    ]
  },
  {
    title: "Government Users",
    icon: <Shield className="w-5 h-5 text-primary" />,
    responsibilities: [
      "Approve valid applications",
      "Monitor system compliance",
      "Generate required reports",
      "Ensure data security"
    ]
  }
]