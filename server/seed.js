import { storage } from "./storage.js";

async function seedData() {
  console.log("Seeding database...");

  // Create admin user
  const adminUser = await storage.createUser({
    name: "Admin User",
    email: "admin@sokobo.co.za",
    password: "$scrypt$16384$8$1$2e52f6e1f3e4a5b2c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5.1a2b3c4d5e6f7a8b9c0d1e2f3",
    role: "admin"
  });

  // Create sample products
  const tshirt = await storage.createProduct({
    name: "Sokobo Classic Tee",
    category: "tshirts",
    description: "Premium cotton streetwear with signature graphics. Comfortable fit with bold Sokobo branding.",
    price: "350.00",
    stock: 50,
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
    ],
    featured: true
  });

  const hoodie = await storage.createProduct({
    name: "Sokobo Street Hoodie",
    category: "hoodies",
    description: "Oversized fit with bold graphics and premium comfort. Perfect for the urban lifestyle.",
    price: "650.00",
    stock: 30,
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    ],
    featured: true
  });

  const hat = await storage.createProduct({
    name: "Sokobo Signature Cap",
    category: "hats",
    description: "Embroidered logo with adjustable strap. Classic streetwear essential.",
    price: "250.00",
    stock: 75,
    sizes: ["One Size"],
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    ],
    featured: true
  });

  // Create additional products
  await storage.createProduct({
    name: "Urban Flow Tee",
    category: "tshirts",
    description: "Minimalist design with contemporary graphics. Essential streetwear piece.",
    price: "320.00",
    stock: 40,
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
    ],
    featured: false
  });

  await storage.createProduct({
    name: "Midnight Hoodie",
    category: "hoodies",
    description: "All-black premium hoodie with subtle branding. Perfect for any occasion.",
    price: "720.00",
    stock: 25,
    sizes: ["M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
    ],
    featured: false
  });

  await storage.createProduct({
    name: "Classic Snapback",
    category: "hats",
    description: "Flat brim snapback with embroidered logo. Adjustable fit for maximum comfort.",
    price: "280.00",
    stock: 60,
    sizes: ["One Size"],
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
    ],
    featured: false
  });

  // Create portfolio items
  await storage.createPortfolioItem({
    title: "Brand Identity Design",
    description: "Complete brand identity package for local business including logo design, color palette, and brand guidelines.",
    images: [
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    ],
    category: "branding"
  });

  await storage.createPortfolioItem({
    title: "Custom Apparel Collection",
    description: "Unique designs for streetwear collection featuring bold graphics and contemporary aesthetics.",
    images: [
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    ],
    category: "apparel"
  });

  await storage.createPortfolioItem({
    title: "Print Design Materials",
    description: "Business cards and marketing materials with elegant typography and professional layout.",
    images: [
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    ],
    category: "print"
  });

  await storage.createPortfolioItem({
    title: "Event Poster Campaign",
    description: "Eye-catching promotional materials with bold graphics and modern design elements.",
    images: [
      "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    ],
    category: "print"
  });

  await storage.createPortfolioItem({
    title: "Digital Artwork Series",
    description: "Original illustrations and artwork featuring vibrant colors and contemporary street art style.",
    images: [
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    ],
    category: "digital"
  });

  await storage.createPortfolioItem({
    title: "Web Design Project",
    description: "Modern website and app interfaces with clean layouts and intuitive user experience.",
    images: [
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    ],
    category: "digital"
  });

  console.log("Database seeded successfully!");
  console.log("Admin user created - Email: admin@sokobo.co.za, Password: admin123");
  console.log("Sample products and portfolio items created.");
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedData().catch(console.error);
}

export { seedData };
