import CartProductModel from '../models/cartProduct.model.js'
import UserModel from '../models/user.model.js'

export async function addToCartItemController(request, response) {
  try {
    const userId = request.userId
    const { productId } = request.body

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
      return response.status(400).json({
        message: 'Item already in cart',
        error: true,
        success: false,
      })
    }

    // Add to cart collection
    const cartItem = new CartProductModel({
      quantity: 1,
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
export async function getCartItemController(request, response) {
    try {
        const userId = request.userId;

        const cartItem = await CartProductModel.find({
            userId : userId
        }).populate('productId')

        return response.status(200).json({
           data: cartItem,
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
  
      if (!_id || !productId) {
        return response.status(400).json({
          message: "Provide _id and productId",
          error: true,
          success: false,
        });
      }
  
      // delete from cart collection
      const deleteItem = await CartProductModel.deleteOne({
        _id: _id,
        userId: userId,
      });
  
      // also update user shopping_cart array
      await UserModel.updateOne(
        { _id: userId },
        {
          $pull: { shopping_cart: productId },
        }
      );
  
      return response.status(200).json({
        message: "Cart item deleted successfully",
        error: false,
        success: true,
        data: deleteItem,
      });
    } catch (error) {
      return response.status(500).json({
        message: error.message || "Something went wrong",
        error: true,
        success: false,
      });
    }
  }
  