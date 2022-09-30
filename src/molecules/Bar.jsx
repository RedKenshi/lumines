import React, { useState } from 'react';

const Bar = props => {

    return (
        <div className={"bar " + props.type}>
            <div className='inner-bar' style={{height:((props.val/props.max)*100)+"%"}}></div>
        </div>
    )
}

export default Bar;