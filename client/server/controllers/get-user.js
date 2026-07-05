import UserModel from "../models/user_model.js";

const getUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.sub).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Failed to get user:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch user.",
    });
  }
};

export default getUser;
