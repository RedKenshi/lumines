import React, { useState, useEffect } from 'react';
import Block from '../atoms/Block';

const Grid = props => {

    const generateBackgrid = () => {
        let grid = [];
        for (let y = 1; y <= 2; y++) {
            for (let x = 1; x <= 24; x++) {
                grid.push({y:y,x:x,t:"o"})
            }
        }
        for (let y = 3; y <= 18; y++) {
            for (let x = 1; x <= 24; x++) {
                grid.push({y:y,x:x,t:"i"})
            }
        }
        setBackgrid(grid);
    }
    const [backgrid,setBackgrid] = useState([])
    const [subgrid,setSubgrid] = useState([])

    useEffect(()=>{
        generateBackgrid()
    },[])
    useEffect(()=>{
        setSubgrid(props.subgrid)
    })

    return (
        <div className='grids'>
            <div className="sub-grid">
                {subgrid.map(s=><div key={"sub-x"+s.x+"y"+s.y} className={"sub s" + s.c + (s.charged ? " charged" : "")} style={{gridColumnStart:s.x,gridRowStart:s.y}}></div>)}
            </div>
            <div className="grid">
                {backgrid.map(s=><div key={"backsub-x"+s.x+"y"+s.y} className={"sub s" + s.t + (s.x == props.aim || s.x == props.aim + 1 ? " aim" : "")} style={{gridColumnStart:s.x,gridRowStart:s.y}}></div>)}
            </div>
        </div>
    )
}

export default Grid;