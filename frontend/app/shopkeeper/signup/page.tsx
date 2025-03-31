"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { MapPin, Navigation } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import dynamic from "next/dynamic"

// Dynamically import Map component to avoid SSR issues
const MapComponent = dynamic(() => import("@/components/map-component"), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-muted animate-pulse rounded-md"></div>,
})

const shopkeeperFormSchema = z
  .object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    shop_name: z.string().min(2, {
      message: "Shop name must be at least 2 characters.",
    }),
    location_name: z.string().min(5, {
      message: "Location is required.",
    }),
    latitude: z.string().refine((val) => !isNaN(Number.parseFloat(val)), {
      message: "Latitude must be a valid number.",
    }),
    longitude: z.string().refine((val) => !isNaN(Number.parseFloat(val)), {
      message: "Longitude must be a valid number.",
    }),
    domain: z.string({
      required_error: "Please select a business domain.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string().min(8, {
      message: "Confirm password must be at least 8 characters.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type ShopkeeperFormValues = z.infer<typeof shopkeeperFormSchema>

export default function ShopkeeperSignupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [position, setPosition] = useState<[number, number]>([20.5937, 78.9629]) // Default center of India
  const [mapKey, setMapKey] = useState(Date.now())

  const form = useForm<ShopkeeperFormValues>({
    resolver: zodResolver(shopkeeperFormSchema),
    defaultValues: {
      name: "",
      email: "",
      shop_name: "",
      location_name: "",
      latitude: "",
      longitude: "",
      domain: "",
      password: "",
      confirmPassword: "",
    },
  })

  const handleMapClick = async (lat: number, lng: number) => {
    setPosition([lat, lng])

    // Reverse geocoding to get address
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      )
      const data = await response.json()

      form.setValue("location_name", data.display_name)
      form.setValue("latitude", lat.toString())
      form.setValue("longitude", lng.toString())
    } catch (error) {
      console.error("Error fetching location name:", error)

      // Set coordinates even if reverse geocoding fails
      form.setValue("location_name", `Latitude: ${lat}, Longitude: ${lng}`)
      form.setValue("latitude", lat.toString())
      form.setValue("longitude", lng.toString())
    }
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      })
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setPosition([latitude, longitude])

        // Reverse geocoding
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
          )
          const data = await response.json()

          form.setValue("location_name", data.display_name)
          form.setValue("latitude", latitude.toString())
          form.setValue("longitude", longitude.toString())
        } catch (error) {
          console.error("Error fetching location name:", error)

          // Set coordinates even if reverse geocoding fails
          form.setValue("location_name", `Latitude: ${latitude}, Longitude: ${longitude}`)
          form.setValue("latitude", latitude.toString())
          form.setValue("longitude", longitude.toString())
        }

        // Force map to rerender with new position
        setMapKey(Date.now())
      },
      (error) => {
        console.error("Error getting location:", error)
        toast({
          title: "Error",
          description: "Unable to get your current location. Please select manually on the map.",
          variant: "destructive",
        })
      },
    )
  }

  async function onSubmit(values: ShopkeeperFormValues) {
    setIsLoading(true)

    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...apiData } = values

      // Convert latitude and longitude to numbers
      const payload = {
        ...apiData,
        latitude: Number.parseFloat(apiData.latitude),
        longitude: Number.parseFloat(apiData.longitude),
      }

      // In a real app, this would be an actual API call
      // const response = await fetch('http://localhost:8000/shopkeeper/signup', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(payload),
      // })
      //
      // if (!response.ok) {
      //   const errorData = await response.json()
      //   throw new Error(errorData.detail || 'Signup failed')
      // }
      //
      // const data = await response.json()

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate successful response
      const mockData = {
        message: "Shopkeeper signup successful",
        shopkeeper_id: Math.floor(Math.random() * 1000).toString(),
      }

      // Store shopkeeper ID in localStorage
      localStorage.setItem("shopkeeperId", mockData.shopkeeper_id)
      localStorage.setItem("shopkeeperName", values.name)

      toast({
        title: "Success",
        description: "Your shopkeeper account has been created successfully.",
      })

      // Redirect to shopkeeper landing page
      router.push("/shopkeeper/dashboard")
    } catch (error) {
      console.error("Signup error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Signup failed. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Shopkeeper Signup</CardTitle>
          <CardDescription>
            Create a shopkeeper account to manage your inventory and connect with dealers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="jane@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="shop_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shop Name</FormLabel>
                    <FormControl>
                      <Input placeholder="My Shop" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Select on map or use current location" {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="rounded-md border overflow-hidden">
                <div className="bg-muted p-3 flex justify-end">
                  <Button type="button" variant="outline" size="sm" onClick={getCurrentLocation}>
                    <Navigation className="w-4 h-4 mr-2" />
                    Use Current Location
                  </Button>
                </div>
                <div className="h-[300px]">
                  <MapComponent position={position} onPositionChange={handleMapClick} key={mapKey} />
                </div>
                <div className="p-3 text-sm text-muted-foreground flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Click on the map to select your location
                </div>
              </div>

              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="domain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Domain</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a business domain" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Fashion">Fashion</SelectItem>
                        <SelectItem value="Grocery">Grocery</SelectItem>
                        <SelectItem value="Home">Home & Furniture</SelectItem>
                        <SelectItem value="Health">Health & Beauty</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Sign Up"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

