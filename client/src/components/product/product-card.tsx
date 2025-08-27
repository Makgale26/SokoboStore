import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart } from "lucide-react";
import { Product } from "@shared/schema";
import { Link } from "wouter";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.sizes.length > 0) {
      addToCart(product, product.sizes[0]);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    }
  };

  const handleToggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <Link href={`/product/${product.id}`}>
      <Card
        className="group cursor-pointer hover-lift overflow-hidden bg-card/50 backdrop-blur-sm border-border/50"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        data-testid={`product-card-${product.id}`}
      >
        <div className="relative overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
            data-testid={`product-image-${product.id}`}
          />
          
          {product.featured && (
            <Badge
              variant="secondary"
              className="absolute top-4 left-4 bg-accent text-accent-foreground"
              data-testid={`product-badge-featured-${product.id}`}
            >
              NEW
            </Badge>
          )}
          
          {product.stock <= 5 && product.stock > 0 && (
            <Badge
              variant="destructive"
              className="absolute top-4 right-4"
              data-testid={`product-badge-stock-${product.id}`}
            >
              LOW STOCK
            </Badge>
          )}
          
          {product.stock === 0 && (
            <Badge
              variant="destructive"
              className="absolute top-4 right-4"
              data-testid={`product-badge-soldout-${product.id}`}
            >
              SOLD OUT
            </Badge>
          )}

          <div
            className={`absolute top-4 right-4 transition-opacity ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <Button
              variant="secondary"
              size="sm"
              onClick={handleToggleLike}
              className={`backdrop-blur-sm ${
                isLiked ? "text-red-500" : "text-foreground"
              }`}
              data-testid={`button-like-${product.id}`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            </Button>
          </div>
        </div>

        <CardContent className="p-6">
          <h3 className="text-xl font-display font-semibold mb-2" data-testid={`product-name-${product.id}`}>
            {product.name}
          </h3>
          <p className="text-muted-foreground mb-4 line-clamp-2" data-testid={`product-description-${product.id}`}>
            {product.description}
          </p>
          
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-primary" data-testid={`product-price-${product.id}`}>
              R {product.price}
            </span>
            
            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="hover:scale-105 transition-transform"
              data-testid={`button-add-cart-${product.id}`}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
