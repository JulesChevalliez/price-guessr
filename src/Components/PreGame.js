import { useSelector, useStore } from "react-redux";
import { setGameStatusState } from "../Feature/game"
import { selectGameStatus } from "../Utils/selector";

export default function PreGame(){

    const statusSelector = useSelector(selectGameStatus);
    const store = useStore();

    function handleClickBtn(e){
        e.target.classList.toggle("clicked");
        if(e.target.classList.contains("play")){
            setTimeout(() => {
                e.target.classList.toggle("clicked");
                document.querySelector(".homepage").classList.add("game-started");
                if(statusSelector === "paused" || statusSelector === "void"){
                    document.querySelector(".progress-bar").classList.add("active");
                    document.querySelector(".progress-bar").classList.remove("paused");
                    setGameStatusState(store, "running")
                }
            }, 200)
        }
        if(e.target.classList.contains("settings")){
            setTimeout(() => {
                e.target.classList.toggle("clicked");
                document.querySelector(".homepage").classList.add("in-settings");
            }, 200)
        }
        if(e.target.classList.contains("rules")){
            setTimeout(() => {
                e.target.classList.toggle("clicked");
                document.querySelector(".homepage").classList.add("in-rules");
            }, 200)
        }
    }


    return(
        <div className={"pre-game"}>
                <div className="container">
                    <img className="logo" src={process.env.PUBLIC_URL+"logo.svg"} />
                    <div className="buttons">
                        <div className={"play"} onClick={handleClickBtn}>
                            <div className="text">{statusSelector !== "void" ? "Resume" : "Play"}</div>
                        </div>
                        <div className={"rules"} onClick={handleClickBtn}>
                            <div className="text">rules</div>
                        </div>
                        <div className={"settings"} onClick={handleClickBtn}>
                            <div className="text">settings</div>
                        </div>
                    </div>
                </div>
            </div>
    )
}