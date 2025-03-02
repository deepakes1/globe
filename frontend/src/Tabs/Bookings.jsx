import React, { useState } from 'react';
import { useUser } from "@clerk/clerk-react";

// Add API base URL configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://globe-bg.vercel.app'
  : 'http://localhost:5000';

function Bookings() {
  const { user } = useUser();
  const [selectedTransport, setSelectedTransport] = useState('');
  const [selectedHotel, setSelectedHotel] = useState('');
  const [fromPlace, setFromPlace] = useState('');
  const [toPlace, setToPlace] = useState('');
  const [date, setDate] = useState('');
  const [showAvailableOptions, setShowAvailableOptions] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSeatsModal, setShowSeatsModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [numberOfSeats, setNumberOfSeats] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showHotelModal, setShowHotelModal] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [showHotelOptions, setShowHotelOptions] = useState(false);
  const [selectedHotelOption, setSelectedHotelOption] = useState(null);
  const [numberOfDays, setNumberOfDays] = useState(1);

  const transportOptions = [
    { 
      id: 'bus', 
      name: 'Bus',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500&auto=format'
    },
    { 
      id: 'train', 
      name: 'Train',
      image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=500&auto=format'
    },
    { 
      id: 'flight', 
      name: 'Flight',
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=500&auto=format'
    }
  ];

  const hotelOptions = [
    { 
      id: '3star', 
      name: '3 Star Hotel',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format'
    },
    { 
      id: '4star', 
      name: '4 Star Hotel',
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500&auto=format'
    },
    { 
      id: '5star', 
      name: '5 Star Hotel',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&auto=format'
    }
  ];

  const availableTransports = {
    bus: [
      {
        id: 'bus1',
        name: 'Luxury Bus',
        departure: '06:00 AM',
        arrival: '02:00 PM',
        price: '₹800',
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500&auto=format'
      },
      {
        id: 'bus2',
        name: 'Semi-Sleeper',
        departure: '08:00 PM',
        arrival: '06:00 AM',
        price: '₹600',
        image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=500&auto=format'
      },
      {
        id: 'bus3',
        name: 'AC Sleeper',
        departure: '09:00 PM',
        arrival: '07:00 AM',
        price: '₹1000',
        image: 'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?w=500&auto=format'
      }
    ],
    train: [
      {
        id: 'train1',
        name: 'Express Train',
        departure: '10:00 AM',
        arrival: '04:00 PM',
        price: '₹1200',
        image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=500&auto=format'
      },
      {
        id: 'train2',
        name: 'Super Fast',
        departure: '11:00 PM',
        arrival: '07:00 AM',
        price: '₹1500',
        image: 'https://images.unsplash.com/photo-1552423314-cf29ab68ad73?w=500&auto=format'
      },
      {
        id: 'train3',
        name: 'Rajdhani',
        departure: '04:00 PM',
        arrival: '06:00 AM',
        price: '₹2000',
        image: 'https://images.unsplash.com/photo-1553941884-f8947df6e0ba?w=500&auto=format'
      }
    ],
    flight: [
      {
        id: 'flight1',
        name: 'Economy Flight',
        departure: '10:00 AM',
        arrival: '12:00 PM',
        price: '₹5000',
        image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=500&auto=format'
      },
      {
        id: 'flight2',
        name: 'Business Class',
        departure: '02:00 PM',
        arrival: '04:00 PM',
        price: '₹8000',
        image: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=500&auto=format'
      },
      {
        id: 'flight3',
        name: 'First Class',
        departure: '08:00 PM',
        arrival: '10:00 PM',
        price: '₹12000',
        image: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?w=500&auto=format'
      }
    ]
  };

  const availableHotels = {
    '3star': [
      {
        id: 'hotel1',
        name: 'Comfort Inn',
        price: '₹2000',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format',
        amenities: ['WiFi', 'AC', 'Restaurant']
      },
      {
        id: 'hotel2',
        name: 'Hotel Blue',
        price: '₹2500',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&auto=format',
        amenities: ['WiFi', 'Pool', 'Gym']
      }
    ],
    '4star': [
      {
        id: 'hotel3',
        name: 'Grand Plaza',
        price: '₹3500',
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500&auto=format',
        amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant']
      },
      {
        id: 'hotel4',
        name: 'Business Suite',
        price: '₹4000',
        image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=500&auto=format',
        amenities: ['WiFi', 'Business Center', 'Restaurant']
      }
    ],
    '5star': [
      {
        id: 'hotel5',
        name: 'Luxury Palace',
        price: '₹6000',
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&auto=format',
        amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Bar']
      },
      {
        id: 'hotel6',
        name: 'Royal Suite',
        price: '₹7000',
        image: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28f8e?w=500&auto=format',
        amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Bar', 'Gym']
      }
    ]
  };

  const handleTransportSelect = (transportId) => {
    setSelectedTransport(transportId);
    setIsModalOpen(true);
    setShowAvailableOptions(false);
    setFromPlace('');
    setToPlace('');
    setDate('');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setShowAvailableOptions(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (fromPlace && toPlace && date) {
      setShowAvailableOptions(true);
    }
  };

  const handleBookNow = (option) => {
    setSelectedOption(option);
    setShowSeatsModal(true);
  };

  const handleSeatConfirmation = () => {
    setShowSeatsModal(false);
    setShowPaymentModal(true);
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setNumberOfDays(1);
  };

  const handlePaymentSuccess = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      let bookingData;
      
      if (selectedTransport) {
        // For travel bookings
        bookingData = {
          user_id: user.primaryEmailAddress.emailAddress,
          transport_type: selectedTransport,
          from_place: fromPlace,
          to_place: toPlace,
          travel_date: new Date(date),
          transport_name: selectedOption.name,
          departure_time: selectedOption.departure,
          arrival_time: selectedOption.arrival,
          number_of_seats: numberOfSeats,
          price_per_seat: parseInt(selectedOption.price.replace('₹', '')),
          total_amount: parseInt(selectedOption.price.replace('₹', '')) * numberOfSeats
        };

        await fetch(`${API_BASE_URL}/api/bookings/travel/book`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookingData)
        });
      } else {
        // For hotel bookings
        bookingData = {
          user_id: user.primaryEmailAddress.emailAddress,
          hotel_name: selectedOption.name,
          hotel_category: selectedHotel,
          check_in: new Date(checkIn),
          check_out: new Date(checkOut),
          number_of_rooms: numberOfSeats,
          price_per_night: parseInt(selectedOption.price.replace('₹', '')),
          total_amount: parseInt(selectedOption.price.replace('₹', '')) * numberOfSeats,
          amenities: selectedOption.amenities
        };

        await fetch(`${API_BASE_URL}/api/bookings/hotels/book`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookingData)
        });
      }

      setTimeout(() => {
        setIsLoading(false);
        alert('Booking Successful! Thank you for your purchase.');
        setShowPaymentModal(false);
        setIsModalOpen(false);
        setShowAvailableOptions(false);
        // Reset other states
        setFromPlace('');
        setToPlace('');
        setDate('');
        setSelectedOption(null);
        setNumberOfSeats(1);
      }, 4000);
    } catch (error) {
      console.error('Error saving booking:', error);
      setIsLoading(false);
      alert('There was an error processing your booking. Please try again.');
    }
  };

  const handleHotelSelect = (hotelId) => {
    setSelectedHotel(hotelId);
    setShowHotelModal(true);
    setShowHotelOptions(false);
    setCheckIn('');
    setCheckOut('');
    setNumberOfDays(1);
  };

  const handleHotelSearch = (e) => {
    e.preventDefault();
    if (checkIn && checkOut) {
      // Calculate number of days between check-in and check-out
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      setNumberOfDays(daysDiff > 0 ? daysDiff : 1);
      setShowHotelOptions(true);
    }
  };

  const handleHotelBookNow = (option) => {
    setSelectedOption(option);
    setShowSeatsModal(true);
  };

  return (
    <div className="bookings-container">
     
      <div className="transport-section">
        <h2>Select Transport</h2>
        <div className="options-grid">
          {transportOptions.map((option) => (
            <div
              key={option.id}
              className={`option-card ${selectedTransport === option.id ? 'selected' : ''}`}
              onClick={() => handleTransportSelect(option.id)}
            >
              <div className="image-container">
                <img src={option.image} alt={option.name} className='lg:h-[30vh]'/>
              </div>
              <h3>{option.name}</h3>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={handleCloseModal}>×</button>
            <h2>{selectedTransport.charAt(0).toUpperCase() + selectedTransport.slice(1)} Booking</h2>
            
            <div className="search-form">
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="From"
                  value={fromPlace}
                  onChange={(e) => setFromPlace(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="To"
                  value={toPlace}
                  onChange={(e) => setToPlace(e.target.value)}
                  required
                />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
                <button type="submit">Search</button>
              </form>
            </div>

            {showAvailableOptions && (
              <div className="available-options">
                <h3>Available Options</h3>
                <div className="options-grid">
                  {availableTransports[selectedTransport].map((option) => (
                    <div key={option.id} className="option-card">
                      <div className="image-container">
                        <img src={option.image} alt={option.name} />
                      </div>
                      <h3>{option.name}</h3>
                      <p>Departure: {option.departure}</p>
                      <p>Arrival: {option.arrival}</p>
                      <p className="price">{option.price}</p>
                      <button 
                        className="book-button" 
                        onClick={() => handleBookNow(option)}
                      >
                        Book Now
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="hotel-section">
        <h2>Select Hotel</h2>
        <div className="options-grid">
          {hotelOptions.map((option) => (
            <div
              key={option.id}
              className={`option-card ${selectedHotel === option.id ? 'selected' : ''}`}
              onClick={() => handleHotelSelect(option.id)}
            >
              <div className="image-container">
                <img src={option.image} alt={option.name} />
              </div>
              <h3>{option.name}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Hotel Modal */}
      {showHotelModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={() => setShowHotelModal(false)}>×</button>
            <h2>{selectedHotel.split('star')[0]} Star Hotel Booking</h2>
            
            <div className="search-form">
              <form onSubmit={handleHotelSearch}>
                <input
                  type="date"
                  placeholder="Check-in Date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  required
                />
                <input
                  type="date"
                  placeholder="Check-out Date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  required
                />
                <button type="submit">Search</button>
              </form>
            </div>

            {showHotelOptions && (
              <div className="available-options">
                <h3>Available Hotels</h3>
                <div className="options-grid">
                  {availableHotels[selectedHotel].map((option) => (
                    <div key={option.id} className="option-card">
                      <div className="image-container">
                        <img src={option.image} alt={option.name} />
                      </div>
                      <h3>{option.name}</h3>
                      <p className="amenities">
                        {option.amenities.join(' • ')}
                      </p>
                      <p className="price">
                        {option.price} per night
                      </p>
                      <button 
                        className="book-button"
                        onClick={() => handleHotelBookNow(option)}
                      >
                        Book Now
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Seats Selection Modal */}
      {showSeatsModal && (
        <div className="modal-overlay">
          <div className="modal-content seats-modal">
            <button className="close-button" onClick={() => setShowSeatsModal(false)}>×</button>
            <h2>{selectedTransport ? "Select Number of Seats" : "Select Number of Rooms"}</h2>
            <div className="seats-container">
              <div className="seats-display">
                <h3>{selectedOption.name}</h3>
                <p className="price">{selectedTransport ? `Price per seat: ${selectedOption.price}` : `Price per room: ${selectedOption.price}`}</p>
                <div className="seats-input">
                  <button 
                    className="seat-btn"
                    onClick={() => setNumberOfSeats(Math.max(1, numberOfSeats - 1))}
                  >
                    -
                  </button>
                  <span className="seat-number">{numberOfSeats}</span>
                  <button 
                    className="seat-btn"
                    onClick={() => setNumberOfSeats(numberOfSeats + 1)}
                  >
                    +
                  </button>
                </div>
                <p className="total-price">
                  Total: ₹{parseInt(selectedOption.price.replace('₹', '')) * numberOfSeats}
                </p>
                <button 
                  className="confirm-seats-btn"
                  onClick={handleSeatConfirmation}
                >
                  {selectedTransport ? "Confirm Seats" : "Confirm Rooms"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="modal-overlay">
          <div className="modal-content payment-modal">
            <button className="close-button" onClick={handleClosePaymentModal}>×</button>
            <h2>Payment Details</h2>
            <div className="payment-container">
              <div className="payment-summary">
                <h3>Booking Summary</h3>
                {selectedHotel ? (
                  // Hotel booking summary
                  <div className="summary-details">
                    <p><strong>{selectedOption.name}</strong></p>
                    <p>Check-in: {new Date(checkIn).toLocaleDateString()}</p>
                    <p>Check-out: {new Date(checkOut).toLocaleDateString()}</p>
                    <p>Number of rooms: {numberOfSeats}</p>
                    <p>Number of nights: {numberOfDays}</p>
                    <p>Price per room per night: {selectedOption.price}</p>
                    <div className="price-calculation hotel-price-calculation">
                      <h4>Price Calculation:</h4>
                      <div className="calculation-formula">
                        <div className="calc-item">
                          <span className="calc-label">Rooms:</span>
                          <span className="calc-value">{numberOfSeats}</span>
                        </div>
                        <span className="calc-operator">×</span>
                        <div className="calc-item">
                          <span className="calc-label">Price per night:</span>
                          <span className="calc-value">{selectedOption.price}</span>
                        </div>
                        <span className="calc-operator">×</span>
                        <div className="calc-item">
                          <span className="calc-label">Nights:</span>
                          <span className="calc-value">{numberOfDays}</span>
                        </div>
                      </div>
                      <div className="total-calculation">
                        <span className="total-label">Total:</span>
                        <span className="total-value">₹{(parseInt(selectedOption.price.replace('₹', '')) * numberOfSeats * numberOfDays).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Transport booking summary
                  <div className="summary-details">
                    <p><strong>{selectedOption.name}</strong></p>
                    <p>From: {fromPlace}</p>
                    <p>To: {toPlace}</p>
                    <p>Date: {new Date(date).toLocaleDateString()}</p>
                    <p>Number of seats: {numberOfSeats}</p>
                    <p>Price per seat: {selectedOption.price}</p>
                    <div className="price-calculation">
                      <p>Total price: {numberOfSeats} seats × {selectedOption.price} = 
                      ₹{(parseInt(selectedOption.price.replace('₹', '')) * numberOfSeats).toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="payment-card">
                <div className="card-header">
                  <h3>Credit/Debit Card</h3>
                  <div className="card-icons">
                    <span>💳</span>
                  </div>
                </div>
                <form className="payment-form" onSubmit={handlePaymentSuccess}>
                  <div className="form-group">
                    <label>Card Number</label>
                    <input type="text" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input type="text" placeholder="MM/YY" />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input type="text" placeholder="123" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Card Holder Name</label>
                    <input type="text" placeholder="John Doe" />
                  </div>
                  <button 
                    type="submit" 
                    className={`pay-button ${isLoading ? 'loading' : ''}`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="loader-container">
                        <div className="loader"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      selectedHotel ? 
                      `Pay ₹${(parseInt(selectedOption.price.replace('₹', '')) * numberOfSeats * numberOfDays).toLocaleString()}` :
                      `Pay ₹${(parseInt(selectedOption.price.replace('₹', '')) * numberOfSeats).toLocaleString()}`
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .bookings-container {
          padding: 20px;
        }
        .transport-section,
        .hotel-section {
          margin-bottom: 30px;
        }
        .options-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-top: 15px;
        }
        .option-card {
          border: 1px solid #ddd;
          padding: 15px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
        }
        .option-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .option-card.selected {
          border-color: #007bff;
          background-color: #f8f9ff;
        }
        .image-container {
          width: 100%;
          margin-bottom: 15px;
          overflow: hidden;
          border-radius: 4px;
        }
        .image-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        h2 {
          color: #333;
          margin-bottom: 10px;
        }
        h3 {
          margin: 0;
          color: #333;
        }
        .search-form {
          margin: 20px 0;
          padding: 20px;
          background: #f5f5f5;
          border-radius: 8px;
        }
        .search-form form {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }
        .search-form input {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          flex: 1;
          min-width: 200px;
        }
        .search-form button {
          padding: 10px 20px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .search-form button:hover {
          background: #0056b3;
        }
        .available-options {
          margin-top: 30px;
        }
        .price {
          font-weight: bold;
          color: #007bff;
          margin: 10px 0;
        }
        .book-button {
          background: #28a745;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        .book-button:hover {
          background: #218838;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          padding: 30px;
          border-radius: 8px;
          max-width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
        }
        .close-button {
          position: absolute;
          top: 10px;
          right: 10px;
          font-size: 24px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 5px 10px;
        }
        .close-button:hover {
          color: #666;
        }
        .seats-modal {
          max-width: 400px;
        }
        .seats-container {
          padding: 20px;
          text-align: center;
        }
        .seats-input {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
          margin: 20px 0;
        }
        .seat-btn {
          background: #007bff;
          color: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          font-size: 20px;
          cursor: pointer;
        }
        .seat-number {
          font-size: 24px;
          font-weight: bold;
        }
        .confirm-seats-btn {
          background: #28a745;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          margin-top: 20px;
        }
        .payment-modal {
          max-width: 600px;
        }
        .payment-container {
          padding: 20px;
        }
        .payment-summary {
          background: #f0f8ff;
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 20px;
        }
        .summary-details p {
          margin: 8px 0;
        }
        .price-calculation {
          margin-top: 15px;
          padding-top: 10px;
          border-top: 1px dashed #ccc;
          font-weight: bold;
        }
        .hotel-price-calculation {
          background-color: #f0f7ff;
          padding: 15px;
          border-radius: 8px;
          border: 1px solid #cce5ff;
          margin-top: 20px;
        }
        .hotel-price-calculation h4 {
          margin: 0 0 12px 0;
          color: #0056b3;
        }
        .calculation-formula {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 15px;
        }
        .calc-item {
          display: flex;
          flex-direction: column;
          text-align: center;
          background-color: white;
          padding: 8px 15px;
          border-radius: 6px;
          border: 1px solid #cce5ff;
        }
        .calc-label {
          font-size: 12px;
          color: #666;
          margin-bottom: 4px;
        }
        .calc-value {
          font-weight: bold;
          color: #0056b3;
        }
        .calc-operator {
          font-size: 24px;
          color: #0056b3;
        }
        .total-calculation {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #cce5ff;
        }
        .total-label {
          font-size: 18px;
        }
        .total-value {
          font-size: 20px;
          color: #0056b3;
        }
        .payment-card {
          background: #f8f9fa;
          border-radius: 10px;
          padding: 20px;
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .payment-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        .payment-form input {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
        }
        .payment-form label {
          font-weight: bold;
          color: #333;
        }
        .pay-button {
          background: #28a745;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          margin-top: 10px;
          position: relative;
          min-height: 48px;
          transition: background-color 0.3s;
        }
        .pay-button:disabled {
          background: #94d3a2;
          cursor: not-allowed;
        }
        .loader-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .loader {
          width: 20px;
          height: 20px;
          border: 3px solid #ffffff;
          border-radius: 50%;
          border-top-color: transparent;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        .total-price {
          font-size: 20px;
          font-weight: bold;
          color: #007bff;
          margin: 10px 0;
        }
        .amenities {
          color: #666;
          font-size: 14px;
          margin: 10px 0;
        }
        .hotel-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 15px;
        }
        .hotel-details {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
}

export default Bookings;
