import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, Palette, Printer, Star } from "lucide-react";
import { Product } from "@shared/schema";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ProductCard } from "@/components/product/product-card";
import { Link } from "wouter";

export default function HomePage() {
  const { data: featuredProducts, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products?featured=true"],
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10"></div>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')",
          }}
        ></div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight" data-testid="hero-title">
            <span className="gradient-text">DESIGN.</span>
            <br />
            <span className="text-foreground">PRINT.</span>
            <br />
            <span className="gradient-text">ELEVATE.</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto font-light" data-testid="hero-description">
            Where streetwear meets exceptional design. Custom graphics, premium printing, and branded merchandise that tells your story.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop">
              <Button size="lg" className="text-lg px-8 py-4 hover:scale-105 transition-transform" data-testid="button-shop-collection">
                Shop Collection
              </Button>
            </Link>
            <Link href="/portfolio">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 hover:scale-105 transition-transform" data-testid="button-view-portfolio">
                View Portfolio
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-muted-foreground animate-bounce">
          <ChevronDown className="w-8 h-8" />
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4" data-testid="featured-title">
              Featured <span className="gradient-text">Drops</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="featured-description">
              Fresh designs, premium quality. Limited edition pieces that make a statement.
            </p>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <div className="h-80 bg-muted"></div>
                  <CardContent className="p-6">
                    <div className="h-6 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-8 w-16 bg-muted rounded"></div>
                      <div className="h-10 w-24 bg-muted rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="featured-products-grid">
              {featuredProducts?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/shop">
              <Button variant="outline" size="lg" className="hover:scale-105 transition-transform" data-testid="button-view-all-products">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Shop Categories Section */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4" data-testid="categories-title">
              Shop by <span className="gradient-text">Category</span>
            </h2>
            <p className="text-xl text-muted-foreground" data-testid="categories-description">
              Discover our full range of streetwear essentials
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" data-testid="categories-grid">
            <Link href="/shop/tshirts">
              <div className="group cursor-pointer" data-testid="category-tshirts">
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src="https://images.unsplash.com/photo-1503341504253-dff4815485f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                    alt="T-Shirts Collection"
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
                  <div className="absolute bottom-6 left-6">
                    <h3 className="text-2xl font-display font-bold mb-2">T-Shirts</h3>
                    <p className="text-muted-foreground">From R350</p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/shop/hoodies">
              <div className="group cursor-pointer" data-testid="category-hoodies">
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src="https://images.unsplash.com/photo-1509631179647-0177331693ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                    alt="Hoodies Collection"
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
                  <div className="absolute bottom-6 left-6">
                    <h3 className="text-2xl font-display font-bold mb-2">Hoodies</h3>
                    <p className="text-muted-foreground">From R650</p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/shop/hats">
              <div className="group cursor-pointer" data-testid="category-hats">
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src="https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                    alt="Hats Collection"
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
                  <div className="absolute bottom-6 left-6">
                    <h3 className="text-2xl font-display font-bold mb-2">Hats</h3>
                    <p className="text-muted-foreground">From R250</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4" data-testid="services-title">
              Our <span className="gradient-text">Services</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="services-description">
              From concept to completion - we bring your vision to life
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="services-grid">
            <Card className="glass-card p-8 text-center hover-lift">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Palette className="text-primary w-8 h-8" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-4">Graphic Design</h3>
              <p className="text-muted-foreground mb-6">
                Logo design, brand identity, digital artwork, and creative solutions that make your brand stand out.
              </p>
              <Link href="/services">
                <Button variant="outline" data-testid="button-graphic-design-quote">
                  Get Quote
                </Button>
              </Link>
            </Card>

            <Card className="glass-card p-8 text-center hover-lift">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Printer className="text-accent w-8 h-8" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-4">Premium Printing</h3>
              <p className="text-muted-foreground mb-6">
                High-quality printing services for all your business and personal needs with fast turnaround times.
              </p>
              <Link href="/services">
                <Button variant="outline" data-testid="button-printing-quote">
                  Get Quote
                </Button>
              </Link>
            </Card>

            <Card className="glass-card p-8 text-center hover-lift">
              <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="text-destructive w-8 h-8" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-4">Custom Branding</h3>
              <p className="text-muted-foreground mb-6">
                Complete branding solutions including merchandise, packaging, and brand strategy development.
              </p>
              <Link href="/services">
                <Button variant="outline" data-testid="button-branding-quote">
                  Get Quote
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
