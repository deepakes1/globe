import React from 'react'
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react';
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerClose
} from "@/components/ui/drawer"
import { Menu } from "lucide-react"

import Img from "../src/assets/Untitled-1.jpg"

import {Link} from "react-router-dom"
import logo from "../src/assets/logo.avif"

function Navbar() {
  return (
    <div className="bg-teal-600 text-white">
      <div className="flex justify-between items-center w-[90vw] mx-auto p-3">
       <Link to= "/">
       <img src={Img} className='md:h-[49px] w-32 object-contain rounded-full' alt="" />
       </Link>

        <div className="flex gap-3 items-center">

          <div className="hidden md:flex  gap-3">
            
            <Link to="/Destinations" className="text-lg">Destinations</Link>
            <Link to="/Itineraries" className="text-lg">Itineraries</Link>
            <Link to="/Bookings" className="text-lg">Bookings</Link>
            <Link to="/my-bookings" className="text-lg">My Bookings</Link>
          </div>

          <div className="md:hidden flex items-center gap-3">
           <Drawer>
            <DrawerTrigger><Menu className="h-6 w-6" /></DrawerTrigger>
            <DrawerContent className="bg-teal-600 text-white text-center border-0 p-4">
                <DrawerClose asChild>
                  <Link to="/Destinations" className="text-lg block">Destinations</Link>
                </DrawerClose>
                <DrawerClose asChild>
                  <Link to="/Itineraries" className="text-lg block">Itineraries</Link>
                </DrawerClose>
                <DrawerClose asChild>
                  <Link to="/Bookings" className="text-lg block">Bookings</Link>
                </DrawerClose>
                <DrawerClose asChild>
                  <Link to="/my-bookings" className="text-lg block">My Bookings</Link>
                </DrawerClose>
            </DrawerContent>
            </Drawer>
          </div>

          
        </div>
      </div>
    </div>
  )
}

export default Navbar
