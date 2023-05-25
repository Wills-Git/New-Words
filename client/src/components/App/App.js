import React, {useState,useEffect} from 'react'
import { Layout } from '../Layout/Layout'
import './App.css'


function App(){
    const [layouts,setLayouts] = useState([0])
    
    function NewLayout (){
        setLayouts([...layouts, layouts.length])
    }

    function PrintButton(){
        const handlePrint = () => {
            window.print();
          };
return (
    <button className='print-button' onClick = {handlePrint}>⚡️Print⚡️</button>
)
    }
    
    const pages = layouts.map(layout => <Layout/>)
    return(
        <div className='app'>
            <div className='hero'>
            <h1>New Words v1</h1>
            <h2>quickly make PECS images - get back to what's important</h2>
            <ol>
                <li>click add image 👨‍🎨</li>
                <li>paste in the address to your image 📋</li>
                <li>hit enter ⮐</li>
                <li>click on "New Word" to add your caption ✍️ </li>
                <li>add another card by clicking on the ➕ </li>
                <li>add new pages with the button below the layout 👏 </li>
                <li>you can title your layouts to help you stay organized 🤓</li>
                <li>repeat as needed, then just print this webpage! 👍</li>
                
            </ol>
            <PrintButton/>
            </div>
            {pages}
            <button className ="addPage" onClick={NewLayout}>+</button>
        </div>
    )
}

export default App