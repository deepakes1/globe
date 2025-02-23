import React, { useEffect, useState } from 'react';
import { SignedIn, SignedOut, SignInButton, useUser, UserButton } from '@clerk/clerk-react';

import Navbar from './Navbar';
import Globetrotter from "./Tabs/Globetrotter";
import Destinations from "./Tabs/Destinations";
import Itineraries from './Tabs/Itineraries';
import Bookings from './Tabs/Bookings';
import MyBookings from './Tabs/MyBookings';
import AdminPage from './Tabs/AdminPage';
import { Route, Routes } from 'react-router-dom';


function App() {
  const { user, isLoaded } = useUser(); // Get the current user information
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      // Define the admin email address
      const adminEmail = 'deepakes2003@gmail.com'; // Replace with your admin email address
      const userEmail = user.primaryEmailAddress?.emailAddress; // Get the user's email (assuming the first email address)
      console.log(userEmail);
      // If the email matches the admin email, set as admin, else set as regular user
      if (userEmail === adminEmail) {
        setIsAdmin(true); // If the email matches, set user as admin
      } else {
        setIsAdmin(false); // Otherwise, treat the user as a regular user
      }
    }
  }, [isLoaded, user]);

  

  return (
    <div className="relative min-h-screen ">
      <SignedOut>
        <div className="fixed inset-0 bg-gradient-to-br from-black/80 to-purple-900/80 backdrop-blur-md flex items-center justify-center z-50">
          <div className="min-h-screen flex flex-col justify-center backdrop-blur-lg border border-white/20 p-12 rounded-2xl shadow-2xl text-center max-w-md mx-auto">
            <h2 className="text-5xl font-bold text-white mb-4 tracking-tight">
              Globetrotter
            </h2>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              Your journey begins here. Discover extraordinary destinations and create unforgettable memories.
            </p>
            <SignInButton mode="modal">
              <button className="group relative bg-white/10 border-2 border-white/30 hover:bg-white/20 text-white px-10 py-4 rounded-xl font-medium text-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                <span className="flex items-center justify-center gap-2">
                  Get Started
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>


      <SignedIn>
       
          <div className="flex flex-col">
            <Navbar />
              <div className="flex justify-end">
                <UserButton afterSignOutUrl="/" className='mt-5'/> 
              </div>
          </div>
        

        <div className="mt-5">
          {isAdmin ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold">Welcome, Admin</h2>
              <p className="text-gray-600">You have admin access.</p>
            </div>
          ) : (
            <div className="">
              {/* <UsersMain /> */}
            </div>
          )}
        </div>

        <Routes>
          <Route path="/" element={<Globetrotter />} />
          <Route path="/Destinations" element={<Destinations />} />
          <Route path="/Itineraries" element={<Itineraries />} />
          <Route path="/Bookings" element={<Bookings />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </SignedIn>
    </div>
  );
}

export default App;
