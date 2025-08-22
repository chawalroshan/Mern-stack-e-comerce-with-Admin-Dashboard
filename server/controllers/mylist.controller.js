import MyListModel from "../models/myList.model.js";


export async function addToMyListController(request, response) {
try {
    const userId = request.userId
    const { 
        productId,
         productTitle, 
         images,
          rating,
           price, 
           oldPrice,
            brand, 
            discount } = request.body

            const item = await MyListModel.findOne({
                userId: userId,
                productId: productId
            })

            if(item){
                return response.status(500).json({
                    message: 'Item already in my list',
                    
              })        
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
        })

        const save = await myList.save();

        return response.status(500).json({
            message: 'The product saved in my list',
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


// delete from MyList
export async function deleteToMyListController(request, response) {
    try {
      const userId = request.userId;   // assuming auth middleware sets this
      const { id } = request.params;   // id of the item in MyList
      const { productId } = request.body; // optional, if you track product in user doc
  
      const myListItem = await MyListModel.findById(id);
  
      if (!myListItem) {
        return response.status(404).json({
          message: "The item with this given id was not found",
          error: true,
          success: false,
        });
      }
  
      // delete item from MyList collection
      const deleteItem = await MyListModel.deleteOne({ _id: id });
  
      // optional: update user to remove productId from my_list array
      if (productId) {
        await UserModel.updateOne(
          { _id: userId },
          { $pull: { my_list: productId } }
        );
      }
  
      return response.status(200).json({
        message: "Item removed from MyList successfully",
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
  
  