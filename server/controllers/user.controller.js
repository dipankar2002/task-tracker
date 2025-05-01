import { UserDb } from '../models/user.js';
import { comparePassword, hashPassword } from '../utils/hashPass.js';
import { generateToken } from '../utils/generateTocken.js';
import { loginSchema } from '../../../payment-app/backend/src/zod/user.zod.js';
import { userSignupZod } from '../zod/userZod.js';
import ProjectDb from '../models/project.js';
import TaskDb from '../models/task.js';


export const checkUser = (req,res) => {
  try {
    res.status(200).json({
      message: "User fetch successfull",
      success: true,
      user: req.user
    });
  } catch(error) {
    res.status(500).json({
      message: 'Internal server error',
      success: false,
      error: error,
    });
  }
}
export const users = async (req, res) => {
  const filter = req.query.filter || "";

  try {
    if (filter) {
      const filterUsers = await UserDb.find({
        $or: [
          {
            name: { $regex: filter, $options: "i" },
          },
          {
            username: { $regex: filter, $options: "i" },
          },
        ],
      }).select("-password -__v");

      return res.status(200).json({
        message: "Filter users fetch successfull",
        success: true,
        user: filterUsers,
      });
    }

    const allUsers = await UserDb.find().select("-password -__v");
    res.status(200).json({
      message: "All users fetch successfull",
      success: true,
      users: allUsers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error,
    });
  }
};

export const signup = async (req, res) => {
  const { email, name, username, password, country } = req.body;

  try {
    const { success, error } = userSignupZod.safeParse(req.body);
    if(!success ) {
      return res.status(401).json({
        message: 'Invalid input data',
        success: false,
        error: error,
      });
    }
    
    const isUserExist = await UserDb.findOne({ email });
    if(isUserExist) {
      return res.status(401).json({
        message: 'User already exists',
        success: false,
      });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new UserDb({
      email, name, username, password: hashedPassword, country,
    });

    if(newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
    
      return res.status(201).json({
        message: 'User created successfully',
        success: true,
        user: {
          _id: newUser._id,
          email: newUser.email,
          name: newUser.name,
          username: newUser.username,
          country: newUser.country,
          createdAt: newUser.createdAt,
        }
      });
    } else {
      return res.status(401).json({
        message: 'User creation failed',
        success: false,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
      success: false,
      error: error,
    });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { success, error } = loginSchema.safeParse({
      email: email,
      password: password,
    });

    if (!success) {
      return res.status(401).json({
        message: "Invalid input data",
        success: false,
        error: error,
      });
    }

    const user = await UserDb.findOne({ email });
    if(!user) {
      return res.status(400).json({
        message: "User not found / Try to SignUp first",
        success: false
      })
    }

    const checkPass = await comparePassword(password, user.password);
    if(checkPass) {
      generateToken(user._id, res);

      return res.status(201).json({
        message: 'User login successfully',
        success: true,
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          username: user.username,
          country: user.country,
          createdAt: user.createdAt,
        }
      });
    } else {
      return res.status(400).json({
        message: "Password is incorrect",
        success: false
      })
    }

  } catch(error) {
    res.status(500).json({
      message: 'Internal server error',
      success: false,
      error: error,
    });
  }
};
export const logout = (req,res)=> {
  try {
    res.cookie('jwt', "", { maxAge: 0 });
    res.status(200).json({
      message: "Logout successfull",
      success: true
    })
  } catch(error) {
    res.status(500).json({
      message: 'Internal server error',
      success: false,
      error: error,
    });
  }
}

export const deleteUser = async (req,res) => {
  const { email, password } = req.body;
  const userId = req.user._id;

  try {
    const { success, error } = loginSchema.safeParse({
      email: email,
      password: password,
    });

    if (!success) {
      return res.status(401).json({
        message: "Invalid input data",
        success: false,
        error: error,
      });
    }

    const user = await UserDb.findById(userId);
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    if (user.email !== email) {
      return res.status(400).json({
        message: "Email is incorrect",
        success: false,
      });
    }

    const checkPass = await comparePassword(password, user.password);
    if (!checkPass) {
      return res.status(400).json({
        message: "Password is incorrect",
        success: false,
      });
    }

    const projects = await ProjectDb.find({ createBy: req.user._id });
    if(projects.length > 0) {
      await TaskDb.deleteMany({ projectId: { $in: projects.map((project) => project._id) } });
    }
    await ProjectDb.deleteMany({ createBy: userId });
    await UserDb.findByIdAndDelete(userId);

    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({
      message: "User deleted successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error,
    });
  }
};