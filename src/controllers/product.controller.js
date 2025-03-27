import multer from "multer";
import Product from "../models/product.model.js";
import cloudinary from "../config/cloudinary.js";
import { validationResult } from "express-validator";

// Configure multer to handle file uploads
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
}).single("image");

/**
 * Service function to upload image to Cloudinary
 */
const uploadImageToCloudinary = async (fileBuffer) => {
  try {
    return await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder: "products", // Organize images in folder
          quality: "auto:good", // Optimize image quality
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(fileBuffer);
    });
  } catch (error) {
    throw new Error(`Image upload failed: ${error.message}`);
  }
};

/**
 * Add new product with image upload
 */
export const addProduct = async (req, res, next) => {
  // First handle the file upload
  upload(req, res, async (uploadError) => {
    try {
      if (uploadError) {
        return res.status(400).json({
          success: false,
          error: uploadError.message || "File upload failed",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "No image file provided",
        });
      }

      // Validate request body
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { name, description, price, stock, category } = req.body;

      // Validate numeric fields
      if (isNaN(price) || isNaN(stock)) {
        return res.status(400).json({
          success: false,
          error: "Price and stock must be numbers",
        });
      }

      // Upload image to Cloudinary
      const uploadResult = await uploadImageToCloudinary(req.file.buffer);

      // Create product in database
      const product = new Product({
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price),
        stock: parseInt(stock),
        image: uploadResult.secure_url,
        category: category.trim(),
      });

      await product.save();

      // Return success response
      res.status(201).json({
        success: true,
        message: "Product added successfully",
        data: {
          product: {
            id: product._id,
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            imageUrl: product.image,
            category: product.category,
          },
        },
      });
    } catch (error) {
      // Log the error for debugging
      console.error("Product creation error:", error);

      // Send appropriate error response
      if (error.message.includes("Image upload failed")) {
        return res.status(502).json({
          success: false,
          error: "Image storage service unavailable",
        });
      }

      next(error);
    }
  });
};

export const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: products?.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};
