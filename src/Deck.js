//import the needed tools from react and the other components
import React, { useState, useEffect, useRef } from "react";
//since this is a deck, we will need to import the cards
import Card from "./Card";
//we are using an API so we need to import Axios to call 
import axios from 'axios';
import "./Deck.css";

//lets set the api globally to call 
const API_URL = "https://deckofcardsapi.com/api/deck/"

function Deck() {
    const [deck, setDeck] = useState(null);
    //so...why would we always use useState?
    const [drawn, setDrawn] = useState([]);
    //draw would be a method to code 
    const [autoDraw, setAutoDraw] = useState(false); 
    //need to look this up later. might be an API thing
    const timerRef = useRef(null); 
    //why would we use useRef?

    //need to load the deck from the api, how do we know to use useEffect?
    useEffect(() => {
        async function getData() {
            let d = await axios.get(`${API_URL}new/shuffle`);
            setDeck(d.data);
        }
        getData(); //part of useEffect syntax. need to execute the function.
    }, [setDeck]); //another part of useEffect. need to call on state to update it

    //need to set an autodraw. when pressed, draws a card by a set time i.e. 1 sec
    //same question as above
    useEffect(() =>{
        async function getCard(){
            let { deck_id } = deck; //from the api to get our deck unique id
        //since we are calling to the api, we should remember the try and catch
        try {
            let drawRes = await axios.get(`${API_URL}/${deck_id}/draw/`);

            if (drawRes.data.remaining === 0) {
                setAutoDraw(false);
                throw new Error("no cards remaining!")
            }

            const card = drawRes.data.card[0];

            //why would we call setDrawn here?
            setDrawn(d => [
                ...d, // spread to keep existing data but add the following into the deck value
                {
                    id: card.code,
                    name: card.suit + " " + card.value,
                    image: card.image
                }
            ]);

        } catch (err) {
            alert(err);
            }
        }
        //what is this conditional for? if this func is running, and the timmer is out..?
        if (autoDraw && !timerRef.current) {
            timerRef.current = setInterval(async () => {
                await getCard();
            }, 1000);
        }

        return () => {
            clearInterval(timerRef.current);
            timerRef.current = null;
        };
    }, [autoDraw, setAutoDraw, deck]); //what is happening here?
    //what is the logic for this function saying??
    const toggleAutoDraw = () => {
        setAutoDraw(auto => !auto); 
    };

    const cards = drawn.map(c => (
        <Card key={c.id} name={c.name} image={c.image} />
    ));
//logic is done return the result and render to the html page
    return (
        <div className="Deck">
            {deck ? (
            <button className="Deck-gimme" onClick={toggleAutoDraw}>
                {autoDraw ? "STOP " : "KEEP "}
                 Drawing for me!
            </button>
            ) : null}
            <div className="Deck-cardarea">{cards}</div>
        </div>
    );
}

export default Deck;

