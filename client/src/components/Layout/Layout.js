import React, {useState,useEffect} from 'react'
import { Card } from '../Card/Card'
import './Layout.css'
export function Layout (props){
    const {layoutID, LayoutTitle, layouts, setLayouts} = props
    const thisLayoutIdx = layouts.findIndex(layout => layout.id === layoutID)

    
    const [currentImgUrls,setCurrentImageUrls] = useState ([])
    const [currentCaptions, setCurrentCaptions] = useState([])
    const [cardIDs,setCardIDs] = useState([0])

    function handleDelete(ID) {
        setLayouts(prevLayouts => {
            
          const updatedLayouts = [...prevLayouts];
          const layout = updatedLayouts[thisLayoutIdx];
          layout.cardIDs = layout.cardIDs.filter((_, i) => i !== ID).map(num => num > ID ? num - 1 : num);
          layout.currentCaptions = layout.currentCaptions.filter((_, i) => i !== ID).map(num => num > ID ? num - 1 : num);
          layout.currentImgUrls = layout.currentImgUrls.filter((_, i) => i !== ID).map(num => num > ID ? num - 1 : num);
          return updatedLayouts;
        });
      }

      useEffect(() => {
        const layout = layouts[thisLayoutIdx];
        console.log('cardIDs length', cardIDs.length)
        console.log('layout cards length',layout.cardIDs.length)
        if (layout.cardIDs.length > cardIDs.length) {
          setCardIDs([...layout.cardIDs]);
        }
      }, [layouts, cardIDs]);

    useEffect(() => {
        if(layouts[thisLayoutIdx].currentCaptions.length > currentCaptions.length){
        setCurrentCaptions([...layouts[thisLayoutIdx].currentCaptions])
        }
    },[layouts,currentCaptions])

    useEffect(() => {
        if(layouts[thisLayoutIdx].currentImgUrls.length > currentImgUrls.length){
        setCurrentImageUrls([...layouts[thisLayoutIdx].currentImgUrls])
        }
    },[layouts,currentImgUrls])



    useEffect(() => {
        const newLayouts = [...layouts]
            const layoutToUpdateIdx = newLayouts.findIndex(layout => layout.id === layoutID)
            newLayouts[layoutToUpdateIdx].cardIDs = cardIDs
            setLayouts(newLayouts)
            
    },[cardIDs])

    useEffect(() => {
        const newLayouts = [...layouts]
            const layoutToUpdateIdx = newLayouts.findIndex(layout => layout.id === layoutID)
            newLayouts[layoutToUpdateIdx].currentImgUrls = currentImgUrls
            setLayouts(newLayouts)
    },[currentImgUrls])

    useEffect(() => {
        const newLayouts = [...layouts]
            const layoutToUpdateIdx = newLayouts.findIndex(layout => layout.id === layoutID)
            newLayouts[layoutToUpdateIdx].currentCaptions = currentCaptions
            setLayouts(newLayouts)
            
    },[currentCaptions])

    

    const Cards = layouts[thisLayoutIdx].cardIDs.map((cardID)=> (<Card 
        ID={cardID} 
        caption = {layouts[thisLayoutIdx].currentCaptions[cardID]}
        ImgUrl ={layouts[thisLayoutIdx].currentImgUrls[cardID]}
        currentImgUrls={currentImgUrls} 
        setCurrentImageUrls={setCurrentImageUrls} 
        cardIDs={cardIDs} 
        currentCaptions = {currentCaptions}
        setCurrentCaptions= {setCurrentCaptions}
        handleDelete = {handleDelete}
        />)) 
    
    function AddCard () {
        const newLayouts = [...layouts];
        const layout = newLayouts[thisLayoutIdx];
        if(cardIDs.length <12) {
        return(
        <button className ='add-card' onClick={() => {
        const newCardIDs = [...layout.cardIDs, layout.cardIDs.length];
        layout.cardIDs = newCardIDs;
        setLayouts(newLayouts);
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