// // import express from "express";
// // import cors from "cors";
// // import dotenv from "dotenv";
// // import mongoose from "mongoose";
// // import bcrypt from "bcryptjs";
// // import jwt from "jsonwebtoken";
// // // import jwt from "jsonwebtoken";
// // import Razorpay from "razorpay";
// // import crypto from "crypto";

// // dotenv.config();

// // const app = express();

// // app.use(cors());
// // app.use(express.json());

// // const razorpay = new Razorpay({
// //   key_id: process.env.RAZORPAY_KEY_ID,
// //   key_secret: process.env.RAZORPAY_KEY_SECRET,
// // });

// // /* =========================
// //    PRODUCT SCHEMA
// // ========================= */

// // const productSchema = new mongoose.Schema(
// //   {
// //     name: { type: String, required: true, trim: true },
// //     category: { type: String, default: "General" },
// //     price: { type: Number, required: true, min: 0 },
// //     variants: [
// //       {
// //         size: { type: String, required: true },
// //         price: { type: Number, min: 0 },
// //         originalPrice: { type: Number, min: 0 },
// //         offerPrice: { type: Number, min: 0 },
// //         buyingPrice: { type: Number, min: 0 },
// //       },
// //     ],
// //     image: { type: String, default: "" },
// //     images: { type: [String], default: [] },
// //     videoUrl: { type: String, default: "" },
// //     description: { type: String, default: "" },
// //     featured: { type: Boolean, default: false },
// //     enabled: { type: Boolean, default: true },
// //   },
// //   { timestamps: true }
// // );

// // /* =========================
// //    ORDER SCHEMA
// // ========================= */

// // const orderSchema = new mongoose.Schema(
// //   {
// //     customer: {
// //       name: { type: String, required: true },
// //       email: String,
// //       phone: { type: String, required: true },
// //       address: { type: String, required: true },
// //       city: String,
// //       pincode: String,
// //     },
// //     items: [
// //       {
// //         productId: String,
// //         name: String,
// //         price: Number,
// //         quantity: Number,
// //         size: String,
// //         image: String,
// //       },
// //     ],
// //     subtotal: { type: Number, required: true },
// //     deliveryCharge: { type: Number, required: true, default: 50 },
// //     total: { type: Number, required: true },
// //     paymentMethod: {
// //       type: String,
// //       enum: ["COD", "ONLINE"],
// //       default: "COD",
// //     },
// //     paymentStatus: {
// //       type: String,
// //       enum: ["Pending", "Paid", "Failed"],
// //       default: "Pending",
// //     },
// //     status: {
// //       type: String,
// //       enum: [
// //         "Pending",
// //         "Confirmed",
// //         "Packed",
// //         "Shipped",
// //         "Delivered",
// //         "Cancelled",
// //       ],
// //       default: "Pending",
// //     },
// //     paymentStatus: {
// //   type: String,
// //   enum: ["Pending", "Paid", "Failed"],
// //   default: "Pending",
// // },
// //   },
// //   { timestamps: true }
// // );

// // /* =========================
// //    ADMIN SCHEMA
// // ========================= */

// // const adminSchema = new mongoose.Schema({
// //   email: { type: String, unique: true, required: true },
// //   password: { type: String, required: true },
// //   role: { type: String, default: "admin" },
// // });

// // const Product = mongoose.model("Product", productSchema);
// // const Order = mongoose.model("Order", orderSchema);
// // const Admin = mongoose.model("Admin", adminSchema);

// // /* =========================
// //    AUTH
// // ========================= */

// // function signToken(admin) {
// //   return jwt.sign(
// //     {
// //       id: admin._id.toString(),
// //       role: admin.role,
// //       email: admin.email,
// //     },
// //     process.env.JWT_SECRET,
// //     { expiresIn: "1d" }
// //   );
// // }

// // function adminAuth(req, res, next) {
// //   const header = req.headers.authorization;

// //   if (!header?.startsWith("Bearer ")) {
// //     return res.status(401).json({
// //       message: "Admin authentication required",
// //     });
// //   }

// //   try {
// //     const token = header.split(" ")[1];
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);

// //     if (decoded.role !== "admin") {
// //       return res.status(403).json({
// //         message: "Admin access only",
// //       });
// //     }

// //     req.admin = decoded;
// //     next();
// //   } catch {
// //     return res.status(401).json({
// //       message: "Invalid or expired token",
// //     });
// //   }
// // }

// // /* =========================
// //    SHIPPING + PRODUCT HELPERS
// // ========================= */

// // const DELIVERY_CHARGE = 50;
// // const FREE_SHIPPING_THRESHOLD = 1000;

// // function normalizeVariants(price, variants) {
// //   const base = Number(price || 0);
// //   const fallback = [
// //     { size: "100ml", price: base, originalPrice: base, offerPrice: base, buyingPrice: 0 },
// //     { size: "200ml", price: base + 100, originalPrice: base + 100, offerPrice: base + 100, buyingPrice: 0 },
// //     { size: "500ml", price: base + 250, originalPrice: base + 250, offerPrice: base + 250, buyingPrice: 0 },
// //   ];
// //   if (!Array.isArray(variants) || !variants.length) return fallback;
// //   const clean = variants
// //     .filter(v => v?.size && Number(v?.offerPrice ?? v?.price) >= 0)
// //     .map(v => {
// //       const offer = Number(v.offerPrice ?? v.price ?? 0);
// //       return {
// //         size: String(v.size),
// //         price: offer,
// //         originalPrice: Number(v.originalPrice ?? offer),
// //         offerPrice: offer,
// //         buyingPrice: Number(v.buyingPrice ?? 0),
// //       };
// //     });
// //   return clean.length ? clean : fallback;
// // }

// // function calculateOrderTotals(items) {
// //   const subtotal = items.reduce(
// //     (sum, item) => sum + Number(item.price) * Number(item.quantity),
// //     0
// //   );
// //   const deliveryCharge = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : DELIVERY_CHARGE;
// //   return { subtotal, deliveryCharge, total: subtotal + deliveryCharge };
// // }

// // /* =========================
// //    DEMO PRODUCTS
// // ========================= */

// // const seedProducts = [
// //   {
// //     name: "Aloe Vera Face Wash",
// //     category: "Face Care",
// //     price: 229,
// //     image:
// //       "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=900&q=80",
// //     images: [
// //       "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=900&q=80",
// //       "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=900&q=80",
// //       "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=80",
// //       "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=900&q=80",
// //     ],
// //     videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
// //     description:
// //       "Gentle aloe vera face wash for a fresh, clean feel.",
// //     featured: true,
// //   },

// //   {
// //     name: "Neem Tulsi Face Serum",
// //     category: "Face Care",
// //     price: 449,
// //     image:
// //       "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80",
// //     description:
// //       "Lightweight botanical serum with neem and tulsi inspired care.",
// //     featured: true,
// //   },

// //   {
// //     name: "Rice Water Face Cream",
// //     category: "Face Care",
// //     price: 399,
// //     image:
// //       "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=900&q=80",
// //     description:
// //       "Rich yet comfortable daily face cream.",
// //     featured: true,
// //   },

// //   {
// //     name: "Herbal Shampoo",
// //     category: "Hair Care",
// //     price: 349,
// //     image:
// //       "https://images.unsplash.com/photo-1620917670394-6c3b8d0a8c0c?auto=format&fit=crop&w=900&q=80",
// //     description:
// //       "Botanical shampoo for everyday hair care.",
// //     featured: true,
// //   },

// //   {
// //     name: "Multani Mitti Face Mask",
// //     category: "Face Masks",
// //     price: 199,
// //     image:
// //       "https://images.unsplash.com/photo-1570194065650-d99fb4abbd1b?auto=format&fit=crop&w=900&q=80",
// //     description:
// //       "Classic clay-based face mask for a refreshed routine.",
// //     featured: true,
// //   },

// //   {
// //     name: "Vitamin C Face Wash",
// //     category: "Face Care",
// //     price: 249,
// //     image:
// //       "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=80",
// //     description:
// //       "Fresh daily cleanser with vitamin C inspired skincare.",
// //     featured: false,
// //   },

// //   {
// //     name: "Argan Hair Oil",
// //     category: "Hair Care",
// //     price: 499,
// //     image:
// //       "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=80",
// //     description:
// //       "Nourishing hair oil for smooth and healthy-looking hair.",
// //     featured: false,
// //   },

// //   {
// //     name: "Rose Water Toner",
// //     category: "Face Care",
// //     price: 299,
// //     image:
// //       "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=80",
// //     description:
// //       "Refreshing rose water toner for daily skincare.",
// //     featured: false,
// //   },

// //   {
// //     name: "Aloe Vera Gel",
// //     category: "Body Care",
// //     price: 199,
// //     image:
// //       "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=900&q=80",
// //     description:
// //       "Cooling aloe vera gel for everyday care.",
// //     featured: false,
// //   },
// // ];

// // seedProducts.forEach(product => {
// //   product.variants = normalizeVariants(product.price, [
// //     { size: "100ml", price: product.price },
// //     { size: "200ml", price: Number(product.price) + 100 },
// //     { size: "500ml", price: Number(product.price) + 250 },
// //   ]);
// // });

// // /* =========================
// //    SEED DATABASE
// // ========================= */

// // // const FACE_CARE_DETAIL_IMAGES = [
// // //   "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=900&q=80",
// // //   "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80",
// // //   "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=900&q=80",
// // //   "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=900&q=80",
// // // ];

// // // // Upgrade older products that only have one image. The main image stays first,
// // // // and three related skincare/detail reference images are added for the shop slider.
// // // async function upgradeProductImages() {
// // //   const faceCareProducts = await Product.find({
// // //     category: "Face Care",
// // //     $or: [
// // //       { images: { $exists: false } },
// // //       { images: { $size: 0 } },
// // //       { images: { $size: 1 } },
// // //       { images: { $size: 2 } },
// // //       { images: { $size: 3 } },
// // //     ],
// // //   });

// // //   for (const product of faceCareProducts) {
// // //     const current = Array.isArray(product.images) ? product.images.filter(Boolean) : [];
// // //     const main = product.image || current[0] || FACE_CARE_DETAIL_IMAGES[0];
// // //     const related = FACE_CARE_DETAIL_IMAGES.filter(url => url !== main);
// // //     product.images = [main, ...current.filter(url => url !== main), ...related].slice(0, 4);
// // //     product.image = product.images[0];
// // //     await product.save();
// // //   }

