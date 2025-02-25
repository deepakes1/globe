import React, { useState, useEffect } from 'react';
import { useUser } from "@clerk/clerk-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plane, Hotel, MapPin, Calendar, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://globe-bg.vercel.app'
  : 'http://localhost:5000';

export default function MyBookings() {
  const { user } = useUser();
  const [bookings, setBookings] = useState({
    travel: [],
    hotels: [],
    itineraries: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;

      try {
        const userEmail = user.primaryEmailAddress.emailAddress;
        console.log('Fetching bookings for:', userEmail);
        
        const response = await fetch(`${API_BASE_URL}/api/bookings/user/${userEmail}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Received bookings:', data);
        
        setBookings({
          travel: data.travel || [],
          hotels: data.hotels || [],
          itineraries: data.itineraries || []
        });
      } catch (error) {
        console.error('Error fetching bookings:', error);
        // Show user-friendly error message
        alert('Unable to fetch your bookings. Please try again later.');
        setBookings({
          travel: [],
          hotels: [],
          itineraries: []
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const handleDeleteBooking = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings/${type}/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete booking');
      }

      // Update state to remove deleted booking
      setBookings(prev => ({
        ...prev,
        [type]: prev[type].filter(booking => booking._id !== id)
      }));
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-96">Loading...</div>;
  }

  if (!bookings || !bookings.travel || !bookings.hotels || !bookings.itineraries) {
    return <div className="flex justify-center items-center h-96">No bookings found</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

      <Tabs defaultValue="travel" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="travel">
            Travel ({bookings.travel.length})
          </TabsTrigger>
          <TabsTrigger value="hotels">
            Hotels ({bookings.hotels.length})
          </TabsTrigger>
          <TabsTrigger value="itineraries">
            Itineraries ({bookings.itineraries.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="travel">
          <ScrollArea className="h-[600px]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookings.travel.length === 0 ? (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No travel bookings found
                </div>
              ) : (
                bookings.travel.map((booking) => (
                  <Card key={booking._id} className="relative">
                    <Button
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => handleDeleteBooking('travel', booking._id)}
                    >
                      <Trash2 className="h-5 w-5 text-red-500" />
                    </Button>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Plane className="h-5 w-5" />
                        {booking.transport_name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-2">
                        <span className="font-semibold">From:</span> {booking.from_place}
                      </p>
                      <p className="text-sm mb-2">
                        <span className="font-semibold">To:</span> {booking.to_place}
                      </p>
                      <p className="text-sm mb-2">
                        <span className="font-semibold">Date:</span> {new Date(booking.travel_date).toLocaleDateString()}
                      </p>
                      <p className="text-sm mb-2">
                        <span className="font-semibold">Seats:</span> {booking.number_of_seats}
                      </p>
                      <p className="text-sm font-semibold text-green-600">
                        Total Amount: ₹{booking.total_amount}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="hotels">
          <ScrollArea className="h-[600px]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookings.hotels.length === 0 ? (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No hotel bookings found
                </div>
              ) : (
                bookings.hotels.map((booking) => (
                  <Card key={booking._id} className="relative">
                    <Button
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => handleDeleteBooking('hotel', booking._id)}
                    >
                      <Trash2 className="h-5 w-5 text-red-500" />
                    </Button>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Hotel className="h-5 w-5" />
                        {booking.hotel_name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-2">
                        <span className="font-semibold">Check-in:</span> {new Date(booking.check_in).toLocaleDateString()}
                      </p>
                      <p className="text-sm mb-2">
                        <span className="font-semibold">Check-out:</span> {new Date(booking.check_out).toLocaleDateString()}
                      </p>
                      <p className="text-sm mb-2">
                        <span className="font-semibold">Rooms:</span> {booking.number_of_rooms}
                      </p>
                      <p className="text-sm font-semibold text-green-600">
                        Total Amount: ₹{booking.total_amount}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="itineraries">
          <ScrollArea className="h-[600px]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookings.itineraries.length === 0 ? (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No itinerary bookings found
                </div>
              ) : (
                bookings.itineraries.map((booking) => (
                  <Card key={booking._id} className="relative">
                    <Button
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => handleDeleteBooking('itinerary', booking._id)}
                    >
                      <Trash2 className="h-5 w-5 text-red-500" />
                    </Button>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        {booking.destination}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-2">
                        <span className="font-semibold">Booking Date:</span>{' '}
                        {new Date(booking.booking_date).toLocaleDateString()}
                      </p>
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">Itinerary Days:</h4>
                        {booking.days.map((day, index) => (
                          <div key={index} className="mb-2">
                            <p className="text-sm font-medium">Day {index + 1}</p>
                            <ul className="list-disc list-inside text-sm">
                              {day.activities.map((activity, actIndex) => (
                                <li key={actIndex}>{activity.name}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
