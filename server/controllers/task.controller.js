import ProjectDb from "../models/project.js";
import TaskDb from "../models//task.js";


export const createTask = async (req, res) => {
  const { projectId } = req.params;
  const { title, description } = req.body;

  try {
    if (!projectId) {
      return res.status(400).json({
        message: 'Project ID is invalid',
        success: false,
      });
    }
    const project = await ProjectDb.findById(projectId);
    if(!project) {
      return res.status(404).json({
        message: 'Project not found',
        success: false,
      });
    }
    if (!title || !description) {
      return res.status(400).json({
        message: 'Title and description are required',
        success: false,
      });
    }
    const isTaskExist = await TaskDb.findOne({ title, projectId });
    if (isTaskExist) {
      return res.status(400).json({
        message: 'Task already exists',
        success: false,
      });
    }

    const newTast = new TaskDb({
      projectId, title, description,
    });
    if(!newTast) {
      return res.status(400).json({
        message: 'Task creation failed',
        success: false,
      });
    }
    const task = await newTast.save();
    if(!task) {
      return res.status(400).json({
        message: 'Task creation failed',
        success: false,
      });
    }

    const io = req.app.get('io');
    io.emit('task-changed', task); // Notify all clients

    res.status(201).json({
      message: 'Task created successfully',
      success: true,
      task: task,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
      success: false,
      error: error,
    });
  }
};
export const updateTask = async (req, res) => {
  const { taskId } = req.params;
  const { title, description } = req.body;
  try {
    if (!taskId) {
      return res.status(400).json({
        message: 'Task ID is invalid',
        success: false,
      });
    }
    const task = await TaskDb.findById(taskId);
    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
        success: false,
      });
    }
    if (!title || !description) {
      return res.status(400).json({
        message: 'Title and description are required',
        success: false,
      });
    }
    const updatedTask = await TaskDb.findByIdAndUpdate( taskId, {
      title,
      description,
    }, { new: true });

    if (!updatedTask) {
      return res.status(400).json({
        message: 'Task update failed',
        success: false,
      });
    }
    const io = req.app.get('io');
    io.emit('task-changed', updatedTask);

    res.status(200).json({
      message: 'Task updated successfully',
      success: true,
      task: updatedTask,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
      success: false,
      error: error,
    });
  }
};
export const completeTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    if (!taskId) {
      return res.status(400).json({
        message: 'Task ID is invalid',
        success: false,
      });
    }
    const task = await TaskDb.findById(taskId);
    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
        success: false,
      });
    }
    const updatedTask = await TaskDb.findByIdAndUpdate( taskId, {
      status: "Complete",
      completedAt: Date.now(),
    }, { new: true });

    if (!updatedTask) {
      return res.status(400).json({
        message: 'Task update failed',
        success: false,
      });
    }
    const io = req.app.get('io');
    io.emit('task-changed', updatedTask);

    res.status(200).json({
      message: 'Task updated successfully',
      success: true,
      task: updatedTask,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
      success: false,
      error: error,
    });
  }
}
export const unCompleteTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    if (!taskId) {
      return res.status(400).json({
        message: 'Task ID is invalid',
        success: false,
      });
    }
    const task = await TaskDb.findById(taskId);
    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
        success: false,
      });
    }
    const updatedTask = await TaskDb.findByIdAndUpdate( taskId, {
      status: "Pending",
      completedAt: null,
    }, { new: true });

    if (!updatedTask) {
      return res.status(400).json({
        message: 'Task update failed',
        success: false,
      });
    }
    const io = req.app.get('io');
    io.emit('task-changed', updatedTask);

    res.status(200).json({
      message: 'Task updated successfully',
      success: true,
      task: updatedTask,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
      success: false,
      error: error,
    });
  }
}
export const deleteTask = async (req, res) => {
  const { taskId } = req.params;
  try {
    if (!taskId) {
      return res.status(400).json({
        message: 'Task ID is invalid',
        success: false,
      });
    }
    const task = await TaskDb.findByIdAndDelete(taskId);
    if (!task) {
      return res.status(400).json({
        message: 'Task not found',
        success: false,
      });
    }
    const io = req.app.get('io');
    io.emit('task-removed', task._id);

    res.status(200).json({
      message: 'Task deleted successfully',
      success: true,
      task: task,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
      success: false,
      error: error,
    });
  }
};


export const getTasks = async (req, res) => {
  const { projectId } = req.params;

  try {
    if(!projectId) {
      return res.status(400).json({
        message: 'Project ID is invalid',
        success: false,
      });
    }
    const project = await ProjectDb.findById(projectId);
    if(!project) {
      return res.status(404).json({
        message: 'Project not found',
        success: false,
      });
    }

    const tasks = await TaskDb.find({ projectId: project._id }).select('-__v -projectId');
    if(!tasks) {
      return res.status(404).json({
        message: 'No tasks found',
        success: false,
      });
    }
    res.status(200).json({
      message: 'Tasks fetched successfully',
      success: true,
      tasks: tasks,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
      success: false,
      error: error,
    });
  }
};
