import React, {useState,useEffect} from 'react'
import { Layout } from '../Layout/Layout'
import './App.css'


function App(){
    const [photo,setPhoto] = useState([])

    useEffect( () => {
    })
    
    
    

    return(
        <div className='app'>
            <h1>New Words v1</h1>
            <Layout />
        </div>
    )
}

export default App