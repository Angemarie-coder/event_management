"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";

interface Admin {
  id: number;
  name: string;
  email: string;
  isApproved: boolean;
  isVerified: boolean;
  role: string;
}

export default function ApproveRejectAdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchAdmins = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/api/admins");
      setAdmins(response.data.filter((admin: Admin) => admin.role === "admin"));
    } catch (err: any) {
      setError("Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAction = async (id: number, action: "approve" | "reject") => {
    setActionLoading(id);
    setError("");
    try {
      await api.post(`/api/admins/${id}/${action}`);
      await fetchAdmins();
    } catch (err: any) {
      setError(`Failed to ${action} admin`);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Approve/Reject Admins</h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-4">
          {admins.filter(a => !a.isApproved).length === 0 ? (
            <div className="text-gray-500">No pending admin approvals.</div>
          ) : (
            admins.filter(a => !a.isApproved).map((admin) => (
              <div key={admin.id} className="bg-white rounded shadow p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold">{admin.name}</div>
                  <div className="text-sm text-gray-600">{admin.email}</div>
                  <div className="text-xs text-gray-500">Verified: {admin.isVerified ? "Yes" : "No"}</div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleAction(admin.id, "approve")}
                    disabled={actionLoading === admin.id}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleAction(admin.id, "reject")}
                    disabled={actionLoading === admin.id}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
} 