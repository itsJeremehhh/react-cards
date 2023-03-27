import React, { useState } from "react";
import './Card.css';

//single card component rendered when pulling from the deck

function Card({name, image}) {//these are the properties we are implamenting into the card
    //this is the possition of the cards..but why is it not its own function?
    const [{angle, xPos, yPos}] = useState({
        angle: Math.random() * 90 - 45, //is this the min/max values? or is it a math
        xPos: Math.randon() * 40 - 20,
        yPos: Math.randon() * 40 - 20,
    });

    const transform = `translate(${xPos}px, ${yPos}) rotate(${angle}deg)`;

    //render the card
    return <img className="Card"
                alt={name}
                src={image}
                style={{transform}} />
}

export default Card