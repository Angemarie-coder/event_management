"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link. No token provided.');
        return;
      }

      try {
        console.log('Attempting to verify email with token:', token);
        const response = await fetch(`http://localhost:5000/api/auth/verify-email?token=${token}`);
        const data = await response.json();

        console.log('Verification response status:', response.status);
        console.log('Verification response data:', data);

        if (response.ok) {
          setStatus('success');
          setMessage(data.message || 'Email verified successfully!');
        } else {
          setStatus('error');
          setMessage(data.message || `Email verification failed (Status: ${response.status})`);
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    verifyEmail();
  }, [searchParams]);

  const handleRedirectToLogin = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Email Verification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            {status === 'loading' && (
              <>
                <Loader2 className="h-16 w-16 text-blue-500 mx-auto animate-spin" />
                <p className="text-gray-600">Verifying your email...</p>
              </>
            )}

            {status === 'success' && (
              <>
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold text-green-600">Email Verified!</h3>
                  <p className="text-sm text-gray-600 mt-2">{message}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    Your account is now pending super admin approval. You will be notified once approved.
                  </p>
                </div>
                <Button 
                  onClick={handleRedirectToLogin}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Go to Login
                </Button>
              </>
            )}

            {status === 'error' && (
              <>
                <XCircle className="h-16 w-16 text-red-500 mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold text-red-600">Verification Failed</h3>
                  <p className="text-sm text-gray-600 mt-2">{message}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    If you're having trouble, please contact support or try registering again.
                  </p>
                </div>
                <div className="space-y-2">
                  <Link href="/login">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Go to Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="outline" className="w-full">
                      Register Again
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 