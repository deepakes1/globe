"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Calendar from "react-calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Plane, Hotel, MapPin, Utensils, Camera, Plus, Trash2, Edit, CalendarIcon, ArrowRight } from "lucide-react";
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from "@clerk/clerk-react";

export default function ItinerariesPage() {
  const [itineraries, setItineraries] = useState([]);
  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newActivity, setNewActivity] = useState({
    name: "",
    type: "other",
    details: "",
    time: "",
  });
  const [newItinerary, setNewItinerary] = useState({
    name: "",
    destination: "",
    days: []
  });
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    if (location.state?.destinationData) {
      handleDestinationData(location.state.destinationData);
    }
  }, [location.state]);

  const handleDestinationData = (destinationData) => {
    const { selectedDays, recommendedPlaces, destination } = destinationData;
    
    // Distribute places evenly across days
    const daysArray = Array.from({ length: parseInt(selectedDays) }, (_, dayIndex) => {
      // Calculate how many places each day should have
      const totalPlaces = recommendedPlaces.length;
      const placesPerDay = Math.floor(totalPlaces / selectedDays);
      const extraPlaces = totalPlaces % selectedDays;
      
      // Calculate start and end indices for this day's places
      const startIndex = dayIndex * placesPerDay + Math.min(dayIndex, extraPlaces);
      const endIndex = startIndex + placesPerDay + (dayIndex < extraPlaces ? 1 : 0);
      
      // Get this day's places
      const dayPlaces = recommendedPlaces.slice(startIndex, endIndex);
      
      return {
        date: new Date(),
        activities: dayPlaces.map((place, placeIndex) => ({
          id: `${dayIndex}-${placeIndex}`,
          name: place.name,
          type: "attraction",
          details: place.description,
          time: "09:00 AM"
        }))
      };
    });

    const newItinerary = {
      id: (itineraries.length + 1).toString(),
      name: `Trip to ${destination.name}`,
      destination: destination.name,
      days: daysArray
    };

    setItineraries([...itineraries, newItinerary]);
    setSelectedItinerary(newItinerary);
  };

  const handleCreateItinerary = () => {
    const newId = (itineraries.length + 1).toString();
    const createdItinerary = { 
      ...newItinerary, 
      id: newId,
      days: newItinerary.days 
    };
    setItineraries([...itineraries, createdItinerary]);
    setIsCreateDialogOpen(false);
    setNewItinerary({
      name: "",
      destination: "",
      startDate: new Date(),
      endDate: new Date(),
      days: []
    });
  };

  const handleDeleteItinerary = (id) => {
    setItineraries(itineraries.filter((itinerary) => itinerary.id !== id));
    if (selectedItinerary?.id === id) {
      setSelectedItinerary(null);
    }
  };

  const handleAddActivity = (date) => {
    if (!selectedItinerary) return;

    const updatedDays = selectedItinerary.days.map((day) => {
      if (day.date.toDateString() === date.toDateString()) {
        return {
          ...day,
          activities: [...day.activities, { ...newActivity, id: Date.now().toString() }],
        };
      }
      return day;
    });

    const updatedItinerary = { ...selectedItinerary, days: updatedDays };
    setSelectedItinerary(updatedItinerary);
    setItineraries(
      itineraries.map((itinerary) => (itinerary.id === selectedItinerary.id ? updatedItinerary : itinerary))
    );

    setNewActivity({
      name: "",
      type: "other",
      details: "",
      time: "",
    });
  };

  const handleDeleteActivity = (dayIndex, activityId) => {
    if (!selectedItinerary) return;

    const updatedDays = selectedItinerary.days.map((day, index) => {
      if (index === dayIndex) {
        return {
          ...day,
          activities: day.activities.filter((activity) => activity.id !== activityId),
        };
      }
      return day;
    });

    const updatedItinerary = { ...selectedItinerary, days: updatedDays };
    setSelectedItinerary(updatedItinerary);
    setItineraries(
      itineraries.map((itinerary) => (itinerary.id === selectedItinerary.id ? updatedItinerary : itinerary))
    );
  };

  const onDragEnd = (result) => {
    if (!result.destination || !selectedItinerary) return;

    const sourceDay = parseInt(result.source.droppableId.split('-')[1]);
    let destinationDay = parseInt(result.destination.droppableId.split('-')[1]);

    // Check if dropping on a tab trigger
    if (result.destination.droppableId.startsWith('tab-')) {
      destinationDay = parseInt(result.destination.droppableId.split('-')[1]);
      // Add to the end of the destination day's activities
      result.destination.index = selectedItinerary.days[destinationDay].activities.length;
    }

    const updatedDays = [...selectedItinerary.days];
    
    // Get the activity being moved
    const [movedActivity] = updatedDays[sourceDay].activities.splice(result.source.index, 1);
    
    // Add the activity to the destination day
    updatedDays[destinationDay].activities.splice(result.destination.index, 0, movedActivity);

    const updatedItinerary = { ...selectedItinerary, days: updatedDays };
    setSelectedItinerary(updatedItinerary);
    setItineraries(
      itineraries.map((itinerary) => 
        itinerary.id === selectedItinerary.id ? updatedItinerary : itinerary
      )
    );
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "flight":
        return <Plane className="h-5 w-5" />;
      case "hotel":
        return <Hotel className="h-5 w-5" />;
      case "attraction":
        return <Camera className="h-5 w-5" />;
      case "restaurant":
        return <Utensils className="h-5 w-5" />;
      default:
        return <MapPin className="h-5 w-5" />;
    }
  };

  const handleNextClick = async () => {
    if (!selectedItinerary || !user) return;

    try {
      // Prepare the data for database storage
      const bookingData = {
        user_id: user.primaryEmailAddress.emailAddress,
        itinerary_id: selectedItinerary.id,
        destination: selectedItinerary.destination,
        booking_date: new Date().toISOString(),
        days: selectedItinerary.days.map(day => ({
          date: day.date,
          activities: day.activities.map(activity => ({
            name: activity.name,
            type: activity.type,
            details: activity.details,
            time: activity.time
          }))
        }))
      };

      // Make API call to store data in your database
      const response = await fetch('http://localhost:5000/api/itineraries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        throw new Error('Failed to store booking data');
      }

      // If successful, navigate to the bookings page
      navigate('/Bookings', { 
        state: { itineraryData: selectedItinerary } 
      });
    } catch (error) {
      console.error('Error storing booking data:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-blue-50 to-purple-50">
      <h1 className="text-4xl font-bold mb-8 text-indigo-800">My Itineraries</h1>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-indigo-700">Itinerary List</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gray-300 hover:bg-gray-200">
              <Plus className="mr-2 h-4 w-4" /> Create New Itinerary
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Itinerary</DialogTitle>
              <DialogDescription>
                Enter the details for your new itinerary. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newItinerary.name}
                  onChange={(e) => setNewItinerary({ ...newItinerary, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="destination" className="text-right">
                  Destination
                </Label>
                <Input
                  id="destination"
                  value={newItinerary.destination}
                  onChange={(e) => setNewItinerary({ ...newItinerary, destination: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startDate" className="text-right">
                  Start Date
                </Label>
                <div className="col-span-3">
                  <Calendar
                    value={newItinerary.startDate}
                    onChange={(date) => setNewItinerary({ ...newItinerary, startDate: date })}
                    className="rounded-md border"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endDate" className="text-right">
                  End Date
                </Label>
                <div className="col-span-3">
                  <Calendar
                    value={newItinerary.endDate}
                    onChange={(date) => setNewItinerary({ ...newItinerary, endDate: date })}
                    className="rounded-md border"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateItinerary}>
                Save Itinerary
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 border-2 border-indigo-100 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
            <CardTitle className="text-indigo-800">Itineraries</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              {itineraries.map((itinerary) => (
                <div
                  key={itinerary.id}
                  className={`p-4 mb-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedItinerary?.id === itinerary.id 
                      ? "bg-indigo-600 text-white shadow-md" 
                      : "bg-indigo-50 hover:bg-indigo-100"
                  }`}
                  onClick={() => setSelectedItinerary(itinerary)}
                >
                  <h3 className="font-semibold">{itinerary.name}</h3>
                  <p className={`text-sm ${selectedItinerary?.id === itinerary.id ? "text-indigo-100" : "text-indigo-600"}`}>
                    {itinerary.destination}
                  </p>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2 border-2 border-indigo-100 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
            <CardTitle className="text-indigo-800">
              {selectedItinerary ? selectedItinerary.name : "Select an Itinerary"}
            </CardTitle>
            {selectedItinerary && (
              <CardDescription className="text-indigo-600">{selectedItinerary.destination}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {selectedItinerary ? (
              <DragDropContext onDragEnd={onDragEnd}>
                <Tabs defaultValue={`day-0`}>
                  <TabsList className="mb-4 bg-indigo-100">
                    {selectedItinerary.days.map((_, index) => (
                      <Droppable key={`tab-${index}`} droppableId={`tab-${index}`}>
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.droppableProps}>
                            <TabsTrigger 
                              value={`day-${index}`}
                              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                            >
                              Day {index + 1}
                            </TabsTrigger>
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    ))}
                  </TabsList>
                  {selectedItinerary.days.map((day, dayIndex) => (
                    <TabsContent key={`day-${dayIndex}`} value={`day-${dayIndex}`}>
                      <h3 className="text-lg font-semibold mb-4 text-indigo-800">Day {dayIndex + 1}</h3>
                      <Droppable droppableId={`day-${dayIndex}`}>
                        {(provided) => (
                          <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                            {day.activities.map((activity, index) => (
                              <Draggable key={activity.id} draggableId={activity.id} index={index}>
                                {(provided) => (
                                  <li
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="bg-indigo-50 hover:bg-indigo-100 p-3 rounded-lg flex items-center justify-between transition-colors duration-200"
                                  >
                                    <div className="flex items-center space-x-3">
                                      <div className="text-indigo-600">
                                        {getActivityIcon(activity.type)}
                                      </div>
                                      <div>
                                        <p className="font-medium text-indigo-800">{activity.name}</p>
                                        <p className="text-sm text-indigo-600">
                                          {activity.time} - {activity.details}
                                        </p>
                                      </div>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="hover:text-red-600"
                                      onClick={() => handleDeleteActivity(dayIndex, activity.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </li>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </ul>
                        )}
                      </Droppable>
                    </TabsContent>
                  ))}
                </Tabs>
              </DragDropContext>
            ) : (
              <p className="text-indigo-600">Select an itinerary to view and edit details</p>
            )}
          </CardContent>
          {selectedItinerary && (
            <CardFooter className="flex justify-between">
              <Button 
                variant="destructive" 
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => handleDeleteItinerary(selectedItinerary.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete Itinerary
              </Button>
              <Button 
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={handleNextClick}
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