// // //   if (faceCareProducts.length) {
// // //     console.log(`Added 4-image slider references to ${faceCareProducts.length} Face Care product(s)`);
// // //   }
// // // }

// // const PRODUCT_DETAIL_IMAGES = [
// //   "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=900&q=80",
// //   "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=900&q=80",
// //   "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=80",
// //   "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=900&q=80",
// // ];

// // async function upgradeProductImages() {
// //   const products = await Product.find({
// //     $or: [
// //       { images: { $exists: false } },
// //       { images: { $size: 0 } },
// //       { images: { $size: 1 } },
// //       { images: { $size: 2 } },
// //       { images: { $size: 3 } },
// //     ],
// //   });

// //   for (const product of products) {
// //     const current = Array.isArray(product.images)
// //       ? product.images.filter(Boolean)
// //       : [];

// //     const main =
// //       product.image ||
// //       current[0] ||
// //       PRODUCT_DETAIL_IMAGES[0];

// //     const allImages = [
// //       main,
// //       ...current.filter((url) => url !== main),
// //       ...PRODUCT_DETAIL_IMAGES.filter(
// //         (url) => url !== main
// //       ),
// //     ];

// //     product.images = [...new Set(allImages)].slice(0, 4);
// //     product.image = product.images[0];

// //     await product.save();
// //   }

// //   if (products.length) {
// //     console.log(
// //       `4-image slider added to ${products.length} product(s)`
// //     );
// //   }
// // }

// // async function seedDatabase() {
// //   const adminEmail = process.env.ADMIN_EMAIL || "admin@naduvan.com";
// //   const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";

// //   const existingAdmin = await Admin.findOne({ email: adminEmail });

// //   if (!existingAdmin) {
// //     const hashedPassword = await bcrypt.hash(adminPassword, 10);

// //     await Admin.create({
// //       email: adminEmail,
// //       password: hashedPassword,
// //       role: "admin",
// //     });

// //     console.log(`Admin created: ${adminEmail}`);
// //   } else {
// //     const hashedPassword = await bcrypt.hash(adminPassword, 10);
// //     existingAdmin.password = hashedPassword;
// //     existingAdmin.role = "admin";
// //     await existingAdmin.save();
// //   }

// //   // Existing products from older versions did not have the enabled field.
// //   // Keep them visible by default when upgrading the project.
// //   await Product.updateMany(
// //     { enabled: { $exists: false } },
// //     { $set: { enabled: true } }
// //   );

// //   const productsWithoutVariants = await Product.find({
// //     $or: [{ variants: { $exists: false } }, { variants: { $size: 0 } }]
// //   });
// //   for (const product of productsWithoutVariants) {
// //     product.variants = normalizeVariants(product.price, product.variants);
// //     product.price = product.variants.find(v => v.size === "100ml")?.price ?? product.price;
// //     await product.save();
// //   }

// //   await upgradeProductImages();

// //   const count = await Product.countDocuments();

// //   if (count === 0) {
// //     await Product.insertMany(seedProducts);
// //     console.log("Demo products seeded");
// //     // Apply the 4-image Face Care slider to newly seeded products too.
// //     await upgradeProductImages();
// //   }
// // }

// // async function ensureSampleGalleryVideo() {
// //   const withVideo = await Product.exists({ videoUrl: { $nin: ["", null] } });
// //   if (!withVideo) {
// //     const firstProduct = await Product.findOne().sort({ createdAt: 1 });
// //     if (firstProduct) {
// //       firstProduct.videoUrl = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
// //       await firstProduct.save();
// //       console.log(`Sample gallery video added to: ${firstProduct.name}`);
// //     }
// //   }
// // }

// // /* =========================
// //    HOME
// // ========================= */

// // app.get("/", (req, res) => {
// //   res.json({ message: "Naduvan API running" });
// // });

// // /* =========================
// //    ADMIN LOGIN
// // ========================= */

// // app.post("/api/admin/login", async (req, res) => {
// //   try {
// //     const { email, password } = req.body;

// //     if (!email || !password) {
// //       return res.status(400).json({
// //         message: "Email and password are required",
// //       });
// //     }

// //     const admin = await Admin.findOne({
// //       email: email.toLowerCase().trim(),
// //     });

// //     if (!admin || !(await bcrypt.compare(password, admin.password))) {
// //       return res.status(401).json({
// //         message: "Invalid admin email or password",
// //       });
// //     }

// //     res.json({
// //       token: signToken(admin),
// //       admin: {
// //         email: admin.email,
// //         role: admin.role,
// //       },
// //     });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: "Login failed" });
// //   }
// // });

// // /* =========================
// //    PUBLIC PRODUCTS
// //    Only enabled products are
// //    visible in the shopping UI.
// // ========================= */

// // app.get("/api/products", async (req, res) => {
// //   try {
// //     const products = await Product.find({ enabled: true }).sort({
// //       createdAt: -1,
// //     });

// //     res.json(products);
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: "Unable to load products" });
// //   }
// // });

// // app.get("/api/products/featured", async (req, res) => {
// //   try {
// //     const products = await Product.find({
// //       enabled: true,
// //       featured: true,
// //     }).limit(10);

// //     res.json(products);
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({
// //       message: "Unable to load featured products",
// //     });
// //   }
// // });


// // /* =========================
// //    PUBLIC GALLERY
// //    Gallery videos are managed
// //    from the admin product form.
// // ========================= */

// // app.get("/api/gallery", async (req, res) => {
// //   try {
// //     const products = await Product.find({ enabled: true, videoUrl: { $nin: ["", null] } })
// //       .select("name category image videoUrl variants")
// //       .sort({ createdAt: -1 });
// //     res.json(products);
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: "Unable to load gallery" });
// //   }
// // });

// // /* =========================
// //    CREATE ORDER
// // ========================= */

// // app.post("/api/orders", async (req, res) => {
// //   try {
// //     const {
// //       customer,
// //       items,
// //       paymentMethod = "COD",
// //     } = req.body;

// //     if (!customer?.name || !customer?.phone || !customer?.address) {
// //       return res.status(400).json({
// //         message: "Name, phone and address are required",
// //       });
// //     }

// //     if (!Array.isArray(items) || items.length === 0) {
// //       return res.status(400).json({ message: "Cart is empty" });
// //     }

// //     if (!["COD", "ONLINE"].includes(paymentMethod)) {
// //       return res.status(400).json({
// //         message: "Invalid payment method",
// //       });
// //     }

// //     const safeItems = items.map(item => ({
// //       productId: item.productId || item._id,
// //       name: item.name,
// //       price: Number(item.price),
// //       quantity: Math.max(1, Number(item.quantity) || 1),
// //       image: item.image || "",
// //       size: item.size || "100ml",
// //     }));

// //     const { subtotal, deliveryCharge, total } = calculateOrderTotals(safeItems);

// //     const order = await Order.create({
// //       customer,
// //       items: safeItems,
// //       subtotal,
// //       deliveryCharge,
// //       total,
// //       paymentMethod,
// //       paymentStatus: "Pending",
// //     });

// //     res.status(201).json({
// //       message:
// //         paymentMethod === "ONLINE"
// //           ? "Online payment order created. Complete payment through your payment gateway."
// //           : "COD order placed successfully",
// //       orderId: order._id,
// //       order,
// //     });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: "Unable to place order" });
// //   }
// // });

// // /* =========================
// //    ADMIN ORDERS
// // ========================= */

// // app.get("/api/admin/orders", adminAuth, async (req, res) => {
// //   try {
// //     const orders = await Order.find().sort({ createdAt: -1 });
// //     res.json(orders);
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: "Unable to load orders" });
// //   }
// // });

// // app.patch("/api/admin/orders/:id/status", adminAuth, async (req, res) => {
// //   try {
// //     const allowedStatuses = [
// //       "Pending",
// //       "Confirmed",
// //       "Packed",
// //       "Shipped",
// //       "Delivered",
// //       "Cancelled",
// //     ];

// //     const { status } = req.body;

// //     if (!allowedStatuses.includes(status)) {
// //       return res.status(400).json({ message: "Invalid status" });
// //     }

// //     const order = await Order.findByIdAndUpdate(
// //       req.params.id,
// //       { status },
// //       { new: true }
// //     );

// //     if (!order) {
// //       return res.status(404).json({ message: "Order not found" });
// //     }

// //     res.json(order);
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({
// //       message: "Unable to update status",
// //     });
// //   }
// // });

// // /* =========================
// //    DELETE / REJECT ORDER
// // ========================= */

// // app.delete("/api/admin/orders/:id", adminAuth, async (req, res) => {
// //   try {
// //     const order = await Order.findByIdAndDelete(req.params.id);

// //     if (!order) {
// //       return res.status(404).json({ message: "Order not found" });
// //     }

// //     res.json({
// //       message: "Order rejected and deleted successfully",
// //       orderId: req.params.id,
// //     });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({
// //       message: "Unable to delete order",
// //     });
// //   }
// // });

// // /* =========================
// //    ADMIN STATS
// // ========================= */

// // app.get("/api/admin/stats", adminAuth, async (req, res) => {
// //   try {
// //     const orders = await Order.find();

// //     const activeOrders = orders.filter(
// //       (order) => order.status !== "Cancelled"
// //     );

// //     const sales = activeOrders.reduce(
// //       (sum, order) => sum + Number(order.total || 0),
// //       0
// //     );

// //     const customers = new Set(
// //       orders.map(
// //         (order) => order.customer?.email || order.customer?.phone
// //       )
// //     ).size;
// //     const products = await Product.countDocuments();

// //     res.json({
// //       orders: orders.length,
// //       customers,
// //       sales,
// //       products,
// //     });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({
// //       message: "Unable to load dashboard stats",
// //     });
// //   }
// // });

// // /* =========================
// //    ADMIN PRODUCTS
// // ========================= */

// // app.get("/api/admin/products", adminAuth, async (req, res) => {
// //   try {
// //     const products = await Product.find().sort({ createdAt: -1 });
// //     res.json(products);
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: "Unable to load products" });
// //   }
// // });

// // app.post("/api/admin/products", adminAuth, async (req, res) => {
// //   try {
// //     const {
// //       name,
// //       category,
// //       price,
// //       variants,
// //       image,
// //       images,
// //       videoUrl,
// //       description,
// //       featured,
// //       enabled = true,
// //     } = req.body;

// //     if (!name || price === undefined || price === "") {
// //       return res.status(400).json({
// //         message: "Product name and price are required",
// //       });
// //     }

