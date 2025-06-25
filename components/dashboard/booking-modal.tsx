"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, MapPin, Users, DollarSign, Loader2 } from "lucide-react"
import type { Event } from "@/lib/db"

interface BookingModalProps {
  event: Event
  onClose: () => void
  onBookingComplete: () => void
}

export default function BookingModal({ event, onClose, onBookingComplete }: BookingModalProps) {
  const [seatsBooked, setSeatsBooked] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const totalAmount = event.price * seatsBooked

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          seatsBooked,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          onBookingComplete()
          onClose()
        }, 2000)
      } else {
        setError(data.error || "Booking failed")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent>
          <div className="text-center space-y-4 py-4">
            <div className="text-green-600 text-6xl">✓</div>
            <h3 className="text-lg font-semibold">Booking Submitted!</h3>
            <p className="text-sm text-muted-foreground">
              Your booking has been submitted and is pending approval. You will receive an email notification once it's
              reviewed.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book Event</DialogTitle>
          <DialogDescription>Complete your booking for this event</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Event Details */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <h4 className="font-medium">{event.title}</h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(event.event_date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                {event.location}
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                {event.available_seats} seats available
              </div>
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />${event.price} per seat
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="seats">Number of Seats</Label>
              <Input
                id="seats"
                type="number"
                min="1"
                max={event.available_seats}
                value={seatsBooked}
                onChange={(e) => setSeatsBooked(Number.parseInt(e.target.value) || 1)}
                disabled={loading}
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Amount:</span>
                <span className="text-lg font-bold">${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Book Now
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
