
import Link from "next/link"
import Image from "next/image"
export default function Footer() {
    return (
        <footer className="bg-primary text-white py-12">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <h3 className="font-bold mb-4">Product</h3>
                        <ul className="space-y-2 text-white/70 text-sm">
                            <li>
                                <Link href="#" className="hover:text-white transition">
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white transition">
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white transition">
                                    Security
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">Company</h3>
                        <ul className="space-y-2 text-white/70 text-sm">
                            <li>
                                <Link href="/about" className="hover:text-white transition">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white transition">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white transition">
                                    Careers
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">Legal</h3>
                        <ul className="space-y-2 text-white/70 text-sm">
                            <li>
                                <Link href="#" className="hover:text-white transition">
                                    Privacy
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white transition">
                                    Terms
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white transition">
                                    Cookie Policy
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">Contact</h3>
                        <p className="text-white/70 text-sm mb-4">support@eduplace.et</p>
                        <p className="text-white/70 text-sm">+251 111 234 567</p>
                    </div>
                </div>

                <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row items-center justify-between text-white/60 text-sm">
                    <p>&copy; 2025 EduPlace. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link href="#" className="hover:text-white transition">
                            Twitter
                        </Link>
                        <Link href="#" className="hover:text-white transition">
                            LinkedIn
                        </Link>
                        <Link href="#" className="hover:text-white transition">
                            Facebook
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}