import ProjectDb from "../models/project.js";


export const deleteProject = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const project = await ProjectDb.findOneAndDelete({
      _id: id,
      createBy: userId,
    });
    if (!project) {
      return res.status(400).json({
        message: "Project not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Project deleted successfully",
      success: true,
      project: project,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error,
    });
  }
}
export const createProject = async (req, res) => {
  const { title } = req.body;
  const userId = req.user._id;

  try {
    const count = await ProjectDb.countDocuments({ createBy: userId });
    if (count >= 4) {
      return res.status(400).json({
        message: "Max 4 projects allowed!! You reached the limit",
        success: false,
      });
    }
    if (!title) {
      return res.status(400).json({
        message: "Title is required",
        success: false,
      });
    }
    const existingProject = await ProjectDb.findOne({
      title,
      createBy: userId,
    });
    if (existingProject) {
      return res.status(400).json({
        message: "Project with this title already exists",
        success: false,
      });
    }
    const created = await ProjectDb.create({ title, createBy: userId });
    
    if (!created) {
      return res.status(400).json({
        message: "Project not created",
        success: false,
      });
    }
    
    const project = await ProjectDb.findById(created._id).select("-__v -updatedAt");
    return res.status(201).json({
      message: "Project created successfully",
      success: true,
      project: project,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error,
    });
  }
};

export const getProjects = async (req, res) => {
  const filter = req.query.filter || "";

  try {
    if (filter) {
      const filterProjects = await ProjectDb.find({
        $or: [
          {
            title: { $regex: filter, $options: "i" },
          },
        ],
      }).select("-__v");

      return res.status(200).json({
        message: "Filter projects fetched successfully",
        success: true,
        user: filterProjects,
      });
    }

    const allProjects = await ProjectDb.find({ createBy: req.user._id }).select(
      "-__v"
    );
    if (!allProjects) {
      return res.status(400).json({
        message: "No projects found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Projects fetched successfully",
      success: true,
      projects: allProjects,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error,
    });
  }
};