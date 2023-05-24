import React, {useState,useEffect} from 'react'
import { Card } from '../Card/Card'
import './Layout.css'
export function Layout (){

    return(
        <div className='layout'>
        <Card />
        <Card />
        <Card />
        </div>
    )
}