import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

//public
const userAuth = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (user && (await user.matchPass(password))) {
    const token = generateToken(res, user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,

      profileImage: user.profileImage,
      role: user.role,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid Username or Password!");
  }
});

// public
const userRegister = asyncHandler(async (req, res) => {
  const { name, username, email, password, role, profileImage } = req.body;

  const duplicateUser = await User.findOne({ username });
  const duplicateEmail = await User.findOne({ email });

  if (duplicateUser) {
    res.status(400);
    throw new Error("Username already taken :(");
  }
  if (duplicateEmail) {
    res.status(400);
    throw new Error("Email already in use,Log in! ");
  }
  const user = await User.create({
    name,
    username,
    email,
    password,
    profileImage,
    role,
  });
  if (user) {
    const token = generateToken(res, user._id);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      profileImage: user.profileImage,
      role: user.role,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Soemthing went wrong,try again!");
  }
});

//private
const userLogout = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "User Logged Out" });
});

//private

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.body._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      profileImage: user.profileImage,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//get user by id

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      profileImage: user.profileImage,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.body._id);

  if (user) {
    user.name = req.body.name;
    user.username = req.body.username;
    user.profileImage = req.body.profileImage;
    user.email = req.body.email;
    user.role = req.body.role;

    if (req.body.password !== "") {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      username: updatedUser.username,
      profileImage: updatedUser.profileImage,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } else {
    res.status(401);
    throw new Error("no user found");
  }
});

const deleteUser = async (req, res) => {
  const userId = req.body._id;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while deleting the user" });
  }
};

export {
  getUser,
  deleteUser,
  userAuth,
  userRegister,
  userLogout,
  getUserProfile,
  updateUserProfile,
};
