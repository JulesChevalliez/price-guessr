import React, { useEffect } from "react"
import { useSelector, useStore } from "react-redux"
import InGame from "../Components/InGame"
import PreGame from "../Components/PreGame"
import Rules from "../Components/Rules"
import { getRandomProduct } from "../Feature/game"
import { selectGamesHistory } from "../Utils/selector"
import Settings from "../Components/Settings"


export default function Home(){
    const store = useStore();
    const historySelector = useSelector(selectGamesHistory);

    useEffect(() => {
        getRandomProduct(store, historySelector)
    }, [])
    
    return (
        <div className={"homepage"}>
            <div className="card-container">
                <Settings />
            </div>
            <div className="card-container">                
                <PreGame />
            </div>
            <div className="card-container">
                <InGame />
            </div>
            <div className="card-container rules-cell">
                <Rules />
            </div>
        </div>
    )
}