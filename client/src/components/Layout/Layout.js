import React, {useState,useEffect} from 'react'
import { Card } from '../Card/Card'
import './Layout.css'
export function Layout (){
    const [currentImgUrls,setCurrentImageUrls] = useState ([])
    const [cardIDs,setCardIDs] = useState([0])
    const Cards = cardIDs.map((cardID)=> (<Card ID={cardID} currentImgUrls={currentImgUrls} setCurrentImageUrls={setCurrentImageUrls} cardIDs={cardIDs} setCardIDs={setCardIDs}/>)) 
    
    function AddCard () {
        if(cardIDs.length <12) {
        return(
        <button className ='add-card' onClick={() => {
            setCardIDs([...cardIDs,cardIDs.length])
        }}> + </button>
        )
    }
    }

    function LayoutTitle() {
        return (
            <input className='layout-title' placeholder='layout title' />
        )
    }
    return(
        <div className='outer-layout'>
            <LayoutTitle />
        <div className='layout'>
            {Cards}
            {AddCard()}
        </div>
        </div>
    )
}