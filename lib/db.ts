// Database connection removed. Use backend API instead.

export interface User {
    id: number
    email: string
    password_hash: string
    first_name: string
    last_name: string
    role: "user" | "admin" | "super_admin"
    status: "pending" | "approved" | "rejected"
    created_at: string
    updated_at: string
  }
  
  export interface Event {
    id: number
    title: string
    description: string
    event_date: string
    location: string
    total_seats: number
    available_seats: number
    price: number
    image_url?: string
    created_by: number
    status: "active" | "cancelled" | "completed"
    created_at: string
    updated_at: string
  }
  
  export interface Booking {
    id: number
    user_id: number
    event_id: number
    seats_booked: number
    total_amount: number
    status: "pending" | "approved" | "rejected" | "cancelled"
    booking_date: string
    approved_by?: number
    approved_at?: string
    created_at: string
    updated_at: string
  }