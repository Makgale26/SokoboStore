import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Product } from "@shared/schema";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ProductCard } from "@/components/product/product-card";

export default function ShopPage() {
  const params = useParams();
  const category = params.category;
  const [sortBy, setSortBy] = useState("name");

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: [category ? `/api/products?category=${category}` : "/api/products"],
  });

  const categories = [
    { value: "all", label: "All Products", href: "/shop" },
    { value: "tshirts", label: "T-Shirts", href: "/shop/tshirts" },
    { value: "hoodies", label: "Hoodies", href: "/shop/hoodies" },
    { value: "hats", label: "Hats", href: "/shop/hats" },
  ];

  const sortedProducts = products?.slice().sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return parseFloat(a.price) - parseFloat(b.price);
      case "price-high":
        return parseFloat(b.price) - parseFloat(a.price);
      case "name":
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const getCategoryTitle = () => {
    if (!category) return "All Products";
    return categories.find(cat => cat.value === category)?.label || "Products";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16">
        {/* Header Section */}
        <section className="py-16 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4" data-testid="shop-title">
                {getCategoryTitle()}
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="shop-description">
                Discover our premium streetwear collection designed for the urban lifestyle
              </p>
            </div>
          </div>
        </section>

        {/* Category Filter & Sort */}
        <section className="py-8 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <a
                    key={cat.value}
                    href={cat.href}
                    className={`inline-block`}
                    data-testid={`category-filter-${cat.value}`}
                  >
                    <Badge
                      variant={
                        (cat.value === "all" && !category) || cat.value === category
                          ? "default"
                          : "outline"
                      }
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {cat.label}
                    </Badge>
                  </a>
                ))}
              </div>

              {/* Sort Controls */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {products?.length || 0} products
                </span>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48" data-testid="sort-select">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name A-Z</SelectItem>
                    <SelectItem value="price-low">Price Low to High</SelectItem>
                    <SelectItem value="price-high">Price High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {[...Array(8)].map((_, index) => (
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
            ) : sortedProducts && sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" data-testid="products-grid">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-2xl font-display font-semibold mb-4" data-testid="no-products-title">
                  No products found
                </h3>
                <p className="text-muted-foreground mb-8" data-testid="no-products-description">
                  {category 
                    ? `We don't have any ${getCategoryTitle().toLowerCase()} available right now.`
                    : "No products are currently available."
                  }
                </p>
                <a href="/shop">
                  <Button data-testid="button-view-all-products">
                    View All Products
                  </Button>
                </a>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
