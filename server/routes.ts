import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth, requireAuth, requireAdmin } from "./auth";
import { storage } from "./storage";
import { insertProductSchema, insertOrderSchema, insertPortfolioSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Product routes
  app.get("/api/products", async (req, res, next) => {
    try {
      const { category, featured } = req.query;
      let products;
      
      if (category) {
        products = await storage.getProductsByCategory(category as string);
      } else if (featured === "true") {
        products = await storage.getFeaturedProducts();
      } else {
        products = await storage.getAllProducts();
      }
      
      res.json(products);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/products/:id", async (req, res, next) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/products", requireAdmin, async (req, res, next) => {
    try {
      const validation = insertProductSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid data", errors: validation.error.errors });
      }

      const product = await storage.createProduct(validation.data);
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/products/:id", requireAdmin, async (req, res, next) => {
    try {
      const validation = insertProductSchema.partial().safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid data", errors: validation.error.errors });
      }

      const product = await storage.updateProduct(req.params.id, validation.data);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/products/:id", requireAdmin, async (req, res, next) => {
    try {
      const deleted = await storage.deleteProduct(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  });

  // Order routes
  app.get("/api/orders", requireAuth, async (req, res, next) => {
    try {
      const user = req.user as any;
      let orders;
      
      if (user.role === "admin") {
        orders = await storage.getAllOrders();
      } else {
        orders = await storage.getOrdersByUser(user.id);
      }
      
      res.json(orders);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/orders", requireAuth, async (req, res, next) => {
    try {
      const validation = insertOrderSchema.safeParse({
        ...req.body,
        userId: (req.user as any).id,
      });
      
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid data", errors: validation.error.errors });
      }

      const order = await storage.createOrder(validation.data);
      res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/orders/:id/status", requireAdmin, async (req, res, next) => {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }

      const order = await storage.updateOrderStatus(req.params.id, status);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      next(error);
    }
  });

  // Portfolio routes
  app.get("/api/portfolio", async (req, res, next) => {
    try {
      const portfolio = await storage.getAllPortfolio();
      res.json(portfolio);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/portfolio", requireAdmin, async (req, res, next) => {
    try {
      const validation = insertPortfolioSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid data", errors: validation.error.errors });
      }

      const item = await storage.createPortfolioItem(validation.data);
      res.status(201).json(item);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/portfolio/:id", requireAdmin, async (req, res, next) => {
    try {
      const deleted = await storage.deletePortfolioItem(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Portfolio item not found" });
      }
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  });

  // User management routes (admin only)
  app.get("/api/users", requireAdmin, async (req, res, next) => {
    try {
      const users = await storage.getAllUsers();
      const usersWithoutPasswords = users.map(({ password, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/users/:id/role", requireAdmin, async (req, res, next) => {
    try {
      const { role } = req.body;
      if (!role || !["customer", "admin"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      const user = await storage.updateUserRole(req.params.id, role);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/users/:id", requireAdmin, async (req, res, next) => {
    try {
      const deleted = await storage.deleteUser(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "User not found" });
      }
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  });

  // Contact form endpoint
  app.post("/api/contact", async (req, res, next) => {
    try {
      const { firstName, lastName, email, service, message } = req.body;
      
      if (!firstName || !lastName || !email || !message) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // In a real app, you would send this to an email service
      console.log("Contact form submission:", { firstName, lastName, email, service, message });
      
      res.json({ message: "Contact form submitted successfully" });
    } catch (error) {
      next(error);
    }
  });

  // Analytics endpoint for admin dashboard
  app.get("/api/analytics", requireAdmin, async (req, res, next) => {
    try {
      const products = await storage.getAllProducts();
      const orders = await storage.getAllOrders();
      const users = await storage.getAllUsers();
      
      const totalSales = orders.reduce((sum, order) => sum + parseFloat(order.total), 0);
      
      res.json({
        totalSales: totalSales.toFixed(2),
        totalProducts: products.length,
        totalOrders: orders.length,
        totalCustomers: users.filter(user => user.role === "customer").length,
      });
    } catch (error) {
      next(error);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
