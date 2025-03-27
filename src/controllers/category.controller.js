
// @desc    Get all categories
// @route   GET /api/v1/categories

import Category from "../models/category.model.js";

// @access  Public
export const getCategories = (async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single category
// @route   GET /api/v1/categories/:id
// @access  Public
export const getCategory = (async (req, res, next) => {
  const category = await Category.findById(req.params.id).populate({
    path: 'parent',
    select: 'name description'
  });

  if (!category) {
    return next(
      new ErrorResponse(`No category with the id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: category
  });
});

// @desc    Create category
// @route   POST /api/v1/categories
// @access  Private/Admin
export const createCategory = async (req, res, next) => {
    try {
      // 1. Proper request logging
      console.log('Create Category Request:', JSON.stringify(req.body, null, 2));
  
      // 2. Validate required fields
      const { name, description, parent } = req.body;
      
      if (!name || typeof name !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Category name is required and must be a string'
        });
      }
  
      // 3. Trim and validate name
      const trimmedName = name.trim();
      if (!trimmedName) {
        return res.status(400).json({
          success: false,
          error: 'Category name cannot be empty'
        });
      }
  
      if (trimmedName.length > 50) {
        return res.status(400).json({
          success: false,
          error: 'Category name cannot exceed 50 characters'
        });
      }
  
      // 4. Validate parent category if provided
      if (parent) {
        try {
          const parentExists = await Category.exists({ _id: parent });
          if (!parentExists) {
            return res.status(400).json({
              success: false,
              error: 'Parent category does not exist'
            });
          }
        } catch (err) {
          return res.status(400).json({
            success: false,
            error: 'Invalid parent category ID format'
          });
        }
      }
  
      // 5. Check for duplicate category name
      const existingCategory = await Category.findOne({ name: trimmedName });
      if (existingCategory) {
        return res.status(409).json({
          success: false,
          error: 'Category name already exists'
        });
      }
  
      // 6. Create the category with slug
      const category = await Category.create({
        name: trimmedName,
        description: description || '',
        parent: parent || null,
        isActive: req.body.isActive !== false, // Default to true
      });
  
      // 7. Success response
      res.status(201).json({
        success: true,
        data: category
      });
  
    } catch (error) {
      console.error('Category Creation Error:', error);
      
      // Handle validation errors
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          error: error.message,
          details: error.errors
        });
      }
      
      // Handle duplicate key errors (unique constraint)
      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          error: 'Category name must be unique'
        });
      }
      
      // Generic server error
      res.status(500).json({
        success: false,
        error: 'Internal server error while creating category'
      });
    }
  };

// @desc    Update category
// @route   PUT /api/v1/categories/:id
// @access  Private/Admin
export const updateCategory = (async (req, res, next) => {
  let category = await Category.findById(req.params.id);

  if (!category) {
    return next(
      new ErrorResponse(`No category with the id of ${req.params.id}`, 404)
    );
  }


  category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: category
  });
});

// // @desc    Delete category
// // @route   DELETE /api/v1/categories/:id
// // @access  Private/Admin
// exports.deleteCategory = asyncHandler(async (req, res, next) => {
//   const category = await Category.findById(req.params.id);

//   if (!category) {
//     return next(
//       new ErrorResponse(`No category with the id of ${req.params.id}`, 404)
//     );
//   }

//   await category.remove();

//   res.status(200).json({
//     success: true,
//     data: {}
//   });
// });

// // @desc    Get subcategories
// // @route   GET /api/v1/categories/:id/subcategories
// // @access  Public
// exports.getSubCategories = asyncHandler(async (req, res, next) => {
//   const subCategories = await Category.find({ parent: req.params.id });

//   res.status(200).json({
//     success: true,
//     count: subCategories.length,
//     data: subCategories
//   });
// });