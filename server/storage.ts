import { type User, type InsertUser, type Product, type InsertProduct, type Order, type InsertOrder, type Portfolio, type InsertPortfolio } from "@shared/schema";
import { randomUUID } from "crypto";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUserRole(id: string, role: string): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;

  // Product methods
  getProduct(id: string): Promise<Product | undefined>;
  getAllProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;

  // Order methods
  getOrder(id: string): Promise<Order | undefined>;
  getAllOrders(): Promise<Order[]>;
  getOrdersByUser(userId: string): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;

  // Portfolio methods
  getPortfolioItem(id: string): Promise<Portfolio | undefined>;
  getAllPortfolio(): Promise<Portfolio[]>;
  createPortfolioItem(item: InsertPortfolio): Promise<Portfolio>;
  deletePortfolioItem(id: string): Promise<boolean>;

  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<string, Product>;
  private orders: Map<string, Order>;
  private portfolio: Map<string, Portfolio>;
  public sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.portfolio = new Map();
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      role: insertUser.role || "customer",
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async updateUserRole(id: string, role: string): Promise<User | undefined> {
    const user = this.users.get(id);
    if (user) {
      const updated = { ...user, role };
      this.users.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  // Product methods
  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.category === category);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.featured);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { 
      ...insertProduct, 
      id,
      sizes: Array.isArray(insertProduct.sizes) ? insertProduct.sizes : [],
      images: Array.isArray(insertProduct.images) ? insertProduct.images : [],
      stock: insertProduct.stock || 0,
      featured: insertProduct.featured || false,
      createdAt: new Date() 
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (product) {
      const updated = { 
        ...product, 
        ...updates,
        sizes: Array.isArray(updates.sizes) ? updates.sizes : product.sizes,
        images: Array.isArray(updates.images) ? updates.images : product.images
      };
      this.products.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  // Order methods
  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrdersByUser(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.userId === userId);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = { 
      ...insertOrder, 
      id,
      status: insertOrder.status || "pending",
      items: Array.isArray(insertOrder.items) ? insertOrder.items : [],
      createdAt: new Date() 
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (order) {
      const updated = { ...order, status };
      this.orders.set(id, updated);
      return updated;
    }
    return undefined;
  }

  // Portfolio methods
  async getPortfolioItem(id: string): Promise<Portfolio | undefined> {
    return this.portfolio.get(id);
  }

  async getAllPortfolio(): Promise<Portfolio[]> {
    return Array.from(this.portfolio.values());
  }

  async createPortfolioItem(insertItem: InsertPortfolio): Promise<Portfolio> {
    const id = randomUUID();
    const item: Portfolio = { 
      ...insertItem, 
      id,
      images: Array.isArray(insertItem.images) ? insertItem.images : [], 
      createdAt: new Date() 
    };
    this.portfolio.set(id, item);
    return item;
  }

  async deletePortfolioItem(id: string): Promise<boolean> {
    return this.portfolio.delete(id);
  }
}

export const storage = new MemStorage();
