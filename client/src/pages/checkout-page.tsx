import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Loader2, CreditCard, Truck, CheckCircle } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

const checkoutSchema = z.object({
  shippingAddress: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    street: z.string().min(5, "Street address is required"),
    city: z.string().min(2, "City is required"),
    postalCode: z.string().min(4, "Postal code is required"),
    phone: z.string().min(10, "Phone number is required"),
  }),
  paymentMethod: z.enum(["card", "eft", "cash"], {
    required_error: "Please select a payment method",
  }),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const [, setLocation] = useLocation();
  const { state: cartState, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState("");

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shippingAddress: {
        name: user?.name || "",
        street: "",
        city: "",
        postalCode: "",
        phone: "",
      },
      paymentMethod: "card",
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async (data: CheckoutFormData) => {
      const orderData = {
        items: cartState.items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          size: item.size,
          price: parseFloat(item.product.price),
          name: item.product.name,
          image: item.product.images[0],
        })),
        total: cartState.total.toFixed(2),
        shippingAddress: data.shippingAddress,
      };

      const response = await apiRequest("POST", "/api/orders", orderData);
      return response.json();
    },
    onSuccess: (order) => {
      setOrderId(order.id);
      setOrderComplete(true);
      clearCart();
      toast({
        title: "Order placed successfully!",
        description: `Your order #${order.id.slice(-8)} has been confirmed.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Order failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CheckoutFormData) => {
    createOrderMutation.mutate(data);
  };

  // Redirect if cart is empty and order not complete
  if (cartState.items.length === 0 && !orderComplete) {
    setLocation("/cart");
    return null;
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <Card className="glass-card text-center">
              <CardContent className="pt-12 pb-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
                <h1 className="text-3xl font-display font-bold mb-4" data-testid="order-success-title">
                  Order Confirmed!
                </h1>
                <p className="text-xl text-muted-foreground mb-6" data-testid="order-success-description">
                  Thank you for your purchase. Your order has been successfully placed.
                </p>
                <div className="bg-card p-4 rounded-lg mb-6">
                  <p className="text-sm text-muted-foreground mb-1">Order Number</p>
                  <p className="font-mono text-lg font-semibold" data-testid="order-number">
                    #{orderId.slice(-8).toUpperCase()}
                  </p>
                </div>
                <p className="text-muted-foreground mb-8">
                  You will receive an email confirmation shortly with your order details and tracking information.
                </p>
                <div className="space-y-4">
                  <Button onClick={() => setLocation("/shop")} size="lg" className="w-full" data-testid="button-continue-shopping">
                    Continue Shopping
                  </Button>
                  <Button variant="outline" onClick={() => setLocation("/")} className="w-full" data-testid="button-back-home">
                    Back to Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16">
        {/* Header */}
        <section className="py-8 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-display font-bold" data-testid="checkout-title">
              Checkout
            </h1>
            <p className="text-muted-foreground" data-testid="checkout-description">
              Complete your order and secure your streetwear essentials
            </p>
          </div>
        </section>

        {/* Checkout Form */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Checkout Forms */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Shipping Information */}
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 font-display" data-testid="shipping-title">
                        <Truck className="w-5 h-5" />
                        Shipping Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          {...form.register("shippingAddress.name")}
                          placeholder="John Doe"
                          data-testid="input-shipping-name"
                        />
                        {form.formState.errors.shippingAddress?.name && (
                          <p className="text-sm text-destructive mt-1" data-testid="error-shipping-name">
                            {form.formState.errors.shippingAddress.name.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="street">Street Address</Label>
                        <Input
                          id="street"
                          {...form.register("shippingAddress.street")}
                          placeholder="123 Main Street, Apt 4B"
                          data-testid="input-shipping-street"
                        />
                        {form.formState.errors.shippingAddress?.street && (
                          <p className="text-sm text-destructive mt-1" data-testid="error-shipping-street">
                            {form.formState.errors.shippingAddress.street.message}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            {...form.register("shippingAddress.city")}
                            placeholder="Johannesburg"
                            data-testid="input-shipping-city"
                          />
                          {form.formState.errors.shippingAddress?.city && (
                            <p className="text-sm text-destructive mt-1" data-testid="error-shipping-city">
                              {form.formState.errors.shippingAddress.city.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="postalCode">Postal Code</Label>
                          <Input
                            id="postalCode"
                            {...form.register("shippingAddress.postalCode")}
                            placeholder="2000"
                            data-testid="input-shipping-postal"
                          />
                          {form.formState.errors.shippingAddress?.postalCode && (
                            <p className="text-sm text-destructive mt-1" data-testid="error-shipping-postal">
                              {form.formState.errors.shippingAddress.postalCode.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          {...form.register("shippingAddress.phone")}
                          placeholder="+27 12 345 6789"
                          data-testid="input-shipping-phone"
                        />
                        {form.formState.errors.shippingAddress?.phone && (
                          <p className="text-sm text-destructive mt-1" data-testid="error-shipping-phone">
                            {form.formState.errors.shippingAddress.phone.message}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Payment Method */}
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 font-display" data-testid="payment-title">
                        <CreditCard className="w-5 h-5" />
                        Payment Method
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Select
                        value={form.watch("paymentMethod")}
                        onValueChange={(value) => form.setValue("paymentMethod", value as "card" | "eft" | "cash")}
                      >
                        <SelectTrigger data-testid="payment-method-select">
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="card">Credit/Debit Card</SelectItem>
                          <SelectItem value="eft">EFT/Bank Transfer</SelectItem>
                          <SelectItem value="cash">Cash on Delivery</SelectItem>
                        </SelectContent>
                      </Select>
                      {form.formState.errors.paymentMethod && (
                        <p className="text-sm text-destructive mt-1" data-testid="error-payment-method">
                          {form.formState.errors.paymentMethod.message}
                        </p>
                      )}

                      <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          {form.watch("paymentMethod") === "card" && "Secure card payment processing. Your payment information is encrypted and secure."}
                          {form.watch("paymentMethod") === "eft" && "You will receive banking details via email to complete the transfer. Order will be processed upon payment confirmation."}
                          {form.watch("paymentMethod") === "cash" && "Pay with cash when your order is delivered. Additional delivery fee may apply."}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <Card className="glass-card sticky top-24">
                    <CardHeader>
                      <CardTitle className="font-display" data-testid="order-summary-title">Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Order Items */}
                      <div className="space-y-3">
                        {cartState.items.map((item) => (
                          <div key={`${item.product.id}-${item.size}`} className="flex items-center gap-3" data-testid={`order-item-${item.product.id}-${item.size}`}>
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{item.product.name}</p>
                              <p className="text-xs text-muted-foreground">Size: {item.size} × {item.quantity}</p>
                            </div>
                            <p className="text-sm font-medium">
                              R {(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>

                      <Separator />

                      {/* Pricing Breakdown */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Subtotal</span>
                          <span data-testid="order-subtotal">R {cartState.total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Shipping</span>
                          <span className="text-green-500" data-testid="order-shipping">Free</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Tax</span>
                          <span data-testid="order-tax">R 0.00</span>
                        </div>
                      </div>

                      <Separator />

                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span className="text-primary" data-testid="order-total">R {cartState.total.toFixed(2)}</span>
                      </div>

                      {/* Place Order Button */}
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full mt-6"
                        disabled={createOrderMutation.isPending}
                        data-testid="button-place-order"
                      >
                        {createOrderMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          `Place Order - R ${cartState.total.toFixed(2)}`
                        )}
                      </Button>

                      <p className="text-xs text-center text-muted-foreground mt-4">
                        By placing this order, you agree to our Terms of Service and Privacy Policy.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
