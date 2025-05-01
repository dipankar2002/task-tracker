import React, { useState } from 'react'
import { useAuthStore } from '../store/authStore'

const TaskShow = () => {
  const { taskList, selectedProject, setSelectedProject } = useAuthStore();

  return (
    <div>
      <div className=' flex justify-between items-center px-4'>
        {selectedProject === null ? (
          <span className='text-2xl font-bold'>Select a project to see the tasks</span>
        ):null}
        {taskList.length === 0 && selectedProject && (
          <span className='text-2xl font-bold mx-auto'>No Task available</span>
        )}
        {selectedProject && taskList.length > 0 && (
          <span className='text-2xl font-bold'>All Tasks</span>
        )}
        {selectedProject && taskList.length > 0 && (
          <button 
            className='text-2xl text-red-500 font-bold'
            onClick={() => {setSelectedProject(null)}}
          >x</button>
        )}
      </div>
      { selectedProject && (
        <div className='flex flex-col space-y-4 pt-4'>
          { taskList.map((task,i) => <TaskList key={i} task={task}/>)}
        </div>
      )}
    </div>
  )
}

function TaskList({ task }) {
  const { completeTask, unCompleteTask, updateTask } = useAuthStore();
  const [ openEditForm, setOpenEditForm ] = useState(false);
  const [ editTask, setEditTask ] = useState({
    title: '',
    description: ''
  });

  const updateHandle = (e) => {
    e.preventDefault();
    if (editTask.title && editTask.description) {
      // socket.emit('updateTask', taskForm);
      updateTask(editTask, task._id);
      setEditTask({ title: '', description: ''})
    }
  }

  return (
    <div className=' flex flex-col space-y-1 px-6 py-4 rounded-lg border-2'>
      <div className='text-xl font-bold'>{task.title}</div>
      <div className='text-lg'>{task.description}</div>
      <div>
        <span className='font-semibold'>Status : </span> 
        {task.status}
      </div>
      <div>
        <span className='font-semibold'>CreatedAt - </span> 
        {task.createdAt.slice(0,10)}
      </div>
      {task.completedAt && <div>
        <span className='font-semibold'>CompletedAt - </span> 
        {task.completedAt === null ? <span className='text-red-500 font-semibold'>Not Completed</span> : task.completedAt.slice(0,10)}
      </div>}
      <div className='flex justify-between pr-2 py-2'>
        {!task.completedAt && <button 
          className='bg-green-300 px-2 py-0.5 rounded'
          onClick={() => {completeTask(task._id)}}
        >Done</button>}
        {task.completedAt && <button 
          className='bg-gray-300 px-2 py-0.5 rounded'
          onClick={() => {unCompleteTask(task._id)}}
        >Not Done</button>}
        <div className='flex space-x-2'>
          <button 
            className='bg-yellow-300 px-2 py-0.5 rounded'
            onClick={() => {setOpenEditForm((prev) => !prev)}}
          >{openEditForm ? 'Close' : 'Edit'}</button>
          <button className='bg-red-400 text-white px-2 py-0.5 rounded'>Delete</button>
        </div>
      </div>
      {openEditForm && (
        <form 
          onSubmit={updateHandle}
          className='grid grid-cols-1 items-center space-x-2 space-y-2' 
        >
          <input
              name="title"
              value={editTask.title}
              onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
              placeholder={task.title}
              className="border rounded px-2 py-1"
            />
            <input
              name="description"
              value={editTask.description}
              onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
              placeholder={task.description}
              className="border rounded px-2 py-1"
            />
            <button
              type="submit" 
              className="bg-blue-600 text-white px-2 py-1 rounded"
            >
              Update
            </button>
        </form>
      )}
    </div>
  )
}

export default TaskShow
