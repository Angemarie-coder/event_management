"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Users, Mail, Calendar, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  isApproved: boolean;
  isVerified: boolean;
  createdAt: string;
  avatar?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await api.get('/api/admins/users', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUsers(response.data);
    } catch (error: any) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to load users");
      }
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super-admin':
        return <Badge variant="destructive" className="bg-red-100 text-red-800"><Shield className="w-3 h-3 mr-1" />Super Admin</Badge>;
      case 'admin':
        return <Badge variant="default" className="bg-gray-100 text-gray-600"><Shield className="w-3 h-3 mr-1" />Admin</Badge>;
      case 'user':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800"><Users className="w-3 h-3 mr-1" />User</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getStatusBadge = (isApproved: boolean, isVerified: boolean, role: string) => {
    if (role === 'super-admin') {
      return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
    }
    
    if (!isVerified) {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending Verification</Badge>;
    }
    
    if (!isApproved) {
      return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Pending Approval</Badge>;
    }
    
    return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Management
          </CardTitle>
          <CardDescription>
            View all registered users in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {users.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-500">There are no users registered in the system.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <Card key={user.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                          <div className="flex gap-2">
                            {getRoleBadge(user.role)}
                            {getStatusBadge(user.isApproved, user.isVerified, user.role)}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{user.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              Joined: {new Date(user.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600 capitalize">{user.role}</span>
                          </div>
                        </div>

                        {user.role === 'admin' && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-600">
                              <p><strong>Email Verified:</strong> {user.isVerified ? 'Yes' : 'No'}</p>
                              <p><strong>Account Approved:</strong> {user.isApproved ? 'Yes' : 'No'}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 