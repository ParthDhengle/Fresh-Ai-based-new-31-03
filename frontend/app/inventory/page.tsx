"use client"

import { useState } from "react"
import { Store, BarChart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import FileUpload from "@/components/file-upload"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import { Bar } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

type PredictionType = {
  product_name: string
  product_id: string
  predicted_demand: number
}

type ShopDataType = {
  fileSelected: File | null
  predictions: PredictionType[]
  isLoading: boolean
  fileName: string
}

export default function InventoryPage() {
  const { toast } = useToast()
  const [shopData, setShopData] = useState<Record<number, ShopDataType>>({
    0: { fileSelected: null, predictions: [], isLoading: false, fileName: "" },
    1: { fileSelected: null, predictions: [], isLoading: false, fileName: "" },
    2: { fileSelected: null, predictions: [], isLoading: false, fileName: "" },
    3: { fileSelected: null, predictions: [], isLoading: false, fileName: "" },
    4: { fileSelected: null, predictions: [], isLoading: false, fileName: "" },
    5: { fileSelected: null, predictions: [], isLoading: false, fileName: "" },
  })

  const [currentTab, setCurrentTab] = useState("0")

  const [chartData, setChartData] = useState({
    labels: ["Shop 1", "Shop 2", "Shop 3", "Shop 4", "Shop 5", "Shop 6"],
    datasets: [
      {
        label: "Average Predicted Demand",
        data: [0, 0, 0, 0, 0, 0],
        backgroundColor: [
          "rgba(106, 17, 203, 0.7)",
          "rgba(37, 117, 252, 0.7)",
          "rgba(142, 45, 226, 0.7)",
          "rgba(74, 0, 224, 0.7)",
          "rgba(116, 55, 245, 0.7)",
          "rgba(89, 0, 255, 0.7)",
        ],
        borderColor: "rgba(255, 255, 255, 0.3)",
        borderWidth: 2,
      },
    ],
  })

  const handleFileChange = (file: File | null, shopIndex: number) => {
    if (!file) {
      return
    }

    setShopData((prev) => ({
      ...prev,
      [shopIndex]: {
        ...prev[shopIndex],
        fileSelected: file,
        predictions: [],
        fileName: file.name,
      },
    }))

    toast({
      title: "File selected",
      description: `${file.name} has been selected for Shop ${shopIndex + 1}`,
    })
  }

  const handlePredict = async (shopIndex: number) => {
    const file = shopData[shopIndex].fileSelected

    if (!file) {
      toast({
        title: "No file selected",
        description: `Please select a CSV file for Shop ${shopIndex + 1}`,
        variant: "destructive",
      })
      return
    }

    setShopData((prev) => ({
      ...prev,
      [shopIndex]: {
        ...prev[shopIndex],
        isLoading: true,
      },
    }))

    const formData = new FormData()
    formData.append("file", file)

    try {
      // In a real app, this would be an actual API call
      // const response = await fetch('http://localhost:8000/inventory/predict', {
      //   method: 'POST',
      //   body: formData
      // })
      // const data = await response.json()

      // Mocking API response
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const mockPredictions = [
        { product_id: "1", product_name: "Product 1", predicted_demand: 120 + Math.random() * 50 },
        { product_id: "2", product_name: "Product 2", predicted_demand: 100 + Math.random() * 40 },
        { product_id: "3", product_name: "Product 3", predicted_demand: 85 + Math.random() * 30 },
        { product_id: "4", product_name: "Product 4", predicted_demand: 70 + Math.random() * 25 },
        { product_id: "5", product_name: "Product 5", predicted_demand: 55 + Math.random() * 20 },
      ]

      // Update shop data with predictions
      setShopData((prev) => ({
        ...prev,
        [shopIndex]: {
          ...prev[shopIndex],
          predictions: mockPredictions,
          isLoading: false,
        },
      }))

      // Update chart data
      const avgPrediction = mockPredictions.reduce((sum, p) => sum + p.predicted_demand, 0) / mockPredictions.length

      const newChartData = { ...chartData }
      newChartData.datasets[0].data[shopIndex] = avgPrediction
      setChartData(newChartData)

      toast({
        title: "Prediction Complete",
        description: `Demand predictions generated for Shop ${shopIndex + 1}`,
      })
    } catch (error) {
      console.error("Prediction error:", error)
      toast({
        title: "Prediction Failed",
        description: "There was an error generating predictions. Please try again.",
        variant: "destructive",
      })

      setShopData((prev) => ({
        ...prev,
        [shopIndex]: {
          ...prev[shopIndex],
          isLoading: false,
        },
      }))
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Inventory Prediction Dashboard</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Upload CSV files for each shop to predict product demand using machine learning
        </p>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="mb-12">
        <TabsList className="w-full max-w-md mx-auto grid grid-cols-3 mb-8">
          <TabsTrigger value="0">Shop 1-2</TabsTrigger>
          <TabsTrigger value="1">Shop 3-4</TabsTrigger>
          <TabsTrigger value="2">Shop 5-6</TabsTrigger>
        </TabsList>

        {[0, 1, 2].map((tabIndex) => (
          <TabsContent key={tabIndex} value={tabIndex.toString()} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[tabIndex * 2, tabIndex * 2 + 1].map((shopIndex) => (
                <Card key={shopIndex} className="overflow-hidden">
                  <CardHeader className="gradient-bg">
                    <CardTitle className="flex justify-between items-center text-white">
                      <span>Shop {shopIndex + 1}</span>
                      <Store className="w-6 h-6" />
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-6">
                    <FileUpload
                      onFileChange={(file) => handleFileChange(file, shopIndex)}
                      accept=".csv"
                      fileName={shopData[shopIndex].fileName}
                    />

                    <Button
                      className="w-full mt-4"
                      onClick={() => handlePredict(shopIndex)}
                      disabled={!shopData[shopIndex].fileSelected || shopData[shopIndex].isLoading}
                    >
                      {shopData[shopIndex].isLoading ? (
                        <>Processing...</>
                      ) : (
                        <>
                          <BarChart className="w-4 h-4 mr-2" />
                          Predict Demand
                        </>
                      )}
                    </Button>

                    {shopData[shopIndex].predictions.length > 0 && (
                      <div className="mt-6 border rounded-lg p-4">
                        <h4 className="font-medium text-center mb-3">Top Products by Demand</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left p-2">Product</th>
                                <th className="text-right p-2">Predicted Demand</th>
                              </tr>
                            </thead>
                            <tbody>
                              {shopData[shopIndex].predictions.map((pred, idx) => (
                                <tr key={idx} className="border-b last:border-0">
                                  <td className="p-2">{pred.product_name}</td>
                                  <td className="p-2 text-right">{pred.predicted_demand.toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <Card className="p-6">
        <CardHeader>
          <CardTitle className="text-center">Comparative Demand Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <Bar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  title: {
                    display: true,
                    text: "Average Predicted Demand by Shop",
                    font: {
                      size: 16,
                    },
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
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

