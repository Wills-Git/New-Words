import React, {useState,useEffect, useRef} from 'react'
import reactDom from 'react-dom'
import './Card.css'


export function Card() {
    const [showDialog,setShowDialog] = useState(false)
    const [currentImgUrl,setCurrentImageUrl] = useState ("")
    const inputRef = useRef(null)
    const addImageRef = useRef(null)
    const parentRef = useRef(null)

    const handleAddText = (event) => {
        if (event.key === 'Enter') {
          console.log(inputRef.current.value);
        }
      };
    const NewImage = ({onClick}) => {
        
        return <img src={currentImgUrl} onClick={onClick} />
    }
    const handleAddImage = (event) => {
        if (event.key === 'Enter') {
            console.log(addImageRef.current.value);
            const newUrl = addImageRef.current.value
            
            setCurrentImageUrl(newUrl)
          }
        }
      const handleButtonClick = () => {
        setShowDialog(true);
      };
    
      const handleDialogClose = () => {
        setShowDialog(false);
      };

    function AddImageButton({onClick}) {
        return <button onClick={onClick}>Add Image</button>;
    }
    function AddImageDialog({onClose}) {
        return (
            <dialog open onClose={onClose}>
                <input type="url" ref={addImageRef} placeholder='🥺image address plz🥺' onKeyDown={handleAddImage}/>
            </dialog>
        )
    }
    return (
        <div ref={parentRef} className='card'>

        <form onSubmit={e => { e.preventDefault(); }}>
        <div className='addImage'>
            {showDialog ? (
            !currentImgUrl ? <AddImageDialog onClose={handleDialogClose}/> : <NewImage />
                  ) : (
            <AddImageButton onClick={handleButtonClick}/>
                  )}
     <input type="text" id="card_input_vis" ref={inputRef} placeholder='New Word' onKeyDown={handleAddText}/>
        </div>
    </form>
        
        </div>
    )
}

