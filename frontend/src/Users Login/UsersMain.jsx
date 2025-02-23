import React, { useState } from 'react';

function UsersMain() {
  const [destination, setDestination] = useState('');
  const [travelDates, setTravelDates] = useState({ start: '', end: '' });
  const [accommodation, setAccommodation] = useState('');
  const [itinerary, setItinerary] = useState('');

  // Handle form submissions
  const handleSubmit = (e) => {
    e.preventDefault();
    // Example: Console log user input or you can store it in a state or API call
    console.log({
      destination,
      travelDates,
      accommodation,
      itinerary,
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold text-center mb-6">Travel Planning</h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Destination Selection */}
        <div className="flex flex-col">
          <label htmlFor="destination" className="text-lg">Choose Your Destination:</label>
          <input
            type="text"
            id="destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Enter a destination (e.g., Paris)"
            className="p-2 border border-gray-300 rounded mt-2"
            required
          />
        </div>

        {/* Travel Dates */}
        <div className="flex flex-col">
          <label htmlFor="travelDates" className="text-lg">Select Your Travel Dates:</label>
          <div className="flex gap-4 mt-2">
            <input
              type="date"
              id="start-date"
              value={travelDates.start}
              onChange={(e) => setTravelDates({ ...travelDates, start: e.target.value })}
              className="p-2 border border-gray-300 rounded"
              required
            />
            <input
              type="date"
              id="end-date"
              value={travelDates.end}
              onChange={(e) => setTravelDates({ ...travelDates, end: e.target.value })}
              className="p-2 border border-gray-300 rounded"
              required
            />
          </div>
        </div>

        {/* Accommodation Options */}
        <div className="flex flex-col">
          <label htmlFor="accommodation" className="text-lg">Choose Accommodation Type:</label>
          <select
            id="accommodation"
            value={accommodation}
            onChange={(e) => setAccommodation(e.target.value)}
            className="p-2 border border-gray-300 rounded mt-2"
            required
          >
            <option value="">Select an option</option>
            <option value="Hotel">Hotel</option>
            <option value="Hostel">Hostel</option>
            <option value="Airbnb">Airbnb</option>
            <option value="Camping">Camping</option>
          </select>
        </div>

        {/* Itinerary Suggestions */}
        <div className="flex flex-col">
          <label htmlFor="itinerary" className="text-lg">Suggested Itinerary:</label>
          <textarea
            id="itinerary"
            value={itinerary}
            onChange={(e) => setItinerary(e.target.value)}
            placeholder="Write your suggested itinerary here..."
            className="p-2 border border-gray-300 rounded mt-2"
            rows="4"
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
          >
            Submit Plan
          </button>
        </div>
      </form>

      {/* Display the submitted information (Optional) */}
      {destination && travelDates.start && travelDates.end && accommodation && itinerary && (
        <div className="mt-8 p-4 border border-gray-300 rounded">
          <h2 className="text-xl font-semibold">Your Travel Plan:</h2>
          <p><strong>Destination:</strong> {destination}</p>
          <p><strong>Travel Dates:</strong> {travelDates.start} to {travelDates.end}</p>
          <p><strong>Accommodation:</strong> {accommodation}</p>
          <p><strong>Itinerary:</strong> {itinerary}</p>
        </div>
      )}
    </div>
  );
}

export default UsersMain;
