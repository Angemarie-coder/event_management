"use client";

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Calendar, Menu } from "lucide-react"
import { useEffect, useState } from "react"
import EventCard from "@/components/user/eventcard"
import axios from "@/lib/axios"

interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
  availableSeats: number;
  totalSeats: number;
  createdBy?: {
    id: number;
    name: string;
    email: string;
  };
}

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    const fetchEvents = async () => {
      try {
        console.log('Fetching events from:', 'http://localhost:5000/api/events/public');
        const response = await axios.get('http://localhost:5000/api/events/public');
        console.log('Events response:', response.data);
        console.log('Events array length:', response.data.length);
        console.log('Events array:', JSON.stringify(response.data, null, 2));
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Debug events state changes
  useEffect(() => {
    console.log('Events state changed:', events);
    console.log('Events length in state:', events.length);
  }, [events]);

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
              <h1 className="text-2xl font-bold text-white">Event Management</h1>
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
        </div>

        {/* Available Events Section */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-white mb-4">Available Events</h3>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Browse and book tickets for exciting events. No account required!
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
              <p className="text-gray-300 mt-4">Loading events...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-300 text-lg">No events available at the moment.</p>
              <p className="text-gray-400 mt-2">Check back later for new events!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <EventCard key={event.id} event={event} isLandingPage={true} />
              ))}
            </div>
          )}

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
      <footer className="relative z-10 bg-gray-800/90 backdrop-blur-sm border-t border-gray-700 mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mr-3">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Event Manager</h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                The ultimate event management platform for organizing, managing, and tracking events with ease. From
                small workshops to large conferences.
              </p>
              <div className="flex space-x-4">
                {/* Social Media Links */}
                <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-gray-300 hover:text-pink-400 transition-colors text-sm">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-gray-300 hover:text-pink-400 transition-colors text-sm">
                    Browse Events
                  </Link>
                </li>
                <li>
                  <Link href="/create-event" className="text-gray-300 hover:text-pink-400 transition-colors text-sm">
                    Create Event
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-gray-300 hover:text-pink-400 transition-colors text-sm">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-300 hover:text-pink-400 transition-colors text-sm">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="text-gray-300 hover:text-pink-400 transition-colors text-sm">
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Support</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/contact" className="text-gray-300 hover:text-pink-400 transition-colors text-sm">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-300 hover:text-pink-400 transition-colors text-sm">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/documentation" className="text-gray-300 hover:text-pink-400 transition-colors text-sm">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/api" className="text-gray-300 hover:text-pink-400 transition-colors text-sm">
                    API
                  </Link>
                </li>
                <li>
                  <Link href="/status" className="text-gray-300 hover:text-pink-400 transition-colors text-sm">
                    System Status
                  </Link>
                </li>
                <li>
                  <Link href="/feedback" className="text-gray-300 hover:text-pink-400 transition-colors text-sm">
                    Feedback
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Stay Updated</h4>
              <p className="text-gray-300 text-sm">
                Subscribe to our newsletter for the latest updates and event management tips.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                />
                <Button className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white">
                  Subscribe
                </Button>
              </div>
              <div className="pt-4">
                <h5 className="text-sm font-semibold text-white mb-2">Contact Info</h5>
                <div className="space-y-1 text-sm text-gray-300">
                  <p>📧 support@eventmanager.com</p>
                  <p>📞0786298442</p>
                  <p>📍 123 Event Street,kigali City </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-center md:text-left">
                <p className="text-gray-400 text-sm">
                  &copy; 2025 Event Manager. All rights reserved. 
                </p>
              </div>
              <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
                <Link href="/privacy" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Terms of Service
                </Link>
                <Link href="/cookies" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Cookie Policy
                </Link>
                <Link href="/security" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Security
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>


      {/* Scroll to top button*/}
      <button className="fixed bottom-8 right-8 p-3 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 rounded-full transition-colors z-20">
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </div>
  )
}
