import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { Link } from "wouter";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { state, updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (productId: string, size: string, quantity: number) => {
    updateQuantity(productId, size, quantity);
  };

  const handleRemoveItem = (productId: string, size: string) => {
    removeFromCart(productId, size);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2" data-testid="cart-title">
            <ShoppingCart className="w-5 h-5" />
            Shopping Cart ({state.items.length})
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full pt-6">
          {state.items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
              <ShoppingCart className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4" data-testid="text-empty-cart">
                Your cart is empty
              </p>
              <Link href="/shop">
                <Button onClick={onClose} data-testid="button-shop-now">
                  Shop Now
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto space-y-4">
                {state.items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.size}`}
                    className="flex gap-4 p-4 border border-border rounded-lg"
                    data-testid={`cart-item-${item.product.id}-${item.size}`}
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                      data-testid={`cart-item-image-${item.product.id}`}
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate" data-testid={`cart-item-name-${item.product.id}`}>
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-muted-foreground" data-testid={`cart-item-size-${item.product.id}`}>
                        Size: {item.size}
                      </p>
                      <p className="text-sm font-medium text-primary" data-testid={`cart-item-price-${item.product.id}`}>
                        R {item.product.price}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleQuantityChange(item.product.id, item.size, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          data-testid={`button-decrease-${item.product.id}-${item.size}`}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        
                        <span className="w-8 text-center" data-testid={`cart-item-quantity-${item.product.id}-${item.size}`}>
                          {item.quantity}
                        </span>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleQuantityChange(item.product.id, item.size, item.quantity + 1)
                          }
                          data-testid={`button-increase-${item.product.id}-${item.size}`}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.product.id, item.size)}
                          className="ml-auto text-destructive hover:text-destructive"
                          data-testid={`button-remove-${item.product.id}-${item.size}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total:</span>
                  <span className="text-xl font-bold text-primary" data-testid="cart-total">
                    R {state.total.toFixed(2)}
                  </span>
                </div>

                <div className="space-y-2">
                  <Link href="/cart">
                    <Button variant="outline" className="w-full" onClick={onClose} data-testid="button-view-cart">
                      View Cart
                    </Button>
                  </Link>
                  
                  <Link href="/checkout">
                    <Button className="w-full" onClick={onClose} data-testid="button-checkout">
                      Checkout
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
