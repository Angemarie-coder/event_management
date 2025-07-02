"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function AddEventPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    totalSeats: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await api.post('/api/events', {
        ...formData,
        totalSeats: parseInt(formData.totalSeats),
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard/admins');
      }, 2000);
    } catch (error: any) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="py-8 bg-[#f4f4fa]">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Event created successfully!</p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-8">
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold">Event Created Successfully!</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Your event has been created and is now available for bookings.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex justify-center items-center bg-[#f4f4fa] py-8">
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-10 space-y-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Event</h1>
          <p className="text-gray-600">Fill in the details below to create a new event.</p>
        </div>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-2">
          <Label htmlFor="title">Event Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="Enter event title"
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="Enter event description"
            rows={4}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Event Date</Label>
          <Input
            id="date"
            name="date"
            type="datetime-local"
            value={formData.date}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="totalSeats">Total Seats</Label>
          <Input
            id="totalSeats"
            name="totalSeats"
            type="number"
            min="1"
            value={formData.totalSeats}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="Enter total seats"
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="Enter event location"
            className="w-full"
          />
        </div>
        <div className="flex gap-4">
          <Button
            type="submit"
            className="flex-1 bg-gray-700 hover:bg-gray-800 text-white h-12 text-lg font-semibold rounded-lg"
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Event
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/admins')}
            disabled={loading}
            className="flex-1 h-12 text-lg font-semibold rounded-lg"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
} 