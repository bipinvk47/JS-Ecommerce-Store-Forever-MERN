import userModel from "../models/userModel.js";
import {
  handleControllerError,
  requireFields,
  sendFailure,
  sendSuccess,
} from "../utils/apiResponse.js";

// Add products to user's cart
const addToCart = async (req, res) => {
  try {
    const { userId, itemId, size } = req.body;
    const validationError = requireFields(req.body, ["userId", "itemId", "size"]);

    if (validationError) {
      return sendFailure(res, validationError, 400);
    }

    const userData = await userModel.findById(userId);

    if (!userData) {
      return sendFailure(res, "User not found", 404);
    }

    let cartData = await userData.cartData;

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });

    return sendSuccess(res, { message: "Added to cart" });
  } catch (error) {
    return handleControllerError(res, error, "addToCart");
  }
};

// Update user's cart
const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;
    const validationError = requireFields(req.body, [
      "userId",
      "itemId",
      "size",
      "quantity",
    ]);

    if (validationError) {
      return sendFailure(res, validationError, 400);
    }

    if (Number(quantity) < 0) {
      return sendFailure(res, "Quantity must be zero or greater", 400);
    }

    const userData = await userModel.findById(userId);

    if (!userData) {
      return sendFailure(res, "User not found", 404);
    }

    let cartData = await userData.cartData;

    if (!cartData[itemId] || cartData[itemId][size] === undefined) {
      return sendFailure(res, "Cart item not found", 404);
    }

    cartData[itemId][size] = Number(quantity);

    await userModel.findByIdAndUpdate(userId, { cartData });

    return sendSuccess(res, { message: "Cart Updated" });
  } catch (error) {
    return handleControllerError(res, error, "updateCart");
  }
};

// Get user's cart data
const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body;
    const validationError = requireFields(req.body, ["userId"]);

    if (validationError) {
      return sendFailure(res, validationError, 400);
    }

    const userData = await userModel.findById(userId);

    if (!userData) {
      return sendFailure(res, "User not found", 404);
    }

    let cartData = await userData.cartData;

    return sendSuccess(res, { cartData });
  } catch (error) {
    return handleControllerError(res, error, "getUserCart");
  }
};

export { addToCart, updateCart, getUserCart };
