import foodItems from "../models/foodItem.js";
import restaurant from "../models/restaurant.js"
export const createFoodItem = async (req, res) => {
    const { name, description, price, imageUrl, isVeg, category, preparationTime } = req.body;
    try {
        const findRestaurant = await restaurant.findOne({ owner: req.user._id }) //from authmiddleware take the user id to find teh restraurant 
        if (!findRestaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found"
            })
        }

        if (!name || !description || price == null || price < 0 || !category || preparationTime == null || preparationTime < 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide valid food item details."
            });
        }

        const newFoodItem = await foodItems.create({
            name,
            description,
            price,
            imageUrl,
            isVeg,
            category,
            preparationTime,
            restaurantId:findRestaurant._id1
        })

        return res.status(201).json({
            success: true,
            message: "Food item created successfully.",
            foodItem: newFoodItem
        });
    }
    catch(error) {
        return res.status(500).json({
        success: false,
        message:error.message
    });
    }
}