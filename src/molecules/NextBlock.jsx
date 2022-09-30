import React, { useState } from 'react';
import Block from '../atoms/Block';

const Nextblocks = props => {

    return (
        <div className="nextblocks">
            <Block/>
            <Block/>
            <Block/>
        </div>
    )
}

export default Nextblocks;