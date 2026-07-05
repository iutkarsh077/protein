import ImageModel from "../models/image_model.js";
import UserModel from "../models/user_model.js";

const getUserData = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.sub).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const userAnalysisData = await ImageModel.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      userAnalysisData,
    });
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch user data.",
    });
  }
};

export default getUserData;
