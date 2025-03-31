import Link from "next/link"
import { Building, Store, BarChartIcon as ChartBar, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Landing() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)]">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-background to-muted/30"></div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4 gradient-text md:text-6xl">SupplyConnect</h1>
          <h2 className="text-3xl font-semibold mb-6">Intelligent Inventory Management</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Predict product demand with machine learning to optimize your supply chain
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/inventory">Explore Inventory</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/workflow">View Workflow</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 relative">
            Our Features
            <span className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-20 h-1 gradient-bg rounded"></span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="glass-card p-6 transition-all hover:translate-y-[-5px] hover:shadow-xl">
              <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center mb-4 mx-auto">
                <ChartBar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Demand Prediction</h3>
              <p className="text-muted-foreground text-center">
                Use machine learning to accurately predict product demand
              </p>
            </div>

            <div className="glass-card p-6 transition-all hover:translate-y-[-5px] hover:shadow-xl">
              <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center mb-4 mx-auto">
                <Store className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Multi-Shop Management</h3>
              <p className="text-muted-foreground text-center">Manage multiple shops from a single dashboard</p>
            </div>

            <div className="glass-card p-6 transition-all hover:translate-y-[-5px] hover:shadow-xl">
              <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center mb-4 mx-auto">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">CSV Import</h3>
              <p className="text-muted-foreground text-center">Easily import your inventory data using CSV files</p>
            </div>

            <div className="glass-card p-6 transition-all hover:translate-y-[-5px] hover:shadow-xl">
              <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center mb-4 mx-auto">
                <ChartBar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Visual Analytics</h3>
              <p className="text-muted-foreground text-center">View demand forecasts with interactive visualizations</p>
            </div>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 relative">
            Who Can Benefit
            <span className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-20 h-1 gradient-bg rounded"></span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="glass-card p-8 text-center">
              <div className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center mb-4 mx-auto">
                <Building className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Dealers</h3>
              <ul className="text-left mb-6 space-y-2">
                <li className="flex items-start">
                  <span className="mr-2 mt-0.5 text-primary">•</span>
                  <span>Manage multiple shops</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-0.5 text-primary">•</span>
                  <span>Analyze demand across locations</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-0.5 text-primary">•</span>
                  <span>Optimize distribution networks</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-0.5 text-primary">•</span>
                  <span>Improve supply chain efficiency</span>
                </li>
              </ul>
              <Button className="w-full" asChild>
                <Link href="/dealer/signup">Join as Dealer</Link>
              </Button>
            </div>

            <div className="glass-card p-8 text-center">
              <div className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center mb-4 mx-auto">
                <Store className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Shopkeepers</h3>
              <ul className="text-left mb-6 space-y-2">
                <li className="flex items-start">
                  <span className="mr-2 mt-0.5 text-primary">•</span>
                  <span>Predict product demand</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-0.5 text-primary">•</span>
                  <span>Reduce stockouts and overstock</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-0.5 text-primary">•</span>
                  <span>Improve inventory turnover</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-0.5 text-primary">•</span>
                  <span>Increase customer satisfaction</span>
                </li>
              </ul>
              <Button className="w-full" asChild>
                <Link href="/shopkeeper/signup">Join as Shopkeeper</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 gradient-bg mt-auto">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to optimize your inventory?</h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Get started with SupplyConnect today and transform your supply chain with intelligent demand prediction.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/inventory">Try Inventory Prediction</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent text-white border-white hover:bg-white/10"
              asChild
            >
              <Link href="/dealer/signup">Create Account</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

