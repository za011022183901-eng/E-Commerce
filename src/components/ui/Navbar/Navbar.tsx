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
import { ShoppingCart, UserIcon, HeartIcon, Loader2, ShoppingBag, LayoutGrid, Award, Menu } from "lucide-react"
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
    "px-4 py-2 border border-green-500 text-green-500 rounded-lg font-medium hover:bg-green-500 hover:text-white transition-colors"
  const activeButtonClass = "px-4 py-2 bg-green-500 text-white rounded-lg font-medium"

  return (
    <nav
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`fixed top-0 left-0 w-full z-[1000] transition-transform duration-500 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      } py-4 bg-gradient-to-r from-white via-gray-50 to-green-50 shadow-md border-b border-gray-200`}
    >
      <div className="container mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4 px-3 sm:px-6">
        {/* ===== Logo + Mobile Icons ===== */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link href={"/"}>
            <div className="flex items-center gap-2 cursor-pointer">
              <ShoppingCart className="text-green-500 w-7 h-7" />
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-800 tracking-wide">ShopMart</h1>
            </div>
          </Link>

          {/* ===== Mobile Menu + Icons ===== */}
          <div className="flex items-center gap-3 sm:gap-5 md:hidden z-[9999]">
            {isAuthenticated ? (
              <>
                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger className="outline-0 relative z-[9999] flex items-center gap-2">
                    <UserIcon className="w-6 h-6 text-gray-700 hover:text-green-500 transition" />
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
                    <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Wishlist Icon */}
                <div className="relative">
                  <Badge className="absolute -top-3 -right-5 bg-green-500 text-white h-5 w-5 flex items-center justify-center rounded-full text-xs">
                    {loading ? <Loader2 className="animate-spin text-black w-4 h-4" /> : wishlistData?.count || 0}
                  </Badge>
                  <Link href="/Wishlist">
                    <HeartIcon
                      className={`w-6 h-6 transition ${
                        wishlistData?.count! > 0
                          ? "text-red-500 fill-red-500"
                          : "text-gray-700 hover:text-green-500"
                      }`}
                    />
                  </Link>
                </div>

                {/* Cart Icon */}
                <div className="relative">
                  <Badge className="absolute -top-3 -right-5 bg-green-500 text-white h-5 w-5 flex items-center justify-center rounded-full text-xs">
                    {loading ? <Loader2 className="animate-spin text-black w-4 h-4" /> : cartData?.numOfCartItems || 0}
                  </Badge>
                  <Link href="/card">
                    <ShoppingCart
                      className={`w-6 h-6 transition ${
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
              <DropdownMenuTrigger aria-label="Open navigation menu" className="grid h-10 w-10 place-items-center rounded-lg text-gray-700 transition hover:bg-green-50 hover:text-green-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500">
                <Menu className="h-6 w-6" />
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

        {/* ===== Center Links (Desktop) ===== */}
        <div className="hidden md:flex items-center gap-2 mx-auto">
          {[
            { href: "/products", label: "Products", icon: <ShoppingBag className="w-4 h-4" /> },
            { href: "/categories", label: "Categories", icon: <LayoutGrid className="w-4 h-4" /> },
            { href: "/brands", label: "Brands", icon: <Award className="w-4 h-4" /> }
          ].map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 ${
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
        <div className="hidden md:flex items-center gap-6 justify-end">
          {isAuthenticated ? (
            <>
              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-0 relative z-[9999] flex items-center gap-2">
                  <UserIcon className="w-6 h-6 text-gray-700 hover:text-green-500 transition" />
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
                  <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Wishlist */}
              <div className="relative cursor-pointer">
                <Badge className="absolute -top-3 -right-5 bg-green-500 text-white h-5 w-5 flex items-center justify-center rounded-full text-xs">
                  {loading ? <Loader2 className="animate-spin text-black w-4 h-4" /> : wishlistData?.count || 0}
                </Badge>
                <Link href={"/Wishlist"}>
                  <HeartIcon
                    className={`w-6 h-6 transition ${
                      (wishlistData?.count ?? 0) > 0
                        ? "text-red-500 fill-red-500"
                        : "text-gray-500 hover:text-red-400"
                    }`}
                  />
                </Link>
              </div>

              {/* Cart */}
              <div className="relative cursor-pointer">
                <Badge className="absolute -top-3 -right-5 bg-green-500 text-white h-5 w-5 flex items-center justify-center rounded-full text-xs">
                  {loading ? <Loader2 className="animate-spin text-black w-4 h-4" /> : cartData?.numOfCartItems || 0}
                </Badge>
                <Link href="/card">
                  <ShoppingCart
                    className={`w-6 h-6 transition ${
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
