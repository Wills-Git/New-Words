import React, {useState,useEffect, useRef} from 'react'
import reactDom from 'react-dom'
import './Card.css'


export function Card(props) {
    const 
    {ID,
    caption,
    ImgUrl,
    currentImgUrls,
    setCurrentImageUrls,
    cardIDs, setCardIDs,
    currentCaptions,
    setCurrentCaptions,
    handleDelete} = props
    const [showDialog,setShowDialog] = useState(false)

    

    const inputRef = useRef(null)
    const addImageRef = useRef(null)
    const parentRef = useRef(null)

    

    const handleAddText = (event) => {
        if (event.key === 'Enter') {
          const newCaption = inputRef.current.value;
          const newCaptions = [...currentCaptions]
          newCaptions[ID] = newCaption;
          setCurrentCaptions(newCaptions)
        }
      };
    const NewImage = ({onClick}) => {
        
        return <img 
        src={ImgUrl ?? currentImgUrls[ID]} 
        onClick={onClick}
        onError={e => {
            e.target.src = 'https://media.tenor.com/xNHSjjcrl50AAAAM/scooby-doo.gif';
            e.onerror=null}} />
    }
    const handleAddImage = (event) => {
        if (event.key === 'Enter') {
            const newUrl = addImageRef.current.value
            const newImgUrls = [...currentImgUrls]
            newImgUrls[ID] = newUrl;
            setCurrentImageUrls(newImgUrls)
          }
        }

      const handleButtonClick = () => {
        setShowDialog(true);
      };
    
      const handleDialogClose = () => {
        setShowDialog(false);
      };

    function AddImageButton({onClick}) {
        return <button className= "addImageButton" onClick={onClick}>Add Image</button>;
    }
    function AddImageDialog({onClose}) {
        return (
            <dialog open onClose={onClose}>
                <input type="url" ref={addImageRef} 
                placeholder='image address 🥺' 
                onKeyDown={handleAddImage} 
            />
            </dialog>
        )
    }
    function DeleteCardButton({onClick}){
        return <button className="delete" onClick={onClick}>X</button>
    }

    function CaptionInput(){
      const text = caption ?? undefined
      
      return (
        <input type="text" id="card_input" ref={inputRef} placeholder='New Word' defaultValue={text} onKeyDown={handleAddText}/>
      )
    }
  
    return (
        <div ref={parentRef} className='card'>
        <DeleteCardButton onClick={() => (handleDelete(ID))}/>
        <form onSubmit={e => { e.preventDefault(); }}>
        <div className='addImage'>
            {showDialog ? (
            !currentImgUrls[ID] && !ImgUrl ? <AddImageDialog onClose={handleDialogClose}/> : <NewImage />
                  ) : (
            ImgUrl ? <NewImage/> : <AddImageButton onClick={handleButtonClick}/>
                  )}
      <CaptionInput />
     
        </div>
    </form>
        
        </div>
    )
}

