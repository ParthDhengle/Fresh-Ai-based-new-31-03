"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import {
  Store,
  LineChartIcon as ChartLine,
  ProjectorIcon as ProjectDiagram,
  FileText,
  Settings,
  PieChartIcon as ChartPie,
  ShoppingBag,
} from "lucide-react"

type DealerInfo = {
  name: string
  company: string
  shops: {
    id: number
    name: string
    location: string
    domain: string
  }[]
  stats: {
    totalShops: number
    totalProducts: number
    avgAccuracy: number
    lastPrediction: string
  }
}

export default function DealerLandingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [dealerInfo, setDealerInfo] = useState<DealerInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchDealerInfo = async () => {
      try {
        setIsLoading(true)
        setError("")

        // Get dealer ID from localStorage
        const dealerId = localStorage.getItem("dealerId")
        const dealerName = localStorage.getItem("dealerName")

        if (!dealerId) {
          router.push("/dealer/login")
          return
        }

        // In a real app, fetch data from API
        // const response = await fetch(`http://localhost:8000/dealer/${dealerId}`)
        // if (!response.ok) throw new Error('Failed to fetch dealer info')
        // const data = await response.json()

        // Mock data for demo
        const mockDealerInfo: DealerInfo = {
          name: dealerName || "John Doe",
          company: "Global Distribution Inc.",
          shops: [
            { id: 1, name: "Tech Haven", location: "Downtown", domain: "Electronics" },
            { id: 2, name: "Fashion Forward", location: "Uptown", domain: "Fashion" },
            { id: 3, name: "Grocery Plus", location: "Midtown", domain: "Grocery" },
          ],
          stats: {
            totalShops: 3,
            totalProducts: 120,
            avgAccuracy: 92.5,
            lastPrediction: "2023-06-15",
          },
        }

        setDealerInfo(mockDealerInfo)
      } catch (err) {
        console.error("Error fetching dealer info:", err)
        setError(err instanceof Error ? err.message : "Failed to load dealer information")

        toast({
          title: "Error",
          description: "Failed to load dealer information. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDealerInfo()
  }, [router, toast])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !dealerInfo) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Error Loading Dashboard</h1>
        <p className="text-muted-foreground mb-6">{error || "Failed to load dealer information"}</p>
        <Button onClick={() => router.push("/dealer/login")}>Return to Login</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 glass-card p-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome, {dealerInfo.name}</h1>
          <p className="text-muted-foreground">{dealerInfo.company}</p>
        </div>
        <Button asChild className="mt-4 md:mt-0">
          <Link href="/inventory">
            <ChartLine className="w-4 h-4 mr-2" /> Predict Inventory
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card>
          <CardHeader className="gradient-bg text-white">
            <CardTitle className="flex justify-between items-center">
              <span>Dashboard Overview</span>
              <ChartPie className="w-5 h-5" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">{dealerInfo.stats.totalShops}</div>
                <div className="text-sm text-muted-foreground">Connected Shops</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">{dealerInfo.stats.totalProducts}</div>
                <div className="text-sm text-muted-foreground">Total Products</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">{dealerInfo.stats.avgAccuracy}%</div>
                <div className="text-sm text-muted-foreground">Prediction Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">{dealerInfo.stats.lastPrediction}</div>
                <div className="text-sm text-muted-foreground">Last Prediction</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="gradient-bg text-white">
            <CardTitle className="flex justify-between items-center">
              <span>Your Shops</span>
              <Button variant="secondary" size="sm">
                <Store className="w-4 h-4 mr-2" /> Add Shop
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="divide-y">
              {dealerInfo.shops.map((shop) => (
                <div key={shop.id} className="flex justify-between items-center py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white mr-4">
                      {shop.domain === "Electronics" ? (
                        <Store className="w-5 h-5" />
                      ) : shop.domain === "Fashion" ? (
                        <ShoppingBag className="w-5 h-5" />
                      ) : (
                        <Store className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium">{shop.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {shop.location} • {shop.domain}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/inventory">View Inventory</Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                href="/inventory"
                className="glass-card p-6 text-center flex flex-col items-center hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-white mb-3">
                  <ChartLine className="w-6 h-6" />
                </div>
                <span>Predict Demand</span>
              </Link>

              <Link
                href="/workflow"
                className="glass-card p-6 text-center flex flex-col items-center hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-white mb-3">
                  <ProjectDiagram className="w-6 h-6" />
                </div>
                <span>View Workflow</span>
              </Link>

              <Link
                href="/dealer/inventory"
                className="glass-card p-6 text-center flex flex-col items-center hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-white mb-3">
                  <FileText className="w-6 h-6" />
                </div>
                <span>Upload Data</span>
              </Link>

              <Link
                href="/dealer/settings"
                className="glass-card p-6 text-center flex flex-col items-center hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-white mb-3">
                  <Settings className="w-6 h-6" />
                </div>
                <span>Settings</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