// //     const product = await Product.create({
// //       name,
// //       category,
// //       price: Number(normalizeVariants(price, variants).find(v => v.size === "100ml")?.price ?? price),
// //       variants: normalizeVariants(price, variants),
// //       image: image || images?.[0] || "",
// //       images: Array.isArray(images) ? images.filter(Boolean).slice(0, 4) : (image ? [image] : []),
// //       videoUrl: videoUrl || "",
// //       description,
// //       featured: Boolean(featured),
// //       enabled: Boolean(enabled),
// //     });

// //     res.status(201).json(product);
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({
// //       message: "Unable to create product",
// //     });
// //   }
// // });

// // app.put("/api/admin/products/:id", adminAuth, async (req, res) => {
// //   try {
// //     const {
// //       name,
// //       category,
// //       price,
// //       variants,
// //       image,
// //       images,
// //       videoUrl,
// //       description,
// //       featured,
// //       enabled,
// //     } = req.body;

// //     const normalizedVariants = normalizeVariants(price, variants);

// //     const product = await Product.findByIdAndUpdate(
// //       req.params.id,
// //       {
// //         name,
// //         category,
// //         price: Number(normalizedVariants.find(v => v.size === "100ml")?.price ?? price),
// //         variants: normalizedVariants,
// //         image: image || images?.[0] || "",
// //         images: Array.isArray(images) ? images.filter(Boolean).slice(0, 4) : (image ? [image] : []),
// //         videoUrl: videoUrl || "",
// //         description,
// //         featured: Boolean(featured),
// //         enabled: Boolean(enabled),
// //       },
// //       { new: true, runValidators: true }
// //     );

// //     if (!product) {
// //       return res.status(404).json({ message: "Product not found" });
// //     }

// //     res.json(product);
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({
// //       message: "Unable to update product",
// //     });
// //   }
// // });

// // app.patch("/api/admin/products/:id/toggle", adminAuth, async (req, res) => {
// //   try {
// //     const product = await Product.findById(req.params.id);

// //     if (!product) {
// //       return res.status(404).json({ message: "Product not found" });
// //     }

// //     product.enabled = !product.enabled;
// //     await product.save();

// //     res.json(product);
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({
// //       message: "Unable to change product visibility",
// //     });
// //   }
// // });

// // app.delete("/api/admin/products/:id", adminAuth, async (req, res) => {
// //   try {
// //     const product = await Product.findByIdAndDelete(req.params.id);

// //     if (!product) {
// //       return res.status(404).json({ message: "Product not found" });
// //     }

// //     res.json({ message: "Product deleted successfully" });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({
// //       message: "Unable to delete product",
// //     });
// //   }
// // });

// // /* =========================
// //    REPORT HELPERS
// // ========================= */

// // function getDateRange(type, value) {
// //   const now = new Date();

// //   if (type === "day") {
// //     const date = value ? new Date(`${value}T00:00:00`) : now;

// //     if (Number.isNaN(date.getTime())) return null;

// //     const start = new Date(date);
// //     start.setHours(0, 0, 0, 0);

// //     const end = new Date(start);
// //     end.setDate(end.getDate() + 1);

// //     return { start, end };
// //   }

// //   if (type === "month") {
// //     const match = /^([0-9]{4})-([0-9]{2})$/.exec(value || "");
// //     const year = match ? Number(match[1]) : now.getFullYear();
// //     const month = match ? Number(match[2]) - 1 : now.getMonth();

// //     if (month < 0 || month > 11) return null;

// //     const start = new Date(year, month, 1);
// //     const end = new Date(year, month + 1, 1);

// //     return { start, end };
// //   }

// //   if (type === "year") {
// //     const year = value ? Number(value) : now.getFullYear();

// //     if (!Number.isInteger(year) || year < 2000 || year > 2100) {
// //       return null;
// //     }

// //     const start = new Date(year, 0, 1);
// //     const end = new Date(year + 1, 0, 1);

// //     return { start, end };
// //   }

// //   return null;
// // }

// // async function buildReport(type, value) {
// //   const range = getDateRange(type, value);

// //   if (!range) throw new Error("Invalid report date");

// //   const orders = await Order.find({
// //     createdAt: {
// //       $gte: range.start,
// //       $lt: range.end,
// //     },
// //   }).sort({ createdAt: -1 });

// //   const validOrders = orders.filter(
// //     (order) => order.status !== "Cancelled"
// //   );

// //   const sales = validOrders.reduce(
// //     (sum, order) => sum + Number(order.total || 0),
// //     0
// //   );

// //   const customers = new Set(
// //     orders.map(
// //       (order) => order.customer?.email || order.customer?.phone
// //     )
// //   ).size;

// //   return {
// //     type,
// //     from: range.start,
// //     to: range.end,
// //     orders: orders.length,
// //     validOrders: validOrders.length,
// //     cancelledOrders: orders.filter(
// //       (order) => order.status === "Cancelled"
// //     ).length,
// //     customers,
// //     sales,
// //     onlineOrders: orders.filter(
// //       (order) => order.paymentMethod === "ONLINE"
// //     ).length,
// //     codOrders: orders.filter(
// //       (order) => order.paymentMethod === "COD"
// //     ).length,
// //     data: orders,
// //   };
// // }

// // app.get("/api/admin/reports/day", adminAuth, async (req, res) => {
// //   try {
// //     res.json(await buildReport("day", req.query.date));
// //   } catch (error) {
// //     console.error(error);
// //     res.status(400).json({ message: error.message });
// //   }
// // });

// // app.get("/api/admin/reports/month", adminAuth, async (req, res) => {
// //   try {
// //     res.json(await buildReport("month", req.query.month));
// //   } catch (error) {
// //     console.error(error);
// //     res.status(400).json({ message: error.message });
// //   }
// // });

// // app.get("/api/admin/reports/year", adminAuth, async (req, res) => {
// //   try {
// //     res.json(await buildReport("year", req.query.year));
// //   } catch (error) {
// //     console.error(error);
// //     res.status(400).json({ message: error.message });
// //   }
// // });

// // /* =========================
// //    SERVER
// // ========================= */

// // const PORT = process.env.PORT || 3000;

// // mongoose
// //   .connect(process.env.MONGO_URI)
// //   .then(async () => {
// //     console.log("MongoDB connected");
// //     await seedDatabase();
// //     await ensureSampleGalleryVideo();

// //     app.listen(PORT, () => {
// //       console.log(`Server running on http://localhost:${PORT}`);
// //     });
// //   })
// //   .catch((error) => {
// //     console.error(
// //       "MongoDB connection failed:",
// //       error.message
// //     );
// //     process.exit(1);
// //   });



// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import Razorpay from "razorpay";
// import crypto from "crypto";

// dotenv.config();

// const app = express();

// app.use(cors());
// app.use(express.json());

// /* =========================
//    RAZORPAY
// ========================= */

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// /* =========================
//    PRODUCT SCHEMA
// ========================= */

// const productSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     category: {
//       type: String,
//       default: "General",
//     },

//     price: {
//       type: Number,
//       required: true,
//       min: 0,
//     },

//     variants: [
//       {
//         size: {
//           type: String,
//           required: true,
//         },

//         price: {
//           type: Number,
//           min: 0,
//         },

//         originalPrice: {
//           type: Number,
//           min: 0,
//         },

//         offerPrice: {
//           type: Number,
//           min: 0,
//         },

//         buyingPrice: {
//           type: Number,
//           min: 0,
//         },
//       },
//     ],

//     image: {
//       type: String,
//       default: "",
//     },

//     images: {
//       type: [String],
//       default: [],
//     },

//     videoUrl: {
//       type: String,
//       default: "",
//     },

//     description: {
//       type: String,
//       default: "",
//     },

//     featured: {
//       type: Boolean,
//       default: false,
//     },

//     enabled: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// /* =========================
//    ORDER SCHEMA
// ========================= */

// const orderSchema = new mongoose.Schema(
//   {
//     customer: {
//       name: {
//         type: String,
//         required: true,
//       },

//       email: {
//         type: String,
//       },

//       phone: {
//         type: String,
//         required: true,
//       },

//       address: {
//         type: String,
//         required: true,
//       },

//       city: {
//         type: String,
//       },

//       pincode: {
//         type: String,
//       },
//     },

//     items: [
//       {
//         productId: String,
//         name: String,
//         price: Number,
//         quantity: Number,
//         size: String,
//         image: String,
//       },
//     ],

//     subtotal: {
//       type: Number,
//       required: true,
//     },

//     deliveryCharge: {
//       type: Number,
//       required: true,
//       default: 50,
//     },

//     total: {
//       type: Number,
//       required: true,
//     },

//     paymentMethod: {
//       type: String,
//       enum: ["COD", "ONLINE"],
//       default: "COD",
//     },

//     paymentStatus: {
//       type: String,
//       enum: ["Pending", "Paid", "Failed"],
//       default: "Pending",
//     },

//     /* =========================
//        RAZORPAY DETAILS
//     ========================= */

//     razorpayOrderId: {
//       type: String,
//       default: "",
//     },

//     razorpayPaymentId: {
//       type: String,
//       default: "",
//       index: true,
//     },

//     razorpaySignature: {
//       type: String,
//       default: "",
//     },

//     /* =========================
//        ORDER STATUS
//     ========================= */

//     status: {
//       type: String,
//       enum: [
//         "Pending",
//         "Confirmed",
//         "Packed",
//         "Shipped",
//         "Delivered",
//         "Cancelled",
//       ],
//       default: "Pending",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// /* =========================
//    ADMIN SCHEMA
// ========================= */

// const adminSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     unique: true,
//     required: true,
//   },

//   password: {
//     type: String,
//     required: true,
//   },

//   role: {
//     type: String,
//     default: "admin",
//   },
// });

// /* =========================
//    MODELS
// ========================= */

// const Product = mongoose.model("Product", productSchema);

// const Order = mongoose.model("Order", orderSchema);

// const Admin = mongoose.model("Admin", adminSchema);

// /* =========================
//    AUTH
// ========================= */

// function signToken(admin) {
//   return jwt.sign(
//     {
//       id: admin._id.toString(),
//       role: admin.role,
//       email: admin.email,
//     },
//     process.env.JWT_SECRET,
//     {
//       expiresIn: "1d",
//     }
//   );
// }

// /* =========================
//    ADMIN AUTH MIDDLEWARE
// ========================= */

// function adminAuth(req, res, next) {
//   const header = req.headers.authorization;

//   if (!header?.startsWith("Bearer ")) {
//     return res.status(401).json({
//       message: "Admin authentication required",
//     });
//   }

//   try {
//     const token = header.split(" ")[1];

//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET
//     );

//     if (decoded.role !== "admin") {
//       return res.status(403).json({
//         message: "Admin access only",
//       });
//     }

//     req.admin = decoded;

//     next();
//   } catch (error) {
//     return res.status(401).json({
//       message: "Invalid or expired token",
//     });
//   }
// }

// /* =========================
//    SHIPPING SETTINGS
// ========================= */

// const DELIVERY_CHARGE = 50;

// const FREE_SHIPPING_THRESHOLD = 1000;

// /* =========================
//    PRODUCT VARIANT HELPER
// ========================= */

// function normalizeVariants(price, variants) {
//   const base = Number(price || 0);

//   const fallback = [
//     {
//       size: "100ml",
//       price: base,
//       originalPrice: base,
//       offerPrice: base,
//       buyingPrice: 0,
//     },

//     {
//       size: "200ml",
//       price: base + 100,
//       originalPrice: base + 100,
//       offerPrice: base + 100,
//       buyingPrice: 0,
//     },

//     {
//       size: "500ml",
//       price: base + 250,
//       originalPrice: base + 250,
//       offerPrice: base + 250,
//       buyingPrice: 0,
//     },
//   ];

//   if (!Array.isArray(variants) || !variants.length) {
//     return fallback;
//   }

//   const clean = variants
//     .filter(
//       (v) =>
//         v?.size &&
//         Number(v?.offerPrice ?? v?.price) >= 0
//     )
//     .map((v) => {
//       const offer = Number(
//         v.offerPrice ?? v.price ?? 0
//       );

//       return {
//         size: String(v.size),

//         price: offer,

//         originalPrice: Number(
//           v.originalPrice ?? offer
//         ),

//         offerPrice: offer,

//         buyingPrice: Number(
//           v.buyingPrice ?? 0
//         ),
//       };
//     });

//   return clean.length ? clean : fallback;
// }

// /* =========================
//    ORDER TOTAL CALCULATOR
// ========================= */

// function calculateOrderTotals(items) {
//   const subtotal = items.reduce(
//     (sum, item) =>
//       sum +
//       Number(item.price) *
//         Number(item.quantity),
//     0
//   );

//   const deliveryCharge =
//     subtotal >= FREE_SHIPPING_THRESHOLD
//       ? 0
//       : DELIVERY_CHARGE;

//   const total =
//     subtotal + deliveryCharge;

//   return {
//     subtotal,
//     deliveryCharge,
//     total,
//   };
// }

// /* =========================
//    DEMO PRODUCTS
// ========================= */

// const demoProducts = [
//   {
//     name: "Aloe Vera Face Wash",

//     category: "Face Care",

//     price: 229,

//     image:
//       "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=900&q=80",

//     images: [
//       "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=900&q=80",

//       "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=900&q=80",

//       "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=80",

//       "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=900&q=80",
//     ],

//     videoUrl:
//       "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",

//     description:
//       "Gentle aloe vera face wash for a fresh, clean feel.",

//     featured: true,
//   },

//   {
//     name: "Neem Tulsi Face Serum",

//     category: "Face Care",

//     price: 449,

//     image:
//       "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80",

//     description:
//       "Lightweight botanical serum with neem and tulsi inspired care.",

//     featured: true,
//   },

//   {
//     name: "Rice Water Face Cream",

//     category: "Face Care",

//     price: 399,

//     image:
//       "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=900&q=80",

//     description:
//       "Rich yet comfortable daily face cream.",

//     featured: true,
//   },
// ];

// /* =========================
//    DATABASE CONNECTION
// ========================= */

// const PORT = process.env.PORT || 3000;

// async function connectDatabase() {
//   try {
//     if (!process.env.MONGO_URI) {
//       console.error("❌ MONGO_URI is missing in .env");
//       process.exit(1);
//     }

//     await mongoose.connect(process.env.MONGO_URI);

//     console.log("✅ MongoDB connected");

//   } catch (error) {
//     console.error(
//       "❌ MongoDB connection failed:",
//       error.message
//     );

//     process.exit(1);
//   }
// }

// /* =========================
//    HEALTH CHECK
// ========================= */

// app.get("/", (req, res) => {
//   res.json({
//     success: true,
//     message: "Naduvan Industry API is running",
//   });
// });

// app.get("/api/health", (req, res) => {
//   res.json({
//     success: true,
//     message: "Server is healthy",
//   });
// });

// /* =========================
//    ADMIN LOGIN
// ========================= */

// app.post("/api/admin/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({
//         message: "Email and password are required",
//       });
//     }

//     const admin = await Admin.findOne({
//       email: email.toLowerCase().trim(),
//     });

//     if (!admin) {
//       return res.status(401).json({
//         message: "Invalid email or password",
//       });
//     }

//     const passwordMatch =
//       await bcrypt.compare(
//         password,
//         admin.password
//       );

//     if (!passwordMatch) {
//       return res.status(401).json({
//         message: "Invalid email or password",
//       });
//     }

//     const token = signToken(admin);

//     res.json({
//       success: true,
//       message: "Login successful",
//       token,
//       admin: {
//         id: admin._id,
//         email: admin.email,
//         role: admin.role,
//       },
//     });

//   } catch (error) {
//     console.error(
//       "Admin login error:",
//       error
//     );

//     res.status(500).json({
//       message: "Server error",
//     });
//   }
// });

// /* =========================
//    CREATE DEFAULT ADMIN
// ========================= */

// async function createDefaultAdmin() {
//   try {
//     const adminEmail =
//       process.env.ADMIN_EMAIL ||
//       "admin@naduvan.com";

//     const adminPassword =
//       process.env.ADMIN_PASSWORD ||
//       "admin123";

//     const existingAdmin =
//       await Admin.findOne({
//         email: adminEmail,
//       });

//     if (existingAdmin) {
//       console.log(
//         `✅ Admin already exists: ${adminEmail}`
//       );

//       return;
//     }

//     const hashedPassword =
//       await bcrypt.hash(
//         adminPassword,
//         10
//       );

//     await Admin.create({
//       email: adminEmail,
//       password: hashedPassword,
//       role: "admin",
//     });

//     console.log(
//       `✅ Default admin created: ${adminEmail}`
//     );

//   } catch (error) {
//     console.error(
//       "❌ Admin creation error:",
//       error.message
//     );
//   }
// }

// /* =========================
//    GET ALL PRODUCTS
// ========================= */

// app.get("/api/products", async (req, res) => {
//   try {
//     const products =
//       await Product.find({
//         enabled: true,
//       }).sort({
//         createdAt: -1,
//       });

//     const formattedProducts =
//       products.map((product) => ({
//         ...product.toObject(),

//         variants: normalizeVariants(
//           product.price,
//           product.variants
//         ),
//       }));

//     res.json(formattedProducts);

//   } catch (error) {
//     console.error(
//       "Products fetch error:",
//       error
//     );

//     res.status(500).json({
//       message: "Failed to fetch products",
//     });
//   }
// });

// /* =========================
//    GET SINGLE PRODUCT
// ========================= */

// app.get(
//   "/api/products/:id",
//   async (req, res) => {
//     try {
//       const product =
//         await Product.findById(
//           req.params.id
//         );

//       if (!product) {
//         return res.status(404).json({
//           message: "Product not found",
//         });
//       }

//       res.json({
//         ...product.toObject(),

//         variants: normalizeVariants(
//           product.price,
//           product.variants
//         ),
//       });

//     } catch (error) {
//       console.error(
//         "Single product error:",
//         error
//       );

//       res.status(500).json({
//         message: "Failed to fetch product",
//       });
//     }
//   }
// );

// /* =========================
//    ADMIN GET ALL PRODUCTS
// ========================= */

// app.get(
//   "/api/admin/products",
//   adminAuth,
//   async (req, res) => {
//     try {
//       const products =
//         await Product.find()
//           .sort({
//             createdAt: -1,
//           });

//       res.json(products);

//     } catch (error) {
//       console.error(
//         "Admin products error:",
//         error
//       );

//       res.status(500).json({
//         message:
//           "Failed to fetch admin products",
//       });
//     }
//   }
// );

// /* =========================
//    ADD PRODUCT
// ========================= */

// app.post(
//   "/api/admin/products",
//   adminAuth,
//   async (req, res) => {
//     try {
//       const {
//         name,
//         category,
//         price,
//         variants,
//         image,
//         images,
//         videoUrl,
//         description,
//         featured,
//         enabled,
//       } = req.body;

//       if (!name || price === undefined) {
//         return res.status(400).json({
//           message:
//             "Product name and price are required",
//         });
//       }

//       const product =
//         await Product.create({
//           name: String(name).trim(),

//           category:
//             category || "General",

//           price: Number(price),

//           variants:
//             Array.isArray(variants)
//               ? variants
//               : [],

//           image:
//             image || "",

//           images:
//             Array.isArray(images)
//               ? images
//               : [],

//           videoUrl:
//             videoUrl || "",

//           description:
//             description || "",

//           featured:
//             Boolean(featured),

//           enabled:
//             enabled !== false,
//         });

//       res.status(201).json({
//         success: true,
//         message: "Product added successfully",
//         product,
//       });

//     } catch (error) {
//       console.error(
//         "Add product error:",
//         error
//       );

//       res.status(500).json({
//         message:
//           "Failed to add product",
//       });
//     }
//   }
// );

// /* =========================
//    UPDATE PRODUCT
// ========================= */

// app.put(
//   "/api/admin/products/:id",
//   adminAuth,
//   async (req, res) => {
//     try {
//       const {
//         name,
//         category,
//         price,
//         variants,
//         image,
//         images,
//         videoUrl,
//         description,
//         featured,
//         enabled,
//       } = req.body;

//       const product =
//         await Product.findById(
//           req.params.id
//         );

//       if (!product) {
//         return res.status(404).json({
//           message: "Product not found",
//         });
//       }

//       if (name !== undefined) {
//         product.name =
//           String(name).trim();
//       }

//       if (category !== undefined) {
//         product.category = category;
//       }

//       if (price !== undefined) {
//         product.price =
//           Number(price);
//       }

//       if (variants !== undefined) {
//         product.variants =
//           Array.isArray(variants)
//             ? variants
//             : [];
//       }

//       if (image !== undefined) {
//         product.image = image;
//       }

//       if (images !== undefined) {
//         product.images =
//           Array.isArray(images)
//             ? images
//             : [];
//       }

//       if (videoUrl !== undefined) {
//         product.videoUrl =
//           videoUrl;
//       }

//       if (description !== undefined) {
//         product.description =
//           description;
//       }

//       if (featured !== undefined) {
//         product.featured =
//           Boolean(featured);
//       }

//       if (enabled !== undefined) {
//         product.enabled =
//           Boolean(enabled);
//       }

//       await product.save();

//       res.json({
//         success: true,
//         message:
//           "Product updated successfully",
//         product,
//       });

//     } catch (error) {
//       console.error(
//         "Update product error:",
//         error
//       );

//       res.status(500).json({
//         message:
//           "Failed to update product",
//       });
//     }
//   }
// );

// /* =========================
//    DELETE PRODUCT
// ========================= */

// app.delete(
//   "/api/admin/products/:id",
//   adminAuth,
//   async (req, res) => {
//     try {
//       const product =
//         await Product.findById(
//           req.params.id
//         );

//       if (!product) {
//         return res.status(404).json({
//           message: "Product not found",
//         });
//       }

//       await Product.findByIdAndDelete(
//         req.params.id
//       );

//       res.json({
//         success: true,
//         message:
//           "Product deleted successfully",
//       });

//     } catch (error) {
//       console.error(
//         "Delete product error:",
//         error
//       );

//       res.status(500).json({
//         message:
//           "Failed to delete product",
//       });
//     }
//   }
// );

// /* =========================
//    ENABLE / DISABLE PRODUCT
// ========================= */

// app.patch(
//   "/api/admin/products/:id/toggle",
//   adminAuth,
//   async (req, res) => {
//     try {
//       const product =
//         await Product.findById(
//           req.params.id
//         );

//       if (!product) {
//         return res.status(404).json({
//           message: "Product not found",
//         });
//       }

//       product.enabled =
//         !product.enabled;

//       await product.save();

//       res.json({
//         success: true,
//         message: product.enabled
//           ? "Product enabled"
//           : "Product disabled",
//         product,
//       });

//     } catch (error) {
//       console.error(
//         "Toggle product error:",
//         error
//       );

//       res.status(500).json({
//         message:
//           "Failed to toggle product",
//       });
//     }
//   }
// );

// /* =========================
//    GALLERY
// ========================= */

// app.get(
//   "/api/gallery",
//   async (req, res) => {
//     try {
//       const products =
//         await Product.find({
//           enabled: true,
//         })
//           .select(
//             "name image images videoUrl"
//           )
//           .sort({
//             createdAt: -1,
//           });

//       res.json(products);

//     } catch (error) {
//       console.error(
//         "Gallery error:",
//         error
//       );

//       res.status(500).json({
//         message:
//           "Failed to fetch gallery",
//       });
//     }
//   }
// );

// /* =========================
//    CREATE ORDER
//    COD + RAZORPAY
// ========================= */

// app.post("/api/orders", async (req, res) => {
//   try {
//     const {
//       customer,
//       items,
//       paymentMethod,
//     } = req.body;

//     /* =========================
//        BASIC VALIDATION
//     ========================= */

//     if (!customer) {
//       return res.status(400).json({
//         message: "Customer details are required",
//       });
//     }

//     if (!customer.name || !customer.phone) {
//       return res.status(400).json({
//         message:
//           "Customer name and phone are required",
//       });
//     }

//     if (!customer.address) {
//       return res.status(400).json({
//         message: "Address is required",
//       });
//     }

//     if (
//       !Array.isArray(items) ||
//       items.length === 0
//     ) {
//       return res.status(400).json({
//         message: "Cart is empty",
//       });
//     }

//     if (
//       !["COD", "ONLINE"].includes(
//         paymentMethod
//       )
//     ) {
//       return res.status(400).json({
//         message:
//           "Invalid payment method",
//       });
//     }

//     /* =========================
//        CLEAN CART ITEMS
//     ========================= */

//     const safeItems = items.map((item) => ({
//       productId:
//         item.productId ||
//         item._id ||
//         "",

//       name:
//         String(item.name || "").trim(),

//       price:
//         Number(item.price || 0),

//       quantity:
//         Math.max(
//           1,
//           Number(item.quantity || 1)
//         ),

//       size:
//         item.size ||
//         item.variant ||
//         "",

//       image:
//         item.image ||
//         "",
//     }));

//     /* =========================
//        VALIDATE PRICES
//     ========================= */

//     const invalidItem =
//       safeItems.find(
//         (item) =>
//           !item.name ||
//           item.price < 0 ||
//           item.quantity < 1
//       );

//     if (invalidItem) {
//       return res.status(400).json({
//         message:
//           "Invalid product information",
//       });
//     }

//     /* =========================
//        CALCULATE TOTAL
//        SERVER SIDE
//     ========================= */

//     const {
//       subtotal,
//       deliveryCharge,
//       total,
//     } = calculateOrderTotals(
//       safeItems
//     );

//     /* =========================
//        COD ORDER
//     ========================= */

//     if (paymentMethod === "COD") {
//       const order =
//         await Order.create({
//           customer: {
//             name:
//               String(
//                 customer.name
//               ).trim(),

//             email:
//               String(
//                 customer.email || ""
//               ).trim(),

//             phone:
//               String(
//                 customer.phone
//               ).trim(),

//             address:
//               String(
//                 customer.address
//               ).trim(),

//             city:
//               String(
//                 customer.city || ""
//               ).trim(),

//             pincode:
//               String(
//                 customer.pincode || ""
//               ).trim(),
//           },

//           items: safeItems,

//           subtotal,

//           deliveryCharge,

//           total,

//           paymentMethod: "COD",

//           paymentStatus: "Pending",

//           status: "Pending",
//         });

//       return res.status(201).json({
//         success: true,

//         message:
//           "COD order placed successfully",

//         orderId: order._id,

//         order,
//       });
//     }

//     /* =========================
//        RAZORPAY ONLINE PAYMENT
//     ========================= */

//     if (
//       !process.env.RAZORPAY_KEY_ID ||
//       !process.env.RAZORPAY_KEY_SECRET
//     ) {
//       return res.status(500).json({
//         message:
//           "Razorpay configuration is missing",
//       });
//     }

//     /* =========================
//        AMOUNT IN PAISE
//     ========================= */

//     const amountInPaise =
//       Math.round(total * 100);

//     /* =========================
//        CREATE RAZORPAY ORDER
//     ========================= */

//     const razorpayOrder =
//       await razorpay.orders.create({
//         amount: amountInPaise,

//         currency: "INR",

//         receipt:
//           `naduvan_${Date.now()}`,

//         notes: {
//           customerName:
//             customer.name,

//           customerPhone:
//             customer.phone,
//         },
//       });

//     /* =========================
//        SEND RAZORPAY DETAILS
//     ========================= */

//     return res.status(201).json({
//       success: true,

//       paymentMethod: "ONLINE",

//       razorpayOrderId:
//         razorpayOrder.id,

//       amount:
//         razorpayOrder.amount,

//       currency:
//         razorpayOrder.currency,

//       keyId:
//         process.env.RAZORPAY_KEY_ID,

//       customer,

//       items: safeItems,

//       subtotal,

//       deliveryCharge,

//       total,
//     });

//   } catch (error) {
//     console.error(
//       "Create order error:",
//       error
//     );

//     return res.status(500).json({
//       message:
//         error?.error?.description ||
//         error?.message ||
//         "Failed to create order",
//     });
//   }
// });


// /* =========================
//    VERIFY RAZORPAY PAYMENT
// ========================= */

// app.post(
//   "/api/orders/verify-payment",
//   async (req, res) => {
//     try {
//       const {
//         razorpay_order_id,
//         razorpay_payment_id,
//         razorpay_signature,

//         customer,
//         items,
//       } = req.body;

//       /* =========================
//          VALIDATION
//       ========================= */

//       if (
//         !razorpay_order_id ||
//         !razorpay_payment_id ||
//         !razorpay_signature
//       ) {
//         return res.status(400).json({
//           success: false,

//           message:
//             "Razorpay payment details are missing",
//         });
//       }

//       if (!customer) {
//         return res.status(400).json({
//           success: false,

//           message:
//             "Customer details are required",
//         });
//       }

//       if (
//         !Array.isArray(items) ||
//         items.length === 0
//       ) {
//         return res.status(400).json({
//           success: false,

//           message:
//             "Order items are required",
//         });
//       }

//       /* =========================
//          CREATE SIGNATURE
//       ========================= */

//       const body =
//         razorpay_order_id +
//         "|" +
//         razorpay_payment_id;

//       const expectedSignature =
//         crypto
//           .createHmac(
//             "sha256",
//             process.env.RAZORPAY_KEY_SECRET
//           )
//           .update(body)
//           .digest("hex");

//       /* =========================
//          VERIFY SIGNATURE
//       ========================= */

//       if (
//         expectedSignature !==
//         razorpay_signature
//       ) {
//         return res.status(400).json({
//           success: false,

//           message:
//             "Payment verification failed",
//         });
//       }

//       /* =========================
//          CHECK DUPLICATE PAYMENT
//       ========================= */

//       const existingOrder =
//         await Order.findOne({
//           razorpayPaymentId:
//             razorpay_payment_id,
//         });

//       if (existingOrder) {
//         return res.status(409).json({
//           success: false,

//           message:
//             "Payment already processed",

//           orderId:
//             existingOrder._id,
//         });
//       }

//       /* =========================
//          CLEAN ITEMS
//       ========================= */

//       const safeItems = items.map(
//         (item) => ({
//           productId:
//             item.productId ||
//             item._id ||
//             "",

//           name:
//             String(
//               item.name || ""
//             ).trim(),

//           price:
//             Number(
//               item.price || 0
//             ),

//           quantity:
//             Math.max(
//               1,
//               Number(
//                 item.quantity || 1
//               )
//             ),

//           size:
//             item.size ||
//             item.variant ||
//             "",

//           image:
//             item.image ||
//             "",
//         })
//       );

//       /* =========================
//          VALIDATE ITEMS
//       ========================= */

//       const invalidItem =
//         safeItems.find(
//           (item) =>
//             !item.name ||
//             item.price < 0 ||
//             item.quantity < 1
//         );

//       if (invalidItem) {
//         return res.status(400).json({
//           success: false,

//           message:
//             "Invalid order item",
//         });
//       }

//       /* =========================
//          CALCULATE SERVER TOTAL
//       ========================= */

//       const {
//         subtotal,
//         deliveryCharge,
//         total,
//       } =
//         calculateOrderTotals(
//           safeItems
//         );

//       /* =========================
//          CREATE PAID ORDER
//       ========================= */

//       const order =
//         await Order.create({
//           customer: {
//             name:
//               String(
//                 customer.name
//               ).trim(),

//             email:
//               String(
//                 customer.email || ""
//               ).trim(),

//             phone:
//               String(
//                 customer.phone
//               ).trim(),

//             address:
//               String(
//                 customer.address
//               ).trim(),

//             city:
//               String(
//                 customer.city || ""
//               ).trim(),

//             pincode:
//               String(
//                 customer.pincode || ""
//               ).trim(),
//           },

//           items: safeItems,

//           subtotal,

//           deliveryCharge,

//           total,

//           paymentMethod:
//             "ONLINE",

//           paymentStatus:
//             "Paid",

//           status:
//             "Confirmed",

//           razorpayOrderId:
//             razorpay_order_id,

//           razorpayPaymentId:
//             razorpay_payment_id,

//           razorpaySignature:
//             razorpay_signature,
//         });

//       /* =========================
//          SUCCESS RESPONSE
//       ========================= */

//       return res.status(201).json({
//         success: true,

//         message:
//           "Payment successful and order created",

//         orderId:
//           order._id,

//         order,
//       });

//     } catch (error) {
//       console.error(
//         "Payment verification error:",
//         error
//       );

//       return res.status(500).json({
//         success: false,

//         message:
//           error?.message ||
//           "Payment verification failed",
//       });
//     }
//   }
// );


// /* =========================
//    GET ALL ORDERS
//    ADMIN
// ========================= */

// app.get(
//   "/api/admin/orders",
//   adminAuth,
//   async (req, res) => {
//     try {
//       const orders =
//         await Order.find()
//           .sort({
//             createdAt: -1,
//           });

//       res.json(orders);

//     } catch (error) {
//       console.error(
//         "Admin orders error:",
//         error
//       );

//       res.status(500).json({
//         message:
//           "Failed to fetch orders",
//       });
//     }
//   }
// );


// /* =========================
//    GET SINGLE ORDER
//    ADMIN
// ========================= */

// app.get(
//   "/api/admin/orders/:id",
//   adminAuth,
//   async (req, res) => {
//     try {
//       const order =
//         await Order.findById(
//           req.params.id
//         );

//       if (!order) {
//         return res.status(404).json({
//           message:
//             "Order not found",
//         });
//       }

//       res.json(order);

//     } catch (error) {
//       console.error(
//         "Single order error:",
//         error
//       );

//       res.status(500).json({
//         message:
//           "Failed to fetch order",
//       });
//     }
//   }
// );


// /* =========================
//    UPDATE ORDER STATUS
//    ADMIN
// ========================= */

// app.patch(
//   "/api/admin/orders/:id/status",
//   adminAuth,
//   async (req, res) => {
//     try {
//       const { status } =
//         req.body;

//       const allowedStatuses = [
//         "Pending",
//         "Confirmed",
//         "Packed",
//         "Shipped",
//         "Delivered",
//         "Cancelled",
//       ];

//       if (
//         !allowedStatuses.includes(
//           status
//         )
//       ) {
//         return res.status(400).json({
//           message:
//             "Invalid order status",
//         });
//       }

//       const order =
//         await Order.findById(
//           req.params.id
//         );

//       if (!order) {
//         return res.status(404).json({
//           message:
//             "Order not found",
//         });
//       }

//       order.status =
//         status;

//       await order.save();

//       res.json({
//         success: true,

//         message:
//           "Order status updated",

//         order,
//       });

//     } catch (error) {
//       console.error(
//         "Update order status error:",
//         error
//       );

//       res.status(500).json({
//         message:
//           "Failed to update order status",
//       });
//     }
//   }
// );


// /* =========================
//    CANCEL / REJECT ORDER
// ========================= */

// app.patch(
//   "/api/admin/orders/:id/cancel",
//   adminAuth,
//   async (req, res) => {
//     try {
//       const order =
//         await Order.findById(
//           req.params.id
//         );

//       if (!order) {
//         return res.status(404).json({
//           message:
//             "Order not found",
//         });
//       }

//       order.status =
//         "Cancelled";

//       await order.save();

//       res.json({
//         success: true,

//         message:
//           "Order cancelled",

//         order,
//       });

//     } catch (error) {
//       console.error(
//         "Cancel order error:",
//         error
//       );

//       res.status(500).json({
//         message:
//           "Failed to cancel order",
//       });
//     }
//   }
// );


// /* =========================
//    ADMIN STATISTICS
// ========================= */

// app.get(
//   "/api/admin/stats",
//   adminAuth,
//   async (req, res) => {
//     try {
//       const [
//         productCount,
//         orderCount,
//         onlineOrders,
//         codOrders,
//       ] = await Promise.all([
//         Product.countDocuments(),

//         Order.countDocuments(),

//         Order.countDocuments({
//           paymentMethod:
//             "ONLINE",
//         }),

//         Order.countDocuments({
//           paymentMethod:
//             "COD",
//         }),
//       ]);

//       const orders =
//         await Order.find()
//           .select(
//             "subtotal deliveryCharge total paymentStatus status"
//           );

//       const paidOrders =
//         orders.filter(
//           (order) =>
//             order.paymentStatus ===
//             "Paid"
//         );

//       const totalSales =
//         paidOrders.reduce(
//           (sum, order) =>
//             sum +
//             Number(
//               order.total || 0
//             ),
//           0
//         );

//       const pendingOrders =
//         orders.filter(
//           (order) =>
//             order.status ===
//             "Pending"
//         ).length;

//       const deliveredOrders =
//         orders.filter(
//           (order) =>
//             order.status ===
//             "Delivered"
//         ).length;

//       const cancelledOrders =
//         orders.filter(
//           (order) =>
//             order.status ===
//             "Cancelled"
//         ).length;

//       res.json({
//         success: true,

//         productCount,

//         orderCount,

//         onlineOrders,

//         codOrders,

//         totalSales,

//         pendingOrders,

//         deliveredOrders,

//         cancelledOrders,
//       });

//     } catch (error) {
//       console.error(
//         "Admin stats error:",
//         error
//       );

//       res.status(500).json({
//         message:
//           "Failed to fetch statistics",
//       });
//     }
//   }
// );


// /* =========================
//    SALES REPORT
// ========================= */

// app.get(
//   "/api/admin/reports",
//   adminAuth,
//   async (req, res) => {
//     try {
//       const orders =
//         await Order.find()
//           .sort({
//             createdAt: -1,
//           });

//       const paidOrders =
//         orders.filter(
//           (order) =>
//             order.paymentStatus ===
//             "Paid"
//         );

//       const totalRevenue =
//         paidOrders.reduce(
//           (sum, order) =>
//             sum +
//             Number(
//               order.total || 0
//             ),
//           0
//         );

//       const today =
//         new Date();

//       const startOfDay =
//         new Date(
//           today
//         );

//       startOfDay.setHours(
//         0,
//         0,
//         0,
//         0
//       );

//       const startOfMonth =
//         new Date(
//           today.getFullYear(),
//           today.getMonth(),
//           1
//         );

//       const startOfYear =
//         new Date(
//           today.getFullYear(),
//           0,
//           1
//         );

//       const todayOrders =
//         paidOrders.filter(
//           (order) =>
//             new Date(
//               order.createdAt
//             ) >= startOfDay
//         );

//       const monthOrders =
//         paidOrders.filter(
//           (order) =>
//             new Date(
//               order.createdAt
//             ) >= startOfMonth
//         );

//       const yearOrders =
//         paidOrders.filter(
//           (order) =>
//             new Date(
//               order.createdAt
//             ) >= startOfYear
//         );

//       const getRevenue =
//         (list) =>
//           list.reduce(
//             (sum, order) =>
//               sum +
//               Number(
//                 order.total || 0
//               ),
//             0
//           );

//       res.json({
//         success: true,

//         totalOrders:
//           orders.length,

//         paidOrders:
//           paidOrders.length,

//         totalRevenue,

//         today: {
//           orders:
//             todayOrders.length,

//           revenue:
//             getRevenue(
//               todayOrders
//             ),
//         },

//         month: {
//           orders:
//             monthOrders.length,

//           revenue:
//             getRevenue(
//               monthOrders
//             ),
//         },

//         year: {
//           orders:
//             yearOrders.length,

//           revenue:
//             getRevenue(
//               yearOrders
//             ),
//         },

//         onlineOrders:
//           orders.filter(
//             (order) =>
//               order.paymentMethod ===
//               "ONLINE"
//           ).length,

//         codOrders:
//           orders.filter(
//             (order) =>
//               order.paymentMethod ===
//               "COD"
//           ).length,
//       });

//     } catch (error) {
//       console.error(
//         "Reports error:",
//         error
//       );

//       res.status(500).json({
//         message:
//           "Failed to generate report",
//       });
//     }
//   }
// );


// /* =========================
//    SEED PRODUCTS
// ========================= */

// async function seedDemoProducts() {
//   try {
//     const count =
//       await Product.countDocuments();

//     if (count > 0) {
//       console.log(
//         `ℹ️ Products already exist: ${count}`
//       );

//       return;
//     }

//     const products =
//       demoProducts.map(
//         (product) => ({
//           ...product,

//           variants:
//             normalizeVariants(
//               product.price,
//               product.variants
//             ),
//         })
//       );

//     await Product.insertMany(
//       products
//     );

//     console.log(
//       `✅ ${products.length} demo products inserted`
//     );

//   } catch (error) {
//     console.error(
//       "❌ Product seed error:",
//       error
//     );
//   }
// }


// /* =========================
//    START SERVER
// ========================= */

// async function startServer() {
//   try {
//     if (!process.env.JWT_SECRET) {
//       console.error(
//         "❌ JWT_SECRET is missing in .env"
//       );

//       process.exit(1);
//     }

//     if (
//       !process.env.RAZORPAY_KEY_ID ||
//       !process.env.RAZORPAY_KEY_SECRET
//     ) {
//       console.warn(
//         "⚠️ Razorpay keys are missing. Online payment will not work."
//       );
//     }

//     await connectDatabase();

//     await createDefaultAdmin();

//     await seedDemoProducts();

//     app.listen(
//       PORT,
//       () => {
//         console.log(
//           `🚀 Server running on http://localhost:${PORT}`
//         );

//         console.log(
//           `📦 API: http://localhost:${PORT}/api`
//         );
//       }
//     );

//   } catch (error) {
//     console.error(
//       "❌ Server startup failed:",
//       error
//     );

//     process.exit(1);
//   }
// }

// startServer();


import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || "").split(",").map(value => value.trim()).filter(Boolean);
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || /^http:\/\/localhost:(5173|5174)$/.test(origin)) return callback(null, true);
    return callback(new Error("Origin is not allowed by CORS"));
  },
}));
app.use(express.json({ limit: "1mb" }));

