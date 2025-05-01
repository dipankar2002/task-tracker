import { create } from 'zustand';
import { axiosInstance } from '../api/axios';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIng: false,
  isCheckingAuth: true,
  userList: [],
  projectList: [],
  taskList: [],
  
  selectedProject: null,

  // Tasks functions
  searchTasks: async (projectId) => {
    try {
      const res = await axiosInstance.get(`/tasks/allTasks/${projectId}`);
      if (res.data.success) {
        set({ taskList: res.data.tasks });
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error('An error occurred while searching for tasks. Please try again.');
    }
  },
  createTask: async (data, projectId) => {
    try {
      const res = await axiosInstance.post(`/tasks/create/${projectId}`, data, {
        headers: { 
          'Content-Type': 'application/json',
        },
      });
      if (res.data.success) {
        set((state) => ({ taskList: [...state.taskList, res.data.task] }));
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error('An error occurred while creating the task. Please try again.');
    }
  },
  completeTask: async (taskId) => {
    try {
      const res = await axiosInstance.put(`/tasks/complete/${taskId}`);
      if (res.data.success) {
        set((state) => ({
          taskList: state.taskList.map((task) =>
            task._id === res.data.task._id ? res.data.task : task
          )
        }));
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error('An error occurred while updating the task. Please try again.');
    }
  },
  unCompleteTask: async (taskId) => {
    try {
      const res = await axiosInstance.put(`/tasks/uncomplete/${taskId}`);
      if (res.data.success) {
        set((state) => ({
          taskList: state.taskList.map((task) =>
            task._id === res.data.task._id ? res.data.task : task
          )
        }));
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error('An error occurred while updating the task. Please try again.');
    }
  },
  updateTask: async (data, taskId) => {
    try {
      const res = await axiosInstance.put(`/tasks/update/${taskId}`, data, {
        headers: { 
          'Content-Type': 'application/json',
        },
      })
      if (res.data.success) {
        set((state) => ({
          taskList: state.taskList.map((task) =>
            task._id === res.data.task._id ? res.data.task : task
          )
        }));
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error('An error occurred while updating the task. Please try again.');
    }
  },

  // projects functions
  searchProjects: async () => {
    try {
      const res = await axiosInstance.get(`/projects/allProjects`);
      if (res.data.success) {
        set({ projectList: res.data.projects });
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error('An error occurred while searching for projects. Please try again.');
    }
  },
  setSelectedProject: (project) => set({ selectedProject: project }),
  createProject: async (data) => {
    try {
      const res = await axiosInstance.post('/projects/create', data, {
        headers: { 
          'Content-Type': 'application/json',
        },
      });
      if (res.data.success) {
        set({ selectedProject: res.data.project });
        set((state) => ({ projectList: [...state.projectList, res.data.project] }));
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error('An error occurred while creating the project. Please try again.');
    }
  },
  deleteProject: async (projectId) => {
    try {
      const res = await axiosInstance.delete(`/projects/delete/${projectId}`);
      if (res.data.success) {
        set((state) => ({
          projectList: state.projectList.filter((project) => project._id !== projectId),
          selectedProject: null,
        }));
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error('An error occurred while deleting the project. Please try again.');
    }
  },
  
  // auth user functions
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      if(res.data.success) {
        set({authUser: res.data.user});
      }
    } catch(err) {
      set({authUser: null});
      console.log(err);
    } finally {
      set({isCheckingAuth: false});
    }
  },
  searchUser: async (query) => {
    try {
      const res = await axiosInstance.get(`/auth/allUsers?filter=${query}`);
      if (res.data.success) {
        set({ userList: res.data.users });
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error('An error occurred while searching for users. Please try again.');
    }
  },

  // user login, signup, and logout functions
  login: async (data) => {
    set({ isLoggingIng: true });
    try {
      const res = await axiosInstance.post('/auth/login', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.data.success) {
        set({ authUser: res.data.user });
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error('An error occurred while logging in. Please try again.');
    } finally {
      set({ isLoggingIng: false });
    }
  },
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post('/auth/signup', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.data.success) {
        set({ authUser: res.data.user });
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error('An error occurred while signing up. Please try again.');
    } finally {
      set({ isSigningUp: false });
    }
  },
  logout: async () => {
    try {
      const res = await axiosInstance.post('/auth/logout');
      set({authUser: null});
      toast.success(res.data.message);
    } catch(err) {
      toast.error(err.response.data.message);
      console.log(err);
    }
  }
}));
