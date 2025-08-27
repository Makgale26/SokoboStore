import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, ShoppingCart, Heart, Share2, ArrowLeft } from "lucide-react";
import { Product } from "@shared/schema";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ProductCarousel } from "@/components/product/product-carousel";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/hooks/use-toast";

export default function ProductPage() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { addToCart } = useCart();
  
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: [`/api/products/${params.id}`],
    enabled: !!params.id,
  });

  const { data: relatedProducts } = useQuery<Product[]>({
    queryKey: [`/api/products?category=${product?.category}`],
    enabled: !!product?.category,
  });

  const handleAddToCart = () => {
    if (!product) return;
    
    if (product.sizes.length > 0 && !selectedSize) {
      toast({
        title: "Please select a size",
        description: "You must select a size before adding to cart.",
        variant: "destructive",
      });
      return;
    }

    const size = product.sizes.length > 0 ? selectedSize : "One Size";
    addToCart(product, size, quantity);
    
    toast({
      title: "Added to cart",
      description: `${quantity}x ${product.name} (${size}) has been added to your cart.`,
    });
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 1)) {
      setQuantity(newQuantity);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Product link has been copied to clipboard.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="animate-pulse">
                <div className="h-96 bg-muted rounded-lg mb-4"></div>
                <div className="flex space-x-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-20 h-20 bg-muted rounded"></div>
                  ))}
                </div>
              </div>
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-6 bg-muted rounded w-1/2"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-10 bg-muted rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-2xl font-display font-bold mb-4" data-testid="product-not-found-title">
                Product Not Found
              </h1>
              <p className="text-muted-foreground mb-8" data-testid="product-not-found-description">
                The product you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => setLocation("/shop")} data-testid="button-back-to-shop">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Shop
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const filteredRelatedProducts = relatedProducts?.filter(p => p.id !== product.id).slice(0, 4) || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16">
        {/* Breadcrumb */}
        <section className="py-4 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <button onClick={() => setLocation("/shop")} className="hover:text-primary transition-colors" data-testid="breadcrumb-shop">
                Shop
              </button>
              <span>/</span>
              <button 
                onClick={() => setLocation(`/shop/${product.category}`)} 
                className="hover:text-primary transition-colors capitalize" 
                data-testid="breadcrumb-category"
              >
                {product.category}
              </button>
              <span>/</span>
              <span className="text-foreground" data-testid="breadcrumb-product">{product.name}</span>
            </div>
          </div>
        </section>

        {/* Product Details */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Product Images */}
              <div>
                <ProductCarousel images={product.images} productName={product.name} />
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h1 className="text-3xl font-display font-bold" data-testid="product-title">
                      {product.name}
                    </h1>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsLiked(!isLiked)}
                        className={isLiked ? "text-red-500" : "text-muted-foreground"}
                        data-testid="button-like-product"
                      >
                        <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleShare}
                        data-testid="button-share-product"
                      >
                        <Share2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="text-3xl font-bold text-primary" data-testid="product-price">
                      R {product.price}
                    </span>
                    
                    {product.featured && (
                      <Badge variant="secondary" className="bg-accent text-accent-foreground" data-testid="product-featured-badge">
                        FEATURED
                      </Badge>
                    )}
                    
                    {product.stock <= 5 && product.stock > 0 && (
                      <Badge variant="destructive" data-testid="product-low-stock-badge">
                        LOW STOCK ({product.stock} left)
                      </Badge>
                    )}
                    
                    {product.stock === 0 && (
                      <Badge variant="destructive" data-testid="product-out-of-stock-badge">
                        OUT OF STOCK
                      </Badge>
                    )}
                  </div>

                  <p className="text-muted-foreground text-lg leading-relaxed" data-testid="product-description">
                    {product.description}
                  </p>
                </div>

                <Separator />

                {/* Size Selection */}
                {product.sizes.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Size</h3>
                    <Select value={selectedSize} onValueChange={setSelectedSize}>
                      <SelectTrigger className="w-full" data-testid="size-select">
                        <SelectValue placeholder="Select a size" />
                      </SelectTrigger>
                      <SelectContent>
                        {product.sizes.map((size) => (
                          <SelectItem key={size} value={size} data-testid={`size-option-${size}`}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Quantity Selection */}
                <div>
                  <h3 className="font-semibold mb-3">Quantity</h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border border-border rounded-lg">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                        data-testid="button-decrease-quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="px-4 py-2 font-medium" data-testid="product-quantity">
                        {quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= product.stock}
                        data-testid="button-increase-quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <span className="text-sm text-muted-foreground" data-testid="stock-info">
                      {product.stock} in stock
                    </span>
                  </div>
                </div>

                {/* Add to Cart */}
                <div className="space-y-4">
                  <Button
                    size="lg"
                    className="w-full text-lg py-6"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    data-testid="button-add-to-cart"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" onClick={() => setLocation("/cart")} data-testid="button-view-cart">
                      View Cart
                    </Button>
                    <Button variant="outline" onClick={() => setLocation("/checkout")} data-testid="button-buy-now">
                      Buy Now
                    </Button>
                  </div>
                </div>

                {/* Product Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="capitalize" data-testid="product-category">{product.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SKU:</span>
                    <span data-testid="product-sku">{product.id.slice(-8).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Availability:</span>
                    <span className={product.stock > 0 ? "text-green-500" : "text-red-500"} data-testid="product-availability">
                      {product.stock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {filteredRelatedProducts.length > 0 && (
          <section className="py-16 bg-card">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-display font-bold mb-8 text-center" data-testid="related-products-title">
                Related Products
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" data-testid="related-products-grid">
                {filteredRelatedProducts.map((relatedProduct) => (
                  <Card key={relatedProduct.id} className="group cursor-pointer hover-lift overflow-hidden">
                    <div className="relative overflow-hidden">
                      <img
                        src={relatedProduct.images[0]}
                        alt={relatedProduct.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                        onClick={() => setLocation(`/product/${relatedProduct.id}`)}
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-1 truncate">{relatedProduct.name}</h3>
                      <p className="text-primary font-bold">R {relatedProduct.price}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
