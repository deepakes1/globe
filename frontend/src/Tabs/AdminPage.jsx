import React, { useState, useEffect } from 'react';
import { useUser } from "@clerk/clerk-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from 'lucide-react';

export default function AdminPage() {
  const { user } = useUser();
  const [destinations, setDestinations] = useState([]);
  const [activeTab, setActiveTab] = useState('national');
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    description: '',
    image: '',
    rating: 0,
    priceRange: [0, 0],
    categories: '',
    type: 'national'
  });
  const [message, setMessage] = useState('');

  const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://globe-bg.vercel.app'
    : 'http://localhost:5000';

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/destinations`);
      if (response.ok) {
        const data = await response.json();
        setDestinations(data);
      }
    } catch (error) {
      console.error('Error fetching destinations:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this destination?')) {
      try {
        console.log('Attempting to delete destination with ID:', id);
        
        const response = await fetch(`${API_BASE_URL}/api/destinations/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        console.log('Delete response status:', response.status);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete destination');
        }

        const data = await response.json();
        console.log('Delete response data:', data);
        
        // Update the local state to remove the deleted destination
        setDestinations(prevDestinations => 
          prevDestinations.filter(dest => dest._id !== id)
        );
        setMessage('Destination deleted successfully!');
      } catch (error) {
        console.error('Error deleting destination:', error);
        setMessage('Error: ' + error.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/api/destinations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          categories: formData.categories.split(',').map(cat => cat.trim()),
          priceRange: [parseInt(formData.priceRange[0]), parseInt(formData.priceRange[1])],
          type: formData.type
        })
      });

      if (response.ok) {
        let newDestination;
        try {
          newDestination = await response.json();
        } catch (parseError) {
          throw new Error('Invalid response format from server');
        }
        
        setDestinations(prevDestinations => [...prevDestinations, newDestination]);
        setMessage('Destination added successfully!');
        
        // Reset form
        setFormData({
          name: '',
          country: '',
          description: '',
          image: '',
          rating: 0,
          priceRange: [0, 0],
          categories: '',
          type: activeTab
        });
      } else {
        let errorMessage;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || 'Failed to add destination';
        } catch (parseError) {
          errorMessage = `Server error: ${response.status}`;
        }
        setMessage('Error: ' + errorMessage);
      }
    } catch (error) {
      console.error('Error adding destination:', error);
      setMessage('Error: ' + (error.message || 'Failed to add destination'));
    }
  };

  const filteredDestinations = destinations.filter(
    destination => destination.type === activeTab
  );

  if (user?.primaryEmailAddress?.emailAddress !== 'atrotter486@gmail.com') {
    return (
      <div className="container mx-auto p-4">
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">You don't have admin privileges to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="grid gap-8">
        {/* Form Card */}
        <Card className="bg-white/5 backdrop-blur-md shadow-xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Add New Destination
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary/90">
                    Destination Name
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="mt-1 border-0 bg-white/10 border-gray-500 focus:ring-2 focus:ring-primary/20 focus-visible:ring-offset-0"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary/90">Country</label>
                  <Input
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    className="mt-1 border-0 bg-white/10 border-gray-500 focus:ring-2 focus:ring-primary/20 focus-visible:ring-offset-0"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary/90">Image URL</label>
                  <Input
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    className="mt-1 border-0 bg-white/10 border-gray-500 focus:ring-2 focus:ring-primary/20 focus-visible:ring-offset-0"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary/90">Rating (0-5)</label>
                  <Input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value)})}
                    className="mt-1 border-0 border-gray-500 bg-white/10 focus:ring-2 focus:ring-primary/20 focus-visible:ring-offset-0"
                    required
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary/90">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="mt-1 border-0 border-gray-500 bg-white/10 focus:ring-2 focus:ring-primary/20 focus-visible:ring-offset-0"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary/90">Price Range</label>
                  <div className="flex gap-4 mt-1">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={formData.priceRange[0]}
                      onChange={(e) => setFormData({...formData, priceRange: [parseInt(e.target.value), formData.priceRange[1]]})}
                      className="border-0 border-gray-500 bg-white/10 focus:ring-2 focus:ring-primary/20 focus-visible:ring-offset-0"
                      required
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={formData.priceRange[1]}
                      onChange={(e) => setFormData({...formData, priceRange: [formData.priceRange[0], parseInt(e.target.value)]})}
                      className="border-0 border-gray-500 bg-white/10 focus:ring-2 focus:ring-primary/20 focus-visible:ring-offset-0"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary/90">Categories</label>
                  <Input
                    value={formData.categories}
                    onChange={(e) => setFormData({...formData, categories: e.target.value})}
                    placeholder="e.g., beach, culture, adventure"
                    className="mt-1 border-0 bg-white/10 focus:ring-2 focus:ring-primary/20 focus-visible:ring-offset-0"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary/90">Type</label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({...formData, type: value})}
                    className="mt-1"
                  >
                    <SelectTrigger className="border-0 bg-white/10 focus:ring-2 focus:ring-primary/20">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="national">National</SelectItem>
                      <SelectItem value="international">International</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" className="md:col-span-2 w-full bg-primary hover:bg-primary/90 transition-colors duration-300">
                Add Destination
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Destinations List Card */}
        <Card className="bg-white/50 backdrop-blur-sm border-2">
          <CardHeader>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Manage Destinations
            </CardTitle>
            <div className="flex space-x-4 mt-6">
              <Button
                variant={activeTab === 'national' ? 'default' : 'outline'}
                onClick={() => setActiveTab('national')}
                className="flex-1 md:flex-none"
              >
                National
              </Button>
              <Button
                variant={activeTab === 'international' ? 'default' : 'outline'}
                onClick={() => setActiveTab('international')}
                className="flex-1 md:flex-none"
              >
                International
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDestinations.map((destination) => (
                <Card key={destination._id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-2">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={destination.image}
                        alt={destination.name}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(destination._id)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="font-semibold text-lg">{destination.name}</h3>
                      <p className="text-sm text-muted-foreground">{destination.country}</p>
                      <div className="flex justify-between text-sm">
                        <span>Rating: {destination.rating}</span>
                        <span>${destination.priceRange[0]} - ${destination.priceRange[1]}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {message && (
        <div 
          className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg transition-all duration-300 transform ${
            message.includes('Error') 
              ? 'bg-destructive text-destructive-foreground'
              : 'bg-primary text-primary-foreground'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
} 