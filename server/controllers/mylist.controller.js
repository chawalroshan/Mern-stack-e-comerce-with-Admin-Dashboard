import MyListModel from "../models/myList.model.js";


export async function addToMyListController(request, response) {
  try {
    const userId = request.userId;
    const { 
      productId,
      productTitle, 
      images,
      rating,
      price, 
      oldPrice,
      brand, 
      discount 
    } = request.body;

    // Check if product already in wishlist
    const item = await MyListModel.findOne({
      userId: userId,
      productId: productId
    });

    if (item) {
      return response.status(400).json({ // Changed from 500 to 400
        message: 'Item already in my list',
        error: true,
        success: false,
      });        
    }

    const myList = new MyListModel({
      productId,
      productTitle, 
      images,
      rating,
      price, 
      oldPrice,
      brand, 
      discount, 
      userId
    });

    const save = await myList.save();

    return response.status(200).json({ // Changed from 500 to 200
      message: 'The product saved in my list',
      error: false,
      success: true,
      data: save
    });

  } catch (error) {
    console.error('Error in addToMyListController:', error);
    return response.status(500).json({
      message: error.message || 'Something went wrong',
      error: true,
      success: false,
    });
  }
}


// delete from MyList
export async function deleteToMyListController(request, response) {
  try {
      console.log('=== DELETE MY LIST ITEM ===');
      console.log('User ID:', request.userId);
      console.log('Item ID from params:', request.params.id);
      console.log('Request body:', request.body);

      const userId = request.userId;
      const { id } = request.params; // Get id from URL params
      
      if (!id) {
          console.log('No item ID provided');
          return response.status(400).json({
              message: "Please provide item ID",
              error: true,
              success: false,
          });
      }

      // First, find the item to verify it belongs to the user
      const myListItem = await MyListModel.findOne({
          _id: id,
          userId: userId
      });

      console.log('Found item:', myListItem);

      if (!myListItem) {
          return response.status(404).json({
              message: "Item not found in your wishlist",
              error: true,
              success: false,
          });
      }

      // Store productId for updating user document
      const productId = myListItem.productId;

      // Delete the item
      const deleteResult = await MyListModel.deleteOne({
          _id: id,
          userId: userId
      });

      console.log('Delete result:', deleteResult);

      // Optional: Update user's my_list array if you have that field
      if (productId) {
          try {
              await UserModel.updateOne(
                  { _id: userId },
                  { $pull: { my_list: productId } }
              );
              console.log('User document updated');
          } catch (userError) {
              console.log('Note: Could not update user document, but item deleted');
          }
      }

      return response.status(200).json({
          message: "Item removed from wishlist successfully",
          error: false,
          success: true,
          data: deleteResult,
      });
  } catch (error) {
      console.error('Error in deleteToMyListController:', error);
      console.error('Error stack:', error.stack);
      return response.status(500).json({
          message: error.message || "Something went wrong",
          error: true,
          success: false,
      });
  }
}


  
// get from MyList
export async function getMyListController(request, response) {
    try {
      const userId = request.userId; // comes from auth middleware
  
      if (!userId) {
        return response.status(401).json({
          message: "Unauthorized - userId missing",
          error: true,
          success: false,
        });
      }
  
      // find all my list items for this user
      const myListItems = await MyListModel.find({ userId })
        .populate("productId")   // assuming MyList schema has productId ref
        .sort({ createdAt: -1 }); // latest first
  
      return response.status(200).json({
        message: "Fetched MyList successfully",
        error: false,
        success: true,
        data: myListItems,
      });
    } catch (error) {
      return response.status(500).json({
        message: error.message || "Something went wrong",
        error: true,
        success: false,
      });
    }
  }
  
  