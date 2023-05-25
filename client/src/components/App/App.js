import React, {useState,useEffect, useRef} from 'react'
import { Layout } from '../Layout/Layout'
import './App.css'


function App(){
    const [layouts,setLayouts] = useState([{id: 0, title:'', currentImgUrls:[], cardIDs:[], currentCaptions: []}])
    const [showCreateDialog,setShowCreateDialog] = useState(false)
    const [showLoginDialog,setShowLoginDialog] = useState(false)
    const createRefUsername = useRef(null)
    const createRefPassword = useRef(null)
    const loginRefUsername = useRef(null)
    const loginRefPassword = useRef(null)

    // useEffect(() => {
    //     console.log(layouts)
    // }, [layouts])

    const handleCreateDialogOpen = () => {
        setShowCreateDialog(true);
      };
    
      const handleCreateDialogClose = () => {
        setShowCreateDialog(false);
      };
      const handleLoginDialogOpen = () => {
        setShowLoginDialog(true);
      };
    
      const handleLoginDialogClose = () => {
        setShowLoginDialog(false);
      };


    function NewLayout (){
        console.log(layouts)
        setLayouts([...layouts,{id: layouts.length, title:'', currentImgUrls:[], cardIDs:[], currentCaptions:[] }])
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

    // const handleUpdates = async () => 
    
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
            body: JSON.stringify({username: createRefUsername.current.value, password: createRefPassword.current.value, layouts: layouts})
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
        const handleLoginUser = async () => {
            try {
            //make enclosing function async
            const postURL = '/auth/login'
            const fetchResponse = await fetch(postURL, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type' : 'application/json'
                },
            body: JSON.stringify({username: loginRefUsername.current.value, password: loginRefPassword.current.value})
            },
            )
            const data = await fetchResponse.json()
            //figure out how to populate state from this response
            console.log(data)
            setLayouts(data)
            } catch(error) {
            //handle error
            console.log(error)
            }

            handleLoginDialogClose()
        }
    
        function CreateUserDialog() {
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

        function LoginUserDialog() {
            return (
            <dialog open onClose={handleLoginDialogClose}>
                    <input type="text" ref={loginRefUsername} 
                    placeholder='username 🔫' />
                    <input type="text" ref={loginRefPassword} 
                    placeholder='password 😻' 
                />
                <button onClick={handleLoginUser}>Login</button>
                </dialog>
            )
        }
    
    function CreateUser({onClick}){
        return (
            <button className ='create-user' onClick={onClick}> Create Account</button>
        )
    }
    function LoginUser({onClick}){
        return (
            <button className ='login-user' onClick={onClick}> Login</button>
        )
    }
    
    
    // two buttons on modal to either sign in or sign up
        //click button that activates get request to sign in 
            //goes to auth route, creates document in mongo db
    //login goes to auth route
        //on login, pass data from json into appropriate props - will need layout identifiers
    const pages = layouts.map(layout => <Layout 
        layoutID={layout.id} 
        layouts={layouts} 
        setLayouts={setLayouts} 
        LayoutTitle ={LayoutTitle} />)
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
                <li>hit enter ⮐</li>
                <li>add another card by clicking on the ➕ </li>
                <li>add new pages with the button below the layout 👏 </li>
                <li>you can title your layouts to help you stay organized 🤓</li>
                <li>repeat as needed, then just print this webpage! 👍</li>
                <li>create an account to save your cards (hopefully this works 🙏) </li>
            </ol>
            <PrintButton/>
            <div className='account'>
                {showCreateDialog ? (
                <CreateUserDialog onClose={handleCreateDialogClose}/>
                ) : (
                <CreateUser onClick ={handleCreateDialogOpen}/>)}
                
                {showLoginDialog ? (
                <LoginUserDialog onClose={handleLoginDialogClose}/>
                ) : (
                <LoginUser onClick ={handleLoginDialogOpen}/>)}
            </div>
            </div>
            {pages}
            <button className ="addPage" onClick={NewLayout}>+</button>
        </div>
    )
                }

export default App