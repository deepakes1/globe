import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Search, MapPin, Calendar, Hotel, Plane } from 'lucide-react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Link } from 'react-router-dom'
export default function HomePage() {
  const [chatbotOpen, setChatbotOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [featuredDestinations, setFeaturedDestinations] = useState([
    { 
      id: '1', 
      name: 'Taj Mahal, Agra', 
      description: 'Experience the majestic beauty of one of the world\'s wonders',
      fullDescription: 'The Taj Mahal, an ivory-white marble mausoleum on the right bank of the river Yamuna, was commissioned in 1632 by the Mughal emperor Shah Jahan to house the tomb of his favorite wife. This UNESCO World Heritage site combines Persian, Ottoman Turkish and Indian architectural styles. The best times to visit are during sunrise and sunset when the marble takes on stunning golden and pink hues.',
      image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1000&auto=format&fit=crop'
    },
    { 
      id: '2', 
      name: 'Pink City, Jaipur', 
      description: 'Discover royal palaces and vibrant bazaars in the heart of Rajasthan',
      fullDescription: 'Jaipur, the capital of Rajasthan, is known as the Pink City due to its distinctive terracotta-pink buildings. Home to magnificent palaces like Hawa Mahal and Amber Fort, the city offers a perfect blend of royal heritage and modern culture. Explore bustling markets, try traditional Rajasthani cuisine, and witness the rich craftsmanship in textiles and jewelry.',
      image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1000&auto=format&fit=crop'
    },
    { 
      id: '3', 
      name: 'Backwaters, Kerala', 
      description: 'Cruise through serene waterways surrounded by lush greenery',
      fullDescription: 'Kerala\'s backwaters are a network of interconnected canals, rivers, lakes, and inlets formed by more than 900 km of waterways. Experience traditional houseboats called Kettuvallams, witness local life along the shores, and immerse yourself in the tranquil atmosphere. The region is famous for its ayurvedic treatments, spice plantations, and diverse wildlife.',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1000&auto=format&fit=crop'
    },
    { 
      id: '4', 
      name: 'Santorini, Greece', 
      description: 'Explore white-washed buildings and stunning Mediterranean views',
      fullDescription: 'Santorini, one of the Cyclades islands in the Aegean Sea, is famous for its dramatic views, stunning sunsets, and volcanic-sand beaches. The island\'s white-washed, cubiform houses cling to cliffs above an underwater caldera. Visit the picturesque towns of Oia and Fira, explore ancient ruins, and enjoy world-class wineries and Mediterranean cuisine.',
      image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1000&auto=format&fit=crop'
    },
    { 
      id: '5', 
      name: 'Machu Picchu, Peru', 
      description: 'Discover the ancient Incan citadel in the Andes Mountains',
      fullDescription: 'Machu Picchu, the 15th-century Inca citadel, stands 7,970 feet above sea level in the Cusco Region of Peru. This UNESCO World Heritage site is renowned for its sophisticated dry-stone walls that fuse huge blocks without the use of mortar. The site offers insights into the Incan Empire\'s architectural prowess and astronomical alignment. Take the scenic train journey or trek the famous Inca Trail for an unforgettable experience.',
      image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1000&auto=format&fit=crop'
    },
    { 
      id: '6', 
      name: 'Kyoto, Japan', 
      description: 'Experience traditional Japanese culture and serene temples',
      fullDescription: 'Kyoto, Japan\'s former capital, is home to numerous classical Buddhist temples, Shinto shrines, imperial palaces, and traditional gardens. The city is famous for its preservation of traditions, from tea ceremonies to geisha culture in the Gion district. Visit the iconic golden Kinkaku-ji temple, the bamboo forests of Arashiyama, and experience the cherry blossoms in spring or the vibrant autumn colors.',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000&auto=format&fit=crop'
    },
  ]);



  const [activities, setActivities] = useState([
    { 
      id: '1', 
      name: 'Heritage Walk', 
      description: 'Walk through the ancient streets of Jaipur', 
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1000&auto=format&fit=crop', 
      price: 40 
    },
    { 
      id: '2', 
      name: 'Kerala Backwater Cruise', 
      description: 'Explore the tranquil backwaters of Kerala', 
      image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=1000&auto=format&fit=crop', 
      price: 60 
    },
    { 
      id: '3', 
      name: 'Ganga Aarti Ceremony', 
      description: 'Experience the spiritual Ganga Aarti at Varanasi ghats', 
      image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=1000&auto=format&fit=crop', 
      price: 20 
    },
    { 
      id: '4', 
      name: 'Bollywood Tour', 
      description: 'Visit famous Bollywood studios in Mumbai', 
      image: 'https://img.freepik.com/free-vector/bollywood-lettering-with-mandala-background_52683-35170.jpg?uid=R179059036&ga=GA1.1.156755672.1738750788&semt=ais_hybrid', 
      price: 50 
    },
    { 
      id: '5', 
      name: 'Cooking Class in Delhi', 
      description: 'Learn to cook authentic Indian cuisine', 
      image: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?q=80&w=1000&auto=format&fit=crop', 
      price: 75 
    },
    { 
      id: '6', 
      name: 'Yoga Retreat in Rishikesh', 
      description: 'Experience traditional yoga and meditation in the yoga capital', 
      image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?q=80&w=1000&auto=format&fit=crop', 
      price: 90 
    },
  ]);

  const [cart, setCart] = useState([])
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', message: 'Hello! How can I assist you with your travel plans today?' },
  ])
  const [userMessage, setUserMessage] = useState('')

  // First, add this new state for tracking expanded cards
  const [expandedCards, setExpandedCards] = useState({});

  useEffect(() => {
    // Simulating an API call to fetch featured destinations
    const fetchDestinations = async () => {
      // In a real application, you would fetch this data from an API
      // For now, we'll just use a timeout to simulate an async operation
      await new Promise(resolve => setTimeout(resolve, 1000))
      setFeaturedDestinations(featuredDestinations)
    }

    fetchDestinations()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    // In a real application, you would typically make an API call here
    console.log('Searching for:', searchQuery)
    // For now, let's just filter the featured destinations
    const filteredDestinations = featuredDestinations.filter(dest => 
      dest.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFeaturedDestinations(filteredDestinations)
  }

  const onDragEnd = (result) => {
    if (!result.destination) return

    const { source, destination } = result
    const sourceDay = source.droppableId
    const destDay = destination.droppableId

    const newItinerary = { ...itinerary }
    const [reorderedItem] = newItinerary[sourceDay].splice(source.index, 1)
    newItinerary[destDay].splice(destination.index, 0, reorderedItem)

    setItinerary(newItinerary)
  }

  const addToCart = (activity) => {
    setCart([...cart, activity])
  }

  const sendMessage = () => {
    if (userMessage.trim() === '') return

    setChatMessages([...chatMessages, { sender: 'user', message: userMessage }])
    setUserMessage('')

    // Simulate bot response
    setTimeout(() => {
      setChatMessages(prevMessages => [
        ...prevMessages,
        { sender: 'bot', message: `I'm sorry, I don't have a specific answer for "${userMessage}". How else can I assist you with your travel plans?` }
      ])
    }, 1000)
  }

  // Add this function to handle toggling card descriptions
  const toggleCardExpansion = (id) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="flex flex-col mt-0 min-h-screen">
      

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[90vh] overflow-hidden">
          <div 
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506461883276-594a12b11cf3?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center"
            style={{ 
              filter: 'brightness(0.4)',
              transform: 'scale(1.1)',
              transition: 'transform 20s ease-out',
            }}
          ></div>
          <div className="relative container mx-auto px-4 sm:px-6 h-full flex items-center justify-center">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-4 sm:mb-6 animate-fade-in">
                Discover Your Next Adventure
              </h1>
              <p className="mt-4 sm:mt-6 text-lg sm:text-xl md:text-2xl leading-8 text-gray-200 max-w-2xl mx-auto animate-fade-in-delayed">
                Plan, book, and experience unforgettable journeys with GlobeTrotter
              </p>
              <form onSubmit={handleSearch} className="mt-8 sm:mt-12 flex items-center justify-center gap-x-2 sm:gap-x-6 animate-fade-in-delayed">
                <div className="flex w-full max-w-lg">
                  <Input 
                    type="text" 
                    placeholder="Search destinations" 
                    className="flex-1 h-10 sm:h-12 text-base sm:text-lg bg-white/90 backdrop-blur-sm border-2 border-r-0 rounded-r-none focus:border-primary" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button type="submit" className="h-10 sm:h-12 px-3 sm:px-5 text-base sm:text-lg bg-white/90 rounded-l-none border-2 border-l-0 border-primary hover:bg-white/90">
                    <Search className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    <span className="hidden sm:inline">Search</span>
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Featured Destinations */}
        <section className="py-12 sm:py-24 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-3 sm:mb-4">Featured Destinations</h2>
            <p className="text-gray-600 text-center mb-8 sm:mb-12 text-base sm:text-lg">Explore our handpicked destinations for your next journey</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
              {featuredDestinations.map((destination) => (
                <Card key={destination.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0">
                  <CardHeader className="relative p-0">
                    <div className="overflow-hidden">
                      <img 
                        src={destination.image}
                        alt={destination.name} 
                        className="w-full h-72 object-cover transform group-hover:scale-110 transition-transform duration-700" 
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-2xl font-bold mb-2">{destination.name}</h3>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="text-gray-600">
                      {expandedCards[destination.id] 
                        ? destination.fullDescription 
                        : destination.description}
                    </p>
                    <Button 
                      variant="link" 
                      onClick={() => toggleCardExpansion(destination.id)}
                      className="mt-2 p-0 h-auto font-semibold text-primary hover:text-primary/80 flex items-center gap-2"
                    >
                      {expandedCards[destination.id] ? (
                        <>
                          Show Less
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-up">
                            <path d="m18 15-6-6-6 6"/>
                          </svg>
                        </>
                      ) : (
                        <>
                          Show More
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down">
                            <path d="m6 9 6 6 6-6"/>
                          </svg>
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>


        {/* Activity Booking */}
        <section className="py-12 sm:py-24 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-3 sm:mb-4">Book Exciting Activities</h2>
            <p className="text-gray-600 text-center mb-8 sm:mb-12 text-base sm:text-lg">Unforgettable experiences await you</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
              {activities.map((activity) => (
                <Card key={activity.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0">
                  <CardHeader className="relative p-0">
                    <div className="overflow-hidden">
                      <img 
                        src={activity.image}
                        alt={activity.name} 
                        className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-700" 
                      />
                    </div>
                    <div className="absolute top-4 right-4 bg-primary text-white px-4 py-2 rounded-full">
                      <span className="font-semibold">${activity.price}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{activity.name}</h3>
                    <p className="text-gray-600">{activity.description}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full text-lg py-6 bg-primary hover:bg-primary/90 transition-colors" onClick={() => addToCart(activity)}>
                      Book Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About GlobeTrotter</h3>
              <p className="text-gray-400">Your all-in-one travel planning companion for unforgettable adventures.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2 flex flex-col text-gray-400">
                <Link to = "/Destinations">Destinations</Link>
                <Link to = "/Itineraries">Itineraries</Link>
                <Link to = "/Bookings">Bookings</Link>
                <Link to = "/Support">Support</Link>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <p className="text-gray-400">Email: info@globetrotter.com</p>
              <p className="text-gray-400">Phone: +1 (123) 456-7890</p>
            </div>
          </div>
          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2023 GlobeTrotter. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Chatbot */}
      <div className={`fixed bottom-0 bg-white right-4 transition-all duration-300 ease-in-out ${chatbotOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        <Card className="w-[280px] sm:w-80">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>GlobeTrotter Assistant</span>
              <Button variant="ghost" size="sm" onClick={() => setChatbotOpen(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-60 overflow-y-auto">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`flex items-start space-x-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                  {msg.sender === 'bot' && (
                    <Avatar>
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>GT</AvatarFallback>
                    </Avatar>
                  )}
                  <p className={`text-sm p-2 rounded-md ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex w-full items-center space-x-2">
              <Input 
                type="text" 
                placeholder="Type your message..." 
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
              />
              <Button type="submit" size="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>

      {/* Chatbot Toggle Button */}
      {!chatbotOpen && (
        <Button
          className="fixed bottom-4 right-4 rounded-full p-4"
          onClick={() => setChatbotOpen(true)}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  )
}
