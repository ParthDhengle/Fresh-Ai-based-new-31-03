import { ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function WorkflowPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">How SupplyConnect Works</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Our AI-powered platform makes inventory management and demand prediction simple
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="relative">
          {/* Vertical line connecting steps */}
          <div className="absolute left-[50px] top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-secondary rounded-full hidden md:block"></div>

          {/* Step 1 */}
          <div className="flex flex-col md:flex-row gap-6 mb-12 relative">
            <div className="md:w-[100px] flex flex-row md:flex-col items-center">
              <div className="w-14 h-14 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-xl z-10">
                1
              </div>
              <div className="md:hidden flex-1 h-1 bg-gradient-to-r from-primary to-secondary ml-4"></div>
            </div>
            <Card className="flex-1">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-3">Upload Data</h2>
                <p className="text-muted-foreground mb-4">
                  Import your historical inventory data using CSV files. Include fields like historical sales, promotion
                  status, day of week, month, product ID, and past demand.
                </p>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-mono">
                    Required CSV columns: Historical_Sales, Promotion, Day_of_Week, Month, Product_ID, Demand
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col md:flex-row gap-6 mb-12 relative">
            <div className="md:w-[100px] flex flex-row md:flex-col items-center">
              <div className="w-14 h-14 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-xl z-10">
                2
              </div>
              <div className="md:hidden flex-1 h-1 bg-gradient-to-r from-primary to-secondary ml-4"></div>
            </div>
            <Card className="flex-1">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-3">AI Analysis</h2>
                <p className="text-muted-foreground mb-4">
                  Our machine learning models analyze your historical data to identify patterns and trends. The system
                  uses Random Forest algorithms to process multiple variables and establish relationships.
                </p>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm">
                    <span className="font-semibold">Features considered:</span> Seasonal patterns, promotional impact,
                    day-of-week variations, product relationships, and more.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col md:flex-row gap-6 mb-12 relative">
            <div className="md:w-[100px] flex flex-row md:flex-col items-center">
              <div className="w-14 h-14 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-xl z-10">
                3
              </div>
              <div className="md:hidden flex-1 h-1 bg-gradient-to-r from-primary to-secondary ml-4"></div>
            </div>
            <Card className="flex-1">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-3">Get Predictions</h2>
                <p className="text-muted-foreground mb-4">
                  Receive accurate demand forecasts for your products. The system generates predictions showing expected
                  demand for each item, ranked by priority.
                </p>
                <div className="flex items-center justify-center">
                  <div className="p-4 bg-muted rounded-lg w-full max-w-sm">
                    <div className="flex justify-between pb-2 border-b mb-2">
                      <span className="font-semibold">Product</span>
                      <span className="font-semibold">Predicted Demand</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Product A</span>
                      <span>245 units</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Product B</span>
                      <span>183 units</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Product C</span>
                      <span>129 units</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col md:flex-row gap-6 relative">
            <div className="md:w-[100px] flex flex-row md:flex-col items-center">
              <div className="w-14 h-14 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-xl z-10">
                4
              </div>
              <div className="md:hidden flex-1 h-1 bg-gradient-to-r from-primary to-secondary ml-4"></div>
            </div>
            <Card className="flex-1">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-3">Optimize Inventory</h2>
                <p className="text-muted-foreground mb-4">
                  Make data-driven decisions to optimize your supply chain. Use prediction insights to adjust inventory
                  levels, plan promotions, and ensure you have the right products in stock.
                </p>
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <span>Benefits: Reduced stockouts, minimized excess inventory, increased sales</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

