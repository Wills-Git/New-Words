import React, {useState,useEffect} from 'react'
import { Card } from '../Card/Card'
import './Layout.css'
export function Layout (props){
    const {layoutID, LayoutTitle, layouts, setLayouts} = props
    const [currentImgUrls,setCurrentImageUrls] = useState ([])
    const [cardIDs,setCardIDs] = useState([0])
    const Cards = cardIDs.map((cardID)=> (<Card 
        ID={cardID} 
        currentImgUrls={currentImgUrls} 
        setCurrentImageUrls={setCurrentImageUrls} 
        cardIDs={cardIDs} 
        setCardIDs={setCardIDs}
        // layoutID = {layoutID}
        // layouts = {layouts}
        // setLayouts= {setLayouts}
        />)) 
    
    function AddCard () {
        if(cardIDs.length <12) {
        return(
        <button className ='add-card' onClick={() => {
            setCardIDs([...cardIDs,cardIDs.length])
            const newLayouts = [...layouts]
            const layoutToUpdateIdx = newLayouts.findIndex(layout => layout.id === layoutID)
            newLayouts[layoutToUpdateIdx].cardIDs = cardIDs
            setLayouts(newLayouts)
            console.log("cardIDs",cardIDs)
            console.log("layouts",layouts)
        }}> + </button>
        )
    }
    }

    
    return(
        <div className='outer-layout'>
            <LayoutTitle />
        <div className='layout'>
            
            {Cards}
            <AddCard />
        </div>
        </div>
    )
}