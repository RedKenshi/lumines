import React, { useState, useEffect, Fragment } from 'react';
import Nextblocks from '../molecules/NextBlock';
import Grid from '../molecules/Grid';
import Bar from '../molecules/Bar';
import Menu from '../molecules/Menu';
import Score from '../molecules/Score';
const Game = props => {

    const configs = [
        {id:0,config:"0000"},
        {id:1,config:"0001"},
        {id:2,config:"0101"},
        {id:3,config:"0011"}
    ]

    const [timeLeft, setTimeLeft] = useState(16000)
    let tl = 16000
    const time = 16000;
    const health = 10000;
    const maxHealth = 100000;
    const points = 0;
    const [chargedNeeded, setChargedNeeded] = useState(false)
    const [config, setConfig] = useState(Math.floor(Math.random() * 3))
    const [orientation, setOrientation] = useState(Math.floor(Math.random() * 3))
    const [inverse, setInverse] = useState(Math.random() > 0.5)
    const [position, setPosition] = useState({x:12,y:1})
    const [id, setId] = useState(0)
    const [spawned, setSpawned] = useState(false)
    const [subgrid,setSubgrid] = useState([])

    const getSubGrid = () => {
        return Array.from(subgrid);
    }
    //GAME FEATURES
    const spawn = () => {
        setSpawned(true)
        setConfig(Math.floor(Math.random() * 3))
        setOrientation(Math.floor(Math.random() * 3))
        setInverse(Math.random() > 0.5)
        setPosition({x:12,y:1})
        setId(Date.now())
        setSpawned(true)
    }
    const generateSubsOfCurrent = () => {
        let subs = [];
        if(!spawned){
            return[]
        }
        let display = [
            configs[config].config.slice(0, orientation),
            configs[config].config.slice(orientation)
        ]
        display = display.reverse().join("").split("");
        subs.push({x:parseInt(position.x),y:parseInt(position.y),c:display[0]=="0" ? (inverse ? "a" : "b") : (inverse ? "b" : "a")})
        subs.push({x:parseInt(position.x+1),y:parseInt(position.y),c:display[1]=="0" ? (inverse ? "a" : "b") : (inverse ? "b" : "a")})
        subs.push({x:parseInt(position.x+1),y:parseInt(position.y+1),c:display[2]=="0" ? (inverse ? "a" : "b") : (inverse ? "b" : "a")})
        subs.push({x:parseInt(position.x),y:parseInt(position.y+1),c:display[3]=="0" ? (inverse ? "a" : "b") : (inverse ? "b" : "a")})
        return (subs)
    } 
    const compiledSubgrid = () => {
        return subgrid.concat(generateSubsOfCurrent())
    }
    const useKeyDown = () => {
        const handleKeyDown = e => {
            switch( e.keyCode ) {
                case 37://ARROW LEFT
                    moveLeft()
                    break;
                case 39://ARROW RIGHT
                    moveRight()
                    break;
                case 40://ARROW DOWN
                    moveDown()
                    break;
                case 81://Q KEY
                    rotateAnti(1)
                    break;
                case 68://D KEY
                    rotateClock(1) 
                    break;
                case 83://S KEY
                    fall(1)
                    break;
                default:
                    break;
            }
        }
        // Add event listeners
        useEffect(() => {
            window.addEventListener("keydown", handleKeyDown);
            // Remove event listeners on cleanup
            return () => {
                window.removeEventListener("keydown", handleKeyDown);
            };
        }, ); // Empty array ensures that effect is only run on mount and unmount
        //return keyPressed;
    }

    useKeyDown()
    useEffect(()=>{
        spawn()
        //KEY PRESS
    },[])
    useEffect(()=>{
        if(chargedNeeded){
            chargeSubs()
        }
        //document.addEventListener("keydown", handleKeyDown,{once:true});
    })

    useEffect(() => {
        const interval = setInterval(() => {
            updateBar()
        }, 250);
        return () => clearInterval(interval);
    }, []);

    const chargeSubs = () => {
        let structured = [];
        let chargedGrid = Array.from(subgrid)
        for (let y = 1; y <= 18; y++) {
            let row = [];
            for (let x = 1; x <= 24; x++) {
                row.push({y:y,x:x,ay:y-1,ax:x-1})
            }
            structured.push(row)
        }
        chargedGrid.forEach(s=>{
            structured[s.y-1][s.x-1] = {x:s.x, y:s.y, ax:s.x-1, ay:s.y-1, content:s.c}
        })
        chargedGrid.forEach(s=>{
            if(!s.charged){
                let res = testNeighbors(structured,chargedGrid,s);
                if(res.found){
                    res.charged.forEach(c=>{
                        let sub = chargedGrid.filter(s=> s.ax == c.x && s.ay == c.y)[0]
                        let i = chargedGrid.indexOf(sub);
                        chargedGrid[i].charged = true
                    })
                }
            }
        })
        setSubgrid(chargedGrid)
        setChargedNeeded(false);
    }
    const testNeighbors = (structured,grid,pos) => {
        if(pos.ay != 17 && pos.ax != 23){
            if(
                structured[pos.ay][pos.ax+1].content == pos.c &&
                structured[pos.ay+1][pos.ax+1].content == pos.c &&
                structured[pos.ay+1][pos.ax].content == pos.c){
                return {found:true,charged:[
                    {y:pos.ay,x:pos.ax},
                    {y:pos.ay,x:pos.ax+1},
                    {y:pos.ay+1,x:pos.ax+1},
                    {y:pos.ay+1,x:pos.ax}
                ]}
            }
        }
        if(pos.ax != 23){
            if(
                structured[pos.ay-1][pos.ax].content == pos.c &&
                structured[pos.ay-1][pos.ax+1].content == pos.c &&
                structured[pos.ay][pos.ax+1].content == pos.c){
                return {found:true,charged:[
                    {y:pos.ay,x:pos.ax},
                    {y:pos.ay-1,x:pos.ax},
                    {y:pos.ay-1,x:pos.ax+1},
                    {y:pos.ay,x:pos.ax+1}
                ]}
            }
        }
        if(pos.ax != 0){
            if(
                structured[pos.ay-1][pos.ax-1].content == pos.c &&
                structured[pos.ay-1][pos.ax].content == pos.c &&
                structured[pos.ay][pos.ax-1].content == pos.c
            ){
                return {found:true,charged:[
                    {y:pos.ay,x:pos.ax},
                    {y:pos.ay-1,x:pos.ax-1},
                    {y:pos.ay-1,x:pos.ax},
                    {y:pos.ay,x:pos.ax-1}
                ]}
            }
        }
        if(pos.ay != 17 && pos.ax != 0){
            if(
                structured[pos.ay][pos.ax-1].content == pos.c &&
                structured[pos.ay+1][pos.ax-1].content == pos.c &&
                structured[pos.ay+1][pos.ax].content == pos.c){
                return {found:true,charged:[
                    {y:pos.ay,x:pos.ax},
                    {y:pos.ay,x:pos.ax-1},
                    {y:pos.ay+1,x:pos.ax-1},
                    {y:pos.ay+1,x:pos.ax}
                ]}
            }
        }
        return {found:false}
    }
    const getImpactYSub = x => {
        const subsBelow = subgrid.filter(s=>s.x == x)
        if(subsBelow.length == 0){
            return 18;
        }else{
            return Math.min(...subsBelow.map(s=>s.y))-1;
        }
    }
    const getImpactY = () => {
        const subsBelow = subgrid.filter(s=>s.x == position.x || s.x == position.x + 1)
        if(subsBelow.length == 0){
            return 18;
        }else{
            return Math.min(...subsBelow.map(s=>s.y))-1;
        }
    }
    const consume = () => {
        console.log(getSubGrid())
        //console.log(subgrid.filter(s=>!s.charged))
        //setSubgrid(subgrid.filter(s=>!s.charged))
        //HERE
    }
    const updateBar = () => {
        tl = tl - 250;
        if(tl < 0){
            consume()
            setTimeLeft(16000)
            tl=16000;
        }else{
            setTimeLeft(tl-250)
        }
    }
    const defeat = () => {
        //document.removeEventListener("keydown",handleKeyDown);
        alert("DEFEAT");
        reset();
    }
    //MOVING CURRENT
    const rotateClock = v => {
        //document.removeEventListener("keydown",handleKeyDown);
        let n = orientation - v;
        if(n < 0){n = 3}
        if(n > 3){n = 0}
        setOrientation(n)
    }
    const rotateAnti = v => {
        //document.removeEventListener("keydown",handleKeyDown);
        let n = orientation + v;
        if(n < 0){n = 3}
        if(n > 3){n = 0}
        setOrientation(n)
    }
    const moveLeft = () => {
        let newx = position.x - 1;
        if(newx > 0){
            //document.removeEventListener("keydown",handleKeyDown);
            setPosition({x:newx, y:position.y})
        }
    }
    const moveRight = () => {
        let newx = position.x + 1;
        if(newx <= 23){
            //document.removeEventListener("keydown",handleKeyDown);
            setPosition({x:newx, y:position.y})
        }
    }
    const moveDown = () => {
        //document.removeEventListener("keydown",handleKeyDown);
        if(getImpactY() == position.y + 1){
            printSubs();
        }else{
            setPosition({x:position.x, y:position.y + 1})
        }
    }
    const fall = () => {
        //document.removeEventListener("keydown",handleKeyDown);
        setPosition({x:position.x, y:getImpactY()})
        printSubs()
    }
    const printSubs = () => {
        let subs = [];
        let display = [
            configs[config].config.slice(0, orientation),
            configs[config].config.slice(orientation)
        ]
        display = display.reverse().join("").split("");
        subs.push({
            x:parseInt(position.x),
            y:getImpactYSub(position.x)-1,
            ax:parseInt(position.x)-1,
            ay:getImpactYSub(position.x)-2,
            c:display[0]=="0" ? (inverse ? "a" : "b") : (inverse ? "b" : "a"),charged:false})
        subs.push({
            x:parseInt(position.x+1),
            y:getImpactYSub(position.x+1)-1,
            ax:parseInt(position.x+1)-1,
            ay:getImpactYSub(position.x+1)-2,
            c:display[1]=="0" ? (inverse ? "a" : "b") : (inverse ? "b" : "a"),charged:false})
        subs.push({
            x:parseInt(position.x+1),
            y:getImpactYSub(position.x+1),
            ax:parseInt(position.x+1)-1,
            ay:getImpactYSub(position.x+1)-1,
            c:display[2]=="0" ? (inverse ? "a" : "b") : (inverse ? "b" : "a"),charged:false})
        subs.push({
            x:parseInt(position.x),
            y:getImpactYSub(position.x),
            ax:parseInt(position.x)-1,
            ay:getImpactYSub(position.x)-1,
            c:display[3]=="0" ? (inverse ? "a" : "b") : (inverse ? "b" : "a"),charged:false})
        if(Math.min(...subs.map(s=>s.y)) < 3){
            reset();
        }else{
            setSubgrid(subgrid.concat(subs))
            setChargedNeeded(true);
            spawn()
        }
    }
    const reset = () => {
        setSubgrid([])
    }

    return (
        <Fragment>
            <div className="game">
                <Grid configs={configs} aim={position.x} subgrid={compiledSubgrid()}/>
                <Bar type='time' val={timeLeft} max={time}/>
                <Bar type='health' val={health} max={maxHealth}/>
            </div>
        </Fragment>
    )
}

export default Game;

/*
<Nextblocks/>
<Menu/>
<Score/>
*/