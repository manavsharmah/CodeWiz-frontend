import React from 'react'
import Navbar from '../components/Navbar'
import CodeEditor from '../components/CodeEditor'

const questions = () => {

 

  return (
    <div>
      <Navbar/>
      <div className='bg-black h-screen w-screen'>
        <div className="w-full container mx-auto p-4">
          <h1 className="text-3xl font-bold mb-4">Code Editor</h1>
          <CodeEditor />
        </div>    
      </div>
    </div>
  )
}

export default questions
