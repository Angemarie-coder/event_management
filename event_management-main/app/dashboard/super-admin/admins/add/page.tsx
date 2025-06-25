"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AddAdminPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await api.post("/api/admins", form);
      setSuccess("Admin added successfully! Pending approval.");
      setForm({ name: "", email: "", password: "", role: "admin" });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Add Admin</h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {success && <div className="text-green-600 mb-4">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" value={form.name} onChange={handleChange} required disabled={loading} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required disabled={loading} />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" value={form.password} onChange={handleChange} required disabled={loading} />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Adding..." : "Add Admin"}
        </Button>
      </form>
    </div>
  );
} 