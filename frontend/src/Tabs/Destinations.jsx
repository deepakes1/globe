import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Search, Star, Luggage, Shield, Wallet, SearchX } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Add this near the top of your file
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://globe-bg.vercel.app'
  : 'http://localhost:5000';

export default function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [selectedType, setSelectedType] = useState("national");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDays, setSelectedDays] = useState("");
  const [recommendedPlaces, setRecommendedPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCustomDaysInput, setShowCustomDaysInput] = useState(false);
  const [customDays, setCustomDays] = useState("");
  const navigate = useNavigate();

  const stateWisePlaces = {
    "Rajasthan": {
      "2": [
        { name: "Jaipur", image: "https://images.unsplash.com/photo-1477587458883-47145ed94245", description: "Pink City - City Palace, Hawa Mahal, Amber Fort" },
        { name: "Udaipur", image: "https://images.unsplash.com/photo-1595658658481-d53d3f999875", description: "City of Lakes - Lake Palace, City Palace" },
        { name: "Jodhpur", image: "https://images.unsplash.com/photo-1590766940522-78c104a442e6", description: "Blue City - Mehrangarh Fort, Clock Tower" }
      ],
      "3": [
        { name: "Jaipur", image: "https://images.unsplash.com/photo-1477587458883-47145ed94245", description: "Pink City - City Palace, Hawa Mahal, Amber Fort" },
        { name: "Udaipur", image: "https://images.unsplash.com/photo-1595658658481-d53d3f999875", description: "City of Lakes - Lake Palace, City Palace" },
        { name: "Jodhpur", image: "https://images.unsplash.com/photo-1590766940522-78c104a442e6", description: "Blue City - Mehrangarh Fort, Clock Tower" },
        { name: "Pushkar", image: "https://images.unsplash.com/photo-1590687664033-89a42974e5c5", description: "Holy City - Pushkar Lake, Brahma Temple" }
      ],
      "4": [
        { name: "Jaipur", image: "https://images.unsplash.com/photo-1477587458883-47145ed94245", description: "Pink City - City Palace, Hawa Mahal, Amber Fort" },
        { name: "Udaipur", image: "https://images.unsplash.com/photo-1595658658481-d53d3f999875", description: "City of Lakes - Lake Palace, City Palace" },
        { name: "Jodhpur", image: "https://images.unsplash.com/photo-1590766940522-78c104a442e6", description: "Blue City - Mehrangarh Fort, Clock Tower" },
        { name: "Pushkar", image: "https://images.unsplash.com/photo-1590687664033-89a42974e5c5", description: "Holy City - Pushkar Lake, Brahma Temple" },
        { name: "Jaisalmer", image: "https://images.unsplash.com/photo-1577394200544-348b55d52b4f", description: "Golden City - Jaisalmer Fort, Sam Sand Dunes" }
      ],
      "5": [
        { name: "Jaipur", image: "https://images.unsplash.com/photo-1477587458883-47145ed94245", description: "Pink City - City Palace, Hawa Mahal, Amber Fort" },
        { name: "Udaipur", image: "https://images.unsplash.com/photo-1595658658481-d53d3f999875", description: "City of Lakes - Lake Palace, City Palace" },
        { name: "Jodhpur", image: "https://images.unsplash.com/photo-1590766940522-78c104a442e6", description: "Blue City - Mehrangarh Fort, Clock Tower" },
        { name: "Pushkar", image: "https://images.unsplash.com/photo-1590687664033-89a42974e5c5", description: "Holy City - Pushkar Lake, Brahma Temple" },
        { name: "Jaisalmer", image: "https://images.unsplash.com/photo-1577394200544-348b55d52b4f", description: "Golden City - Jaisalmer Fort, Sam Sand Dunes" },
        { name: "Ranthambore", image: "https://images.unsplash.com/photo-1615460549969-36fa19521a4f", description: "Wildlife - Ranthambore National Park, Tiger Reserve" }
      ]
    },
    "Kerala": {
      "2": [
        { name: "Munnar", image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2", description: "Tea Gardens, Eravikulam National Park" },
        { name: "Alleppey", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944", description: "Backwaters, Houseboat Cruise" },
        { name: "Kochi", image: "https://images.unsplash.com/photo-1590123717647-44deb1d3a019", description: "Fort Kochi, Chinese Fishing Nets" }
      ],
      "3": [
        { name: "Munnar", image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2", description: "Tea Gardens, Eravikulam National Park" },
        { name: "Alleppey", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944", description: "Backwaters, Houseboat Cruise" },
        { name: "Kochi", image: "https://images.unsplash.com/photo-1590123717647-44deb1d3a019", description: "Fort Kochi, Chinese Fishing Nets" },
        { name: "Thekkady", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220", description: "Periyar Wildlife Sanctuary" }
      ],
      "4": [
        { name: "Munnar", image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2", description: "Tea Gardens, Eravikulam National Park" },
        { name: "Alleppey", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944", description: "Backwaters, Houseboat Cruise" },
        { name: "Kochi", image: "https://images.unsplash.com/photo-1590123717647-44deb1d3a019", description: "Fort Kochi, Chinese Fishing Nets" },
        { name: "Thekkady", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220", description: "Periyar Wildlife Sanctuary" },
        { name: "Kovalam", image: "https://images.unsplash.com/photo-1590123717647-44deb1d3a019", description: "Beach, Lighthouse" }
      ],
      "5": [
        { name: "Munnar", image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2", description: "Tea Gardens, Eravikulam National Park" },
        { name: "Alleppey", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944", description: "Backwaters, Houseboat Cruise" },
        { name: "Kochi", image: "https://images.unsplash.com/photo-1590123717647-44deb1d3a019", description: "Fort Kochi, Chinese Fishing Nets" },
        { name: "Thekkady", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220", description: "Periyar Wildlife Sanctuary" },
        { name: "Kovalam", image: "https://images.unsplash.com/photo-1590123717647-44deb1d3a019", description: "Beach, Lighthouse" },
        { name: "Wayanad", image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2", description: "Wildlife Sanctuary, Caves" }
      ]
    },
    "Goa": {
      "2": [
        { name: "Calangute", image: "https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3", description: "Popular Beach - Water Sports, Nightlife" },
        { name: "Panaji", image: "https://images.unsplash.com/photo-1582036661671-da62c57d4ff9", description: "Capital City - Churches, Portuguese Architecture" },
        { name: "Baga", image: "https://images.unsplash.com/photo-1451440063999-77a8b2960d2b", description: "Beach Paradise - Nightlife, Water Activities" }
      ],
      "3": [
        { name: "Calangute", image: "https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3", description: "Popular Beach - Water Sports, Nightlife" },
        { name: "Panaji", image: "https://images.unsplash.com/photo-1582036661671-da62c57d4ff9", description: "Capital City - Churches, Portuguese Architecture" },
        { name: "Baga", image: "https://images.unsplash.com/photo-1451440063999-77a8b2960d2b", description: "Beach Paradise - Nightlife, Water Activities" },
        { name: "Anjuna", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2", description: "Hippie Culture - Flea Market, Beach Parties" }
      ],
      "4": [
        { name: "Calangute", image: "https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3", description: "Popular Beach - Water Sports, Nightlife" },
        { name: "Panaji", image: "https://images.unsplash.com/photo-1582036661671-da62c57d4ff9", description: "Capital City - Churches, Portuguese Architecture" },
        { name: "Baga", image: "https://images.unsplash.com/photo-1451440063999-77a8b2960d2b", description: "Beach Paradise - Nightlife, Water Activities" },
        { name: "Anjuna", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2", description: "Hippie Culture - Flea Market, Beach Parties" },
        { name: "Palolem", image: "https://images.unsplash.com/photo-1566897819059-db42e89b5d91", description: "Scenic Beach - Dolphin Watching, Peaceful" }
      ],
      "5": [
        { name: "Calangute", image: "https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3", description: "Popular Beach - Water Sports, Nightlife" },
        { name: "Panaji", image: "https://images.unsplash.com/photo-1582036661671-da62c57d4ff9", description: "Capital City - Churches, Portuguese Architecture" },
        { name: "Baga", image: "https://images.unsplash.com/photo-1451440063999-77a8b2960d2b", description: "Beach Paradise - Nightlife, Water Activities" },
        { name: "Anjuna", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2", description: "Hippie Culture - Flea Market, Beach Parties" },
        { name: "Palolem", image: "https://images.unsplash.com/photo-1566897819059-db42e89b5d91", description: "Scenic Beach - Dolphin Watching, Peaceful" },
        { name: "Dudhsagar Falls", image: "https://images.unsplash.com/photo-1544634076-a90160ddf22e", description: "Waterfall - Trekking, Nature" }
      ]
    },
    "Uttarakhand": {
      "2": [
        { name: "Rishikesh", image: "https://images.unsplash.com/photo-1584732200355-486c00295cbe", description: "Yoga Capital - Adventure Sports, Spirituality" },
        { name: "Haridwar", image: "https://images.unsplash.com/photo-1590050352254-5f26b398a36c", description: "Holy City - Ganga Aarti, Temples" },
        { name: "Mussoorie", image: "https://images.unsplash.com/photo-1600100397608-f010f420a915", description: "Queen of Hills - Mall Road, Scenic Views" }
      ],
      "3": [
        { name: "Rishikesh", image: "https://images.unsplash.com/photo-1584732200355-486c00295cbe", description: "Yoga Capital - Adventure Sports, Spirituality" },
        { name: "Haridwar", image: "https://images.unsplash.com/photo-1590050352254-5f26b398a36c", description: "Holy City - Ganga Aarti, Temples" },
        { name: "Mussoorie", image: "https://images.unsplash.com/photo-1600100397608-f010f420a915", description: "Queen of Hills - Mall Road, Scenic Views" },
        { name: "Nainital", image: "https://images.unsplash.com/photo-1626714485833-537cd87de3c2", description: "Lake City - Boating, Shopping" }
      ],
      "4": [
        { name: "Rishikesh", image: "https://images.unsplash.com/photo-1584732200355-486c00295cbe", description: "Yoga Capital - Adventure Sports, Spirituality" },
        { name: "Haridwar", image: "https://images.unsplash.com/photo-1590050352254-5f26b398a36c", description: "Holy City - Ganga Aarti, Temples" },
        { name: "Mussoorie", image: "https://images.unsplash.com/photo-1600100397608-f010f420a915", description: "Queen of Hills - Mall Road, Scenic Views" },
        { name: "Nainital", image: "https://images.unsplash.com/photo-1626714485833-537cd87de3c2", description: "Lake City - Boating, Shopping" },
        { name: "Auli", image: "https://images.unsplash.com/photo-1624821558130-b325d7946fc6", description: "Ski Resort - Snow Activities, Cable Car" }
      ],
      "5": [
        { name: "Rishikesh", image: "https://images.unsplash.com/photo-1584732200355-486c00295cbe", description: "Yoga Capital - Adventure Sports, Spirituality" },
        { name: "Haridwar", image: "https://images.unsplash.com/photo-1590050352254-5f26b398a36c", description: "Holy City - Ganga Aarti, Temples" },
        { name: "Mussoorie", image: "https://images.unsplash.com/photo-1600100397608-f010f420a915", description: "Queen of Hills - Mall Road, Scenic Views" },
        { name: "Nainital", image: "https://images.unsplash.com/photo-1626714485833-537cd87de3c2", description: "Lake City - Boating, Shopping" },
        { name: "Auli", image: "https://images.unsplash.com/photo-1624821558130-b325d7946fc6", description: "Ski Resort - Snow Activities, Cable Car" },
        { name: "Jim Corbett", image: "https://images.unsplash.com/photo-1598627446792-5d89ab3d1913", description: "National Park - Wildlife Safari, Nature" }
      ]
    },
    "Tamil Nadu": {
      "2": [
        { name: "Chennai", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220", description: "Capital City - Marina Beach, Temples" },
        { name: "Mahabalipuram", image: "https://images.unsplash.com/photo-1621831714462-bec486687d0f", description: "UNESCO Site - Shore Temple, Beach" },
        { name: "Pondicherry", image: "https://images.unsplash.com/photo-1619167801419-bfeca51c4062", description: "French Colony - Architecture, Beaches" }
      ],
      "3": [
        { name: "Chennai", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220", description: "Capital City - Marina Beach, Temples" },
        { name: "Mahabalipuram", image: "https://images.unsplash.com/photo-1621831714462-bec486687d0f", description: "UNESCO Site - Shore Temple, Beach" },
        { name: "Pondicherry", image: "https://images.unsplash.com/photo-1619167801419-bfeca51c4062", description: "French Colony - Architecture, Beaches" },
        { name: "Madurai", image: "https://images.unsplash.com/photo-1605797534954-0dd62c204a33", description: "Temple City - Meenakshi Temple, Culture" }
      ],
      "4": [
        { name: "Chennai", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220", description: "Capital City - Marina Beach, Temples" },
        { name: "Mahabalipuram", image: "https://images.unsplash.com/photo-1621831714462-bec486687d0f", description: "UNESCO Site - Shore Temple, Beach" },
        { name: "Pondicherry", image: "https://images.unsplash.com/photo-1619167801419-bfeca51c4062", description: "French Colony - Architecture, Beaches" },
        { name: "Madurai", image: "https://images.unsplash.com/photo-1605797534954-0dd62c204a33", description: "Temple City - Meenakshi Temple, Culture" },
        { name: "Ooty", image: "https://images.unsplash.com/photo-1625904835711-3d2644e0d3a4", description: "Hill Station - Tea Gardens, Toy Train" }
      ],
      "5": [
        { name: "Chennai", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220", description: "Capital City - Marina Beach, Temples" },
        { name: "Mahabalipuram", image: "https://images.unsplash.com/photo-1621831714462-bec486687d0f", description: "UNESCO Site - Shore Temple, Beach" },
        { name: "Pondicherry", image: "https://images.unsplash.com/photo-1619167801419-bfeca51c4062", description: "French Colony - Architecture, Beaches" },
        { name: "Madurai", image: "https://images.unsplash.com/photo-1605797534954-0dd62c204a33", description: "Temple City - Meenakshi Temple, Culture" },
        { name: "Ooty", image: "https://images.unsplash.com/photo-1625904835711-3d2644e0d3a4", description: "Hill Station - Tea Gardens, Toy Train" },
        { name: "Kodaikanal", image: "https://images.unsplash.com/photo-1624374275137-3c8f8a1e4eff", description: "Princess of Hills - Lakes, Waterfalls" }
      ]
    },
    "Maharashtra": {
      "2": [
        { name: "Mumbai", image: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7", description: "Financial Capital - Gateway of India, Marine Drive" },
        { name: "Pune", image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f", description: "Cultural City - Shaniwar Wada, Temples" },
        { name: "Lonavala", image: "https://images.unsplash.com/photo-1625505826533-5c80aca7d157", description: "Hill Station - Caves, Lakes" }
      ],
      "3": [
        { name: "Mumbai", image: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7", description: "Financial Capital - Gateway of India, Marine Drive" },
        { name: "Pune", image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f", description: "Cultural City - Shaniwar Wada, Temples" },
        { name: "Lonavala", image: "https://images.unsplash.com/photo-1625505826533-5c80aca7d157", description: "Hill Station - Caves, Lakes" },
        { name: "Ajanta Caves", image: "https://images.unsplash.com/photo-1624956578878-21fe6b0a3b3b", description: "UNESCO Site - Ancient Caves, Art" }
      ],
      "4": [
        { name: "Mumbai", image: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7", description: "Financial Capital - Gateway of India, Marine Drive" },
        { name: "Pune", image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f", description: "Cultural City - Shaniwar Wada, Temples" },
        { name: "Lonavala", image: "https://images.unsplash.com/photo-1625505826533-5c80aca7d157", description: "Hill Station - Caves, Lakes" },
        { name: "Ajanta Caves", image: "https://images.unsplash.com/photo-1624956578878-21fe6b0a3b3b", description: "UNESCO Site - Ancient Caves, Art" },
        { name: "Ellora Caves", image: "https://images.unsplash.com/photo-1624956567200-77de6628f660", description: "UNESCO Site - Rock-cut Temples" }
      ],
      "5": [
        { name: "Mumbai", image: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7", description: "Financial Capital - Gateway of India, Marine Drive" },
        { name: "Pune", image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f", description: "Cultural City - Shaniwar Wada, Temples" },
        { name: "Lonavala", image: "https://images.unsplash.com/photo-1625505826533-5c80aca7d157", description: "Hill Station - Caves, Lakes" },
        { name: "Ajanta Caves", image: "https://images.unsplash.com/photo-1624956578878-21fe6b0a3b3b", description: "UNESCO Site - Ancient Caves, Art" },
        { name: "Ellora Caves", image: "https://images.unsplash.com/photo-1624956567200-77de6628f660", description: "UNESCO Site - Rock-cut Temples" },
        { name: "Mahabaleshwar", image: "https://images.unsplash.com/photo-1625505826533-5c80aca7d157", description: "Hill Station - Strawberries, Viewpoints" }
      ]
    }
  };

  const internationalPlaces = {
    "France": {
      "2": [
        { name: "Paris", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34", description: "Eiffel Tower, Louvre Museum, Notre-Dame" },
        { name: "Versailles", image: "https://images.unsplash.com/photo-1591289009723-aef022f0e287", description: "Palace of Versailles, Royal Gardens" },
      ],
      "3": [
        { name: "Paris", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34", description: "Eiffel Tower, Louvre Museum, Notre-Dame" },
        { name: "Versailles", image: "https://images.unsplash.com/photo-1591289009723-aef022f0e287", description: "Palace of Versailles, Royal Gardens" },
        { name: "Nice", image: "https://images.unsplash.com/photo-1533614767277-c4c44811d4bb", description: "French Riviera, Promenade des Anglais" },
      ],
      "4": [
        { name: "Paris", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34", description: "Eiffel Tower, Louvre Museum, Notre-Dame" },
        { name: "Versailles", image: "https://images.unsplash.com/photo-1591289009723-aef022f0e287", description: "Palace of Versailles, Royal Gardens" },
        { name: "Nice", image: "https://images.unsplash.com/photo-1533614767277-c4c44811d4bb", description: "French Riviera, Promenade des Anglais" },
        { name: "Lyon", image: "https://images.unsplash.com/photo-1524081684693-1519f5613c13", description: "Gastronomy Capital, Historic District" },
      ],
      "5": [
        { name: "Paris", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34", description: "Eiffel Tower, Louvre Museum, Notre-Dame" },
        { name: "Versailles", image: "https://images.unsplash.com/photo-1591289009723-aef022f0e287", description: "Palace of Versailles, Royal Gardens" },
        { name: "Nice", image: "https://images.unsplash.com/photo-1533614767277-c4c44811d4bb", description: "French Riviera, Promenade des Anglais" },
        { name: "Lyon", image: "https://images.unsplash.com/photo-1524081684693-1519f5613c13", description: "Gastronomy Capital, Historic District" },
        { name: "Bordeaux", image: "https://images.unsplash.com/photo-1589983846997-04788035bc88", description: "Wine Region, Gothic Architecture" },
      ],
    },
    "Japan": {
      "2": [
        { name: "Tokyo", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf", description: "Modern City, Imperial Palace, Shibuya" },
        { name: "Kyoto", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e", description: "Traditional Japan, Temples, Geisha District" },
      ],
      "3": [
        { name: "Tokyo", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf", description: "Modern City, Imperial Palace, Shibuya" },
        { name: "Kyoto", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e", description: "Traditional Japan, Temples, Geisha District" },
        { name: "Osaka", image: "https://images.unsplash.com/photo-1590559899731-a382839e5549", description: "Street Food, Castle, Modern Architecture" },
      ],
      "4": [
        { name: "Tokyo", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf", description: "Modern City, Imperial Palace, Shibuya" },
        { name: "Kyoto", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e", description: "Traditional Japan, Temples, Geisha District" },
        { name: "Osaka", image: "https://images.unsplash.com/photo-1590559899731-a382839e5549", description: "Street Food, Castle, Modern Architecture" },
        { name: "Mount Fuji", image: "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65", description: "Iconic Mountain, Hiking, Lake Kawaguchiko" },
      ],
      "5": [
        { name: "Tokyo", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf", description: "Modern City, Imperial Palace, Shibuya" },
        { name: "Kyoto", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e", description: "Traditional Japan, Temples, Geisha District" },
        { name: "Osaka", image: "https://images.unsplash.com/photo-1590559899731-a382839e5549", description: "Street Food, Castle, Modern Architecture" },
        { name: "Mount Fuji", image: "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65", description: "Iconic Mountain, Hiking, Lake Kawaguchiko" },
        { name: "Hiroshima", image: "https://images.unsplash.com/photo-1558862107-d49ef2a04d72", description: "Peace Memorial, Historical Sites" },
      ],
    },
    "Australia": {
      "2": [
        { name: "Sydney", image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be", description: "Opera House, Harbour Bridge, Bondi Beach" },
        { name: "Blue Mountains", image: "https://images.unsplash.com/photo-1572893289436-c71726a73d93", description: "Three Sisters, Scenic World, Hiking Trails" },
      ],
      "3": [
        { name: "Sydney", image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be", description: "Opera House, Harbour Bridge, Bondi Beach" },
        { name: "Blue Mountains", image: "https://images.unsplash.com/photo-1572893289436-c71726a73d93", description: "Three Sisters, Scenic World, Hiking Trails" },
        { name: "Gold Coast", image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9", description: "Surfers Paradise, Theme Parks, Beaches" },
      ],
      "4": [
        { name: "Sydney", image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be", description: "Opera House, Harbour Bridge, Bondi Beach" },
        { name: "Blue Mountains", image: "https://images.unsplash.com/photo-1572893289436-c71726a73d93", description: "Three Sisters, Scenic World, Hiking Trails" },
        { name: "Gold Coast", image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9", description: "Surfers Paradise, Theme Parks, Beaches" },
        { name: "Great Barrier Reef", image: "https://images.unsplash.com/photo-1582434361665-1391e6e3fc37", description: "Coral Reef, Marine Life, Snorkeling" },
      ],
      "5": [
        { name: "Sydney", image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be", description: "Opera House, Harbour Bridge, Bondi Beach" },
        { name: "Blue Mountains", image: "https://images.unsplash.com/photo-1572893289436-c71726a73d93", description: "Three Sisters, Scenic World, Hiking Trails" },
        { name: "Gold Coast", image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9", description: "Surfers Paradise, Theme Parks, Beaches" },
        { name: "Great Barrier Reef", image: "https://images.unsplash.com/photo-1582434361665-1391e6e3fc37", description: "Coral Reef, Marine Life, Snorkeling" },
        { name: "Melbourne", image: "https://images.unsplash.com/photo-1514395462725-fb4566210144", description: "Cultural Capital, Street Art, Coffee Culture" },
      ],
    },
    "Italy": {
      "2": [
        { name: "Rome", image: "https://images.unsplash.com/photo-1525874684015-58379d421a52", description: "Colosseum, Vatican City, Roman Forum" },
        { name: "Florence", image: "https://images.unsplash.com/photo-1541370976299-4d24ebbc9077", description: "Uffizi Gallery, Duomo, Renaissance Art" },
      ],
      "3": [
        { name: "Rome", image: "https://images.unsplash.com/photo-1525874684015-58379d421a52", description: "Colosseum, Vatican City, Roman Forum" },
        { name: "Florence", image: "https://images.unsplash.com/photo-1541370976299-4d24ebbc9077", description: "Uffizi Gallery, Duomo, Renaissance Art" },
        { name: "Venice", image: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0", description: "Grand Canal, St. Mark's Square, Gondolas" },
      ],
      "4": [
        { name: "Rome", image: "https://images.unsplash.com/photo-1525874684015-58379d421a52", description: "Colosseum, Vatican City, Roman Forum" },
        { name: "Florence", image: "https://images.unsplash.com/photo-1541370976299-4d24ebbc9077", description: "Uffizi Gallery, Duomo, Renaissance Art" },
        { name: "Venice", image: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0", description: "Grand Canal, St. Mark's Square, Gondolas" },
        { name: "Milan", image: "https://images.unsplash.com/photo-1512857313597-881eada00568", description: "Duomo Cathedral, Fashion District, Last Supper" },
      ],
      "5": [
        { name: "Rome", image: "https://images.unsplash.com/photo-1525874684015-58379d421a52", description: "Colosseum, Vatican City, Roman Forum" },
        { name: "Florence", image: "https://images.unsplash.com/photo-1541370976299-4d24ebbc9077", description: "Uffizi Gallery, Duomo, Renaissance Art" },
        { name: "Venice", image: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0", description: "Grand Canal, St. Mark's Square, Gondolas" },
        { name: "Milan", image: "https://images.unsplash.com/photo-1512857313597-881eada00568", description: "Duomo Cathedral, Fashion District, Last Supper" },
        { name: "Amalfi Coast", image: "https://images.unsplash.com/photo-1533165850316-3dad68fcc874", description: "Coastal Towns, Mediterranean Views, Beaches" },
      ],
    },
    "Thailand": {
      "2": [
        { name: "Bangkok", image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a", description: "Grand Palace, Temples, Street Food" },
        { name: "Ayutthaya", image: "https://images.unsplash.com/photo-1528181304800-259b08848526", description: "Ancient Capital, Temple Ruins, History" },
      ],
      "3": [
        { name: "Bangkok", image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a", description: "Grand Palace, Temples, Street Food" },
        { name: "Ayutthaya", image: "https://images.unsplash.com/photo-1528181304800-259b08848526", description: "Ancient Capital, Temple Ruins, History" },
        { name: "Phuket", image: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5", description: "Beaches, Islands, Nightlife" },
      ],
      "4": [
        { name: "Bangkok", image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a", description: "Grand Palace, Temples, Street Food" },
        { name: "Ayutthaya", image: "https://images.unsplash.com/photo-1528181304800-259b08848526", description: "Ancient Capital, Temple Ruins, History" },
        { name: "Phuket", image: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5", description: "Beaches, Islands, Nightlife" },
        { name: "Chiang Mai", image: "https://images.unsplash.com/photo-1586931775007-71650c912779", description: "Temples, Night Markets, Hill Tribes" },
      ],
      "5": [
        { name: "Bangkok", image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a", description: "Grand Palace, Temples, Street Food" },
        { name: "Ayutthaya", image: "https://images.unsplash.com/photo-1528181304800-259b08848526", description: "Ancient Capital, Temple Ruins, History" },
        { name: "Phuket", image: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5", description: "Beaches, Islands, Nightlife" },
        { name: "Chiang Mai", image: "https://images.unsplash.com/photo-1586931775007-71650c912779", description: "Temples, Night Markets, Hill Tribes" },
        { name: "Krabi", image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a", description: "Rock Climbing, Islands, Beaches" },
      ],
    },
    "Switzerland": {
      "2": [
        { name: "Zurich", image: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6", description: "Old Town, Lake Zurich, Shopping" },
        { name: "Lucerne", image: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95", description: "Chapel Bridge, Lake Lucerne, Old Town" },
      ],
      "3": [
        { name: "Zurich", image: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6", description: "Old Town, Lake Zurich, Shopping" },
        { name: "Lucerne", image: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95", description: "Chapel Bridge, Lake Lucerne, Old Town" },
        { name: "Interlaken", image: "https://images.unsplash.com/photo-1520681279154-51b3fb4ea0f0", description: "Adventure Sports, Lakes, Mountains" },
      ],
      "4": [
        { name: "Zurich", image: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6", description: "Old Town, Lake Zurich, Shopping" },
        { name: "Lucerne", image: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95", description: "Chapel Bridge, Lake Lucerne, Old Town" },
        { name: "Interlaken", image: "https://images.unsplash.com/photo-1520681279154-51b3fb4ea0f0", description: "Adventure Sports, Lakes, Mountains" },
        { name: "Zermatt", image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99", description: "Matterhorn, Skiing, Alpine Village" },
      ],
      "5": [
        { name: "Zurich", image: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6", description: "Old Town, Lake Zurich, Shopping" },
        { name: "Lucerne", image: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95", description: "Chapel Bridge, Lake Lucerne, Old Town" },
        { name: "Interlaken", image: "https://images.unsplash.com/photo-1520681279154-51b3fb4ea0f0", description: "Adventure Sports, Lakes, Mountains" },
        { name: "Zermatt", image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99", description: "Matterhorn, Skiing, Alpine Village" },
        { name: "Geneva", image: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95", description: "UN Headquarters, Lake Geneva, Old Town" },
      ],
    }
  };

  useEffect(() => {
    const fetchDestinations = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/destinations/type/${selectedType}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fetched destinations:', data);
        
        setDestinations(data);
        setFilteredDestinations(data);
      } catch (error) {
        console.error('Error details:', error);
        setDestinations([]);
        setFilteredDestinations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDestinations();
  }, [selectedType]);

  useEffect(() => {
    if (!destinations.length) return;
    
    let filtered = [...destinations]; // Create a copy of destinations array

    // Filter by search query
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter((dest) => {
        return (
          dest.name.toLowerCase().includes(searchLower) ||
          dest.country.toLowerCase().includes(searchLower) ||
          dest.description.toLowerCase().includes(searchLower) ||
          (dest.categories && dest.categories.some(cat => cat.toLowerCase().includes(searchLower)))
        );
      });
    }

    // Filter by price range
    filtered = filtered.filter((dest) => {
      const [minPrice, maxPrice] = dest.priceRange || [0, 0];
      return minPrice >= priceRange[0] && maxPrice <= priceRange[1];
    });

    console.log('Filtered destinations:', filtered); // Add this to debug
    setFilteredDestinations(filtered);
  }, [searchQuery, destinations, priceRange]); 

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Filter destinations based on search query
    const filtered = destinations?.filter((dest) => {
      const searchLower = searchQuery.toLowerCase();
      
      // Search in destination name
      if (dest.name.toLowerCase().includes(searchLower)) return true;
      
      // Search in destination country
      if (dest.country.toLowerCase().includes(searchLower)) return true;
      
      // Search in destination description
      if (dest.description.toLowerCase().includes(searchLower)) return true;
      
      // Search in destination categories
      if (dest.categories.some(cat => cat.toLowerCase().includes(searchLower))) return true;
      
      return false;
    });

    setFilteredDestinations(filtered || []);
  };

  const handlePriceRangeChange = (value) => {
    setPriceRange(value);
  };

  const handleCardClick = (destination) => {
    setSelectedDestination(destination);
    setIsDialogOpen(true);
  };

  const handleBooking = () => {
    if (!selectedDestination || !selectedDays || !recommendedPlaces.length) return;

    // Pass the selected data to the Itineraries page
    const destinationData = {
      selectedDays,
      recommendedPlaces,
      destination: selectedDestination
    };

    // Navigate to itineraries page with the data
    navigate('/itineraries', { 
      state: { destinationData }
    });
  };

  const handleDaysChange = (days) => {
    setSelectedDays(days);
    
    if (days === "custom") {
      setShowCustomDaysInput(true);
      return;
    }
    
    setShowCustomDaysInput(false);
    let recommendedList = [];
    
    if (selectedDestination) {
      if (selectedType === "national") {
        // For custom days beyond predefined options, use the highest available day count recommendations
        if (!isNaN(parseInt(days)) && parseInt(days) > 5) {
          recommendedList = stateWisePlaces[selectedDestination.name]?.["5"] || [];
        } else {
          recommendedList = stateWisePlaces[selectedDestination.name]?.[days] || [];
        }
      } else {
        if (!isNaN(parseInt(days)) && parseInt(days) > 5) {
          recommendedList = internationalPlaces[selectedDestination.name]?.["5"] || [];
        } else {
          recommendedList = internationalPlaces[selectedDestination.name]?.[days] || [];
        }
      }
    }
    
    setRecommendedPlaces(recommendedList);
  };

  const handleCustomDaysChange = (e) => {
    const value = e.target.value;
    setCustomDays(value);
  };

  const applyCustomDays = () => {
    if (customDays && !isNaN(parseInt(customDays)) && parseInt(customDays) > 0) {
      const days = customDays.toString();
      setSelectedDays(days);
      
      let recommendedList = [];
      
      if (selectedDestination) {
        // For custom days beyond predefined options, use the highest available day count recommendations
        if (parseInt(days) > 5) {
          if (selectedType === "national") {
            recommendedList = stateWisePlaces[selectedDestination.name]?.["5"] || [];
          } else {
            recommendedList = internationalPlaces[selectedDestination.name]?.["5"] || [];
          }
        } else {
          if (selectedType === "national") {
            recommendedList = stateWisePlaces[selectedDestination.name]?.[days] || [];
          } else {
            recommendedList = internationalPlaces[selectedDestination.name]?.[days] || [];
          }
        }
      }
      
      setRecommendedPlaces(recommendedList);
    }
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedDays(""); // Reset selected days
    setRecommendedPlaces([]); // Reset recommended places
    setShowCustomDaysInput(false); // Reset custom days input
    setCustomDays(""); // Reset custom days value
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white/50 rounded-xl p-8 mb-12 shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-black">
          Explore Destinations
          <span className="block text-lg font-normal mt-2 text-black/80">
            Discover amazing places around the world
          </span>
        </h1>

        {/* Search Bar */}
        <div className=" backdrop-blur-md rounded-2xl p-6 space-y-6">
          <form onSubmit={handleSearch} className="relative bg-gray-200">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5  text-black/60" />
            <Input
              type="text"
              placeholder="Where would you like to go?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-6 bg-white/10 border-white/20 text-black placeholder:text-black/60 focus:ring-2 focus:ring-black/50 focus:border-transparent"
            />
          </form>

          <div className="flex flex-col md:flex-row gap-6 items-stretch md:items-center">
            {/* Type Selection */}
            <div className="flex gap-2 p-1 bg-white/10 rounded-lg">
              <Button
                variant="ghost"
                className={`flex-1 ${
                  selectedType === "national"
                    ? "bg-gray-200 text-indigo-600"
                    : "text-gray-200 hover:bg-white/20"
                }`}
                onClick={() => {
                  setSelectedType("national");
                  setSearchQuery("");
                  setPriceRange([0, 5000]);
                }}
              >
                <MapPin className="mr-2 h-4 w-4" />
                National
              </Button>
              <Button
                variant="ghost"
                className={`flex-1 ${
                  selectedType === "international"
                    ? "bg-gray-200 text-indigo-600"
                    : "text-gray-200 hover:bg-white/20"
                }`}
                onClick={() => {
                  setSelectedType("international");
                  setSearchQuery("");
                  setPriceRange([0, 5000]);
                }}
              >
                <MapPin className="mr-2 h-4 w-4" />
                International
              </Button>
            </div>

            {/* Price Range */}
            <div className="flex-1 bg-white/10 rounded-xl p-4 shadow-inner">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-black/80">Price Range</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-white/50 text-black font-medium px-3">
                      ${priceRange[0]} - ${priceRange[1]}
                    </Badge>
                  </div>
                </div>
                
                <div className="relative pt-2">
                  <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-indigo-200 via-indigo-400 to-indigo-600 rounded-full opacity-20" />
                  <Slider
                    min={0}
                    max={5000}
                    step={100}
                    value={priceRange}
                    onValueChange={handlePriceRangeChange}
                    className="relative z-10"
                    defaultValue={[0, 1000]}
                  />
                  <div className="flex justify-between mt-2 text-sm text-black/60">
                    <span>$0</span>
                    <span>$2.5k</span>
                    <span>$5k</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Budget", range: [0, 1000] },
                    { label: "Mid-Range", range: [1000, 3000] },
                    { label: "Luxury", range: [3000, 5000] }
                  ].map((preset) => (
                    <Button
                      key={preset.label}
                      variant="outline"
                      size="sm"
                      className="bg-white/50 hover:bg-white/80 border-none bg-gray-200 rounded-3xl transition-colors"
                      onClick={() => handlePriceRangeChange(preset.range)}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add this right after your search and filter section */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
            <p className="text-lg text-gray-600">Loading destinations...</p>
          </div>
        </div>
      ) : filteredDestinations.length === 0 ? (
        <div className="text-center py-20">
          <SearchX className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No destinations found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        // Your existing destinations grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {filteredDestinations.length > 0 ? (
            filteredDestinations.map((destination) => (
              <motion.div
                key={destination._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card 
                  className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl overflow-hidden"
                  onClick={() => handleCardClick(destination)}
                >
                  <div className="relative">
                    <img
                      src={destination.image || "/placeholder.svg"}
                      alt={destination.name}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/90 text-black hover:bg-white/75 transition-colors">
                        <Star className="h-4 w-4 text-yellow-500 mr-1 inline" />
                        {destination.rating.toFixed(1)}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl font-bold">{destination.name}</CardTitle>
                        <CardDescription className="text-base">
                          <MapPin className="h-4 w-4 inline mr-1" />
                          {destination.country}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-muted-foreground">Starting from</span>
                        <p className="font-semibold text-lg">${destination.priceRange[0]}</p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-muted-foreground line-clamp-2 mb-4">
                      {destination.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {destination.categories.map((category) => (
                        <Badge 
                          key={category} 
                          variant="secondary"
                          className="capitalize px-3 py-1 bg-secondary/50 hover:bg-secondary/70 transition-colors"
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>

                  <CardFooter className="border-t bg-secondary/10 mt-2">
                    <Button 
                      variant="ghost" 
                      className="w-full hover:bg-secondary/20"
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-12"
            >
              <div className="flex flex-col items-center gap-4">
                <SearchX className="h-12 w-12 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-600">No destinations found</h3>
                <p className="text-gray-500">
                  Try adjusting your search or filters to find what you're looking for
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setPriceRange([0, 5000]);
                    setSelectedCategory('all');
                  }}
                  className="mt-2"
                >
                  Clear all filters
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Booking Dialog */}
      <Dialog 
        open={isDialogOpen} 
        onOpenChange={(open) => {
          if (!open) {
            handleDialogClose();
          }
        }}
      >
        <DialogContent className="sm:max-w-[700px] h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-lg border-none shadow-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DialogHeader className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Plan Your Trip to {selectedDestination?.name}
                </DialogTitle>
              </motion.div>
              
              {selectedDestination && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="relative h-48 rounded-xl overflow-hidden"
                >
                  <img
                    src={selectedDestination.image}
                    alt={selectedDestination.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </motion.div>
              )}
            </DialogHeader>

            <div className="grid gap-6 py-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label htmlFor="days" className="text-sm font-medium flex items-center gap-2">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                    >
                      <MapPin className="h-4 w-4 text-indigo-600" />
                    </motion.div>
                    Select number of days:
                  </label>
                  <Select onValueChange={handleDaysChange} value={selectedDays}>
                    <SelectTrigger className="w-full bg-white/50 backdrop-blur-sm border-2 border-indigo-100 hover:border-indigo-200 transition-colors">
                      <SelectValue placeholder="Select days" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 backdrop-blur-lg border-2 border-indigo-100">
                      {["2", "3", "4", "5"].map((days) => (
                        <SelectItem
                          key={days}
                          value={days}
                          className="hover:bg-indigo-50 transition-colors"
                        >
                          {days} Days
                        </SelectItem>
                      ))}
                      <SelectItem
                        value="custom"
                        className="hover:bg-indigo-50 transition-colors text-indigo-600 font-medium"
                      >
                        Custom Days
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {showCustomDaysInput && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2"
                  >
                    <label htmlFor="customDays" className="text-sm font-medium">
                      Enter number of days:
                    </label>
                    <div className="flex gap-2">
                      <Input
                        id="customDays"
                        type="number"
                        min="1"
                        placeholder="Enter days"
                        value={customDays}
                        onChange={handleCustomDaysChange}
                        className="bg-white/50 backdrop-blur-sm border-2 border-indigo-100"
                      />
                      <Button 
                        onClick={applyCustomDays}
                        className="bg-indigo-600 text-white hover:bg-indigo-700"
                      >
                        Apply
                      </Button>
                    </div>
                  </motion.div>
                )}

                {recommendedPlaces.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-4"
                  >
                    <h3 className="font-medium flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      {recommendedPlaces.length} Places Recommended for {selectedDays} Days:
                    </h3>
                    <motion.div
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                      variants={{
                        hidden: { opacity: 0 },
                        show: {
                          opacity: 1,
                          transition: { staggerChildren: 0.1 }
                        }
                      }}
                      initial="hidden"
                      animate="show"
                    >
                      {recommendedPlaces.map((place, index) => (
                        <motion.div
                          key={index}
                          variants={{
                            hidden: { opacity: 0, scale: 0.9 },
                            show: { opacity: 1, scale: 1 }
                          }}
                        >
                          <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 bg-white/50 backdrop-blur-sm border-2 border-indigo-50 hover:border-indigo-200">
                            <div className="relative">
                              <img
                                src={place.image}
                                alt={place.name}
                                className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <CardHeader>
                              <CardTitle className="text-lg group-hover:text-indigo-600 transition-colors">
                                {place.name}
                              </CardTitle>
                              <CardDescription className="text-sm line-clamp-2">
                                {place.description}
                              </CardDescription>
                            </CardHeader>
                          </Card>
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            </div>

            <DialogFooter className="flex gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleDialogClose}
                className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
              >
                Cancel
              </Button>
              <Button
                onClick={handleBooking}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 transition-opacity"
              >
                Next
              </Button>
            </DialogFooter>
          </motion.div>
        </DialogContent>
      </Dialog>

      {/* Selected Destination Details */}
      {selectedDestination && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl">{selectedDestination.name}</CardTitle>
            <CardDescription className="text-lg">{selectedDestination.country}</CardDescription>
          </CardHeader>
          <CardContent>
            <img
              src={selectedDestination.image || "/placeholder.svg"}
              alt={selectedDestination.name}
              className="w-full h-96 object-cover rounded-md mb-6"
            />
            <p className="text-lg mb-4">{selectedDestination.description}</p>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Star className="h-6 w-6 text-yellow-400 mr-2" />
                <span className="text-xl">{selectedDestination.rating.toFixed(1)}</span>
              </div>
              <div className="text-xl">
                ${selectedDestination.priceRange[0]} - ${selectedDestination.priceRange[1]}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedDestination.categories.map((category) => (
                <Badge key={category} variant="secondary" className="text-lg px-3 py-1">
                  {category}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full text-lg py-6">Book This Destination</Button>
          </CardFooter>
        </Card>
      )}

      {/* Popular Destinations */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Popular Destinations</h2>
        <div className="w-full overflow-x-auto rounded-xl border bg-card custom-scrollbar">
          <div className="flex space-x-6 p-6">
            {filteredDestinations.slice(0, 5).map((destination) => (
              <Card 
                key={destination._id} 
                className="min-w-[300px] group cursor-pointer hover:shadow-lg transition-all duration-300"
                onClick={() => handleCardClick(destination)}
              >
                <div className="relative">
                  <img
                    src={destination.image || "/placeholder.svg"}
                    alt={destination.name}
                    className="w-full h-40 object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                    <h3 className="text-xl font-semibold text-white">{destination.name}</h3>
                    <p className="text-white/90">{destination.country}</p>
                  </div>
                </div>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      {destination.rating.toFixed(1)}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      From ${destination.priceRange[0]}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Travel Tips */}
      <section className="py-12 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 p-3">
        <motion.h2 
          className="text-3xl font-bold mb-4 "
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Travel Tips
        </motion.h2>
        <Tabs defaultValue="packing" className="w-full">
          <TabsList className="mb-4 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <motion.div 
              className="flex gap-2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <TabsTrigger 
                value="packing"
                className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-indigo-400"
              >
                Packing Tips
              </TabsTrigger>
              <TabsTrigger 
                value="safety"
                className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-indigo-400"
              >
                Safety Tips
              </TabsTrigger>
              <TabsTrigger 
                value="budget"
                className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-indigo-400"
              >
                Budget Tips
              </TabsTrigger>
            </motion.div>
          </TabsList>
          <TabsContent value="packing">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-2 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-300 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    >
                      <Luggage className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </motion.div>
                    Essential Packing Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <motion.ul 
                    className="list-disc pl-5 space-y-2"
                    variants={{
                      hidden: { opacity: 0 },
                      show: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.1
                        }
                      }
                    }}
                    initial="hidden"
                    animate="show"
                  >
                    {[
                      "Roll your clothes to save space and prevent wrinkles",
                      "Pack versatile clothing items that can be mixed and matched",
                      "Don't forget a universal power adapter for your electronics",
                      "Bring a reusable water bottle to stay hydrated and reduce plastic waste"
                    ].map((tip, index) => (
                      <motion.li
                        key={index}
                        variants={{
                          hidden: { opacity: 0, x: -20 },
                          show: { opacity: 1, x: 0 }
                        }}
                        className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300"
                      >
                        {tip}
                      </motion.li>
                    ))}
                  </motion.ul>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          <TabsContent value="safety">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-2 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-300 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    >
                      <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </motion.div>
                    Stay Safe While Traveling
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.ul 
                    className="list-disc pl-5 space-y-2"
                    variants={{
                      hidden: { opacity: 0 },
                      show: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.1
                        }
                      }
                    }}
                    initial="hidden"
                    animate="show"
                  >
                    {[
                      "Research your destination's local customs and laws before you go",
                      "Keep important documents and valuables in a secure location",
                      "Stay aware of your surroundings, especially in crowded areas",
                      "Purchase travel insurance for added peace of mind"
                    ].map((tip, index) => (
                      <motion.li
                        key={index}
                        variants={{
                          hidden: { opacity: 0, x: -20 },
                          show: { opacity: 1, x: 0 }
                        }}
                        className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300"
                      >
                        {tip}
                      </motion.li>
                    ))}
                  </motion.ul>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          <TabsContent value="budget">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-2 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-300 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    >
                      <Wallet className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </motion.div>
                    Travel on a Budget
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.ul 
                    className="list-disc pl-5 space-y-2"
                    variants={{
                      hidden: { opacity: 0 },
                      show: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.1
                        }
                      }
                    }}
                    initial="hidden"
                    animate="show"
                  >
                    {[
                      "Travel during the off-season for lower prices on flights and accommodations",
                      "Use public transportation or walk to save on transportation costs",
                      "Look for free activities and attractions at your destination",
                      "Stay at hostels or use home-sharing services for cheaper accommodations"
                    ].map((tip, index) => (
                      <motion.li
                        key={index}
                        variants={{
                          hidden: { opacity: 0, x: -20 },
                          show: { opacity: 1, x: 0 }
                        }}
                        className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300"
                      >
                        {tip}
                      </motion.li>
                    ))}
                  </motion.ul>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
