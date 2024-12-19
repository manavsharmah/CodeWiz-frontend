import React from 'react'
import Navbar from '../components/Navbar'
import QuestionTable from '../components/QuestionTable/QuestionTable'

const questions = () => {

 

  return (
    <div>
      <Navbar/>
      <div className='pt-16 bg-black h-auto w-screen'>
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 p-4 sm:p-8 lg:p-24">
          <QuestionTable />
        </div>    
      </div>
    </div>
  )
}

export default questions




