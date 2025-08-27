import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Mail, MapPin, Phone, Clock, Loader2, CheckCircle, ExternalLink } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const contactSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  service: z.string().min(1, "Please select a service"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      service: "",
      message: "",
    },
  });

  const submitContactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: () => {
      setIsSuccess(true);
      form.reset();
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    submitContactMutation.mutate(data);
  };

  const contactInfo = [
    {
      icon: MessageSquare,
      title: "WhatsApp",
      description: "Chat with us instantly for quick quotes and support",
      contact: "+27 12 345 6789",
      action: "Chat Now",
      href: "https://wa.me/27123456789",
      color: "text-green-500"
    },
    {
      icon: Mail,
      title: "Email",
      description: "Send us detailed project requirements",
      contact: "info@sokobosamatepe.co.za",
      action: "Send Email",
      href: "mailto:info@sokobosamatepe.co.za",
      color: "text-primary"
    },
    {
      icon: MapPin,
      title: "Location",
      description: "Johannesburg, South Africa",
      contact: "Available for in-person consultations",
      action: "",
      href: "",
      color: "text-accent"
    },
    {
      icon: Clock,
      title: "Business Hours",
      description: "Monday - Friday: 8:00 AM - 6:00 PM",
      contact: "Saturday: 9:00 AM - 3:00 PM",
      action: "",
      href: "",
      color: "text-destructive"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6" data-testid="contact-title">
              Get In <span className="gradient-text">Touch</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto" data-testid="contact-subtitle">
              Ready to elevate your brand? Let's discuss your next project and bring your creative vision to life.
            </p>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div>
                <h2 className="text-3xl font-display font-bold mb-8" data-testid="contact-info-title">
                  Let's Start a Conversation
                </h2>
                
                <div className="space-y-6 mb-12" data-testid="contact-info-grid">
                  {contactInfo.map((info, index) => (
                    <Card key={index} className="glass-card hover-lift">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className={`w-12 h-12 bg-muted rounded-full flex items-center justify-center flex-shrink-0`}>
                            <info.icon className={`${info.color} w-6 h-6`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-display font-semibold mb-2" data-testid={`contact-info-title-${index}`}>
                              {info.title}
                            </h3>
                            <p className="text-muted-foreground text-sm mb-2" data-testid={`contact-info-description-${index}`}>
                              {info.description}
                            </p>
                            <p className="font-medium mb-2" data-testid={`contact-info-contact-${index}`}>
                              {info.contact}
                            </p>
                            {info.action && info.href && (
                              <a 
                                href={info.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${info.color} hover:opacity-80 transition-opacity inline-flex items-center text-sm font-medium`}
                                data-testid={`contact-info-action-${index}`}
                              >
                                {info.action}
                                <ExternalLink className="w-3 h-3 ml-1" />
                              </a>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* FAQ Section */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="font-display" data-testid="faq-title">Frequently Asked</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-1">What's your typical turnaround time?</h4>
                      <p className="text-sm text-muted-foreground">Design projects: 3-7 days. Printing: 1-3 days. Rush orders available.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Do you offer revisions?</h4>
                      <p className="text-sm text-muted-foreground">Yes, we include 2-3 rounds of revisions with every design project.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">What file formats do you provide?</h4>
                      <p className="text-sm text-muted-foreground">We deliver in all standard formats: AI, EPS, PDF, PNG, JPG, and more.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Contact Form */}
              <div>
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="font-display text-2xl" data-testid="form-title">
                      Start Your Project
                    </CardTitle>
                    <p className="text-muted-foreground">
                      Tell us about your project and we'll get back to you with a detailed quote.
                    </p>
                  </CardHeader>
                  <CardContent>
                    {isSuccess ? (
                      <div className="text-center py-8">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-display font-semibold mb-2" data-testid="success-title">
                          Message Sent Successfully!
                        </h3>
                        <p className="text-muted-foreground mb-6" data-testid="success-description">
                          Thank you for reaching out. We'll review your message and get back to you within 24 hours.
                        </p>
                        <Button onClick={() => setIsSuccess(false)} data-testid="button-send-another">
                          Send Another Message
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="contact-form">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              id="firstName"
                              {...form.register("firstName")}
                              placeholder="John"
                              data-testid="input-first-name"
                            />
                            {form.formState.errors.firstName && (
                              <p className="text-sm text-destructive mt-1" data-testid="error-first-name">
                                {form.formState.errors.firstName.message}
                              </p>
                            )}
                          </div>
                          <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              {...form.register("lastName")}
                              placeholder="Doe"
                              data-testid="input-last-name"
                            />
                            {form.formState.errors.lastName && (
                              <p className="text-sm text-destructive mt-1" data-testid="error-last-name">
                                {form.formState.errors.lastName.message}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            {...form.register("email")}
                            placeholder="john@example.com"
                            data-testid="input-email"
                          />
                          {form.formState.errors.email && (
                            <p className="text-sm text-destructive mt-1" data-testid="error-email">
                              {form.formState.errors.email.message}
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <Label htmlFor="service">Service Interested In</Label>
                          <Select
                            value={form.watch("service")}
                            onValueChange={(value) => form.setValue("service", value)}
                          >
                            <SelectTrigger data-testid="service-select">
                              <SelectValue placeholder="Select a service" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="graphic-design">Graphic Design</SelectItem>
                              <SelectItem value="printing">Printing Services</SelectItem>
                              <SelectItem value="custom-branding">Custom Branding</SelectItem>
                              <SelectItem value="apparel-design">Apparel Design</SelectItem>
                              <SelectItem value="merchandise">Custom Merchandise</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          {form.formState.errors.service && (
                            <p className="text-sm text-destructive mt-1" data-testid="error-service">
                              {form.formState.errors.service.message}
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <Label htmlFor="message">Project Details</Label>
                          <Textarea
                            id="message"
                            {...form.register("message")}
                            rows={5}
                            placeholder="Tell us about your project, timeline, budget, and any specific requirements..."
                            className="resize-none"
                            data-testid="input-message"
                          />
                          {form.formState.errors.message && (
                            <p className="text-sm text-destructive mt-1" data-testid="error-message">
                              {form.formState.errors.message.message}
                            </p>
                          )}
                        </div>
                        
                        <Button
                          type="submit"
                          className="w-full"
                          size="lg"
                          disabled={submitContactMutation.isPending}
                          data-testid="button-send-message"
                        >
                          {submitContactMutation.isPending ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            "Send Message"
                          )}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Contact Methods */}
        <section className="py-16 bg-card">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-display font-bold mb-6" data-testid="additional-contact-title">
              More Ways to <span className="gradient-text">Connect</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8" data-testid="additional-contact-description">
              Follow us on social media for the latest updates, behind-the-scenes content, and design inspiration.
            </p>
            <div className="flex justify-center space-x-6">
              <a 
                href="#" 
                className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                data-testid="social-instagram"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                data-testid="social-facebook"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                data-testid="social-twitter"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                data-testid="social-linkedin"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
