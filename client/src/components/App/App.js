import React, {useState,useEffect, useRef} from 'react'
import { Layout } from '../Layout/Layout'
import './App.css'


function App(){
    const [layouts,setLayouts] = useState([{id: 0, title:'', currentImgUrls:[], cardIDs:[]}])
    const [showCreateDialog,setShowCreateDialog] = useState(false)
    const [showLoginDialog,setShowLoginDialog] = useState(false)
    const createRefUsername = useRef(null)
    const createRefPassword = useRef(null)

    const handleCreateDialogOpen = () => {
        setShowCreateDialog(true);
      };
    
      const handleCreateDialogClose = () => {
        setShowCreateDialog(false);
      };


    function NewLayout (){
        setLayouts([...layouts,{id: Object.keys(layouts).length, title:'', currentImgUrls:[], cardIDs:[] }])
    }

    function PrintButton(){
        const handlePrint = () => {
            window.print();
          };
return (
    <button className='print-button' onClick = {handlePrint}>⚡️Print⚡️</button>
)
    }

    function LayoutTitle() {
        return (
            <input className='layout-title' placeholder='layout title' />
        )
    }

    
    const handleCreateUser = async () => {
            try {
            //make enclosing function async
            const postURL = '/auth/create'
            const fetchResponse = await fetch(postURL, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type' : 'application/json'
                },
            body: JSON.stringify({username: createRefUsername.current.value, password: createRefPassword.current.value, layouts:[]})
            },
            )
            const data = await fetchResponse.json()
            console.log(data)
            } catch(error) {
            //handle error
            console.log(error)
            }

            handleCreateDialogClose()
        }
    
        function CreateUserDialog({onClick}) {
            return (
            <dialog open onClose={handleCreateDialogClose}>
                    <input type="text" ref={createRefUsername} 
                    placeholder='username 😎' />
                    <input type="text" ref={createRefPassword} 
                    placeholder='password 😤' 
                />
                <button onClick={handleCreateUser}>create account</button>
                </dialog>
            )
        }
    
    function CreateUser({onClick}){
        return (
            <button className ='create-user' onClick={onClick}> Create Account</button>
        )
    }
    
    // two buttons on modal to either sign in or sign up
        //click button that activates get request to sign in 
            //goes to auth route, creates document in mongo db
    //login goes to auth route
        //on login, pass data from json into appropriate props - will need layout identifiers
    const pages = layouts.map(layout => <Layout layoutID={layout.id} layouts={layouts} setLayouts={setLayouts} LayoutTitle ={LayoutTitle} />)
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
            <div className='account'>
                {showCreateDialog ? (
                <CreateUserDialog onClose={handleCreateDialogClose}/>
                ) : (
                <CreateUser onClick ={handleCreateDialogOpen}/>)}
                
                {/*login user */}
            </div>
            </div>
            {pages}
            <button className ="addPage" onClick={NewLayout}>+</button>
        </div>
    )
                }

export default App