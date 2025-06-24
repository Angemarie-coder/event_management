"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/Login');
  };

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white dark:bg-gray-800 shadow">
      <div className="text-2xl font-bold text-blue-700 dark:text-blue-200">
        <Link href="/">events</Link>
      </div>
      <div className="flex gap-6 items-center">
        <Link href="/Events" className="text-blue-700 dark:text-blue-200 font-semibold">Explore</Link>
        <Link href="/CreateEvent" className="text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-200">Create Event</Link>
        {user && (
          <>
            <Link href="/Bookings" className="text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-200">Bookings</Link>
            {user.role === 'admin' && (
              <Link href="/Admin" className="text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-200">Admin Dashboard</Link>
            )}
            {user.role === 'super-admin' && (
              <Link href="/SuperAdmin" className="text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-200">Super Admin Dashboard</Link>
            )}
            <Link href="/Profile" className="text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-200">Profile</Link>
            <span className="ml-4 font-medium text-gray-700 dark:text-gray-200">{user.name} ({user.role})</span>
            <button onClick={handleLogout} className="ml-2 px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600">Logout</button>
          </>
        )}
        {!user && (
          <>
            <Link href="/Login" className="text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-200">Login</Link>
            <Link href="/Register" className="text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-200">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 