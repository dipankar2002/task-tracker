import React, { Children } from 'react'
import { useAuthStore } from '../store/authStore'

const CreateProjectForm = ({children}) => {
  const { projectList } = useAuthStore();

  return (
    <div className='flex items-center justify-end space-x-6 w-full h-full'>
      {projectList.length === 0 ?
        <div className='text-center text-2xl font-bold mb-4'>No projects found!! Create One</div> : 
        <div>
          { projectList.length < 4 ?
            <div className='text-center text-2xl font-bold mb-4'>You can create more projects</div> : 
            <div className='text-center text-2xl font-bold mb-4'>You have reached the maximum number of projects</div> }
        </div> 
      }
      {projectList.length < 4 &&
        <div>{children}</div>
      }
    </div>
  )
}

export default CreateProjectForm
