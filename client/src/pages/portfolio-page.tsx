import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Portfolio } from "@shared/schema";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: portfolioItems, isLoading } = useQuery<Portfolio[]>({
    queryKey: ["/api/portfolio"],
  });

  const categories = [
    { value: "all", label: "All Work" },
    { value: "branding", label: "Branding" },
    { value: "print", label: "Print Design" },
    { value: "digital", label: "Digital Art" },
    { value: "apparel", label: "Apparel Design" },
  ];

  const filteredItems = portfolioItems?.filter(item => 
    selectedCategory === "all" || item.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6" data-testid="portfolio-title">
              Our <span className="gradient-text">Portfolio</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto" data-testid="portfolio-description">
              From concept to creation - explore our latest design projects and creative work that showcases our passion for exceptional visual storytelling.
            </p>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.value)}
                  className="hover:scale-105 transition-transform"
                  data-testid={`category-filter-${category.value}`}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, index) => (
                  <Card key={index} className="animate-pulse">
                    <div className="h-64 bg-muted rounded-t-lg"></div>
                    <CardContent className="p-6">
                      <div className="h-6 bg-muted rounded mb-2"></div>
                      <div className="h-4 bg-muted rounded mb-4"></div>
                      <div className="h-4 w-20 bg-muted rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredItems && filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="portfolio-grid">
                {filteredItems.map((item) => (
                  <Card 
                    key={item.id} 
                    className="group cursor-pointer hover-lift overflow-hidden glass-card" 
                    data-testid={`portfolio-item-${item.id}`}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                        data-testid={`portfolio-image-${item.id}`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-6 left-6 right-6">
                          <Badge 
                            variant="secondary" 
                            className="mb-3 capitalize"
                            data-testid={`portfolio-category-${item.id}`}
                          >
                            {item.category}
                          </Badge>
                          <h3 className="text-xl font-display font-semibold mb-2 text-white" data-testid={`portfolio-title-${item.id}`}>
                            {item.title}
                          </h3>
                          <p className="text-gray-300 text-sm" data-testid={`portfolio-description-${item.id}`}>
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="capitalize">
                          {item.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-lg font-display font-semibold mt-3 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-2xl font-display font-semibold mb-4" data-testid="no-portfolio-title">
                  No work found
                </h3>
                <p className="text-muted-foreground mb-8" data-testid="no-portfolio-description">
                  {selectedCategory === "all" 
                    ? "We haven't added any portfolio items yet."
                    : `No ${categories.find(c => c.value === selectedCategory)?.label.toLowerCase()} work available.`
                  }
                </p>
                <Button onClick={() => setSelectedCategory("all")} data-testid="button-view-all-work">
                  View All Work
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-card">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6" data-testid="cta-title">
              Ready to Start Your <span className="gradient-text">Project</span>?
            </h2>
            <p className="text-xl text-muted-foreground mb-8" data-testid="cta-description">
              Let's collaborate to bring your vision to life. From initial concept to final delivery, we'll work with you every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-4" data-testid="button-get-quote">
                Get a Quote
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4" data-testid="button-view-services">
                View Our Services
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
