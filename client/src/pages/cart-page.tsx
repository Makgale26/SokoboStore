import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useCart } from "@/lib/cart-context";
import { Link } from "wouter";

export default function CartPage() {
  const { state, updateQuantity, removeFromCart, clearCart } = useCart();

  const handleQuantityChange = (productId: string, size: string, quantity: number) => {
    updateQuantity(productId, size, quantity);
  };

  const handleRemoveItem = (productId: string, size: string) => {
    removeFromCart(productId, size);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16">
        {/* Header */}
        <section className="py-8 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-display font-bold mb-2" data-testid="cart-title">
                  Shopping Cart
                </h1>
                <p className="text-muted-foreground" data-testid="cart-item-count">
                  {state.items.length} {state.items.length === 1 ? 'item' : 'items'} in your cart
                </p>
              </div>
              
              <Link href="/shop">
                <Button variant="outline" data-testid="button-continue-shopping">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Cart Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {state.items.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingCart className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
                <h2 className="text-2xl font-display font-semibold mb-4" data-testid="empty-cart-title">
                  Your cart is empty
                </h2>
                <p className="text-muted-foreground mb-8" data-testid="empty-cart-description">
                  Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
                </p>
                <Link href="/shop">
                  <Button size="lg" data-testid="button-start-shopping">
                    Start Shopping
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-display font-semibold">Cart Items</h2>
                    <Button
                      variant="ghost"
                      onClick={clearCart}
                      className="text-destructive hover:text-destructive"
                      data-testid="button-clear-cart"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear Cart
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {state.items.map((item) => (
                      <Card 
                        key={`${item.product.id}-${item.size}`} 
                        className="glass-card" 
                        data-testid={`cart-item-${item.product.id}-${item.size}`}
                      >
                        <CardContent className="p-6">
                          <div className="flex gap-6">
                            {/* Product Image */}
                            <div className="flex-shrink-0">
                              <img
                                src={item.product.images[0]}
                                alt={item.product.name}
                                className="w-24 h-24 object-cover rounded-lg"
                                data-testid={`cart-item-image-${item.product.id}`}
                              />
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h3 className="font-display font-semibold text-lg" data-testid={`cart-item-name-${item.product.id}`}>
                                    {item.product.name}
                                  </h3>
                                  <p className="text-muted-foreground" data-testid={`cart-item-size-${item.product.id}`}>
                                    Size: {item.size}
                                  </p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveItem(item.product.id, item.size)}
                                  className="text-destructive hover:text-destructive"
                                  data-testid={`button-remove-${item.product.id}-${item.size}`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>

                              <div className="flex items-center justify-between">
                                {/* Quantity Controls */}
                                <div className="flex items-center space-x-3">
                                  <span className="text-sm text-muted-foreground">Qty:</span>
                                  <div className="flex items-center border border-border rounded-lg">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleQuantityChange(item.product.id, item.size, item.quantity - 1)}
                                      disabled={item.quantity <= 1}
                                      data-testid={`button-decrease-${item.product.id}-${item.size}`}
                                    >
                                      <Minus className="w-3 h-3" />
                                    </Button>
                                    <span className="px-3 py-1 text-sm font-medium" data-testid={`quantity-${item.product.id}-${item.size}`}>
                                      {item.quantity}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleQuantityChange(item.product.id, item.size, item.quantity + 1)}
                                      data-testid={`button-increase-${item.product.id}-${item.size}`}
                                    >
                                      <Plus className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>

                                {/* Price */}
                                <div className="text-right">
                                  <p className="text-sm text-muted-foreground">R {item.product.price} each</p>
                                  <p className="font-semibold text-lg text-primary" data-testid={`item-total-${item.product.id}-${item.size}`}>
                                    R {(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <Card className="glass-card sticky top-24">
                    <CardHeader>
                      <CardTitle className="font-display" data-testid="order-summary-title">Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Subtotal ({state.items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                          <span data-testid="cart-subtotal">R {state.total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Shipping</span>
                          <span className="text-green-500" data-testid="shipping-cost">Free</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Tax</span>
                          <span data-testid="tax-amount">R 0.00</span>
                        </div>
                      </div>

                      <Separator />

                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span className="text-primary" data-testid="cart-total">R {state.total.toFixed(2)}</span>
                      </div>

                      <div className="space-y-3 pt-4">
                        <Link href="/checkout">
                          <Button size="lg" className="w-full" data-testid="button-checkout">
                            Proceed to Checkout
                          </Button>
                        </Link>
                        
                        <Link href="/shop">
                          <Button variant="outline" size="lg" className="w-full" data-testid="button-continue-shopping-summary">
                            Continue Shopping
                          </Button>
                        </Link>
                      </div>

                      {/* Security Badge */}
                      <div className="text-center pt-4 border-t border-border">
                        <p className="text-xs text-muted-foreground">
                          Secure checkout powered by industry-standard encryption
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
