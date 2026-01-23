"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  Shield,
  Lock,
  Eye,
  Database,
  UserCheck,
  FileText,
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function PrivacyPolicyPage() {
  const [openSection, setOpenSection] = useState("data-collection");

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-28">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Last Updated: December 1, 2024. This Privacy Policy explains how
            ChoiceX collects, uses, and protects your information.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div className="bg-card border border-border rounded-xl p-8 mb-8">
            <p className="text-muted-foreground mb-6">
              ChoiceX ("we", "our", or "us") is committed to protecting your
              privacy. This Privacy Policy applies to all users of the ChoiceX
              platform, including students, schools, universities, and
              government officials.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-4 bg-background rounded-lg">
                <Lock className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="font-medium">Data Security</p>
              </div>
              <div className="text-center p-4 bg-background rounded-lg">
                <Eye className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="font-medium">Transparency</p>
              </div>
              <div className="text-center p-4 bg-background rounded-lg">
                <UserCheck className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="font-medium">User Control</p>
              </div>
              <div className="text-center p-4 bg-background rounded-lg">
                <FileText className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="font-medium">Compliance</p>
              </div>
            </div>
          </div>

          {/* Expandable Sections */}
          <div className="space-y-4">
            {sections.map((section) => (
              <div
                key={section.id}
                className="border border-border rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-6 text-left bg-card hover:bg-card/50 transition"
                >
                  <div className="flex items-center gap-4">
                    <section.icon className="w-5 h-5 text-primary" />
                    <h3 className="text-xl font-bold text-foreground">
                      {section.title}
                    </h3>
                  </div>
                  {openSection === section.id ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>

                {openSection === section.id && (
                  <div className="p-6 pt-2 bg-background border-t border-border">
                    <div className="space-y-4">
                      {section.content.map((content, idx) => (
                        <div key={idx}>
                          {content.title && (
                            <h4 className="font-bold text-foreground mb-2">
                              {content.title}
                            </h4>
                          )}
                          <p className="text-muted-foreground">
                            {content.text}
                          </p>
                          {content.list && (
                            <ul className="mt-2 space-y-1 text-muted-foreground">
                              {content.list.map((item, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-primary mt-1">•</span>
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

          {/* Data Collection Table */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Database className="w-6 h-6 text-primary" />
              Data We Collect
            </h3>

            <div className="border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-card">
                    <tr>
                      <th className="text-left p-4 font-bold text-foreground">
                        Data Type
                      </th>
                      <th className="text-left p-4 font-bold text-foreground">
                        Purpose
                      </th>
                      <th className="text-left p-4 font-bold text-foreground">
                        Retention
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {dataCollection.map((item, idx) => (
                      <tr key={idx} className="hover:bg-card/50 transition">
                        <td className="p-4">
                          <p className="font-medium text-foreground">
                            {item.type}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {item.examples}
                          </p>
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {item.purpose}
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {item.retention}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-12 bg-card border border-border rounded-xl p-8">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Contact Us
            </h3>
            <p className="text-muted-foreground mb-6">
              If you have questions about this Privacy Policy or our data
              practices, please contact our Data Protection Officer:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-foreground mb-2">Email</h4>
                <p className="text-muted-foreground">privacy@choicex.edu.et</p>
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-2">Address</h4>
                <p className="text-muted-foreground">
                  Ministry of Education
                  <br />
                  Addis Ababa, Ethiopia
                </p>
              </div>
            </div>
          </div>

          {/* Acknowledgment */}
          <div className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-lg">
            <p className="text-foreground">
              <strong>Note:</strong> By using the ChoiceX platform, you
              acknowledge that you have read and understood this Privacy Policy.
              We may update this policy periodically, and we will notify users
              of significant changes.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

const sections = [
  {
    id: "data-collection",
    title: "Information We Collect",
    icon: Database,
    content: [
      {
        title: "Personal Information",
        text: "We collect information that identifies you as an individual, including but not limited to:",
        list: [
          "Full name, email address, and phone number",
          "National identification numbers",
          "Date of birth and gender",
          "Academic records and GPA",
          "School and university preferences",
        ],
      },
      {
        title: "Educational Data",
        text: "As part of the placement process, we collect:",
        list: [
          "Academic year and specialization",
          "School information and performance",
          "University choices and rankings",
          "Placement results and status",
        ],
      },
      {
        title: "Technical Information",
        text: "Automatically collected technical data:",
        list: [
          "IP address and device information",
          "Browser type and version",
          "Pages visited and time spent",
          "Cookies and usage data",
        ],
      },
    ],
  },
  {
    id: "data-use",
    title: "How We Use Your Information",
    icon: Eye,
    content: [
      {
        text: "We use the collected information for the following purposes:",
      },
      {
        title: "Platform Operation",
        text: "To provide and maintain our services, including:",
        list: [
          "Processing student applications",
          "Managing school and university data",
          "Facilitating the placement algorithm",
          "Generating reports and analytics",
        ],
      },
      {
        title: "Communication",
        text: "To communicate with users about:",
        list: [
          "Application status updates",
          "Important system announcements",
          "Educational opportunities",
          "Policy changes",
        ],
      },
      {
        title: "Improvement & Research",
        text: "To enhance our platform and services:",
        list: [
          "Analyzing usage patterns",
          "Improving placement algorithms",
          "Conducting educational research",
          "Developing new features",
        ],
      },
    ],
  },
  {
    id: "data-sharing",
    title: "Information Sharing & Disclosure",
    icon: UserCheck,
    content: [
      {
        text: "We may share your information in the following circumstances:",
      },
      {
        title: "With Educational Institutions",
        text: "Your information may be shared with:",
        list: [
          "Schools for verification and enrollment",
          "Universities for placement processing",
          "Regional education bureaus",
          "Ministry of Education officials",
        ],
      },
      {
        title: "Legal Requirements",
        text: "We may disclose information if required by law:",
        list: [
          "To comply with legal obligations",
          "To protect rights and safety",
          "To prevent fraud or abuse",
          "For government reporting requirements",
        ],
      },
      {
        title: "Service Providers",
        text: "We engage trusted third parties to:",
        list: [
          "Host our platform and databases",
          "Provide security services",
          "Send communications",
          "Analyze platform usage",
        ],
      },
    ],
  },
  {
    id: "data-security",
    title: "Data Security & Protection",
    icon: Lock,
    content: [
      {
        text: "We implement robust security measures to protect your information:",
      },
      {
        title: "Technical Safeguards",
        list: [
          "Encryption of sensitive data in transit and at rest",
          "Regular security audits and vulnerability assessments",
          "Secure server infrastructure with access controls",
          "Regular data backups and disaster recovery plans",
        ],
      },
      {
        title: "Administrative Controls",
        list: [
          "Strict access controls based on user roles",
          "Regular staff training on data protection",
          "Incident response procedures",
          "Compliance monitoring and reporting",
        ],
      },
      {
        title: "User Responsibilities",
        text: "Users also play a role in protecting their information:",
        list: [
          "Keep login credentials confidential",
          "Use strong, unique passwords",
          "Log out after using shared devices",
          "Report any suspicious activity immediately",
        ],
      },
    ],
  },
  {
    id: "user-rights",
    title: "Your Rights & Choices",
    icon: Shield,
    content: [
      {
        text: "You have certain rights regarding your personal information:",
      },
      {
        title: "Access & Correction",
        list: [
          "Access your personal information",
          "Request corrections to inaccurate data",
          "View your placement history",
          "Download your application data",
        ],
      },
      {
        title: "Control & Preferences",
        list: [
          "Opt-out of non-essential communications",
          "Request data portability",
          "Withdraw consent where applicable",
          "Manage cookie preferences",
        ],
      },
      {
        title: "Complaints & Questions",
        text: "You can exercise these rights by:",
        list: [
          "Contacting our Data Protection Officer",
          "Using platform privacy controls",
          "Submitting formal requests",
          "Filing complaints with regulatory authorities",
        ],
      },
    ],
  },
  {
    id: "retention",
    title: "Data Retention & Deletion",
    icon: FileText,
    content: [
      {
        text: "We retain your information for specific periods based on legal and operational requirements:",
      },
      {
        title: "Retention Periods",
        list: [
          "Active student records: 7 years after graduation",
          "Application data: 5 years after placement",
          "User accounts: Until deletion request",
          "Analytics data: 3 years maximum",
        ],
      },
      {
        title: "Deletion Process",
        list: [
          "Secure deletion of personal data",
          "Anonymization of statistical data",
          "Archive for legal requirements",
          "Notification of data removal",
        ],
      },
      {
        title: "Legal Holds",
        text: "In certain circumstances, data may be retained longer:",
        list: [
          "Pending legal proceedings",
          "Government investigations",
          "Academic research projects",
          "Historical archiving purposes",
        ],
      },
    ],
  },
];

const dataCollection = [
  {
    type: "Personal Identification",
    examples: "Name, Email, Phone, National ID",
    purpose: "User authentication and communication",
    retention: "7 years after last activity",
  },
  {
    type: "Educational Records",
    examples: "GPA, Academic year, School history",
    purpose: "Placement processing and verification",
    retention: "10 years for archival purposes",
  },
  {
    type: "Preference Data",
    examples: "University choices, Rankings",
    purpose: "Algorithm processing and placement",
    retention: "5 years after placement",
  },
  {
    type: "Technical Data",
    examples: "IP address, Device info, Cookies",
    purpose: "Security, analytics, and improvement",
    retention: "3 years maximum",
  },
  {
    type: "Communication Logs",
    examples: "Emails, Notifications, Support tickets",
    purpose: "Service improvement and records",
    retention: "5 years",
  },
];
