import React, {useState,useEffect, useRef} from 'react'
import reactDom from 'react-dom'
import './Card.css'


export function Card(props) {
    const {ID, currentImgUrls, setCurrentImageUrls, cardIDs, setCardIDs} = props
    const [showDialog,setShowDialog] = useState(false)

    const inputRef = useRef(null)
    const addImageRef = useRef(null)
    const parentRef = useRef(null)

    const handleAddText = (event) => {
        if (event.key === 'Enter') {
          console.log(inputRef.current.value);
        }
      };
    const NewImage = ({onClick}) => {
        
        return <img src={currentImgUrls[ID]} onClick={onClick} />
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
                <input type="url" ref={addImageRef} placeholder='🥺image address🥺' onKeyDown={handleAddImage}/>
            </dialog>
        )
    }
    function DeleteCardButton({onClick}){
        return <button className="delete" onClick={onClick}>X</button>
    }
    function handleDelete(){   
        setCardIDs([...cardIDs].filter((_,i) => i !== ID).map(num => num > ID ? num - 1 : num))
    }
    return (
        <div ref={parentRef} className='card'>
        <DeleteCardButton onClick={handleDelete}/>
        <form onSubmit={e => { e.preventDefault(); }}>
        <div className='addImage'>
            {showDialog ? (
            !currentImgUrls[ID] ? <AddImageDialog onClose={handleDialogClose}/> : <NewImage />
                  ) : (
            <AddImageButton onClick={handleButtonClick}/>
                  )}
     <input type="text" id="card_input" ref={inputRef} placeholder='New Word' onKeyDown={handleAddText}/>
        </div>
    </form>
        
        </div>
    )
}

