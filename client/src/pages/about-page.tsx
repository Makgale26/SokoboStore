import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Palette, Printer, Star, Users, Award, Target } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Link } from "wouter";

export default function AboutPage() {
  const stats = [
    { icon: Users, label: "Happy Clients", value: "500+" },
    { icon: Award, label: "Years Experience", value: "5+" },
    { icon: Palette, label: "Projects Completed", value: "1,000+" },
    { icon: Star, label: "Customer Rating", value: "4.9/5" },
  ];

  const values = [
    {
      icon: Palette,
      title: "Creative Excellence",
      description: "We push the boundaries of design to create unique, impactful visual experiences that resonate with your audience.",
    },
    {
      icon: Target,
      title: "Quality First",
      description: "Every project receives meticulous attention to detail, ensuring the highest standards of craftsmanship and durability.",
    },
    {
      icon: Users,
      title: "Client Partnership",
      description: "We believe in collaborative relationships, working closely with our clients to bring their vision to life.",
    },
    {
      icon: Printer,
      title: "Innovation",
      description: "Staying ahead of trends and technology to deliver cutting-edge solutions that make your brand stand out.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6" data-testid="about-title">
              About <span className="gradient-text">Sokobo sa Matepe</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto" data-testid="about-subtitle">
              Born from the streets, elevated by design. We're more than a brand - we're a movement that celebrates authentic expression through innovative design and premium streetwear.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6" data-testid="story-title">
                  Our <span className="gradient-text">Story</span>
                </h2>
                <div className="space-y-6 text-lg text-muted-foreground">
                  <p data-testid="story-paragraph-1">
                    Founded with a passion for authentic street culture and exceptional design, Sokobo sa Matepe emerged from the vibrant urban landscape of South Africa. Our journey began with a simple belief: that every individual deserves to express their unique story through high-quality, thoughtfully designed apparel and graphics.
                  </p>
                  <p data-testid="story-paragraph-2">
                    What started as a small design studio has evolved into a comprehensive creative agency specializing in graphic design, premium printing, and custom merchandise. We've stayed true to our roots while continuously innovating to meet the evolving needs of our community.
                  </p>
                  <p data-testid="story-paragraph-3">
                    Today, we're proud to serve clients across South Africa and beyond, helping them bring their creative visions to life through our expertise in design, printing, and brand development.
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                  alt="Creative workspace showing design process"
                  className="rounded-lg shadow-2xl"
                  data-testid="story-image"
                />
                <div className="absolute -bottom-6 -left-6 glass-card p-6 rounded-lg">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1" data-testid="stat-experience">5+</div>
                    <div className="text-sm text-muted-foreground">Years Experience</div>
                  </div>
                </div>
                <div className="absolute -top-6 -right-6 glass-card p-6 rounded-lg">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent mb-1" data-testid="stat-clients">500+</div>
                    <div className="text-sm text-muted-foreground">Happy Clients</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <Card className="glass-card p-8 text-center hover-lift">
                <Target className="w-16 h-16 text-primary mx-auto mb-6" />
                <h3 className="text-2xl font-display font-bold mb-4" data-testid="mission-title">
                  Our <span className="gradient-text">Mission</span>
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed" data-testid="mission-description">
                  To empower individuals and brands through exceptional design and quality craftsmanship that resonates with street culture and contemporary aesthetics. We strive to create meaningful connections between our clients and their audiences through authentic visual storytelling.
                </p>
              </Card>

              <Card className="glass-card p-8 text-center hover-lift">
                <Star className="w-16 h-16 text-accent mx-auto mb-6" />
                <h3 className="text-2xl font-display font-bold mb-4" data-testid="vision-title">
                  Our <span className="gradient-text">Vision</span>
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed" data-testid="vision-description">
                  To become the leading creative force in streetwear and design across Africa and beyond, setting new standards for authenticity and innovation in the industry while fostering a community of creative expression and cultural pride.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4" data-testid="stats-title">
                Our <span className="gradient-text">Impact</span>
              </h2>
              <p className="text-xl text-muted-foreground" data-testid="stats-description">
                Numbers that reflect our commitment to excellence
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8" data-testid="stats-grid">
              {stats.map((stat, index) => (
                <Card key={index} className="glass-card p-6 text-center hover-lift">
                  <stat.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <div className="text-3xl font-bold text-foreground mb-2" data-testid={`stat-value-${index}`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground" data-testid={`stat-label-${index}`}>
                    {stat.label}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4" data-testid="values-title">
                Our <span className="gradient-text">Values</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="values-description">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8" data-testid="values-grid">
              {values.map((value, index) => (
                <Card key={index} className="glass-card p-8 hover-lift">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <value.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-semibold mb-3" data-testid={`value-title-${index}`}>
                        {value.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed" data-testid={`value-description-${index}`}>
                        {value.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6" data-testid="cta-title">
              Ready to Work <span className="gradient-text">Together</span>?
            </h2>
            <p className="text-xl text-muted-foreground mb-8" data-testid="cta-description">
              Let's create something amazing together. Whether you need design services, custom printing, or want to join our streetwear community, we're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="text-lg px-8 py-4" data-testid="button-get-in-touch">
                  Get in Touch
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4" data-testid="button-our-services">
                  Our Services
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
