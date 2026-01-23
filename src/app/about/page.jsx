'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Users, Target, Zap, Globe, Heart, BookOpen, CheckCircle } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background text-foreground ">
            {/* Navigation */}
            <Navbar />
            {/* Hero Section */}
            <section className="relative min-h-[600px] bg-gradient-to-br from-primary via-primary to-primary pt-24 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl opacity-50"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-6 py-24 flex flex-col items-center text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                        About ChoiceX
                    </h1>
                    <p className="text-lg text-white/90 max-w-2xl mx-auto">
                        Transforming education placement in Ethiopia by connecting schools, students, and government through intelligent, transparent, and efficient technology.
                    </p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div>
                            <h2 className="text-3xl font-bold mb-4 text-primary">Our Mission</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                To revolutionize student placement in Ethiopia by digitizing the entire process, making education more accessible, transparent, and efficient for schools, students, and the Ministry of Education.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold mb-4 text-primary">Our Vision</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                A future where every student in Ethiopia has fair access to quality education and placement opportunities through an intelligent, data-driven platform that serves all stakeholders equitably.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-20 bg-gradient-to-r from-primary to-accent">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4 text-white">Our Core Values</h2>
                        <p className="text-lg text-white/80 max-w-2xl mx-auto">
                            Guided by principles that drive our mission
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { icon: Heart, title: 'Fairness', description: 'Equal opportunities for all students' },
                            { icon: Globe, title: 'Transparency', description: 'Clear, honest communication throughout' },
                            { icon: Zap, title: 'Innovation', description: 'Continuous improvement and modernization' },
                            { icon: Users, title: 'Collaboration', description: 'Working together with all stakeholders' },
                        ].map((value, idx) => {
                            const Icon = value.icon
                            return (
                                <div key={idx} className="bg-white/90 backdrop-blur p-8 rounded-lg text-center">
                                    <Icon className="w-10 h-10 text-primary mx-auto mb-4" />
                                    <h3 className="font-bold text-lg text-primary mb-2">{value.title}</h3>
                                    <p className="text-muted-foreground text-sm">{value.description}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* The Problem & Solution */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-4xl font-bold mb-16 text-center text-primary">The Challenge We Solve</h2>

                    <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                        <div>
                            <h3 className="text-2xl font-bold mb-6 text-primary">Current System Challenges</h3>
                            <ul className="space-y-4">
                                {[
                                    'Manual, paper-based processes prone to errors',
                                    'Limited transparency in placement decisions',
                                    'Inconsistent data across different systems',
                                    'Slow processing and result publication',
                                    'Difficulty tracking student preferences',
                                    'Limited analytics for decision-making',
                                ].map((challenge, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <span className="text-destructive mt-1">✕</span>
                                        <span className="text-muted-foreground">{challenge}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold mb-6 text-primary">Our Solution</h3>
                            <ul className="space-y-4">
                                {[
                                    'Fully digitized platform for all stakeholders',
                                    'Real-time tracking and transparency',
                                    'Centralized, unified data system',
                                    'Fast, automated processing',
                                    'Student-centric preference management',
                                    'Comprehensive analytics and insights',
                                ].map((solution, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                        <span className="text-muted-foreground">{solution}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Impact Metrics */}
            <section className="py-20 bg-gradient-to-r from-primary to-accent">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4 text-white">Our Impact</h2>
                        <p className="text-lg text-white/80">Measurable results transforming education in Ethiopia</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { metric: '487K+', label: 'Students Placed', color: 'bg-white/90' },
                            { metric: '94.8%', label: 'Success Rate', color: 'bg-white/90' },
                            { metric: '1,245', label: 'Schools Active', color: 'bg-white/90' },
                            { metric: '12', label: 'Regions Served', color: 'bg-white/90' },
                        ].map((item, idx) => (
                            <div key={idx} className={`${item.color} p-8 rounded-lg text-center`}>
                                <div className={`text-4xl font-bold mb-2 ${item.color.includes('white') ? 'text-primary' : 'text-white'}`}>
                                    {item.metric}
                                </div>
                                <p className={`text-sm ${item.color.includes('white') ? 'text-muted-foreground' : 'text-white/80'}`}>
                                    {item.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stakeholders */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4 text-primary">Built for All Stakeholders</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            ChoiceX serves the entire education ecosystem
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                name: 'Schools',
                                benefits: ['Manage enrollments', 'Track placements', 'Generate reports', 'Monitor compliance'],
                            },
                            {
                                name: 'Students',
                                benefits: ['Self-registration', 'Track status', 'View results', 'Document upload'],
                            },
                            {
                                name: 'Ministry (MoE)',
                                benefits: ['Monitor system', 'Approve schools', 'Review applications', 'Generate analytics'],
                            },
                            {
                                name: 'EAES',
                                benefits: ['Process placements', 'Run algorithms', 'Send notifications', 'Generate reports'],
                            },
                        ].map((stakeholder, idx) => (
                            <div key={idx} className="bg-primary/5 border border-primary/20 rounded-lg p-8">
                                <h3 className="text-xl font-bold text-primary mb-4">{stakeholder.name}</h3>
                                <ul className="space-y-3">
                                    {stakeholder.benefits.map((benefit, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                                            <span className="text-sm text-muted-foreground">{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-primary to-primary text-white">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold mb-6">Join the Education Revolution</h2>
                    <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                        Be part of transforming student placement across Ethiopia. Start your journey with ChoiceX today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {/* <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                            Get Started
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button> */}
                        <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 bg-transparent">
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
