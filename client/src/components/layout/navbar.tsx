import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ShoppingCart, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/lib/cart-context";
import { CartSidebar } from "@/components/cart/cart-sidebar";

export function Navbar() {
  const [location] = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logoutMutation } = useAuth();
  const { getCartCount } = useCart();

  const isActive = (path: string) => location === path;

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/services", label: "Services" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <>
      <nav className="fixed top-0 w-full bg-background/90 backdrop-blur-md border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 group">
              <h1 className="text-2xl font-display font-bold gradient-text group-hover:scale-105 transition-transform" data-testid="logo">
                SOKOBO
              </h1>
              <span className="text-xs text-muted-foreground ml-1">SA MATEPE</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <a
                      className={`transition-colors font-medium ${
                        isActive(link.href)
                          ? "text-primary"
                          : "text-muted-foreground hover:text-primary"
                      }`}
                      data-testid={`nav-${link.label.toLowerCase()}`}
                    >
                      {link.label}
                    </a>
                  </Link>
                ))}
              </div>
            </div>

            {/* User Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                  <Link href={user.role === "admin" ? "/admin" : "/cart"}>
                    <Button variant="ghost" size="sm" data-testid="button-account">
                      <User className="w-4 h-4 mr-2" />
                      {user.role === "admin" ? "Admin" : "Account"}
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                    data-testid="button-logout"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <Link href="/auth">
                  <Button variant="ghost" size="sm" data-testid="button-login">
                    <User className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                </Link>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCartOpen(true)}
                className="relative"
                data-testid="button-cart"
              >
                <ShoppingCart className="w-4 h-4" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {getCartCount()}
                  </span>
                )}
              </Button>

              <Link href="/contact">
                <Button data-testid="button-quote">Get Quote</Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCartOpen(true)}
                className="relative"
                data-testid="button-cart-mobile"
              >
                <ShoppingCart className="w-4 h-4" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center font-semibold">
                    {getCartCount()}
                  </span>
                )}
              </Button>

              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" data-testid="button-mobile-menu">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72">
                  <div className="flex flex-col space-y-6 mt-8">
                    {navLinks.map((link) => (
                      <Link key={link.href} href={link.href}>
                        <a
                          className={`block transition-colors font-medium ${
                            isActive(link.href)
                              ? "text-primary"
                              : "text-muted-foreground hover:text-primary"
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          data-testid={`mobile-nav-${link.label.toLowerCase()}`}
                        >
                          {link.label}
                        </a>
                      </Link>
                    ))}

                    <div className="pt-4 border-t border-border space-y-4">
                      {user ? (
                        <>
                          <Link href={user.role === "admin" ? "/admin" : "/cart"}>
                            <Button variant="outline" className="w-full justify-start" onClick={() => setIsMobileMenuOpen(false)} data-testid="mobile-button-account">
                              <User className="w-4 h-4 mr-2" />
                              {user.role === "admin" ? "Admin Dashboard" : "My Account"}
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => {
                              handleLogout();
                              setIsMobileMenuOpen(false);
                            }}
                            disabled={logoutMutation.isPending}
                            data-testid="mobile-button-logout"
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                          </Button>
                        </>
                      ) : (
                        <Link href="/auth">
                          <Button variant="outline" className="w-full justify-start" onClick={() => setIsMobileMenuOpen(false)} data-testid="mobile-button-login">
                            <User className="w-4 h-4 mr-2" />
                            Login / Register
                          </Button>
                        </Link>
                      )}

                      <Link href="/contact">
                        <Button className="w-full" onClick={() => setIsMobileMenuOpen(false)} data-testid="mobile-button-quote">
                          Get Quote
                        </Button>
                      </Link>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