/* =========================
   PRODUCT SCHEMA
========================= */

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, default: "General" },
    price: { type: Number, required: true, min: 0 },
    variants: [
      {
        size: { type: String, required: true },
        price: { type: Number, min: 0 },
        originalPrice: { type: Number, min: 0 },
        offerPrice: { type: Number, min: 0 },
        buyingPrice: { type: Number, min: 0 },
      },
    ],
    image: { type: String, default: "" },
    images: { type: [String], default: [] },
    videoUrl: { type: String, default: "" },
    description: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    enabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

/* =========================
   ORDER SCHEMA
========================= */

const orderSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", default: null },
    orderNumber: { type: String, unique: true, sparse: true },
    estimatedDeliveryDate: { type: Date },
    customer: {
      name: { type: String, required: true },
      email: String,
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: String,
      pincode: String,
    },
    items: [
      {
        productId: String,
        name: String,
        price: Number,
        quantity: Number,
        size: String,
        image: String,
      },
    ],
    subtotal: { type: Number, required: true },
    deliveryCharge: { type: Number, required: true, default: 50 },
    total: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE"],
      default: "COD",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    status: {
      type: String,
      enum: [
        "Placed",
        "Pending",
        "Confirmed",
        "Packed",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },
  },
  { timestamps: true }
);

