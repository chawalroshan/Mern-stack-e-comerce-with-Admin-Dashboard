import CartProductModel from '../models/cartProduct.model.js'
import UserModel from '../models/user.model.js'

export async function addToCartItemController(request, response) {
  try {
    const userId = request.userId
    const { productId, quantity = 1 } = request.body // Accept quantity parameter

    if (!productId) {
      return response.status(400).json({
        message: 'Provide productId',
        error: true,
        success: false,
      })
    }

    // Check if product already in cart
    const checkItemCart = await CartProductModel.findOne({ userId, productId })
    if (checkItemCart) {
      // Instead of returning error, update the quantity
      checkItemCart.quantity += quantity;
      await checkItemCart.save();
      
      return response.status(200).json({
        message: 'Cart item quantity updated',
        error: false,
        success: true,
      })
    }

    // Add to cart collection
    const cartItem = new CartProductModel({
      quantity: quantity,
      userId,
      productId,
    })
    await cartItem.save()

    // Push productId into user.shopping_cart
    await UserModel.updateOne(
      { _id: userId },
      { $push: { shopping_cart: productId } }
    )

    return response.status(200).json({
      message: 'Item added successfully',
      error: false,
      success: true,
    })
  } catch (error) {
    return response.status(500).json({
      message: error.message || 'Something went wrong',
      error: true,
      success: false,
    })
  }
}

//get cart items
// In your cart.controller.js - Fix the getCartItemController
export async function getCartItemController(request, response) {
  try {
      const userId = request.userId;

      // Add proper error handling for populate
      const cartItem = await CartProductModel.find({
          userId: userId
      })
      .populate({
          path: 'productId',
          model: 'product' // Make sure this matches your product model name
      })
      .exec();

      // Check if cartItem is null/undefined
      if (!cartItem) {
          return response.status(200).json({
              data: [],
              error: false,
              success: true,
          });
      }

      return response.status(200).json({
          data: cartItem,
          error: false,
          success: true,
      });

  } catch (error) {
      console.error('Error fetching cart items:', error);
      return response.status(500).json({
          message: error.message || 'Something went wrong',
          error: true,
          success: false,
      });
  }
}


// update cart item quantity
export async function updateCartItemQtyController(request, response) {
    try {
      const userId = request.userId;
      const { _id, qty } = request.body;
  
      if (!_id || !qty) {
        return response.status(400).json({
          message: "Provide _id and qty",
          error: true,
          success: false,
        });
      }
  
      const updateCartItem = await CartProductModel.updateOne(
        {
          _id: _id,
          userId: userId,
        },
        {
          $set: { quantity: qty },
        }
      );
  
      return response.status(200).json({
        message: "Cart item updated successfully",
        error: false,
        success: true,
        data: updateCartItem,
      });
    } catch (error) {
      return response.status(500).json({
        message: error.message || "Something went wrong",
        error: true,
        success: false,
      });
    }
  }
  


  // delete cart item
  export async function deleteCartItemController(request, response) {
    try {
      const userId = request.userId;
      const { _id, productId } = request.body;
      
      console.log('=== DELETE CART ITEM REQUEST ===');
      console.log('User ID:', userId);
      console.log('Cart Item ID (_id):', _id);
      console.log('Product ID:', productId);
  
      if (!_id || !productId) {
        console.log('Missing _id or productId');
        return response.status(400).json({
          message: "Provide _id and productId",
          error: true,
          success: false,
        });
      }
  
      // Verify the cart item exists
      const cartItem = await CartProductModel.findOne({
        _id: _id,
        userId: userId
      });
      
      console.log('Found cart item:', cartItem);
      
      if (!cartItem) {
        console.log('Cart item not found');
        return response.status(404).json({
          message: "Cart item not found",
          error: true,
          success: false,
        });
      }
  
      // Delete from cart collection
      const deleteItem = await CartProductModel.deleteOne({
        _id: _id,
        userId: userId,
      });
      
      console.log('Delete result:', deleteItem);
  
      // Also update user shopping_cart array
      const userUpdate = await UserModel.updateOne(
        { _id: userId },
        {
          $pull: { shopping_cart: productId },
        }
      );
      
      console.log('User update result:', userUpdate);
  
      return response.status(200).json({
        message: "Cart item deleted successfully",
        error: false,
        success: true,
        data: deleteItem,
      });
    } catch (error) {
      console.error('Error in deleteCartItemController:', error);
      console.error('Error stack:', error.stack);
      return response.status(500).json({
        message: error.message || "Something went wrong",
        error: true,
        success: false,
      });
    }
  }


  export async function syncCartController(request, response) {
    try {
      const userId = request.userId;
      const { cartItems } = request.body;
  
      if (!Array.isArray(cartItems)) {
        return response.status(400).json({
          message: 'Provide cartItems array',
          error: true,
          success: false,
        });
      }
  
      const results = [];
      
      for (const item of cartItems) {
        const { productId, quantity = 1 } = item;
        
        // Check if already in cart
        const existingItem = await CartProductModel.findOne({ userId, productId });
        
        if (existingItem) {
          // Update quantity
          existingItem.quantity += quantity;
          await existingItem.save();
          results.push({
            productId,
            action: 'updated',
            quantity: existingItem.quantity
          });
        } else {
          // Add new item
          const cartItem = new CartProductModel({
            quantity: quantity,
            userId,
            productId,
          });
          await cartItem.save();
          results.push({
            productId,
            action: 'added',
            quantity: quantity
          });
        }
  
        // Update user's shopping cart array
        await UserModel.updateOne(
          { _id: userId },
          { $addToSet: { shopping_cart: productId } }
        );
      }
  
      return response.status(200).json({
        message: 'Cart synced successfully',
        error: false,
        success: true,
        syncedItems: results.length,
        results
      });
    } catch (error) {
      return response.status(500).json({
        message: error.message || 'Something went wrong',
        error: true,
        success: false,
      });
    }
  }
  