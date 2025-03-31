"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Sun, Moon, Home, ChevronDown, LogOut, Package2, PackageCheck, Store } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useToast } from "@/hooks/use-toast"

type NavLink = {
  title: string
  href: string
  children?: {
    title: string
    href: string
  }[]
}

export default function Navbar() {
  const pathname = usePathname()
  const { setTheme, theme } = useTheme()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userType, setUserType] = useState<"dealer" | "shopkeeper" | "">("")

  useEffect(() => {
    // Check if user is logged in based on localStorage
    const dealerId = localStorage.getItem("dealerId")
    const shopkeeperId = localStorage.getItem("shopkeeperId")

    if (dealerId) {
      setIsLoggedIn(true)
      setUserType("dealer")
    } else if (shopkeeperId) {
      setIsLoggedIn(true)
      setUserType("shopkeeper")
    } else {
      setIsLoggedIn(false)
      setUserType("")
    }
  }, [pathname])

  const handleLogout = () => {
    localStorage.removeItem("dealerId")
    localStorage.removeItem("shopkeeperId")
    setIsLoggedIn(false)
    setUserType("")

    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    })

    window.location.href = "/"
  }

  const dealerLinks: NavLink[] = [
    { title: "Dashboard", href: "/dealer/landing" },
    { title: "Connections", href: "/dealer/connections" },
    { title: "Inventory", href: "/inventory" },
  ]

  const shopkeeperLinks: NavLink[] = [
    { title: "Dashboard", href: "/shopkeeper/landing" },
    { title: "Find Dealers", href: "/shopkeeper/find-dealers" },
    { title: "Products", href: "/shopkeeper/products" },
    { title: "Sales", href: "/shopkeeper/dashboard" },
  ]

  const visitorLinks: NavLink[] = [
    { title: "How It Works", href: "/workflow" },
    {
      title: "Login",
      href: "#",
      children: [
        { title: "Dealer Login", href: "/dealer/login" },
        { title: "Shopkeeper Login", href: "/shopkeeper/login" },
      ],
    },
    {
      title: "Sign Up",
      href: "#",
      children: [
        { title: "Dealer Sign Up", href: "/dealer/signup" },
        { title: "Shopkeeper Sign Up", href: "/shopkeeper/signup" },
      ],
    },
  ]

  // Get appropriate nav links based on user type
  const navLinks = userType === "dealer" ? dealerLinks : userType === "shopkeeper" ? shopkeeperLinks : visitorLinks

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <div className="flex">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <Package2 className="h-6 w-6 text-primary" />
              <span>SupplyConnect</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/" ? "text-primary" : "text-muted-foreground",
              )}
            >
              Home
            </Link>

            {navLinks.map((link) => {
              if (link.children) {
                return (
                  <div key={link.title} className="relative group">
                    <button
                      className={cn(
                        "flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary",
                        pathname.includes(link.href) ? "text-primary" : "text-muted-foreground",
                      )}
                    >
                      {link.title}
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <div className="absolute left-0 top-full hidden pt-2 group-hover:block">
                      <div className="rounded-md border bg-background p-2 shadow-md">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block rounded-sm px-3 py-2 text-sm hover:bg-muted"
                          >
                            {child.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === link.href ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {link.title}
                </Link>
              )
            })}

            {isLoggedIn && (
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            )}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle Theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle Theme</span>
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="px-0">
                <div className="flex flex-col space-y-4 px-6">
                  <div className="flex items-center justify-between border-b pb-4">
                    <Link href="/" className="flex items-center gap-2 font-bold" onClick={() => setIsOpen(false)}>
                      <Package2 className="h-6 w-6 text-primary" />
                      <span>SupplyConnect</span>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                      <X className="h-5 w-5" />
                      <span className="sr-only">Close</span>
                    </Button>
                  </div>

                  <Link
                    href="/"
                    className={cn(
                      "flex items-center py-2",
                      pathname === "/" ? "text-primary" : "text-muted-foreground",
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <Home className="mr-2 h-4 w-4" />
                    <span>Home</span>
                  </Link>

                  {navLinks.map((link, index) => {
                    if (link.children) {
                      return (
                        <div key={index} className="py-2">
                          <p className="mb-1 font-medium">{link.title}</p>
                          <div className="ml-4 flex flex-col space-y-2 border-l pl-4">
                            {link.children.map((child, childIndex) => (
                              <Link
                                key={childIndex}
                                href={child.href}
                                className={cn(
                                  "text-muted-foreground hover:text-primary",
                                  pathname === child.href && "text-primary",
                                )}
                                onClick={() => setIsOpen(false)}
                              >
                                {child.title}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )
                    }

                    return (
                      <Link
                        key={index}
                        href={link.href}
                        className={cn(
                          "flex items-center py-2",
                          pathname === link.href ? "text-primary" : "text-muted-foreground",
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        {link.title === "Dashboard" && <PackageCheck className="mr-2 h-4 w-4" />}
                        {link.title === "Inventory" && <Package2 className="mr-2 h-4 w-4" />}
                        {link.title === "Connections" && <Store className="mr-2 h-4 w-4" />}
                        {link.title === "Find Dealers" && <Store className="mr-2 h-4 w-4" />}
                        {link.title === "Products" && <Package2 className="mr-2 h-4 w-4" />}
                        {link.title === "Sales" && <PackageCheck className="mr-2 h-4 w-4" />}
                        {link.title === "How It Works" && <PackageCheck className="mr-2 h-4 w-4" />}
                        <span>{link.title}</span>
                      </Link>
                    )
                  })}

                  {isLoggedIn && (
                    <Button variant="ghost" className="justify-start px-2" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

