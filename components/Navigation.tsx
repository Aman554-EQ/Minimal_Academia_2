"use client";

import { useState } from "react";
import { Menu, X, LogOut, LogIn, UserPlus } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

interface NavigationProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  ownerName: string;
}

export default function Navigation({ currentPage, setCurrentPage, ownerName }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();

  const navItems = [
    { id: "home", label: "Home" },
    { id: "publications", label: "Publications" },
    { id: "news", label: "News" },
    { id: "cv", label: "Resume", isExternal: true, href: "/cv.pdf" },
  ];

  const handleMenuClick = (itemId: string) => {
    setCurrentPage(itemId);
    setIsMenuOpen(false);
  };

  return (
    <nav className="w-full bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 truncate">
            {ownerName}
          </h1>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navItems.map((item) =>
              item.isExternal ? (
                <a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative group text-sm font-medium py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  {item.label}
                  <span className="absolute left-1/2 bottom-0 h-0.5 bg-red-500 w-0 group-hover:w-full transition-all duration-300 transform -translate-x-1/2" />
                </a>
              ) : (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`relative group text-sm font-medium py-2 transition-colors duration-200
                    ${currentPage === item.id ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}
                  `}
                >
                  {item.label}
                  <span
                    className={`absolute left-1/2 bottom-0 h-0.5 transition-all duration-300 transform -translate-x-1/2
                      ${currentPage === item.id ? "bg-blue-600 w-full" : "bg-red-500 w-0 group-hover:w-full"}
                    `}
                  />
                </button>
              )
            )}

            {/* Auth buttons */}
            {session ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">
                  Hi, {session.user?.name?.split(" ")[0]}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 py-1 px-2 rounded hover:bg-red-50 transition-colors"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            ) : (
              <div> 
              </div>
               // <div className="flex items-center gap-2">
              //   <Link
              //     href="/auth/signin"
              //     className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 py-1 px-2 rounded hover:bg-gray-50 transition-colors"
              //   >
              //     <LogIn size={14} />
              //     Sign In
              //   </Link>
              //   <Link
              //     href="/auth/signup"
              //     className="flex items-center gap-1.5 text-sm font-medium bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 transition-colors"
              //   >
              //     <UserPlus size={14} />
              //     Sign Up
              //   </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="py-2 space-y-1">
              {navItems.map((item) =>
                item.isExternal ? (
                  <a
                    key={item.id}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                  >
                    {item.label}
                  </a>
                ) : (
                  <button
                    key={item.id}
                    onClick={() => handleMenuClick(item.id)}
                    className={`block w-full text-left px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                      currentPage === item.id
                        ? "text-blue-600 bg-blue-50 border-r-2 border-blue-600"
                        : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                    }`}
                  >
                    {item.label}
                  </button>
                )
              )}

              {/* Mobile auth */}
              <div className="px-4 py-2 border-t border-gray-100">
                {session ? (
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
                  >
                    <LogOut size={14} />
                    Sign Out ({session.user?.name?.split(" ")[0]})
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <Link
                      href="/auth/signin"
                      className="text-sm text-blue-600 hover:underline"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="text-sm text-blue-600 hover:underline"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
