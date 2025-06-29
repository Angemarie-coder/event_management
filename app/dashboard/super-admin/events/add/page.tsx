"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AddEventPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    totalSeats: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await api.post("/api/events", { ...form, totalSeats: Number(form.totalSeats) });
      setSuccess("Event added successfully!");
      setForm({ title: "", description: "", date: "", location: "", totalSeats: 0 });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Add Event</h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {success && <div className="text-green-600 mb-4">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" value={form.title} onChange={handleChange} required disabled={loading} />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <textarea id="description" name="description" value={form.description} onChange={handleChange} required disabled={loading} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <Label htmlFor="date">Date & Time</Label>
          <Input id="date" name="date" type="datetime-local" value={form.date} onChange={handleChange} required disabled={loading} />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" value={form.location} onChange={handleChange} required disabled={loading} />
        </div>
        <div>
          <Label htmlFor="totalSeats">Total Seats</Label>
          <Input id="totalSeats" name="totalSeats" type="number" min={1} value={form.totalSeats} onChange={handleChange} required disabled={loading} />
        </div>
        <Button type="submit" className="w-full bg-pink-700 hover:bg-pink-800 text-white" disabled={loading} >
          {loading ? "Adding..." : "Add Event"}
        </Button>
      </form>
    </div>
  );
} 