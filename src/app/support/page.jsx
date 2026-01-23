import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Support Center</h1>
        
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-medium text-gray-900 mb-2">Phone Support</h3>
              <p className="text-gray-600">+251 911 234 567</p>
              <p className="text-sm text-gray-500 mt-1">Mon-Fri, 8:30 AM - 5:30 PM</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-medium text-gray-900 mb-2">Email Support</h3>
              <p className="text-gray-600">support@choicex.gov.et</p>
              <p className="text-sm text-gray-500 mt-1">Response within 2-4 hours</p>
            </div>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Important Notice</h2>
          <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
            <p className="text-gray-900 font-medium">2025 Placement Results</p>
            <p className="text-gray-600">Announcement: December 20, 2024</p>
            <p className="text-sm text-gray-500 mt-2">Registration deadline: December 15, 2024</p>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Common Questions</h2>
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-medium text-gray-900 mb-2">How to register as a student?</h3>
              <p className="text-gray-600">Visit student.choicex.gov.et and click "Register" to begin.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-medium text-gray-900 mb-2">What documents are required?</h3>
              <p className="text-gray-600">National ID and school certificate for students.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-medium text-gray-900 mb-2">When are results announced?</h3>
              <p className="text-gray-600">2025 placement results will be on December 20, 2024.</p>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← Back to Home
          </Link>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}