import React, {useState,useEffect} from 'react'



function App(){
    const [users,setUsers] = useState([])

    useEffect( () => {
        async function fetchData() {
        const request = await fetch('/api/auth');
        const data = await request.json()
        setUsers(data)
        }
        fetchData()
    })

    return(
        <div>
            <h1>New Words v1</h1>
            <ul>{
            users.map(user => (
                <li>{`Name: ${user.username}`}/br
                {`age: ${user.age}`}</li>     
            )
            )}</ul>
        </div>
    )
}

export default App