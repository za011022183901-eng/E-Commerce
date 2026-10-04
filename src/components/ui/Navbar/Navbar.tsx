"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// إضافة الأيقونات الجديدة هنا
import { ShoppingCart, UserIcon, HeartIcon, Loader2, ShoppingBag, LayoutGrid, Award, Menu, Moon, Sun, Search } from "lucide-react"
import { useContext, useState, useEffect } from "react"
import { cartContext } from "@/components/context/CartContext"
import { signOut, useSession } from "next-auth/react"

export default function Navbar() {
  const session = useSession()
  const pathname = usePathname()
  const { loading, cartData, wishlistData } = useContext(cartContext)

  const [showNavbar, setShowNavbar] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const shouldUseDark = localStorage.getItem("shopmart-theme") === "dark"
    setIsDark(shouldUseDark)
    document.documentElement.classList.toggle("dark", shouldUseDark)
  }, [])

  const toggleTheme = () => {
    const nextIsDark = !document.documentElement.classList.contains("dark")
    document.documentElement.classList.toggle("dark", nextIsDark)
    localStorage.setItem("shopmart-theme", nextIsDark ? "dark" : "light")
    setIsDark(nextIsDark)
  }

  const isAuthenticated = session.status === "authenticated"
  const userName = session.data?.user?.name?.split(" ")[0]

  // التحكم في إخفاء Navbar عند التمرير
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && !isHovering) {
        setShowNavbar(false)
      } else {
        setShowNavbar(true)
      }
      setLastScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY, isHovering])

  const guestButtonClass =
    "px-5 py-2.5 border border-green-500 text-green-500 rounded-lg font-medium hover:bg-green-500 hover:text-white transition-colors"
  const activeButtonClass = "px-5 py-2.5 bg-green-500 text-white rounded-lg font-medium"

  return (
    <nav
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`fixed top-0 left-0 w-full z-[1000] transition-transform duration-500 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      } py-4 max-[380px]:py-0 bg-gradient-to-r from-white via-gray-50 to-green-50 shadow-md border-b border-gray-200 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950 dark:border-slate-800`}
    >
      <div className="container mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4 px-3 sm:px-6">
        {/* ===== Logo + Mobile Icons ===== */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link href={"/"}>
            <div className="flex items-center gap-2 cursor-pointer">
              <ShoppingCart className="text-green-500 w-8 h-8" />
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-wide">ShopMart</h1>
            </div>
          </Link>

          {/* ===== Mobile Menu + Icons ===== */}
          <div className="flex items-center gap-3 sm:gap-5 md:hidden z-[9999] max-[380px]:grid max-[380px]:grid-cols-[repeat(3,2.5rem)] max-[380px]:grid-rows-[repeat(2,2.5rem)] max-[380px]:gap-1 max-[380px]:items-center">
            <div className="flex items-center gap-3 sm:gap-5 max-[380px]:contents">
            <button type="button" onClick={toggleTheme} aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"} title={isDark ? "Light mode" : "Dark mode"} className="grid h-11 w-11 place-items-center rounded-full border border-gray-200 bg-white/80 text-emerald-700 shadow-sm transition hover:scale-105 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:border-slate-700 dark:bg-slate-800 dark:text-amber-300 dark:hover:bg-slate-700 max-[380px]:col-start-2 max-[380px]:row-start-1 max-[380px]:h-10 max-[380px]:w-10">
              {isDark ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
            </button>
            {isAuthenticated ? (
              <>
                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger className="outline-0 relative z-[10001] flex items-center gap-2 max-[380px]:col-start-3 max-[380px]:row-start-1 max-[380px]:grid max-[380px]:h-10 max-[380px]:w-10 max-[380px]:place-items-center max-[380px]:rounded-full max-[380px]:border max-[380px]:border-gray-200 max-[380px]:bg-white/80 max-[380px]:shadow-sm dark:max-[380px]:border-slate-700 dark:max-[380px]:bg-slate-800">
                    <UserIcon className="w-7 h-7 text-gray-700 hover:text-green-500 transition" />
                    {(session?.data?.user?.name || userName) && (
                      <span className="hidden sm:inline text-base font-semibold text-gray-700">
                        {session?.data?.user?.name?.split(" ")[0] || userName}
                      </span>
                    )}
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="md:hidden z-[9999] relative">
                    <Link href="/profile">
                      <DropdownMenuItem>Profile</DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem onClick={() => signOut({ redirectTo: "/login" })}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Wishlist Icon */}
                <div className="relative max-[380px]:col-start-1 max-[380px]:row-start-2 max-[380px]:grid max-[380px]:h-10 max-[380px]:w-10 max-[380px]:place-items-center">
                  <Badge className="absolute -top-3 -right-5 bg-green-500 text-white h-6 w-6 flex items-center justify-center rounded-full text-xs">
                    {loading ? <Loader2 className="animate-spin text-black w-4 h-4" /> : wishlistData?.count || 0}
                  </Badge>
                  <Link href="/Wishlist">
                    <HeartIcon
                      className={`w-7 h-7 transition ${
                        wishlistData?.count! > 0
                          ? "text-red-500 fill-red-500"
                          : "text-gray-700 hover:text-green-500"
                      }`}
                    />
                  </Link>
                </div>

                {/* Cart Icon */}
                <div className="relative max-[380px]:col-start-2 max-[380px]:row-start-2 max-[380px]:grid max-[380px]:h-10 max-[380px]:w-10 max-[380px]:place-items-center">
                  <Badge className="absolute -top-3 -right-5 bg-green-500 text-white h-6 w-6 flex items-center justify-center rounded-full text-xs">
                    {loading ? <Loader2 className="animate-spin text-black w-4 h-4" /> : cartData?.numOfCartItems || 0}
                  </Badge>
                  <Link href="/card">
                    <ShoppingCart
                      className={`w-7 h-7 transition ${
                      (cartData?.numOfCartItems ?? 0) > 0 ? "text-green-500 fill-green-500" : "text-gray-700 hover:text-green-500"
                      }`}
                    />
                  </Link>
                </div>
              </>
            ) : session.status === "loading" ? (
              <span aria-label="Checking account" className="h-9 w-9 animate-pulse rounded-full bg-slate-200" />
            ) : null}
            <DropdownMenu>
              <DropdownMenuTrigger aria-label="Open navigation menu" className="grid h-11 w-11 place-items-center rounded-lg text-gray-700 transition hover:bg-green-50 hover:text-green-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 max-[380px]:col-start-3 max-[380px]:row-start-2 max-[380px]:h-10 max-[380px]:w-10">
                <Menu className="h-7 w-7" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="z-[1001] w-52">
                {[
                  { href: "/products", label: "Products" },
                  { href: "/categories", label: "Categories" },
                  { href: "/brands", label: "Brands" },
                ].map((item) => (
                  <Link key={item.href} href={item.href}>
                    <DropdownMenuItem className={pathname === item.href ? "font-semibold text-green-700" : ""}>{item.label}</DropdownMenuItem>
                  </Link>
                ))}
                {!isAuthenticated && session.status !== "loading" && (
                  <>
                    <div className="my-1 border-t border-gray-100" />
                    <Link href="/login"><DropdownMenuItem className={pathname === "/login" ? "font-semibold text-green-700" : ""}>Login</DropdownMenuItem></Link>
                    <Link href="/register"><DropdownMenuItem className={pathname === "/register" ? "font-semibold text-green-700" : ""}>Register</DropdownMenuItem></Link>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            </div>
          </div>
        </div>

        {/* ===== Center Links (Desktop) ===== */}
        <div className="hidden md:flex items-center gap-3 mx-auto">
          {[
            { href: "/products", label: "Products", icon: <ShoppingBag className="w-5 h-5" /> },
            { href: "/categories", label: "Categories", icon: <LayoutGrid className="w-5 h-5" /> },
            { href: "/brands", label: "Brands", icon: <Award className="w-5 h-5" /> }
          ].map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2.5 transition-all duration-300 ${
                  isActive
                    ? "bg-green-500 text-white shadow-md shadow-green-500/20"
                    : "text-gray-700 hover:bg-green-50 hover:text-green-600"
                }`}
              >
                {/* رندرة الأيقونة هنا */}
                <span className={isActive ? "text-white" : "text-green-500"}>
                  {link.icon}
                </span>
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* ===== Right Icons (Desktop) ===== */}
        <div className="hidden md:flex items-center gap-4 justify-end">
          <button type="button" onClick={toggleTheme} aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"} title={isDark ? "Light mode" : "Dark mode"} className="group relative grid h-11 w-11 place-items-center rounded-full border border-gray-200 bg-white/80 text-emerald-700 shadow-sm transition duration-300 hover:scale-105 hover:border-emerald-300 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:border-slate-700 dark:bg-slate-800 dark:text-amber-300 dark:hover:border-amber-400/40 dark:hover:bg-slate-700">
            <span className="absolute inset-0 rounded-full bg-emerald-400/10 opacity-0 blur-md transition group-hover:opacity-100 dark:bg-amber-300/10" />
            {isDark ? <Sun className="relative h-6 w-6 transition-transform duration-500 group-hover:rotate-45" /> : <Moon className="relative h-6 w-6 transition-transform duration-300 group-hover:-rotate-12" />}
          </button>
          {isAuthenticated ? (
            <>
              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-0 relative z-[9999] flex items-center gap-2">
                  <UserIcon className="w-7 h-7 text-gray-700 hover:text-green-500 transition" />
                  {(session?.data?.user?.name || userName) && (
                    <span className="text-xl font-semibold text-gray-700">
                      {session?.data?.user?.name?.split(" ")[0] || userName}
                    </span>
                  )}
                </DropdownMenuTrigger>

                <DropdownMenuContent className="z-[9999] relative">
                  <Link href={"/profile"}>
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem onClick={() => signOut({ redirectTo: "/login" })}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Wishlist */}
              <div className="relative cursor-pointer">
              <Badge className="absolute -top-3 -right-5 bg-green-500 text-white h-6 w-6 flex items-center justify-center rounded-full text-xs">
                  {loading ? <Loader2 className="animate-spin text-black w-4 h-4" /> : wishlistData?.count || 0}
                </Badge>
                <Link href={"/Wishlist"}>
                  <HeartIcon
                    className={`w-7 h-7 transition ${
                      (wishlistData?.count ?? 0) > 0
                        ? "text-red-500 fill-red-500"
                        : "text-gray-500 hover:text-red-400"
                    }`}
                  />
                </Link>
              </div>

              {/* Cart */}
              <div className="relative cursor-pointer">
              <Badge className="absolute -top-3 -right-5 bg-green-500 text-white h-6 w-6 flex items-center justify-center rounded-full text-xs">
                  {loading ? <Loader2 className="animate-spin text-black w-4 h-4" /> : cartData?.numOfCartItems || 0}
                </Badge>
                <Link href="/card">
                  <ShoppingCart
                    className={`w-7 h-7 transition ${
                      cartData?.numOfCartItems! > 0
                        ? "text-green-500 fill-green-500"
                        : "text-gray-700 hover:text-green-500"
                    }`}
                  />
                </Link>
              </div>
            </>
          ) : session.status === "loading" ? (
            <span aria-label="Checking account" className="h-9 w-9 animate-pulse rounded-full bg-slate-200" />
          ) : (
            <>
              <Link
                href="/login"
                className={pathname === "/login" ? activeButtonClass : guestButtonClass}
              >
                Login
              </Link>
              <Link
                href="/register"
                className={pathname === "/register" ? activeButtonClass : guestButtonClass}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
