import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  DollarSign,
  TrendingUp,
  Camera,
  Upload,
  Loader2,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Product, Order, Portfolio, User } from "@shared/schema";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  category: z.enum(["tshirts", "hoodies", "hats"]),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.string().min(1, "Price is required"),
  stock: z.number().min(0, "Stock must be at least 0"),
  sizes: z.array(z.string()).min(1, "At least one size is required"),
  images: z.array(z.string()).min(1, "At least one image URL is required"),
  featured: z.boolean(),
});

const portfolioSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  images: z.array(z.string()).min(1, "At least one image URL is required"),
  category: z.enum(["branding", "print", "digital", "apparel"]),
});

type ProductFormData = z.infer<typeof productSchema>;
type PortfolioFormData = z.infer<typeof portfolioSchema>;

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isPortfolioDialogOpen, setIsPortfolioDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(null);

  // Redirect if not admin
  if (user?.role !== "admin") {
    setLocation("/");
    return <div>Redirecting...</div>;
  }

  // Queries
  const { data: analytics, isLoading: analyticsLoading } = useQuery<{
    totalSales: string;
    totalProducts: number;
    totalOrders: number;
    totalCustomers: number;
  }>({
    queryKey: ["/api/analytics"],
  });

  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: orders, isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  const { data: portfolio, isLoading: portfolioLoading } = useQuery<Portfolio[]>({
    queryKey: ["/api/portfolio"],
  });

  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  // Product form
  const productForm = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      category: "tshirts",
      description: "",
      price: "",
      stock: 0,
      sizes: [],
      images: [],
      featured: false,
    },
  });

  // Portfolio form
  const portfolioForm = useForm<PortfolioFormData>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      title: "",
      description: "",
      images: [],
      category: "branding",
    },
  });

  // Mutations
  const createProductMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const response = await apiRequest("POST", "/api/products", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics"] });
      setIsProductDialogOpen(false);
      productForm.reset();
      toast({ title: "Product created successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to create product", description: error.message, variant: "destructive" });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ProductFormData }) => {
      const response = await apiRequest("PUT", `/api/products/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics"] });
      setIsProductDialogOpen(false);
      setEditingProduct(null);
      productForm.reset();
      toast({ title: "Product updated successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to update product", description: error.message, variant: "destructive" });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics"] });
      toast({ title: "Product deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to delete product", description: error.message, variant: "destructive" });
    },
  });

  const createPortfolioMutation = useMutation({
    mutationFn: async (data: PortfolioFormData) => {
      const response = await apiRequest("POST", "/api/portfolio", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      setIsPortfolioDialogOpen(false);
      portfolioForm.reset();
      toast({ title: "Portfolio item created successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to create portfolio item", description: error.message, variant: "destructive" });
    },
  });

  const deletePortfolioMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/portfolio/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      toast({ title: "Portfolio item deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to delete portfolio item", description: error.message, variant: "destructive" });
    },
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiRequest("PUT", `/api/orders/${id}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({ title: "Order status updated successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to update order status", description: error.message, variant: "destructive" });
    },
  });

  const updateUserRoleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      const response = await apiRequest("PUT", `/api/users/${id}/role`, { role });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({ title: "User role updated successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to update user role", description: error.message, variant: "destructive" });
    },
  });

  // Helper functions
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    productForm.reset({
      name: product.name,
      category: product.category as "tshirts" | "hoodies" | "hats",
      description: product.description,
      price: product.price,
      stock: product.stock,
      sizes: product.sizes,
      images: product.images,
      featured: product.featured,
    });
    setIsProductDialogOpen(true);
  };

  const handleAddImageUrl = (field: "images", form: any, currentImages: string[]) => {
    const imageUrl = prompt("Enter image URL:");
    if (imageUrl) {
      form.setValue(field, [...currentImages, imageUrl]);
    }
  };

  const handleRemoveImage = (field: "images", form: any, index: number, currentImages: string[]) => {
    const newImages = currentImages.filter((_, i) => i !== index);
    form.setValue(field, newImages);
  };

  const handleAddSize = (currentSizes: string[]) => {
    const size = prompt("Enter size (e.g., S, M, L, XL):");
    if (size && !currentSizes.includes(size)) {
      productForm.setValue("sizes", [...currentSizes, size]);
    }
  };

  const handleRemoveSize = (index: number, currentSizes: string[]) => {
    const newSizes = currentSizes.filter((_, i) => i !== index);
    productForm.setValue("sizes", newSizes);
  };

  const onProductSubmit = (data: ProductFormData) => {
    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, data });
    } else {
      createProductMutation.mutate(data);
    }
  };

  const onPortfolioSubmit = (data: PortfolioFormData) => {
    createPortfolioMutation.mutate(data);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500";
      case "processing": return "bg-blue-500";
      case "shipped": return "bg-purple-500";
      case "delivered": return "bg-green-500";
      case "cancelled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="w-4 h-4" />;
      case "processing": return <Loader2 className="w-4 h-4" />;
      case "shipped": return <Package className="w-4 h-4" />;
      case "delivered": return <CheckCircle className="w-4 h-4" />;
      case "cancelled": return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16">
        {/* Header */}
        <section className="py-8 bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-display font-bold mb-2" data-testid="admin-title">
                  Admin Dashboard
                </h1>
                <p className="text-muted-foreground" data-testid="admin-description">
                  Manage products, orders, portfolio, and users
                </p>
              </div>
              <Badge variant="secondary" className="bg-primary/20 text-primary" data-testid="admin-badge">
                Administrator
              </Badge>
            </div>
          </div>
        </section>

        {/* Dashboard Content */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
                <TabsTrigger value="products" data-testid="tab-products">Products</TabsTrigger>
                <TabsTrigger value="orders" data-testid="tab-orders">Orders</TabsTrigger>
                <TabsTrigger value="portfolio" data-testid="tab-portfolio">Portfolio</TabsTrigger>
                <TabsTrigger value="users" data-testid="tab-users">Users</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="stats-grid">
                  <Card className="glass-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-muted-foreground text-sm">Total Sales</p>
                          <p className="text-2xl font-bold text-accent" data-testid="stat-total-sales">
                            {analyticsLoading ? "..." : `R ${analytics?.totalSales || "0.00"}`}
                          </p>
                        </div>
                        <DollarSign className="text-accent w-8 h-8" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-muted-foreground text-sm">Products</p>
                          <p className="text-2xl font-bold text-primary" data-testid="stat-total-products">
                            {analyticsLoading ? "..." : analytics?.totalProducts || "0"}
                          </p>
                        </div>
                        <Package className="text-primary w-8 h-8" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-muted-foreground text-sm">Orders</p>
                          <p className="text-2xl font-bold text-destructive" data-testid="stat-total-orders">
                            {analyticsLoading ? "..." : analytics?.totalOrders || "0"}
                          </p>
                        </div>
                        <ShoppingCart className="text-destructive w-8 h-8" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-muted-foreground text-sm">Customers</p>
                          <p className="text-2xl font-bold text-foreground" data-testid="stat-total-customers">
                            {analyticsLoading ? "..." : analytics?.totalCustomers || "0"}
                          </p>
                        </div>
                        <Users className="text-foreground w-8 h-8" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Orders */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="font-display" data-testid="recent-orders-title">Recent Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {ordersLoading ? (
                      <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="h-12 bg-muted rounded animate-pulse"></div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3" data-testid="recent-orders-list">
                        {orders?.slice(0, 5).map((order) => (
                          <div key={order.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                            <div className="flex items-center space-x-3">
                              {getStatusIcon(order.status)}
                              <div>
                                <p className="font-medium" data-testid={`order-id-${order.id}`}>
                                  #{order.id.slice(-8).toUpperCase()}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold" data-testid={`order-total-${order.id}`}>R {order.total}</p>
                              <Badge variant="outline" className={`${getStatusColor(order.status)} text-white`}>
                                {order.status}
                              </Badge>
                            </div>
                          </div>
                        )) || <p className="text-muted-foreground text-center py-8">No orders yet</p>}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Products Tab */}
              <TabsContent value="products" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-display font-bold" data-testid="products-title">Products Management</h2>
                  <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                    <DialogTrigger asChild>
                      <Button data-testid="button-add-product">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Product
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle data-testid="product-dialog-title">
                          {editingProduct ? "Edit Product" : "Add New Product"}
                        </DialogTitle>
                      </DialogHeader>
                      <form onSubmit={productForm.handleSubmit(onProductSubmit)} className="space-y-4">
                        <div>
                          <Label htmlFor="product-name">Name</Label>
                          <Input
                            id="product-name"
                            {...productForm.register("name")}
                            placeholder="Product name"
                            data-testid="input-product-name"
                          />
                          {productForm.formState.errors.name && (
                            <p className="text-sm text-destructive mt-1">{productForm.formState.errors.name.message}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="product-category">Category</Label>
                          <Select
                            value={productForm.watch("category")}
                            onValueChange={(value) => productForm.setValue("category", value as "tshirts" | "hoodies" | "hats")}
                          >
                            <SelectTrigger data-testid="select-product-category">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="tshirts">T-Shirts</SelectItem>
                              <SelectItem value="hoodies">Hoodies</SelectItem>
                              <SelectItem value="hats">Hats</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="product-description">Description</Label>
                          <Textarea
                            id="product-description"
                            {...productForm.register("description")}
                            placeholder="Product description"
                            rows={3}
                            data-testid="input-product-description"
                          />
                          {productForm.formState.errors.description && (
                            <p className="text-sm text-destructive mt-1">{productForm.formState.errors.description.message}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="product-price">Price (R)</Label>
                            <Input
                              id="product-price"
                              {...productForm.register("price")}
                              placeholder="0.00"
                              type="number"
                              step="0.01"
                              data-testid="input-product-price"
                            />
                            {productForm.formState.errors.price && (
                              <p className="text-sm text-destructive mt-1">{productForm.formState.errors.price.message}</p>
                            )}
                          </div>

                          <div>
                            <Label htmlFor="product-stock">Stock</Label>
                            <Input
                              id="product-stock"
                              {...productForm.register("stock", { valueAsNumber: true })}
                              placeholder="0"
                              type="number"
                              min="0"
                              data-testid="input-product-stock"
                            />
                            {productForm.formState.errors.stock && (
                              <p className="text-sm text-destructive mt-1">{productForm.formState.errors.stock.message}</p>
                            )}
                          </div>
                        </div>

                        <div>
                          <Label>Sizes</Label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {productForm.watch("sizes").map((size, index) => (
                              <Badge key={index} variant="outline" className="cursor-pointer" onClick={() => handleRemoveSize(index, productForm.watch("sizes"))}>
                                {size} ×
                              </Badge>
                            ))}
                          </div>
                          <Button type="button" variant="outline" onClick={() => handleAddSize(productForm.watch("sizes"))} data-testid="button-add-size">
                            Add Size
                          </Button>
                        </div>

                        <div>
                          <Label>Images</Label>
                          <div className="space-y-2 mb-2">
                            {productForm.watch("images").map((image, index) => (
                              <div key={index} className="flex items-center gap-2 p-2 border border-border rounded">
                                <img src={image} alt={`Product ${index + 1}`} className="w-12 h-12 object-cover rounded" />
                                <span className="flex-1 text-sm truncate">{image}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveImage("images", productForm, index, productForm.watch("images"))}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleAddImageUrl("images", productForm, productForm.watch("images"))}
                            data-testid="button-add-image"
                          >
                            <Camera className="w-4 h-4 mr-2" />
                            Add Image URL
                          </Button>
                        </div>

                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="product-featured"
                            {...productForm.register("featured")}
                            className="rounded"
                            data-testid="checkbox-product-featured"
                          />
                          <Label htmlFor="product-featured">Featured Product</Label>
                        </div>

                        <div className="flex justify-end space-x-2">
                          <Button type="button" variant="outline" onClick={() => setIsProductDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button 
                            type="submit" 
                            disabled={createProductMutation.isPending || updateProductMutation.isPending}
                            data-testid="button-save-product"
                          >
                            {(createProductMutation.isPending || updateProductMutation.isPending) && (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            )}
                            {editingProduct ? "Update" : "Create"} Product
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                <Card className="glass-card">
                  <CardContent className="p-0">
                    {productsLoading ? (
                      <div className="p-6">
                        <div className="space-y-3">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-16 bg-muted rounded animate-pulse"></div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {products?.map((product) => (
                            <TableRow key={product.id} data-testid={`product-row-${product.id}`}>
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="w-12 h-12 object-cover rounded"
                                  />
                                  <div>
                                    <p className="font-medium">{product.name}</p>
                                    <p className="text-sm text-muted-foreground">{product.id.slice(-8)}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="capitalize">{product.category}</TableCell>
                              <TableCell>R {product.price}</TableCell>
                              <TableCell>{product.stock}</TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  {product.featured && <Badge variant="secondary">Featured</Badge>}
                                  <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditProduct(product)}
                                    data-testid={`button-edit-product-${product.id}`}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deleteProductMutation.mutate(product.id)}
                                    className="text-destructive hover:text-destructive"
                                    data-testid={`button-delete-product-${product.id}`}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          )) || (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                No products found
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Orders Tab */}
              <TabsContent value="orders" className="space-y-6">
                <h2 className="text-2xl font-display font-bold" data-testid="orders-title">Orders Management</h2>

                <Card className="glass-card">
                  <CardContent className="p-0">
                    {ordersLoading ? (
                      <div className="p-6">
                        <div className="space-y-3">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-16 bg-muted rounded animate-pulse"></div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orders?.map((order) => (
                            <TableRow key={order.id} data-testid={`order-row-${order.id}`}>
                              <TableCell>
                                <p className="font-mono">#{order.id.slice(-8).toUpperCase()}</p>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{order.shippingAddress.name}</p>
                                  <p className="text-sm text-muted-foreground">{order.shippingAddress.phone}</p>
                                </div>
                              </TableCell>
                              <TableCell className="font-semibold">R {order.total}</TableCell>
                              <TableCell>
                                <Select
                                  value={order.status}
                                  onValueChange={(value) => updateOrderStatusMutation.mutate({ id: order.id, status: value })}
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="processing">Processing</SelectItem>
                                    <SelectItem value="shipped">Shipped</SelectItem>
                                    <SelectItem value="delivered">Delivered</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm" data-testid={`button-view-order-${order.id}`}>
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          )) || (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                No orders found
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Portfolio Tab */}
              <TabsContent value="portfolio" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-display font-bold" data-testid="portfolio-title">Portfolio Management</h2>
                  <Dialog open={isPortfolioDialogOpen} onOpenChange={setIsPortfolioDialogOpen}>
                    <DialogTrigger asChild>
                      <Button data-testid="button-add-portfolio">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Portfolio Item
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle data-testid="portfolio-dialog-title">Add New Portfolio Item</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={portfolioForm.handleSubmit(onPortfolioSubmit)} className="space-y-4">
                        <div>
                          <Label htmlFor="portfolio-title">Title</Label>
                          <Input
                            id="portfolio-title"
                            {...portfolioForm.register("title")}
                            placeholder="Portfolio item title"
                            data-testid="input-portfolio-title"
                          />
                          {portfolioForm.formState.errors.title && (
                            <p className="text-sm text-destructive mt-1">{portfolioForm.formState.errors.title.message}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="portfolio-category">Category</Label>
                          <Select
                            value={portfolioForm.watch("category")}
                            onValueChange={(value) => portfolioForm.setValue("category", value as "branding" | "print" | "digital" | "apparel")}
                          >
                            <SelectTrigger data-testid="select-portfolio-category">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="branding">Branding</SelectItem>
                              <SelectItem value="print">Print Design</SelectItem>
                              <SelectItem value="digital">Digital Art</SelectItem>
                              <SelectItem value="apparel">Apparel Design</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="portfolio-description">Description</Label>
                          <Textarea
                            id="portfolio-description"
                            {...portfolioForm.register("description")}
                            placeholder="Portfolio item description"
                            rows={3}
                            data-testid="input-portfolio-description"
                          />
                          {portfolioForm.formState.errors.description && (
                            <p className="text-sm text-destructive mt-1">{portfolioForm.formState.errors.description.message}</p>
                          )}
                        </div>

                        <div>
                          <Label>Images</Label>
                          <div className="space-y-2 mb-2">
                            {portfolioForm.watch("images").map((image, index) => (
                              <div key={index} className="flex items-center gap-2 p-2 border border-border rounded">
                                <img src={image} alt={`Portfolio ${index + 1}`} className="w-12 h-12 object-cover rounded" />
                                <span className="flex-1 text-sm truncate">{image}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveImage("images", portfolioForm, index, portfolioForm.watch("images"))}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleAddImageUrl("images", portfolioForm, portfolioForm.watch("images"))}
                            data-testid="button-add-portfolio-image"
                          >
                            <Camera className="w-4 h-4 mr-2" />
                            Add Image URL
                          </Button>
                        </div>

                        <div className="flex justify-end space-x-2">
                          <Button type="button" variant="outline" onClick={() => setIsPortfolioDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button 
                            type="submit" 
                            disabled={createPortfolioMutation.isPending}
                            data-testid="button-save-portfolio"
                          >
                            {createPortfolioMutation.isPending && (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            )}
                            Create Portfolio Item
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="portfolio-grid">
                  {portfolioLoading ? (
                    [...Array(6)].map((_, i) => (
                      <Card key={i} className="animate-pulse">
                        <div className="h-48 bg-muted rounded-t-lg"></div>
                        <CardContent className="p-4">
                          <div className="h-4 bg-muted rounded mb-2"></div>
                          <div className="h-3 bg-muted rounded mb-2"></div>
                          <div className="h-3 w-20 bg-muted rounded"></div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    portfolio?.map((item) => (
                      <Card key={item.id} className="glass-card overflow-hidden" data-testid={`portfolio-card-${item.id}`}>
                        <div className="relative">
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            className="w-full h-48 object-cover"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => deletePortfolioMutation.mutate(item.id)}
                            data-testid={`button-delete-portfolio-${item.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline" className="capitalize">
                              {item.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="font-display font-semibold mb-2">{item.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                        </CardContent>
                      </Card>
                    )) || (
                      <div className="col-span-full text-center py-12 text-muted-foreground">
                        No portfolio items found
                      </div>
                    )
                  )}
                </div>
              </TabsContent>

              {/* Users Tab */}
              <TabsContent value="users" className="space-y-6">
                <h2 className="text-2xl font-display font-bold" data-testid="users-title">Users Management</h2>

                <Card className="glass-card">
                  <CardContent className="p-0">
                    {usersLoading ? (
                      <div className="p-6">
                        <div className="space-y-3">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-16 bg-muted rounded animate-pulse"></div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users?.map((user) => (
                            <TableRow key={user.id} data-testid={`user-row-${user.id}`}>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{user.name}</p>
                                  <p className="text-sm text-muted-foreground">{user.id.slice(-8)}</p>
                                </div>
                              </TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>
                                <Select
                                  value={user.role}
                                  onValueChange={(value) => updateUserRoleMutation.mutate({ id: user.id, role: value })}
                                  disabled={user.email === "admin@sokobo.co.za"}
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="customer">Customer</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                                  {user.role}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          )) || (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                No users found
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
