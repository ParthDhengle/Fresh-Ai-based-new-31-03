"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Store } from "lucide-react"

type ShopType = {
  shopkeeper_id: number
  name: string
  shop_name: string
  location_name: string
  domain: string
}

export default function DealerInventoryPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [shops, setShops] = useState<ShopType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setIsLoading(true)

        // Get dealer ID from localStorage
        const dealerId = localStorage.getItem("dealerId")

        if (!dealerId) {
          router.push("/dealer/login")
          return
        }

        // In a real app, fetch shops from API
        // const response = await fetch(`http://localhost:8000/dealer/${dealerId}/shops`)
        // if (!response.ok) throw new Error('Failed to fetch shops')
        // const data = await response.json()

        // Mock data for demo
        const mockShops: ShopType[] = [
          {
            shopkeeper_id: 1,
            name: "John Doe",
            shop_name: "JD Electronics",
            location_name: "Downtown",
            domain: "Electronics",
          },
          {
            shopkeeper_id: 2,
            name: "Jane Smith",
            shop_name: "Smith Groceries",
            location_name: "Uptown",
            domain: "Grocery",
          },
          {
            shopkeeper_id: 3,
            name: "Bob Johnson",
            shop_name: "Fashion Hub",
            location_name: "Midtown",
            domain: "Fashion",
          },
          {
            shopkeeper_id: 4,
            name: "Alice Brown",
            shop_name: "Tech World",
            location_name: "West End",
            domain: "Electronics",
          },
        ]

        setShops(mockShops)
      } catch (err) {
        console.error("Error fetching shops:", err)
        setError(err instanceof Error ? err.message : "Failed to load shops")

        toast({
          title: "Error",
          description: "Failed to load shops. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchShops()
  }, [router, toast])

  const handleViewInventory = (shopId: number) => {
    router.push(`/inventory`)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Error Loading Shops</h1>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Manage Your Shops</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          View and manage inventory predictions for all your connected shops
        </p>
      </div>

      {shops.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map((shop) => (
            <Card
              key={shop.shopkeeper_id}
              className="overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <CardHeader className="gradient-bg text-white">
                <CardTitle className="flex justify-between items-center">
                  <span>{shop.shop_name}</span>
                  <Store className="w-5 h-5" />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Owner</p>
                    <p>{shop.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p>{shop.location_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Domain</p>
                    <p>{shop.domain}</p>
                  </div>

                  <Button className="w-full mt-4" onClick={() => handleViewInventory(shop.shopkeeper_id)}>
                    View Inventory
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-12 glass-card max-w-md mx-auto">
          <Store className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">No Connected Shops</h2>
          <p className="text-muted-foreground mb-6">
            You don't have any connected shops yet. Add shops to start managing their inventory.
          </p>
          <Button>Add New Shop</Button>
        </div>
      )}
    </div>
  )
}

