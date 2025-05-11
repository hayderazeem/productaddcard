import { useState } from 'react'

import './App.css'
import Getproducts from './Products/products'

function App() {

  return (
    <>
      <div>
        <div className='bg-gray-500 w-full h-10 flex items-center px-4 text-white rounded-sm'>
        <h1>NavBar</h1>
        </div>
        <div className=' flex items-center px-4 py-4'>
          <h3> Filter options</h3>
        </div>


<Getproducts/>





       </div>
    </>
  )
}

export default App