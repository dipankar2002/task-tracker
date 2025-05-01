import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import UserSec from '../components/UserSec';
import CreateProjectForm from '../components/CreateProjectForm';
import { useAuthStore } from '../store/authStore';
import { create } from 'zustand';
import TaskShow from '../components/TaskShow';

const socket = io('http://localhost:3000');

export default function Dashboard() {
  const { selectedProject, createProject, projectList, setSelectedProject, deleteProject, createTask  } = useAuthStore();

  const [ projectForm, setProjectForm ] = useState({
    title: '',
  });
  const [ taskForm, setTaskForm ] = useState({
    title: '',
    description: ''
  });

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (projectForm.title) {
      socket.emit('createProject', projectForm.title);
      createProject(projectForm);
      setProjectForm({ title: '' });
    }
  }

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (taskForm.title && taskForm.description) {
      socket.emit('createTask', taskForm);
      createTask(taskForm, selectedProject._id);
      setTaskForm({ title: '', description: '' })
    }
  }

  return (
    <div className="px-8 md:px-[4.5rem] lg:px-[16rem] py-8">
      <UserSec>
        <CreateProjectForm>
          <form 
            onSubmit={handleCreateProject} 
            className='flex items-center justify-center space-x-2'
          >
            <input
              value={projectForm.title}
              onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
              placeholder="New Project Title"
              className="border px-4 py-2 rounded mr-2"
            />
            <button type="submit" className='bg-blue-500 text-white px-4 py-2 rounded'>Create Project</button>
          </form>
        </CreateProjectForm>
      </UserSec>

      <div className='grid grid-cols-1 md:grid-cols-2'>
        {/* Show Projects */}
        <LeftPart>
          <div className='flex flex-col space-y-6 pb-10'>
            <span className='text-2xl font-bold'>My Projects</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 w-[90%] gap-1">
              {projectList.map((project) => (
                <div
                  key={project._id}
                  className="bg-gray-200 px-4 py-2 rounded-md justify-self-start"
                  onClick={() => {
                    setSelectedProject(project);
                    console.log(selectedProject);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <div className="text-lg font-semibold">{project.title}</div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-sm text-gray-500">{project.createdAt.slice(0, 10)}</div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // prevent triggering parent click
                        window.confirm("Are you sure you want to delete this project?") &&
                          deleteProject(project._id);
                      }}
                    >
                      ❌
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Task Form */}
          {selectedProject && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Add New Task for - <span className='text-3xl text-blue-500'>{selectedProject.title}</span></h2>
              <form onSubmit={handleCreateTask} className="flex space-x-4 mb-6">
                <input
                  name="title"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  placeholder="Title"
                  className="rounded border p-2"
                  required
                />
                <input
                  name="description"
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  placeholder="Description"
                  className="rounded border p-2"
                  required
                />
                <button 
                  type="submit" 
                  className="bg-blue-500 text-white rounded px-4 py-2"
                >
                  Create Task
                </button>
              </form>
            </div>
          )}
        </LeftPart>

        <RightPart>
          {/* Task List */}
          <TaskShow />
        </RightPart>
      </div>
    </div>
  );
}

function LeftPart({ children }) {
  return (
    <div>
      {children}
    </div>
  )
}

function RightPart({ children }) {
  return (
    <div>
      {children}
    </div>
  )
}