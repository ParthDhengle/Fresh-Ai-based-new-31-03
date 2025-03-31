"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import { Building, MapPin, Mail, Phone, Check } from "lucide-react"
import dynamic from "next/dynamic"

// Dynamically import Map component to avoid SSR issues
const MapWithNoSSR = dynamic(() => import("@/components/map-component"), {
  ssr: false,
  loading: () => <div className="h-[500px] w-full bg-muted animate-pulse rounded-md"></div>,
})

// Custom icons for different marker types (will be used in client component)
const markerIcons = {
  shopkeeper: {
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  },
  dealer: {
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  },
}

type DealerType = {
  dealer_id: number
  name: string
  company_name: string
  location_name: string
  latitude: number
  longitude: number
  email: string
  phone: string
  distance: number
}

type ShopkeeperType = {
  shopkeeper_id: number
  name: string
  shop_name: string
  location_name: string
  latitude: number
  longitude: number
  domain: string
  dealer_id: number | null
}

export default function ShopkeeperFindDealersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [searchRadius, setSearchRadius] = useState(10) // in kilometers
  const [shopkeeperInfo, setShopkeeperInfo] = useState<ShopkeeperType | null>(null)
  const [nearbyDealers, setNearbyDealers] = useState<DealerType[]>([])
  const [selectedDealer, setSelectedDealer] = useState<DealerType | null>(null)
  const [error, setError] = useState("")
  const [connectingId, setConnectingId] = useState<number | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError("")

        // Check if user is logged in
        const shopkeeperId = localStorage.getItem("shopkeeperId")
        if (!shopkeeperId) {
          router.push("/shopkeeper/login")
          return
        }

        // In a real app, fetch data from API
        // const response = await fetch(`http://localhost:8000/shopkeeper/${shopkeeperId}`)
        // if (!response.ok) throw new Error('Failed to fetch shopkeeper info')
        // const shopkeeperData = await response.json()
        //
        // const dealersResponse = await fetch(`http://localhost:8000/shopkeeper/nearby-dealers?lat=${shopkeeperData.latitude}&lng=${shopkeeperData.longitude}&radius=${searchRadius}`)
        // if (!dealersResponse.ok) throw new Error('Failed to fetch nearby dealers')
        // const dealersData = await dealersResponse.json()

        // Mock data for demo
        const mockShopkeeper: ShopkeeperType = {
          shopkeeper_id: 1,
          name: "Alice Smith",
          shop_name: "Tech Haven",
          location_name: "456 Main St, Brooklyn, NY",
          latitude: 40.6782,
          longitude: -73.9442,
          domain: "Electronics",
          dealer_id: null, // No connected dealer yet
        }

        const mockDealers: DealerType[] = [
          {
            dealer_id: 1,
            name: "John Doe",
            company_name: "Global Distribution Inc.",
            location_name: "123 Business Park, New York, NY",
            latitude: 40.7128,
            longitude: -74.006,
            email: "john.doe@example.com",
            phone: "+1 (555) 123-4567",
            distance: 5.2, // in kilometers
          },
          {
            dealer_id: 2,
            name: "Jane Smith",
            company_name: "East Coast Suppliers",
            location_name: "789 Commerce St, Jersey City, NJ",
            latitude: 40.7282,
            longitude: -74.0776,
            email: "jane.smith@example.com",
            phone: "+1 (555) 987-6543",
            distance: 8.7,
          },
          {
            dealer_id: 3,
            name: "Robert Johnson",
            company_name: "Metro Distributors",
            location_name: "456 Industrial Ave, Queens, NY",
            latitude: 40.7282,
            longitude: -73.7949,
            email: "robert.johnson@example.com",
            phone: "+1 (555) 456-7890",
            distance: 12.3,
          },
        ]

        setShopkeeperInfo(mockShopkeeper)

        // Filter dealers based on search radius
        const filteredDealers = mockDealers.filter((dealer) => dealer.distance <= searchRadius)
        setNearbyDealers(filteredDealers)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err instanceof Error ? err.message : "Failed to load nearby dealers")

        toast({
          title: "Error",
          description: "Failed to load nearby dealers. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [router, toast, searchRadius])

  const handleDealerSelect = (dealer: DealerType) => {
    setSelectedDealer(dealer)
  }

  const connectWithDealer = async (dealerId: number) => {
    try {
      setConnectingId(dealerId)

      // In a real app, make API call to connect with dealer
      // const response = await fetch(`http://localhost:8000/shopkeeper/connect-dealer`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     shopkeeper_id: shopkeeperInfo?.shopkeeper_id,
      //     dealer_id: dealerId,
      //   }),
      // })
      //
      // if (!response.ok) throw new Error('Failed to connect with dealer')
      // const data = await response.json()

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Update shopkeeper info with connected dealer
      if (shopkeeperInfo) {
        setShopkeeperInfo({
          ...shopkeeperInfo,
          dealer_id: dealerId,
        })
      }

      toast({
        title: "Success",
        description: `Successfully connected with ${selectedDealer?.company_name || "dealer"}!`,
      })

      // Close dealer profile
      setSelectedDealer(null)
    } catch (error) {
      console.error("Error connecting with dealer:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to connect with dealer",
        variant: "destructive",
      })
    } finally {
      setConnectingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !shopkeeperInfo) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Error Loading Dealers</h1>
        <p className="text-muted-foreground mb-6">{error || "Failed to load dealer information"}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Find Nearby Dealers</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Connect with local dealers to optimize your supply chain
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Map View</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Search Radius: {searchRadius} km</span>
                  <div className="w-32">
                    <Slider
                      value={[searchRadius]}
                      onValueChange={(value) => setSearchRadius(value[0])}
                      min={1}
                      max={50}
                      step={1}
                    />
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] w-full rounded-md overflow-hidden border">
                <MapWithNoSSR
                  position={[shopkeeperInfo.latitude, shopkeeperInfo.longitude]}
                  onPositionChange={() => {}}
                  zoom={11}
                />
              </div>
              <div className="flex items-center justify-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>Your Location</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Dealers</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-6 h-1 bg-primary rounded-full"></div>
                  <span>Search Radius</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Nearby Dealers</CardTitle>
            </CardHeader>
            <CardContent>
              {nearbyDealers.length > 0 ? (
                <div className="space-y-4">
                  {nearbyDealers.map((dealer) => (
                    <div
                      key={dealer.dealer_id}
                      className="p-4 rounded-lg border hover:border-primary cursor-pointer transition-all"
                      onClick={() => handleDealerSelect(dealer)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center shrink-0">
                          <Building className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium">{dealer.company_name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{dealer.name}</p>
                          <div className="flex items-center text-sm text-muted-foreground mt-2">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{dealer.distance.toFixed(1)} km away</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex justify-end">
                        <Button
                          size="sm"
                          variant={shopkeeperInfo.dealer_id === dealer.dealer_id ? "secondary" : "outline"}
                          onClick={(e) => {
                            e.stopPropagation()
                            if (shopkeeperInfo.dealer_id !== dealer.dealer_id) {
                              connectWithDealer(dealer.dealer_id)
                            }
                          }}
                          disabled={connectingId === dealer.dealer_id}
                        >
                          {connectingId === dealer.dealer_id ? (
                            "Connecting..."
                          ) : shopkeeperInfo.dealer_id === dealer.dealer_id ? (
                            <>
                              <Check className="w-4 h-4 mr-1" />
                              Connected
                            </>
                          ) : (
                            "Connect"
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Building className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium mb-1">No dealers found</h3>
                  <p className="text-muted-foreground mb-4">Try increasing your search radius to find more dealers</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dealer Profile Modal */}
      {selectedDealer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg">
            <CardHeader className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4"
                onClick={() => setSelectedDealer(null)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-x"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
                <span className="sr-only">Close</span>
              </Button>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full gradient-bg flex items-center justify-center text-white">
                  <Building className="w-7 h-7" />
                </div>
                <div>
                  <CardTitle>{selectedDealer.company_name}</CardTitle>
                  <p className="text-muted-foreground">{selectedDealer.name}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h3 className="font-medium">Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedDealer.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedDealer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedDealer.location_name}</span>
                  </div>
                </div>
              </div>

              <div className="h-[200px] w-full rounded-md overflow-hidden border">
                <MapWithNoSSR
                  position={[selectedDealer.latitude, selectedDealer.longitude]}
                  onPositionChange={() => {}}
                  zoom={13}
                />
              </div>

              <Button
                className="w-full"
                onClick={() => connectWithDealer(selectedDealer.dealer_id)}
                disabled={
                  shopkeeperInfo.dealer_id === selectedDealer.dealer_id || connectingId === selectedDealer.dealer_id
                }
              >
                {connectingId === selectedDealer.dealer_id ? (
                  "Connecting..."
                ) : shopkeeperInfo.dealer_id === selectedDealer.dealer_id ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Already Connected
                  </>
                ) : (
                  "Connect with this Dealer"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

