"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface SystemStatsProps {
  stats: {
    totalUsers: number
    pendingUsers: number
    totalAdmins: number
    totalEvents: number
    totalBookings: number
    pendingBookings: number
  }
}

export default function SystemStats({ stats }: SystemStatsProps) {
  const userStatusData = [
    { name: "Approved", value: stats.totalUsers - stats.pendingUsers, color: "#22c55e" },
    { name: "Pending", value: stats.pendingUsers, color: "#eab308" },
  ]

  const bookingStatusData = [
    { name: "Approved", value: stats.totalBookings - stats.pendingBookings, color: "#22c55e" },
    { name: "Pending", value: stats.pendingBookings, color: "#eab308" },
  ]

  const monthlyData = [
    { month: "Jan", users: 45, bookings: 120, events: 8 },
    { month: "Feb", users: 52, bookings: 145, events: 12 },
    { month: "Mar", users: 48, bookings: 167, events: 15 },
    { month: "Apr", users: 61, bookings: 189, events: 18 },
    { month: "May", users: 55, bookings: 201, events: 22 },
    { month: "Jun", users: 67, bookings: 234, events: 25 },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>User Status Distribution</CardTitle>
            <CardDescription>Breakdown of user approval status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {userStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-4 mt-4">
              {userStatusData.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                  <span className="text-sm">
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Booking Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Status Distribution</CardTitle>
            <CardDescription>Breakdown of booking approval status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bookingStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {bookingStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-4 mt-4">
              {bookingStatusData.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                  <span className="text-sm">
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Trends</CardTitle>
          <CardDescription>User registrations, bookings, and events over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#3b82f6" name="New Users" />
                <Bar dataKey="bookings" fill="#10b981" name="Bookings" />
                <Bar dataKey="events" fill="#f59e0b" name="Events" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Approval Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Approved Users</span>
                <span>{Math.round(((stats.totalUsers - stats.pendingUsers) / stats.totalUsers) * 100)}%</span>
              </div>
              <Progress value={((stats.totalUsers - stats.pendingUsers) / stats.totalUsers) * 100} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Booking Approval Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Approved Bookings</span>
                <span>{Math.round(((stats.totalBookings - stats.pendingBookings) / stats.totalBookings) * 100)}%</span>
              </div>
              <Progress value={((stats.totalBookings - stats.pendingBookings) / stats.totalBookings) * 100} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Active Events</span>
                <span>85%</span>
              </div>
              <Progress value={85} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