/* =========================
   ADMIN SCHEMA
========================= */

const adminSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "admin" },
});

const Product = mongoose.model("Product", productSchema);
const Order = mongoose.model("Order", orderSchema);
const Admin = mongoose.model("Admin", adminSchema);
const customerSchema = new mongoose.Schema({ name: { type: String, required: true, trim: true }, email: { type: String, required: true, unique: true, lowercase: true, trim: true }, phone: { type: String, default: "" }, password: { type: String, required: true } }, { timestamps: true });
const Customer = mongoose.model("Customer", customerSchema);

/* =========================
   AUTH
========================= */

function signToken(admin) {
  return jwt.sign(
    {
      id: admin._id.toString(),
      role: admin.role,
      email: admin.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
}

function adminAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Admin authentication required",
    });
  }

  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({
        message: "Admin access only",
      });
    }

    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

/* =========================
   SHIPPING + PRODUCT HELPERS
========================= */

const DELIVERY_CHARGE = 50;
const FREE_SHIPPING_THRESHOLD = 1000;

function normalizeVariants(price, variants) {
  const base = Number(price || 0);
  const fallback = [
    { size: "100ml", price: base, originalPrice: base, offerPrice: base, buyingPrice: 0 },
    { size: "200ml", price: base + 100, originalPrice: base + 100, offerPrice: base + 100, buyingPrice: 0 },
    { size: "500ml", price: base + 250, originalPrice: base + 250, offerPrice: base + 250, buyingPrice: 0 },
  ];
  if (!Array.isArray(variants) || !variants.length) return fallback;
  const clean = variants
    .filter(v => v?.size && Number(v?.offerPrice ?? v?.price) >= 0)
    .map(v => {
      const offer = Number(v.offerPrice ?? v.price ?? 0);
      return {
        size: String(v.size),
        price: offer,
        originalPrice: Number(v.originalPrice ?? offer),
        offerPrice: offer,
        buyingPrice: Number(v.buyingPrice ?? 0),
      };
    });
  return clean.length ? clean : fallback;
}

function customerAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return res.status(401).json({ message: "Please sign in to continue" });
  try { const decoded = jwt.verify(header.slice(7), process.env.JWT_SECRET); if (decoded.role !== "customer") return res.status(403).json({ message: "Customer access only" }); req.customer = decoded; next(); }
  catch { return res.status(401).json({ message: "Invalid or expired session. Please sign in again." }); }
}
function customerToken(customer) { return jwt.sign({ id: customer._id.toString(), role: "customer", email: customer.email }, process.env.JWT_SECRET, { expiresIn: "7d" }); }
async function sendOrderSms(order, eventLabel = "Order placed") {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER } = process.env;
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM_NUMBER || !order?.customer?.phone) return { sent: false };
  try {
    const date = order.estimatedDeliveryDate ? new Date(order.estimatedDeliveryDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "within 5 days";
    const address = [order.customer.address, order.customer.city, order.customer.pincode].filter(Boolean).join(", ");
    const body = `${eventLabel}. Naduvan order ${order.orderNumber || order._id}. Amount: Rs.${Number(order.total).toFixed(2)}. Address: ${address}. Expected delivery: ${date}.`;
    const rawPhone = String(order.customer.phone).trim();
    const digits = rawPhone.replace(/\D/g, "");
    const toPhone = rawPhone.startsWith("+") ? rawPhone : digits.length === 10 ? `+91${digits}` : rawPhone;
    const params = new URLSearchParams({ To: toPhone, From: TWILIO_FROM_NUMBER, Body: body });
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`, { method: "POST", headers: { Authorization: `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64")}`, "Content-Type": "application/x-www-form-urlencoded" }, body: params });
    if (!response.ok) console.error("Order SMS provider error:", response.status, (await response.text()).slice(0, 200));
    return { sent: response.ok };
  } catch (error) { console.error("Order SMS failed:", error.message); return { sent: false }; }
}

