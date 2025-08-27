import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Palette, Printer, Star, Shirt, FileText, Monitor, CheckCircle } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Link } from "wouter";

export default function ServicesPage() {
  const services = [
    {
      icon: Palette,
      title: "Graphic Design",
      description: "Logo design, brand identity, digital artwork, and creative solutions that make your brand stand out.",
      color: "primary",
      features: [
        "Logo & Brand Identity",
        "Digital Illustrations",
        "Marketing Materials",
        "Social Media Graphics",
        "Packaging Design",
        "Business Cards & Stationery"
      ],
      startingPrice: "From R500"
    },
    {
      icon: Printer,
      title: "Premium Printing",
      description: "High-quality printing services for all your business and personal needs with fast turnaround times.",
      color: "accent",
      features: [
        "Business Cards & Stationery",
        "Posters & Banners",
        "Apparel Printing",
        "Promotional Materials",
        "Large Format Printing",
        "Custom Packaging"
      ],
      startingPrice: "From R50"
    },
    {
      icon: Star,
      title: "Custom Branding",
      description: "Complete branding solutions including merchandise, packaging, and brand strategy development.",
      color: "destructive",
      features: [
        "Brand Strategy",
        "Custom Merchandise",
        "Packaging Design",
        "Brand Guidelines",
        "Marketing Collateral",
        "Brand Consultation"
      ],
      startingPrice: "From R2,000"
    },
    {
      icon: Shirt,
      title: "Apparel Design",
      description: "Custom streetwear design and production, from concept sketches to finished garments.",
      color: "secondary",
      features: [
        "Custom T-Shirt Design",
        "Hoodie & Sweatshirt Design",
        "Hat & Cap Design",
        "Screen Printing",
        "Embroidery Services",
        "Small Batch Production"
      ],
      startingPrice: "From R350"
    },
    {
      icon: FileText,
      title: "Print Materials",
      description: "Professional print design for marketing materials, publications, and corporate communications.",
      color: "primary",
      features: [
        "Brochures & Flyers",
        "Annual Reports",
        "Magazines & Catalogs",
        "Presentation Materials",
        "Event Materials",
        "Corporate Publications"
      ],
      startingPrice: "From R200"
    },
    {
      icon: Monitor,
      title: "Digital Design",
      description: "Digital-first design solutions for web, social media, and digital marketing campaigns.",
      color: "accent",
      features: [
        "Web Graphics",
        "Social Media Assets",
        "Digital Advertisements",
        "Email Templates",
        "Digital Presentations",
        "UI/UX Design"
      ],
      startingPrice: "From R800"
    }
  ];

  const process = [
    {
      step: "01",
      title: "Consultation",
      description: "We start with a detailed discussion about your project requirements, goals, and timeline."
    },
    {
      step: "02", 
      title: "Concept Development",
      description: "Our team creates initial concepts and designs based on your brief and brand guidelines."
    },
    {
      step: "03",
      title: "Design & Revision",
      description: "We refine the chosen concept through collaborative feedback and iterative improvements."
    },
    {
      step: "04",
      title: "Production & Delivery",
      description: "Final production with quality control checks and delivery according to your timeline."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6" data-testid="services-title">
              Our <span className="gradient-text">Services</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto" data-testid="services-subtitle">
              From concept to completion - we bring your vision to life through exceptional design, premium printing, and innovative branding solutions.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="services-grid">
              {services.map((service, index) => (
                <Card key={index} className="glass-card hover-lift h-full">
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 bg-${service.color}/20 rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <service.icon className={`text-${service.color} w-8 h-8`} />
                    </div>
                    <CardTitle className="text-xl font-display" data-testid={`service-title-${index}`}>
                      {service.title}
                    </CardTitle>
                    <Badge variant="outline" className="mx-auto" data-testid={`service-price-${index}`}>
                      {service.startingPrice}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-muted-foreground text-center" data-testid={`service-description-${index}`}>
                      {service.description}
                    </p>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">What's Included:</h4>
                      <ul className="space-y-1">
                        {service.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link href="/contact">
                      <Button 
                        className="w-full" 
                        variant={service.color === "primary" ? "default" : "outline"}
                        data-testid={`button-get-quote-${index}`}
                      >
                        Get Quote
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4" data-testid="process-title">
                Our <span className="gradient-text">Process</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="process-description">
                A streamlined approach that ensures quality results and client satisfaction
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" data-testid="process-grid">
              {process.map((step, index) => (
                <div key={index} className="text-center relative">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                    <span className="text-primary-foreground font-bold text-lg" data-testid={`process-step-${index}`}>
                      {step.step}
                    </span>
                  </div>
                  {index < process.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-border transform translate-x-1/2 -z-10"></div>
                  )}
                  <h3 className="text-lg font-display font-semibold mb-2" data-testid={`process-title-${index}`}>
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm" data-testid={`process-description-${index}`}>
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6" data-testid="why-choose-title">
                  Why Choose <span className="gradient-text">Sokobo</span>?
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2">Expert Team</h3>
                      <p className="text-muted-foreground">Our skilled designers and print specialists bring years of experience to every project.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2">Quality Materials</h3>
                      <p className="text-muted-foreground">We use only premium materials and state-of-the-art equipment for superior results.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2">Fast Turnaround</h3>
                      <p className="text-muted-foreground">Quick delivery times without compromising on quality or attention to detail.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2">Competitive Pricing</h3>
                      <p className="text-muted-foreground">Fair, transparent pricing that offers excellent value for money.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                  alt="Design team working on creative projects"
                  className="rounded-lg shadow-2xl"
                  data-testid="why-choose-image"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-card">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6" data-testid="cta-title">
              Ready to Start Your <span className="gradient-text">Project</span>?
            </h2>
            <p className="text-xl text-muted-foreground mb-8" data-testid="cta-description">
              Let's discuss your needs and create something amazing together. Get in touch for a free consultation and quote.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="text-lg px-8 py-4" data-testid="button-get-quote">
                  Get Free Quote
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4" data-testid="button-view-work">
                  View Our Work
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
