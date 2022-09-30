import React, { useState, useEffect } from 'react';

const Block = props => {

    const configs = [
        {id:0,config:"0000"},
        {id:1,config:"0001"},
        {id:2,config:"0101"},
        {id:3,config:"0011"}
    ]

    const [config, setConfig] = useState(
        Math.floor(Math.random() * 3)
    )
    const [orientation, setOrientation] = useState(
        Math.floor(Math.random() * 3)
    )
    const [inverse, setInverse] = useState(
        Math.random() > 0.5
    )
    const rotate = v => {
        let n = orientation + v;
        if(n < 0){n = 3}
        if(n > 3){n = 0}
        setOrientation(n)
    }
    
    let display = [configs[config].config.slice(0, orientation), configs[config].config.slice(orientation)]
    display = display.reverse().join("").split("");


    return (
        <div onClick={()=>rotate(1)} className="block">
            <div className={"s0 sub s"+(display[0]=="0" ? "a" : "b")}></div>
            <div className={"s1 sub s"+(display[1]=="0" ? "a" : "b")}></div>
            <div className={"s2 sub s"+(display[3]=="0" ? "a" : "b")}></div>
            <div className={"s3 sub s"+(display[2]=="0" ? "a" : "b")}></div>
        </div>
    )
}

export default Block;