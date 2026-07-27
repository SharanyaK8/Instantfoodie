import Restaurant from "../models/restaurant.js";

// Create a new restaurant
export const createRestaurant = async (req, res) => {
  try {
    const { restaurantName, cuisine, description, restaurantAddress, isOpen } =
      req.body;

    const restaurant = new Restaurant({
      restaurantName,
      cuisine,
      description,
      restaurantAddress,
      isOpen,
      owner: req.user._id,
    });

    await restaurant.save();

    res.status(201).json({
      success: true,
      message: "Restaurant created successfully",
      restaurant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating restaurant",
      error: error.message,
    });
  }
};

export const getMyRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ owner: req.user._id });

    res.status(200).json({
      success: true,
      message: "Restaurants fetched successfully",
      restaurants,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching restaurants",
      error: error.message,
    });
  }
};

export const updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      restaurantName,
      cuisine,
      description,
      restaurantAddress,
      isOpen,
    } = req.body;

    const updateData = {};

    if (restaurantName !== undefined)
      updateData.restaurantName = restaurantName;

    if (cuisine !== undefined)
      updateData.cuisine = cuisine;

    if (description !== undefined)
      updateData.description = description;

    if (restaurantAddress !== undefined)
      updateData.restaurantAddress = restaurantAddress;

    if (isOpen !== undefined)
      updateData.isOpen = isOpen;

    const restaurant = await Restaurant.findOneAndUpdate(
      {
        _id: id,
        owner: req.user._id,
      },
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found or unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Restaurant updated successfully",
      restaurant,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};