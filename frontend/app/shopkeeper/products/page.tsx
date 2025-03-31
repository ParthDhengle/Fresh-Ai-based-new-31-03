"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Edit, Check, Package, Plus, Search, ArrowUpDown } from "lucide-react"

type ProductType = {
  id: string
  name: string
  category: string
  stock: number
  predicted_demand: number
  price: number
  status: "In Stock" | "Low Stock" | "Out of Stock"
}

export default function ShopkeeperProductsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [products, setProducts] = useState<ProductType[]>([])
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<Partial<ProductType>>({})
  const [error, setError] = useState('')
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        setError('')
        
        // Check if user is logged in
        const shopkeeperId = localStorage.getItem('shopkeeperId')
        if (!shopkeeperId) {
          router.push('/shopkeeper/login')
          return
        }
        
        // In a real app, fetch products from API
        // const response = await fetch(`http://localhost:8000/shopkeeper/${shopkeeperId}/products`)
        // if (!response.ok) throw new Error('Failed to fetch products')
        // const data = await response.json()
        
        // Mock data for demo
        const mockProducts: ProductType[] = [
          {
            id: '1',
            name: 'Premium Smartphone',
            category: 'Electronics',
            stock: 24,
            predicted_demand: 35,
            price: 899.99,
            status: 'Low Stock',
          },
          {
            id: '2',
            name: 'Wireless Earbuds',
            category: 'Electronics',
            stock: 45,
            predicted_demand: 30,
            price: 129.99,
            status: 'In Stock',
          },
          {
            id: '3',
            name: 'Smart Watch',
            category: 'Electronics',
            stock: 18,
            predicted_demand: 25,
            price: 249.99,
            status: 'Low Stock',
          },
          {
            id: '4',
            name: 'Laptop Pro',
            category: 'Electronics',
            stock: 12,
            predicted_demand: 15,
            price: 1299.99,
            status: 'Low Stock',
          },
          {
            id: '5',
            name: 'Bluetooth Speaker',
            category: 'Electronics',
            stock: 30,
            predicted_demand: 20,
            price: 79.99,
            status: 'In Stock',
          },
          {
            id: '6',
            name: 'Gaming Console',
            category: 'Electronics',
            stock: 0,
            predicted_demand: 40,
            price: 499.99,
            status: 'Out of Stock',
          },
          {
            id: '7',
            name: 'Wireless Charger',
            category: 'Electronics',
            stock: 50,
            predicted_demand: 35,
            price: 39.99,
            status: 'In Stock',
          },
        ]
        
        setProducts(mockProducts)
        setFilteredProducts(mockProducts)
      } catch (err) {
        console.error('Error fetching products:', err)
        setError(err instanceof Error ? err.message : 'Failed to load products')
        
        toast({
          title: 'Error',
          description: 'Failed to load products. Please try again.',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchProducts()
  }, [router, toast])
  
  useEffect(() => {
    // Filter products based on search term
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredProducts(filtered)
  }, [searchTerm, products])
  
  const handleEditClick = (product: ProductType) => {
    setEditingProduct(product.id)
    setEditValues({
      name: product.name,
      category: product.category,
      stock: product.stock,
      price: product.price,
    })
  }
  
  const handleEditChange = (field: keyof ProductType, value: any) => {
    setEditValues(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  const handleSaveEdit = async (productId: string) => {
    try {
      // In a real app, save changes to API
      // const response = await fetch(`http://localhost:8000/shopkeeper/products/${productId}`, {
      //   method: 'PATCH',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(editValues),
      // })
      // 
      // if (!response.ok) throw new Error('Failed to update product')
      // const data = await response.json()
      
      // Update product in state
      setProducts(prev => prev.map(p => {
        if (p.id === productId) {
          // Calculate new status based on stock and predicted demand
          let newStatus: 'In Stock' | 'Low Stock' | 'Out of Stock' = 'In Stock'
          
          const newStock = Number(editValues.stock ?? p.stock)
          if (newStock === 0) {
            newStatus = 'Out of Stock'
          } else if (newStock < p.predicted_demand * 0.8) {
            newStatus = 'Low Stock'
          }
          
          return { 
            ...p, 
            ...editValues,
            status: newStatus
          }
        }
        return p
      }))
      
      setEditingProduct(null)
      setEditValues({})
      
      toast({
        title: 'Success',
        description: 'Product updated successfully',
      })
    } catch (error) {
      console.error('Error updating product:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update product',
        variant: 'destructive',
      })
    }
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
        <h1 className="text-2xl font-bold mb-4">Error Loading Products</h1>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Product Management</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Manage your inventory and respond to demand predictions
        </p>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center">
            <Package className="mr-2 h-5 w-5" />
            <span>Products</span>
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="w-64 pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Current Stock</TableHead>
                  <TableHead className="text-right">
                    <div className="flex items-center justify-end">
                      Predicted Demand
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      {editingProduct === product.id ? (
                        <Input
                          value={editValues.name}
                          onChange={(e) => handleEditChange('name', e.target.value)}
                          className="w-full"
                        />
                      ) : (
                        product.name
                      )}
                    </TableCell>
                    <TableCell>
                      {editingProduct === product.id ? (
                        <Input
                          value={editValues.category}
                          onChange={(e) => handleEditChange('category', e.target.value)}
                          className="w-full"
                        />
                      ) : (
                        product.category
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {editingProduct === product.id ? (
                        <Input
                          type="number"
                          value={editValues.stock}
                          onChange={(e) => handleEditChange('stock', Number.parseInt(e.target.value))}
                          className="w-24 ml-auto"
                        />
                      ) : (
                        product.stock
                      )}
                    </TableCell>
                    <TableCell className="text-right">{product.predicted_demand}</TableCell>
                    <TableCell className="text-right">
                      {editingProduct === product.id ? (
                        <Input
                          type="number"
                          value={editValues.price}
                          onChange={(e) => handleEditChange('price', Number.parseFloat(e.target.value))}
                          className="w-24 ml-auto"
                          step="0.01"
                        />
                      ) : (
                        `$${product.price.toFixed(2)}`
                      )}
                    </TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        product.status === 'In Stock' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                          : product.status === 'Low Stock' 
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      }`}>
                        {product.status}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {editingProduct === product.id ? (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleSaveEdit(product.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditClick(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredProducts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No products found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {products.some(p => p.status === 'Low Stock' || p.status === 'Out of Stock') && (
            <div className="mt-6 p-4 rounded-md bg-muted">
              <h3 className="font-medium mb-2">Inventory Alert</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Some products have low stock levels compared to predicted demand. Consider restocking the following items:
              </p>
              <ul className="space-y-1 text-sm">
                {products
                  .filter(p => p.status === 'Low Stock' || p.status === 'Out of Stock')
                  .map(p => (
                    <li key={p.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          p.status === 'Out of Stock' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}></div>
                        <span>{p.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span>Current: {p.stock}</span>
                        <span>Predicted Demand: {p.predicted_demand}</span>
                        <span className="font-medium">{p.predicted_demand - p.stock > 0 ? `Need: ${

