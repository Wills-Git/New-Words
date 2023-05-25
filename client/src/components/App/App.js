import React, {useState,useEffect} from 'react'
import { Layout } from '../Layout/Layout'
import './App.css'


function App(){
    const [layouts,setLayouts] = useState([0])
    
    
    function NewLayout (){
        setLayouts([...layouts, layouts.length])
    }
    
    const pages = layouts.map(layout => <Layout/>)
    return(
        <div className='app'>
            <h1>New Words v1</h1>
            {pages}
            <button className ="addPage" onClick={NewLayout}>+</button>
        </div>
    )
}

export default App