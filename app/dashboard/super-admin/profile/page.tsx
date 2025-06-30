"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SuperAdminProfile {
  id: number
  name: string
  email: string
  role: string
  createdAt: string
  avatar?: string
}

export default function SuperAdminProfilePage() {
  const [profile, setProfile] = useState<SuperAdminProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState({ name: "", avatar: "" })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  useEffect(() => {
    if (profile) {
      setForm({ name: profile.name, avatar: profile.avatar || "" })
    }
  }, [profile])

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("authToken")
      const response = await fetch("http://localhost:5000/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
      }
    } catch (error) {
      // Optionally handle error
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => setEditMode(true)
  const handleCancel = () => setEditMode(false)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("authToken")
      const response = await fetch("http://localhost:5000/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })
      if (response.ok) {
        const data = await response.json()
        setProfile(data.user)
        setEditMode(false)
      }
    } catch (err) {
      // Optionally handle error
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-[40vh] text-gray-400">Loading profile...</div>
  }

  if (!profile) {
    return <div className="flex justify-center items-center min-h-[40vh] text-red-400">Failed to load profile.</div>
  }

  return (
    <div className="max-w-xl mx-auto py-10">
      <Card className="shadow-xl">
        <CardHeader className="flex flex-col items-center gap-2">
          <Avatar className="h-20 w-20 mb-2">
            <AvatarImage src={form.avatar || "/placeholder-user.jpg"} alt={form.name || profile.name} />
            <AvatarFallback>{(form.name || profile.name).split(" ").map((n) => n[0]).join("")}</AvatarFallback>
          </Avatar>
          {editMode ? (
            <form onSubmit={handleSave} className="w-full flex flex-col items-center gap-3">
              <div className="w-full">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={form.name} onChange={handleChange} className="mt-1" required />
              </div>
              <div className="w-full">
                <Label htmlFor="avatar">Avatar URL</Label>
                <Input id="avatar" name="avatar" value={form.avatar} onChange={handleChange} className="mt-1" />
              </div>
              <div className="flex gap-2 mt-2">
                <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
                <Button type="button" variant="outline" onClick={handleCancel} disabled={saving}>Cancel</Button>
              </div>
            </form>
          ) : (
            <>
              <CardTitle className="text-2xl font-bold text-gray-900">{profile.name}</CardTitle>
              <div className="flex items-center gap-2 text-gray-600">
                <Shield className="h-4 w-4" />
                <span className="capitalize">{profile.role}</span>
              </div>
              <Button className="mt-2" size="sm" variant="outline" onClick={handleEdit}>Edit Profile</Button>
            </>
          )}
        </CardHeader>
        <CardContent className="space-y-2 text-center">
          <div className="text-gray-700 font-medium">{profile.email}</div>
          <div className="text-gray-500 text-sm">Joined: {new Date(profile.createdAt).toLocaleDateString()}</div>
        </CardContent>
      </Card>
    </div>
  )
} 