function calculateOrderTotals(items) {
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );
  const deliveryCharge = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : DELIVERY_CHARGE;
  return { subtotal, deliveryCharge, total: subtotal + deliveryCharge };
}

/* =========================
   DEMO PRODUCTS
========================= */

const seedProducts = [
  {
    name: "Aloe Vera Face Wash",
    category: "Face Care",
    price: 229,
    image:
      "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=900&q=80",
    ],
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    description:
      "Gentle aloe vera face wash for a fresh, clean feel.",
    featured: true,
  },

  {
    name: "Neem Tulsi Face Serum",
    category: "Face Care",
    price: 449,
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80",
    description:
      "Lightweight botanical serum with neem and tulsi inspired care.",
    featured: true,
  },

  {
    name: "Rice Water Face Cream",
    category: "Face Care",
    price: 399,
    image:
      "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=900&q=80",
    description:
      "Rich yet comfortable daily face cream.",
    featured: true,
  },

  {
    name: "Herbal Shampoo",
    category: "Hair Care",
    price: 349,
    image:
      "https://images.unsplash.com/photo-1620917670394-6c3b8d0a8c0c?auto=format&fit=crop&w=900&q=80",
    description:
      "Botanical shampoo for everyday hair care.",
    featured: true,
  },

  {
    name: "Multani Mitti Face Mask",
    category: "Face Masks",
    price: 199,
    image:
      "https://images.unsplash.com/photo-1570194065650-d99fb4abbd1b?auto=format&fit=crop&w=900&q=80",
    description:
      "Classic clay-based face mask for a refreshed routine.",
    featured: true,
  },

  {
    name: "Vitamin C Face Wash",
    category: "Face Care",
    price: 249,
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=80",
    description:
      "Fresh daily cleanser with vitamin C inspired skincare.",
    featured: false,
  },

  {
    name: "Argan Hair Oil",
    category: "Hair Care",
    price: 499,
    image:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=80",
    description:
      "Nourishing hair oil for smooth and healthy-looking hair.",
    featured: false,
  },

  {
    name: "Rose Water Toner",
    category: "Face Care",
    price: 299,
    image:
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=80",
    description:
      "Refreshing rose water toner for daily skincare.",
    featured: false,
  },

  {
    name: "Aloe Vera Gel",
    category: "Body Care",
    price: 199,
    image:
      "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=900&q=80",
    description:
      "Cooling aloe vera gel for everyday care.",
    featured: false,
  },
];

seedProducts.forEach(product => {
  product.variants = normalizeVariants(product.price, [
    { size: "100ml", price: product.price },
    { size: "200ml", price: Number(product.price) + 100 },
    { size: "500ml", price: Number(product.price) + 250 },
  ]);
});

/* =========================
   SEED DATABASE
========================= */

async function seedDatabase() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) console.warn("Admin account was not auto-created because ADMIN_EMAIL / ADMIN_PASSWORD are not configured.");
  const existingAdmin = adminEmail ? await Admin.findOne({ email: adminEmail }) : null;

  if (!existingAdmin && adminEmail && adminPassword) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await Admin.create({
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    });

    console.log(`Admin created: ${adminEmail}`);
  } else if (existingAdmin && existingAdmin.role !== "admin") {
    existingAdmin.role = "admin";
    await existingAdmin.save();
  }

  // Existing products from older versions did not have the enabled field.
  // Keep them visible by default when upgrading the project.
  await Product.updateMany(
    { enabled: { $exists: false } },
    { $set: { enabled: true } }
  );

  const productsWithoutVariants = await Product.find({
    $or: [{ variants: { $exists: false } }, { variants: { $size: 0 } }]
  });
  for (const product of productsWithoutVariants) {
    product.variants = normalizeVariants(product.price, product.variants);
    product.price = product.variants.find(v => v.size === "100ml")?.price ?? product.price;
    await product.save();
  }

  const count = await Product.countDocuments();

  if (count === 0) {
    await Product.insertMany(seedProducts);
    console.log("Demo products seeded");
  }
}

async function ensureSampleGalleryVideo() {
  const withVideo = await Product.exists({ videoUrl: { $nin: ["", null] } });
  if (!withVideo) {
    const firstProduct = await Product.findOne().sort({ createdAt: 1 });
    if (firstProduct) {
      firstProduct.videoUrl = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
      await firstProduct.save();
      console.log(`Sample gallery video added to: ${firstProduct.name}`);
    }
  }
}

/* =========================
   HOME
========================= */

app.get("/", (req, res) => {
  res.json({ message: "Naduvan API running" });
});

/* =========================
   ADMIN LOGIN
========================= */

