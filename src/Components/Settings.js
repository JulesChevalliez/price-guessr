import { useSelector, useStore } from "react-redux";
import { getRandomProduct, setDifficultyState } from "../Feature/game";
import { selectDifficulty, selectGamesHistory } from "../Utils/selector";
import Back from "./Back";

export default function Settings(){
    const difficultySelector = useSelector(selectDifficulty);
    const historySelector = useSelector(selectGamesHistory);
    const store = useStore();

    function handleDifficulty(e){
        setDifficultyState(store, e.target.getAttribute("data-difficulty"));
        document.querySelector(".progress-bar").classList.remove("active");
        getRandomProduct(store, historySelector);
    }

    function handleGetBack(){
        document.querySelector(".settings-container .get-back").classList.add("clicked");
        setTimeout(() => {
            document.querySelector(".settings-container .get-back").classList.remove("clicked");
        }, 200);
        setTimeout(() => {
            document.querySelector(".homepage").classList.remove("in-settings");
        }, 200)
    }

    return(
        <div className="settings-container">
            <div className="title">Settings</div>
            <div className="difficulty">
                <div className="name">
                    Difficulty (timer) :
                </div>
                <div className="inputs">
                    <div data-difficulty={"easy"} className={difficultySelector === "easy" ? "input clicked" : "input" } onClick={handleDifficulty}>Easy</div>
                    <div data-difficulty={"medium"} className={difficultySelector === "medium" ? "input clicked" : "input" } onClick={handleDifficulty}>Medium</div>
                    <div data-difficulty={"hard"} className={difficultySelector === "hard" ? "input clicked" : "input" } onClick={handleDifficulty}>Hard</div>
                </div>
            </div>
            <div className="get-back" onClick={handleGetBack}>
                <Back />
            </div>
        </div>
    )
}