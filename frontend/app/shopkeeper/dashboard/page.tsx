"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, ShoppingBag, Users, DollarSign, Package, ArrowUp, ArrowDown, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"
import { Line, Bar, Doughnut } from "react-chartjs-2"

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
)

type DashboardStats = {
  totalSales: number
  salesGrowth: number
  totalOrders: number
  ordersGrowth: number
  totalCustomers: number
  customersGrowth: number
  averageOrderValue: number
  aovGrowth: number
}

type ChartData = {
  labels: string[]
  data: number[]
}

type DashboardData = {
  stats: DashboardStats
  salesData: {
    week: ChartData
    month: ChartData
    year: ChartData
  }
  top_products: {
    name: string
    percentage: number
  }[]
  ordersByDay: ChartData
}

export default function ShopkeeperDashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("week")
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchDashboardData = async () => {
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
        // const response = await fetch(`http://localhost:8000/shopkeeper/dashboard?shopkeeper_id=${shopkeeperId}`)
        // if (!response.ok) throw new Error('Failed to fetch dashboard data')
        // const data = await response.json()

        // Mock data for demo
        const weekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        const monthLabels = Array.from({ length: 30 }, (_, i) => `${i + 1}`)
        const yearLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

        const mockData: DashboardData = {
          stats: {
            totalSales: 12580,
            salesGrowth: 12.5,
            totalOrders: 156,
            ordersGrowth: 8.3,
            totalCustomers: 78,
            customersGrowth: 15.2,
            averageOrderValue: 80.64,
            aovGrowth: 5.7,
          },
          salesData: {
            week: {
              labels: weekLabels,
              data: [1200, 1900, 1500, 2100, 1800, 2500, 1650],
            },
            month: {
              labels: monthLabels,
              data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 1000) + 500),
            },
            year: {
              labels: yearLabels,
              data: [8500, 9200, 11000, 10500, 9800, 12500, 14000, 13200, 12800, 13500, 14800, 15600],
            },
          },
          top_products: [
            { name: "Product A", percentage: 35 },
            { name: "Product B", percentage: 25 },
            { name: "Product C", percentage: 20 },
            { name: "Product D", percentage: 15 },
            { name: "Others", percentage: 5 },
          ],
          ordersByDay: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            data: [18, 24, 20, 25, 30, 22, 17],
          },
        }

        setDashboardData(mockData)
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setError(err instanceof Error ? err.message : "Failed to load dashboard data")

        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [router, toast])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !dashboardData) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Error Loading Dashboard</h1>
        <p className="text-muted-foreground mb-6">{error || "Failed to load dashboard data"}</p>
        <button className="px-4 py-2 bg-primary text-white rounded-md" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    )
  }

  // Chart data and options
  const salesChartData = {
    labels: dashboardData.salesData[timeRange].labels,
    datasets: [
      {
        label: "Sales ($)",
        data: dashboardData.salesData[timeRange].data,
        borderColor: "hsl(var(--primary))",
        backgroundColor: "hsla(var(--primary), 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "hsl(var(--primary))",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  }

  const topProductsChartData = {
    labels: dashboardData.top_products.map((product) => product.name),
    datasets: [
      {
        data: dashboardData.top_products.map((product) => product.percentage),
        backgroundColor: [
          "hsla(var(--primary), 1)",
          "hsla(var(--secondary), 1)",
          "hsla(var(--primary), 0.8)",
          "hsla(var(--secondary), 0.8)",
          "hsla(var(--primary), 0.6)",
        ],
        borderWidth: 0,
      },
    ],
  }

  const ordersByDayChartData = {
    labels: dashboardData.ordersByDay.labels,
    datasets: [
      {
        label: "Orders",
        data: dashboardData.ordersByDay.data,
        backgroundColor: "hsla(var(--secondary), 0.7)",
        borderRadius: 6,
      },
    ],
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Sales Dashboard</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Track your shop's performance and sales analytics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div
                className={`flex items-center ${dashboardData.stats.salesGrowth >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                {dashboardData.stats.salesGrowth >= 0 ? (
                  <ArrowUp className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowDown className="w-4 h-4 mr-1" />
                )}
                <span>{Math.abs(dashboardData.stats.salesGrowth)}%</span>
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-sm font-medium text-muted-foreground">Total Sales</h3>
              <div className="text-2xl font-bold">${dashboardData.stats.totalSales.toLocaleString()}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div
                className={`flex items-center ${dashboardData.stats.ordersGrowth >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                {dashboardData.stats.ordersGrowth >= 0 ? (
                  <ArrowUp className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowDown className="w-4 h-4 mr-1" />
                )}
                <span>{Math.abs(dashboardData.stats.ordersGrowth)}%</span>
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-sm font-medium text-muted-foreground">Total Orders</h3>
              <div className="text-2xl font-bold">{dashboardData.stats.totalOrders}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div
                className={`flex items-center ${dashboardData.stats.customersGrowth >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                {dashboardData.stats.customersGrowth >= 0 ? (
                  <ArrowUp className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowDown className="w-4 h-4 mr-1" />
                )}
                <span>{Math.abs(dashboardData.stats.customersGrowth)}%</span>
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-sm font-medium text-muted-foreground">Total Customers</h3>
              <div className="text-2xl font-bold">{dashboardData.stats.totalCustomers}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div
                className={`flex items-center ${dashboardData.stats.aovGrowth >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                {dashboardData.stats.aovGrowth >= 0 ? (
                  <ArrowUp className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowDown className="w-4 h-4 mr-1" />
                )}
                <span>{Math.abs(dashboardData.stats.aovGrowth)}%</span>
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-sm font-medium text-muted-foreground">Average Order Value</h3>
              <div className="text-2xl font-bold">${dashboardData.stats.averageOrderValue.toFixed(2)}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row justify-between items-center pb-2">
            <CardTitle>Sales Trend</CardTitle>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setTimeRange("week")}
                className={`px-3 py-1 text-sm rounded-md ${
                  timeRange === "week" ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setTimeRange("month")}
                className={`px-3 py-1 text-sm rounded-md ${
                  timeRange === "month" ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setTimeRange("year")}
                className={`px-3 py-1 text-sm rounded-md ${
                  timeRange === "year" ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                Year
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <Line
                data={salesChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                    tooltip: {
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      padding: 10,
                      displayColors: false,
                      callbacks: {
                        label: (context) => `$${context.raw}`,
                      },
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => `$${value}`,
                      },
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <span>Top Products</span>
              <Package className="w-5 h-5 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] flex items-center justify-center">
              <Doughnut
                data={topProductsChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => `${context.raw}% of sales`,
                      },
                    },
                  },
                  cutout: "60%",
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <span>Orders by Day</span>
            <Calendar className="w-5 h-5 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <Bar
              data={ordersByDayChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                },
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