app.post("/api/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const admin = await Admin.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({
        message: "Invalid admin email or password",
      });
    }

    res.json({
      token: signToken(admin),
      admin: {
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
});

/* CUSTOMER ACCOUNT */
app.post("/api/customers/register", async (req, res) => {
  try {
    const name = String(req.body.name || "").trim(), email = String(req.body.email || "").trim().toLowerCase(), phone = String(req.body.phone || "").trim(), password = String(req.body.password || "");
    if (!name || !email || password.length < 8) return res.status(400).json({ message: "Name, valid email and password (8+ characters) are required" });
    if (await Customer.findOne({ email })) return res.status(409).json({ message: "An account with this email already exists. Please sign in." });
    const customer = await Customer.create({ name, email, phone, password: await bcrypt.hash(password, 12) });
    res.status(201).json({ token: customerToken(customer), customer: { id: customer._id, name: customer.name, email: customer.email, phone: customer.phone } });
  } catch (error) { console.error(error); res.status(500).json({ message: "Unable to create account" }); }
});
app.post("/api/customers/login", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase(), password = String(req.body.password || "");
    const customer = await Customer.findOne({ email });
    if (!customer || !(await bcrypt.compare(password, customer.password))) return res.status(401).json({ message: "Invalid email or password" });
    res.json({ token: customerToken(customer), customer: { id: customer._id, name: customer.name, email: customer.email, phone: customer.phone } });
  } catch (error) { console.error(error); res.status(500).json({ message: "Unable to sign in" }); }
});
app.get("/api/customers/me", customerAuth, async (req, res) => {
  const customer = await Customer.findById(req.customer.id).select("-password");
  if (!customer) return res.status(404).json({ message: "Account not found" });
  res.json(customer);
});
app.get("/api/customers/orders", customerAuth, async (req, res) => res.json(await Order.find({ customerId: req.customer.id }).sort({ createdAt: -1 })));
app.get("/api/customers/orders/:id", customerAuth, async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, customerId: req.customer.id });
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
});

/* =========================
   PUBLIC PRODUCTS
   Only enabled products are
   visible in the shopping UI.
========================= */

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find({ enabled: true }).sort({
      createdAt: -1,
    });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to load products" });
  }
});

app.get("/api/products/featured", async (req, res) => {
  try {
    const products = await Product.find({
      enabled: true,
      featured: true,
    }).limit(10);

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to load featured products",
    });
  }
});


/* =========================
   PUBLIC GALLERY
   Gallery videos are managed
   from the admin product form.
========================= */

app.get("/api/gallery", async (req, res) => {
  try {
    const products = await Product.find({ enabled: true, videoUrl: { $nin: ["", null] } })
      .select("name category image videoUrl variants")
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to load gallery" });
  }
});

/* =========================
   CREATE ORDER
========================= */

app.post("/api/orders", customerAuth, async (req, res) => {
  try {
    const { customer: customerInput, items, paymentMethod = "COD" } = req.body;
    if (!customerInput?.name || !customerInput?.phone || !customerInput?.address) return res.status(400).json({ message: "Name, phone and address are required" });
    if (!Array.isArray(items) || !items.length) return res.status(400).json({ message: "Cart is empty" });
    if (paymentMethod !== "COD") return res.status(400).json({ message: "Online payment is not enabled yet. Please choose Cash on Delivery." });
    const safeItems = [];
    for (const item of items) {
      const productId = item.productId || item._id;
      if (!mongoose.Types.ObjectId.isValid(productId)) return res.status(400).json({ message: "Invalid product in cart" });
      const product = await Product.findOne({ _id: productId, enabled: true });
      if (!product) return res.status(400).json({ message: `Product is unavailable: ${item.name || "item"}` });
      const variant = product.variants.find(v => v.size === String(item.size || "")) || product.variants[0];
      const quantity = Number(item.quantity);
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) return res.status(400).json({ message: "Quantity must be between 1 and 99" });
      safeItems.push({ productId: product._id.toString(), name: product.name, price: Number(variant.offerPrice ?? variant.price ?? product.price), quantity, image: product.image || product.images?.[0] || "", size: variant.size });
    }
    const { subtotal, deliveryCharge, total } = calculateOrderTotals(safeItems);
    const account = await Customer.findById(req.customer.id);
    if (!account) return res.status(401).json({ message: "Please sign in again" });
    const phone = String(customerInput.phone).trim();
    if (!/^[+0-9 ()-]{8,18}$/.test(phone)) return res.status(400).json({ message: "Enter a valid mobile number" });
    const estimatedDeliveryDate = new Date(); estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 5);
    const order = await Order.create({
      customerId: account._id, orderNumber: `NDV${Date.now().toString().slice(-10)}`, estimatedDeliveryDate,
      customer: { name: String(customerInput.name).trim(), email: account.email, phone, address: String(customerInput.address).trim(), city: String(customerInput.city || "").trim(), pincode: String(customerInput.pincode || "").trim() },
      items: safeItems, subtotal, deliveryCharge, total, paymentMethod: "COD", paymentStatus: "Pending", status: "Placed",
    });
    await sendOrderSms(order);
    res.status(201).json({ message: "COD order placed successfully", orderId: order._id, orderNumber: order.orderNumber, estimatedDeliveryDate: order.estimatedDeliveryDate, order });
  } catch (error) { console.error(error); res.status(500).json({ message: "Unable to place order" }); }
});

/* =========================
   ADMIN ORDERS
========================= */

app.get("/api/admin/orders", adminAuth, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to load orders" });
  }
});

app.patch("/api/admin/orders/:id/status", adminAuth, async (req, res) => {
  try {
    const allowedStatuses = [
      "Placed",
      "Pending",
      "Confirmed",
      "Packed",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await sendOrderSms(order, `Order status updated: ${status}`);
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to update status",
    });
  }
});

/* =========================
   DELETE / REJECT ORDER
========================= */

app.delete("/api/admin/orders/:id", adminAuth, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: "Cancelled" }, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });
    await sendOrderSms(order, "Your order has been cancelled");
    res.json({ message: "Order cancelled successfully; order history was retained", orderId: req.params.id, order });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to delete order",
    });
  }
});

/* =========================
   ADMIN STATS
========================= */

app.get("/api/admin/stats", adminAuth, async (req, res) => {
  try {
    const orders = await Order.find();

    const salesOrders = orders.filter(order => order.status !== "Cancelled" && (order.paymentStatus === "Paid" || (order.paymentMethod === "COD" && order.status === "Delivered")));
    const sales = salesOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);

    const customers = new Set(
      orders.map(
        (order) => order.customer?.email || order.customer?.phone
      )
    ).size;
    const products = await Product.countDocuments();

    res.json({
      orders: orders.length,
      customers,
      sales,
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to load dashboard stats",
    });
  }
});

/* =========================
   ADMIN PRODUCTS
========================= */

app.get("/api/admin/products", adminAuth, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to load products" });
  }
});

app.post("/api/admin/products", adminAuth, async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      variants,
      image,
      images,
      videoUrl,
      description,
      featured,
      enabled = true,
    } = req.body;

    if (!name || price === undefined || price === "") {
      return res.status(400).json({
        message: "Product name and price are required",
      });
    }

    const product = await Product.create({
      name,
      category,
      price: Number(normalizeVariants(price, variants).find(v => v.size === "100ml")?.price ?? price),
      variants: normalizeVariants(price, variants),
      image: image || images?.[0] || "",
      images: Array.isArray(images) ? images.filter(Boolean).slice(0, 4) : (image ? [image] : []),
      videoUrl: videoUrl || "",
      description,
      featured: Boolean(featured),
      enabled: Boolean(enabled),
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to create product",
    });
  }
});

app.put("/api/admin/products/:id", adminAuth, async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      variants,
      image,
      images,
      videoUrl,
      description,
      featured,
      enabled,
    } = req.body;

    const normalizedVariants = normalizeVariants(price, variants);

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        category,
        price: Number(normalizedVariants.find(v => v.size === "100ml")?.price ?? price),
        variants: normalizedVariants,
        image: image || images?.[0] || "",
        images: Array.isArray(images) ? images.filter(Boolean).slice(0, 4) : (image ? [image] : []),
        videoUrl: videoUrl || "",
        description,
        featured: Boolean(featured),
        enabled: Boolean(enabled),
      },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to update product",
    });
  }
});

app.patch("/api/admin/products/:id/toggle", adminAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.enabled = !product.enabled;
    await product.save();

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to change product visibility",
    });
  }
});

app.delete("/api/admin/products/:id", adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to delete product",
    });
  }
});

/* =========================
   REPORT HELPERS
========================= */

function getDateRange(type, value) {
  const now = new Date();

  if (type === "day") {
    const date = value ? new Date(`${value}T00:00:00`) : now;

    if (Number.isNaN(date.getTime())) return null;

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    return { start, end };
  }

  if (type === "month") {
    const match = /^([0-9]{4})-([0-9]{2})$/.exec(value || "");
    const year = match ? Number(match[1]) : now.getFullYear();
    const month = match ? Number(match[2]) - 1 : now.getMonth();

    if (month < 0 || month > 11) return null;

    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 1);

    return { start, end };
  }

  if (type === "year") {
    const year = value ? Number(value) : now.getFullYear();

    if (!Number.isInteger(year) || year < 2000 || year > 2100) {
      return null;
    }

    const start = new Date(year, 0, 1);
    const end = new Date(year + 1, 0, 1);

    return { start, end };
  }

  return null;
}

async function buildReport(type, value) {
  const range = getDateRange(type, value);

  if (!range) throw new Error("Invalid report date");

  const orders = await Order.find({
    createdAt: {
      $gte: range.start,
      $lt: range.end,
    },
  }).sort({ createdAt: -1 });

  const validOrders = orders.filter(order => order.status !== "Cancelled");
  const salesOrders = orders.filter(order => order.status !== "Cancelled" && (order.paymentStatus === "Paid" || (order.paymentMethod === "COD" && order.status === "Delivered")));
  const sales = salesOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);

  const customers = new Set(
    orders.map(
      (order) => order.customer?.email || order.customer?.phone
    )
  ).size;

  return {
    type,
    from: range.start,
    to: range.end,
    orders: orders.length,
    validOrders: validOrders.length,
    cancelledOrders: orders.filter(
      (order) => order.status === "Cancelled"
    ).length,
    customers,
    sales,
    onlineOrders: orders.filter(
      (order) => order.paymentMethod === "ONLINE"
    ).length,
    codOrders: orders.filter(
      (order) => order.paymentMethod === "COD"
    ).length,
    data: orders,
  };
}

app.get("/api/admin/reports/day", adminAuth, async (req, res) => {
  try {
    res.json(await buildReport("day", req.query.date));
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

app.get("/api/admin/reports/month", adminAuth, async (req, res) => {
  try {
    res.json(await buildReport("month", req.query.month));
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

app.get("/api/admin/reports/year", adminAuth, async (req, res) => {
  try {
    res.json(await buildReport("year", req.query.year));
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

/* =========================
   SERVER
========================= */

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");
    await seedDatabase();
    await ensureSampleGalleryVideo();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error(
      "MongoDB connection failed:",
      error.message
    );
    process.exit(1);
  });

