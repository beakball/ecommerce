import User from "../models/userModel.js";
import JWT from "jsonwebtoken";
import bcrypt from "bcrypt";

export const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // validation
    if (!name) {
      return res.status(400).send({
        success: false,
        message: "Please provide name",
      });
    }
    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Please provide email",
      });
    }
    if (!password && password.length < 6) {
      return res.status(400).send({
        success: false,
        message: "Password must be minimum 6 character long",
      });
    }

    // check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).send({
        success: false,
        message: "User already exists. Please login",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    const { role, isVerified } = user;
    res.status(201).send({
      success: true,
      message: "User registed successfully",
      user: {
        name,
        email,
        role,
        isVerified,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in register controller api",
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Please provide email",
      });
    }
    if (!password && password.length < 6) {
      return res.status(400).send({
        success: false,
        message: "Password must be minimum 6 character long",
      });
    }

    // find the user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(403).send({
        success: false,
        message: "User not exist. Please create account",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(403).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const { name, role, isVerified } = user;

    res.status(200).send({
      success: true,
      message: "Login successfully",
      user: {
        name,
        email,
        role,
        isVerified,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in login controller api",
    });
  }
};

export const testController = async (req, res) => {
  try {
    return res.status(200).send({
      success: true,
      message: "Success",
      user: req.user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in test api",
    });
  }
};
