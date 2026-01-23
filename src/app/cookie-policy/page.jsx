"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  Cookie,
  Settings,
  Shield,
  Bell,
  Trash2,
  RefreshCw,
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";

export default function CookiePolicyPage() {
  const [openSection, setOpenSection] = useState("what-are-cookies");
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true,
    analytics: true,
    functional: true,
    marketing: false,
  });

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleCookieToggle = (type) => {
    if (type !== "necessary") {
      setCookiePreferences((prev) => ({
        ...prev,
        [type]: !prev[type],
      }));
    }
  };

  const handleAcceptAll = () => {
    setCookiePreferences({
      necessary: true,
      analytics: true,
      functional: true,
      marketing: true,
    });
  };

  const handleRejectAll = () => {
    setCookiePreferences({
      necessary: true,
      analytics: false,
      functional: false,
      marketing: false,
    });
  };

  const handleSavePreferences = () => {
    // In a real app, you would save these preferences to localStorage/cookies
    localStorage.setItem(
      "cookiePreferences",
      JSON.stringify(cookiePreferences),
    );
    alert("Cookie preferences saved!");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-28">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <Cookie className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Cookie Policy
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Last Updated: December 1, 2024. Learn how ChoiceX uses cookies and
            similar technologies.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div className="bg-card border border-border rounded-xl p-8 mb-8">
            <p className="text-muted-foreground mb-6">
              This Cookie Policy explains how ChoiceX uses cookies and similar
              technologies to recognize you when you visit our platform. It
              explains what these technologies are and why we use them.
            </p>

            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <div className="text-center p-3 bg-background rounded-lg">
                <Shield className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="font-medium text-sm">Essential</p>
              </div>
              <div className="text-center p-3 bg-background rounded-lg">
                <Bell className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="font-medium text-sm">Functional</p>
              </div>
              <div className="text-center p-3 bg-background rounded-lg">
                <RefreshCw className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="font-medium text-sm">Analytics</p>
              </div>
              <div className="text-center p-3 bg-background rounded-lg">
                <Settings className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="font-medium text-sm">Marketing</p>
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

          {/* Cookie Management Section */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Settings className="w-6 h-6 text-primary" />
              Manage Your Cookie Preferences
            </h3>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="space-y-6">
                {Object.entries(cookiePreferences).map(([type, enabled]) => (
                  <div
                    key={type}
                    className="flex items-center justify-between p-4 bg-background rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        {getCookieIcon(type)}
                        <h4 className="font-bold text-foreground capitalize">
                          {type} Cookies
                        </h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {getCookieDescription(type)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      {type === "necessary" ? (
                        <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                          Always Enabled
                        </span>
                      ) : (
                        <button
                          onClick={() => handleCookieToggle(type)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            enabled ? "bg-primary" : "bg-muted"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              enabled ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-border">
                <Button onClick={handleAcceptAll}>Accept All Cookies</Button>
                <Button onClick={handleRejectAll} variant="outline">
                  Reject Non-Essential
                </Button>
                <Button onClick={handleSavePreferences} className="ml-auto">
                  Save Preferences
                </Button>
              </div>
            </div>
          </div>

          {/* Cookie Details Table */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-foreground mb-6">
              Detailed Cookie Information
            </h3>

            <div className="border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-card">
                    <tr>
                      <th className="text-left p-4 font-bold text-foreground">
                        Cookie Name
                      </th>
                      <th className="text-left p-4 font-bold text-foreground">
                        Purpose
                      </th>
                      <th className="text-left p-4 font-bold text-foreground">
                        Duration
                      </th>
                      <th className="text-left p-4 font-bold text-foreground">
                        Type
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {cookieDetails.map((cookie, idx) => (
                      <tr key={idx} className="hover:bg-card/50 transition">
                        <td className="p-4 font-mono text-sm">{cookie.name}</td>
                        <td className="p-4 text-muted-foreground">
                          {cookie.purpose}
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {cookie.duration}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              cookie.type === "necessary"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                : cookie.type === "analytics"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                  : cookie.type === "functional"
                                    ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                                    : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                            }`}
                          >
                            {cookie.type}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Browser Controls */}
          <div className="mt-12 bg-card border border-border rounded-xl p-8">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Browser Cookie Controls
            </h3>
            <p className="text-muted-foreground mb-6">
              You can control cookies through your browser settings. Here's how
              to manage cookies in popular browsers:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-foreground mb-3">
                  Google Chrome
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>1. Click the three dots menu → Settings</li>
                  <li>
                    2. Select "Privacy and security" → "Cookies and other site
                    data"
                  </li>
                  <li>3. Choose your preferred cookie settings</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-3">
                  Mozilla Firefox
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>1. Click menu → Options</li>
                  <li>2. Select "Privacy & Security"</li>
                  <li>
                    3. Under "Cookies and Site Data," choose your settings
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h4 className="font-bold text-foreground mb-2">
                  More Questions?
                </h4>
                <p className="text-muted-foreground text-sm">
                  Contact us at privacy@choicex.edu.et for cookie-related
                  inquiries
                </p>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" asChild size="sm">
                  <Link href="/privacy-policy">Privacy Policy</Link>
                </Button>
                <Button variant="outline" asChild size="sm">
                  <Link href="/terms">Terms of Service</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
const getCookieIcon = (type) => {
  switch (type) {
    case "necessary":
      return <Shield className="w-5 h-5 text-primary" />;
    case "analytics":
      return <RefreshCw className="w-5 h-5 text-primary" />;
    case "functional":
      return <Bell className="w-5 h-5 text-primary" />;
    case "marketing":
      return <Settings className="w-5 h-5 text-primary" />;
    default:
      return <Cookie className="w-5 h-5 text-primary" />;
  }
};

const getCookieDescription = (type) => {
  switch (type) {
    case "necessary":
      return "Required for platform functionality. Cannot be disabled.";
    case "analytics":
      return "Helps us understand how users interact with the platform.";
    case "functional":
      return "Remembers your preferences and settings.";
    case "marketing":
      return "Used for personalized content and advertising.";
    default:
      return "";
  }
};

const sections = [
  {
    id: "what-are-cookies",
    title: "What Are Cookies?",
    icon: Cookie,
    content: [
      {
        text: "Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.",
      },
      {
        title: "How Cookies Work",
        list: [
          "Stored by your web browser when you visit a site",
          "Sent back to the site on subsequent visits",
          "Can remember your preferences and settings",
          "Help analyze how the site is used",
        ],
      },
      {
        title: "First-Party vs Third-Party Cookies",
        text: "We use both types of cookies:",
        list: [
          "First-party cookies: Set by ChoiceX directly",
          "Third-party cookies: Set by our service providers",
          "Session cookies: Temporary, deleted when you close browser",
          "Persistent cookies: Remain until they expire or are deleted",
        ],
      },
    ],
  },
  {
    id: "why-we-use",
    title: "Why We Use Cookies",
    icon: Shield,
    content: [
      {
        text: "Cookies help us provide you with a better experience on our platform and enable essential functions.",
      },
      {
        title: "Essential Functions",
        list: [
          "User authentication and session management",
          "Secure login and account access",
          "Form submissions and data processing",
          "Platform security and fraud prevention",
        ],
      },
      {
        title: "User Experience",
        list: [
          "Remembering language preferences",
          "Saving form progress and drafts",
          "Customizing interface settings",
          "Maintaining user preferences",
        ],
      },
      {
        title: "Analytics & Improvement",
        list: [
          "Understanding user behavior and patterns",
          "Identifying areas for platform improvement",
          "Measuring feature effectiveness",
          "Optimizing performance and speed",
        ],
      },
    ],
  },
  {
    id: "cookie-types",
    title: "Types of Cookies We Use",
    icon: Settings,
    content: [
      {
        text: "We categorize cookies based on their purpose and function.",
      },
      {
        title: "Strictly Necessary Cookies",
        list: [
          "Essential for platform operation",
          "Cannot be turned off in our systems",
          "Required for user authentication",
          "Necessary for security and fraud prevention",
        ],
      },
      {
        title: "Analytics Cookies",
        list: [
          "Help us understand platform usage",
          "Collect anonymous statistical data",
          "Identify popular features and pages",
          "Help improve user experience",
        ],
      },
      {
        title: "Functional Cookies",
        list: [
          "Remember user preferences and settings",
          "Enable personalized features",
          "Save language and region choices",
          "Remember form data and selections",
        ],
      },
    ],
  },
  {
    id: "control-cookies",
    title: "How to Control Cookies",
    icon: Bell,
    content: [
      {
        text: "You have several options to control how cookies are used on your device.",
      },
      {
        title: "Browser Settings",
        list: [
          "Most browsers allow you to block cookies",
          "You can delete existing cookies",
          "Set preferences for specific websites",
          "Use private/incognito browsing modes",
        ],
      },
      {
        title: "Platform Controls",
        list: [
          "Use our cookie preference center",
          "Opt-out of non-essential cookies",
          "Withdraw consent at any time",
          "Delete account-related cookies",
        ],
      },
      {
        title: "Important Notes",
        list: [
          "Blocking cookies may affect platform functionality",
          "Essential cookies cannot be disabled",
          "Preferences are saved for future visits",
          "You can change preferences anytime",
        ],
      },
    ],
  },
  {
    id: "other-technologies",
    title: "Other Tracking Technologies",
    icon: RefreshCw,
    content: [
      {
        text: "In addition to cookies, we use similar technologies for specific purposes.",
      },
      {
        title: "Local Storage",
        list: [
          "Stores data in your browser",
          "Persists after browser restarts",
          "Used for larger data sets",
          "Enables offline functionality",
        ],
      },
      {
        title: "Session Storage",
        list: [
          "Temporary storage during browsing session",
          "Deleted when browser is closed",
          "Used for form data and temporary preferences",
          "Helps with navigation and user flow",
        ],
      },
      {
        title: "Web Beacons",
        list: [
          "Small transparent images in emails",
          "Track email open rates",
          "Help measure campaign effectiveness",
          "Used for communication analytics",
        ],
      },
    ],
  },
  {
    id: "updates",
    title: "Policy Updates & Contact",
    icon: Trash2,
    content: [
      {
        text: "We may update this Cookie Policy as our platform evolves and technologies change.",
      },
      {
        title: "Policy Changes",
        list: [
          "We will notify users of significant changes",
          "Updated date will be shown at the top",
          "Continued use implies acceptance of changes",
          "Major changes will be announced via email",
        ],
      },
      {
        title: "Your Rights",
        list: [
          "Right to information about cookie usage",
          "Right to consent or withdraw consent",
          "Right to access your cookie preferences",
          "Right to delete cookies from your device",
        ],
      },
      {
        title: "Contact Us",
        text: "For questions about this Cookie Policy:",
        list: [
          "Email: privacy@choicex.edu.et",
          "Address: Ministry of Education, Addis Ababa",
          "Response time: Within 7 business days",
          "Hours: Monday-Friday, 9 AM - 5 PM EAT",
        ],
      },
    ],
  },
];

const cookieDetails = [
  {
    name: "sid",
    purpose: "Maintains your login session",
    duration: "Session",
    type: "necessary",
  },
  // {
  //   name: "choicex_csrf",
  //   purpose: "Security token for form submissions",
  //   duration: "Session",
  //   type: "necessary",
  // },
  // {
  //   name: "choicex_preferences",
  //   purpose: "Stores your language and region settings",
  //   duration: "1 year",
  //   type: "functional",
  // },
  // {
  //   name: "_ga",
  //   purpose: "Google Analytics - distinguishes users",
  //   duration: "2 years",
  //   type: "analytics",
  // },
  // {
  //   name: "_gid",
  //   purpose: "Google Analytics - distinguishes users",
  //   duration: "24 hours",
  //   type: "analytics",
  // },
  // {
  //   name: "_gat",
  //   purpose: "Google Analytics - throttles request rate",
  //   duration: "1 minute",
  //   type: "analytics",
  // },
  // {
  //   name: "choicex_form_progress",
  //   purpose: "Saves your form progress",
  //   duration: "7 days",
  //   type: "functional",
  // },
  // {
  //   name: "choicex_notifications",
  //   purpose: "Stores notification preferences",
  //   duration: "1 year",
  //   type: "functional",
  // },
  // {
  //   name: "choicex_consent",
  //   purpose: "Remembers your cookie preferences",
  //   duration: "1 year",
  //   type: "necessary",
  // },
];
