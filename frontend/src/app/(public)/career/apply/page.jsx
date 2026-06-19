"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import InternshipApplication from '@/components/career/internshipapplication';
import { AlertCircle, LogIn } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

export default function ApplyPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is authenticated by trying to fetch their profile
        const res = await fetch(`${API_BASE_URL}/api/student/me`, {
          credentials: 'include',
        });
        
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data?.student?.registrationId) {
            setIsAuthenticated(true);
          } else {
            setError('No valid registration ID found. Please contact support.');
          }
        } else if (res.status === 401) {
          setIsAuthenticated(false);
        } else {
          setError('Unable to verify your account. Please try again.');
        }
      } catch (err) {
        console.error('Auth check error:', err);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8 mt-10 text-center">
        <div className="inline-block animate-spin">⏳</div>
        <p className="text-slate-600 mt-4">Verifying your authentication...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-8 mt-10">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex gap-4">
            <AlertCircle className="h-6 w-6 text-red-600 shrink-0" />
            <div>
              <h2 className="text-lg font-bold text-red-900">Error</h2>
              <p className="text-red-800 mt-2">{error}</p>
              <div className="mt-4 flex gap-3">
                <Link href="/auth/login">
                  <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    Go to Login
                  </button>
                </Link>
                <Link href="/career">
                  <button className="px-6 py-2 border border-red-200 text-red-700 rounded-lg hover:bg-red-50">
                    Back to Careers
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto p-8 mt-10">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <LogIn className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-blue-900 mb-2">Authentication Required</h2>
          <p className="text-blue-800 mb-6 max-w-md mx-auto">
            You must be logged in to submit an internship application. Please log in or create an account to continue.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/auth/login">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Log In
              </button>
            </Link>
            <Link href="/auth/signup">
              <button className="px-6 py-3 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                Create Account
              </button>
            </Link>
            <Link href="/career">
              <button className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                Back to Careers
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 mt-10">
      <h1 className="text-3xl p-6 font-bold mb-6">Internship Application</h1>
      <InternshipApplication />
    </div>
  );
}
