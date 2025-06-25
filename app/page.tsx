import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Calendar, Menu } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-pink-500/10 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-pink-500/20 rounded-lg rotate-45"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-pink-500/15 rounded-full"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-gray-900/95 backdrop-blur-sm shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mr-3">
                <Calendar className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Event Manager</h1>
            </div>
            <div className="hidden md:flex space-x-4">
              <Link href="/login">
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:text-white hover:border-pink-500"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white">
                  Get Started
                </Button>
              </Link>
            </div>
            <button className="md:hidden">
              <Menu className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-5xl md:text-7xl font-bold leading-tight">
            MANAGE EVENTS
            <br />
            <span className="bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 bg-clip-text text-transparent">
              WITH EASE
            </span>
          </h2>
          <p className="mt-8 text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            A comprehensive event management system with role-based access control, booking management, and automated
            email notifications.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white px-8 py-4 text-lg rounded-full"
              >
                Start Managing Events
              </Button>
            </Link>
            <Link href="/events">
              <Button
                variant="outline"
                size="lg"
                className="border-gray-600 text-gray-300 hover:text-white hover:border-pink-500 px-8 py-4 text-lg rounded-full"
              >
                Browse Events
              </Button>
            </Link>
          </div>
        </div>

        {/* Event Gallery Section */}
        <div className="mt-32">
          <h3 className="text-4xl font-bold text-center text-white mb-4">Experience Events Like Never Before</h3>
          <p className="text-xl text-gray-300 text-center mb-16 max-w-2xl mx-auto">
            From corporate conferences to workshops, seminars to networking events - manage them all seamlessly
          </p>

          {/* Main Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Large Conference Image */}
            <div className="lg:col-span-2 lg:row-span-2 relative group overflow-hidden rounded-2xl">
              <Image
                src="/event5.jpg?height=600&width=800"
                alt="Large conference with audience"
                width={800}
                height={600}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h4 className="text-2xl font-bold mb-2">Corporate Conferences</h4>
                <p className="text-gray-200">Host large-scale professional events with ease</p>
              </div>
            </div>

            {/* Workshop Image */}
            <div className="relative group overflow-hidden rounded-2xl">
              <Image
                src="/event4.jpg?height=300&width=400"
                alt="Interactive workshop session"
                width={400}
                height={300}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h4 className="text-lg font-bold mb-1">Workshops</h4>
                <p className="text-sm text-gray-200">Interactive learning sessions</p>
              </div>
            </div>

            {/* Networking Event */}
            <div className="relative group overflow-hidden rounded-2xl">
              <Image
                src="/blog-1.00bb18f1.jpg?height=300&width=400"
                alt="Networking event with people mingling"
                width={400}
                height={300}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h4 className="text-lg font-bold mb-1">Networking</h4>
                <p className="text-sm text-gray-200">Connect professionals</p>
              </div>
            </div>
          </div>

          {/* Secondary Gallery Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {/* Seminar */}
            <div className="relative group overflow-hidden rounded-2xl">
              <Image
                src="/event2.jpg?height=250&width=300"
                alt="Educational seminar"
                width={300}
                height={250}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-3 left-3 text-white">
                <h4 className="text-sm font-bold">Seminars</h4>
              </div>
            </div>

            {/* Product Launch */}
            <div className="relative group overflow-hidden rounded-2xl">
              <Image
                src="/event1.jpg?height=250&width=300"
                alt="Product launch event"
                width={300}
                height={250}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-3 left-3 text-white">
                <h4 className="text-sm font-bold">Product Launches</h4>
              </div>
            </div>

            {/* Team Building */}
            <div className="relative group overflow-hidden rounded-2xl">
              <Image
                src="/event9.jpg?height=250&width=300"
                alt="Team building activities"
                width={300}
                height={250}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-3 left-3 text-white">
                <h4 className="text-sm font-bold">Team Building</h4>
              </div>
            </div>

            {/* Awards Ceremony */}
            <div className="relative group overflow-hidden rounded-2xl">
              <Image
                src="/event13.jpg?height=250&width=300"
                alt="Awards ceremony"
                width={300}
                height={250}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-3 left-3 text-white">
                <h4 className="text-sm font-bold">Awards</h4>
              </div>
            </div>
          </div>

          {/* Platform Features Visual */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-20">
            {/* Event Management Dashboard */}
            <div className="relative group overflow-hidden rounded-2xl">
              <Image
                src="/event3.jpg?height=400&width=600"
                alt="Event management dashboard interface"
                width={600}
                height={400}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute inset-0 flex items-center">
                <div className="p-8 text-white">
                  <h4 className="text-3xl font-bold mb-4">Easy Management</h4>
                  <p className="text-lg text-gray-200 mb-6">
                    Intuitive dashboard to create, manage, and track all your events in one place
                  </p>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Real-time booking tracking</li>
                    <li>• Automated notifications</li>
                    <li>• Role-based access control</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Mobile App Interface */}
            <div className="relative group overflow-hidden rounded-2xl">
              <Image
                src="/event8.jpg?height=400&width=600"
                alt="Mobile event booking interface"
                width={600}
                height={400}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-end">
                <div className="p-8 text-white text-right">
                  <h4 className="text-3xl font-bold mb-4">Seamless Booking</h4>
                  <p className="text-lg text-gray-200 mb-6">
                    Users can easily browse and book events with our user-friendly interface
                  </p>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Quick event discovery</li>
                    <li>• Instant booking confirmation</li>
                    <li>• Payment integration</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-800/50 backdrop-blur-sm border-t border-gray-700 mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2024 Event Manager. Built with Next.js, TypeScript, and PostgreSQL.</p>
          </div>
        </div>
      </footer>

      {/* Scroll to top button */}
      <button className="fixed bottom-8 right-8 p-3 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 rounded-full transition-colors z-20">
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </div>
  )
}
