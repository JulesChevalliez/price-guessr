import { useEffect, useState } from "react"
import { selectGameProduct, selectGamesHistory, selectGameStatus, selectTimer } from "../Utils/selector"
import { useStore, useSelector } from "react-redux";
import { getRandomProduct, setGameStatusState, setHistoryState } from "../Feature/game";
import { ref } from "firebase/storage";
import { FbStorage } from "../Utils/firebaseConfig";
import { getDownloadURL } from "firebase/storage";
import { produce } from "immer";
import Arrow from "./Arrow";
import Toast from "./Toast";
import Back from "./Back";
import MoneyBag from "./MoneyBag";
import Logo from "./Logo";
import LinkIcon from "./LinkIcon";
import Timer from "./Timer"
import Caroussel from "./Caroussel";

export default function InGame(props){
    const [time, setTime] = useState(useSelector(selectTimer));
    const [imageContainer, setImageContainer] = useState([]);
    const [sliderLength, setSliderLength] = useState();
    const [inputVal, setInputVal] = useState(1);
    const [productPrice, setProductPrice] = useState(0);
    const [toastContainer, setToastContainer] = useState([]);
    const [statusClass, setStatusClass] = useState();
    const [nbrGuess, setNbrGuess] = useState(0);
    const [resetSlider, setResetSlider] = useState(false);
    
    const selectProduct = useSelector(selectGameProduct)
    const statusSelector = useSelector(selectGameStatus);
    const historySelector = useSelector(selectGamesHistory);
    const timerSelector = useSelector(selectTimer);

    const store = useStore();

    useEffect(() => {
        document.addEventListener('keydown', (e) => {
            if(e.key === "Enter"){
                document.querySelector(".guess").click();
            }
        })
    }, [])
    
    useEffect(() => {
        setTime(timerSelector);
    }, [timerSelector]);

    useEffect(() => {
        setStatusClass(statusSelector);
        if(statusSelector === "running"){
            if(time >= 1){
                setTimeout(() => {
                    setTime(time-1)
                }, 1000)
            }else{
                setGameStatusState(store, "timesup")
            }
        }
    }, [statusSelector, time])

    useEffect(() => {
        document.querySelectorAll(".caroussel .container .image").forEach((img) => {img.remove()})
        setProductPrice(selectProduct.price)
        setSliderLength(selectProduct.images.length)
        selectProduct.images?.forEach((img) => {
            
            const pathReference = ref(FbStorage, 'products/'+img);
            getDownloadURL(pathReference).then((url) => {
                setImageContainer(
                    produce((draft) => {
                        draft.push(
                            <div className={"image"} key={url} data-url={'products/'+img}>
                                <img style={{"maxWidth": "100%"}} src={url}/>
                            </div>
                        )
                    })
                )
            })
        })
    }, [selectProduct])

    function handleInput(e){
        setInputVal(parseInt(e.target.value));
    }

    function handleGuess(){
        setNbrGuess(nbrGuess+1);
        if(inputVal === productPrice){
            document.querySelector(".progress-bar").classList.add("paused");
            setGameStatusState(store, "won");
            if(historySelector.length > 9){
                let history = selectGamesHistory;
            }
            setHistoryState(store, selectProduct.id);
        }
        if(inputVal < productPrice){
            let tempArray = 
            {
                color: "blue",
                text: "C'est plus"
            };
            setToastContainer([...toastContainer, tempArray]);
        }
        if(inputVal > productPrice){
            let tempArray = 
                {
                    color: "green",
                    text: "C'est moins"
                };
            setToastContainer([...toastContainer, tempArray]);
        }
        document.querySelector(".guess").classList.add("clicked");
        setTimeout(() => {
            document.querySelector(".guess").classList.remove("clicked");
            animateToast();
        }, 200)
    }

    function animateToast(){
        let toastContainer = document.querySelector(".toasts").childElementCount;

        if(toastContainer === 2){
            document.querySelector(".toast:nth-of-type(1)").classList.add("entrance");
        }

        if(toastContainer === 3){
            document.querySelector(".toast:nth-of-type(1)").classList.add("slide-down", "first");
            setTimeout(() => {
                document.querySelector(".toast:nth-of-type(2)").classList.add("entrance");
            }, 300)
        }

        if(toastContainer === 4){
            document.querySelector(".toast:nth-of-type(2)").classList.add("slide-down", "first");
            document.querySelector(".toast:nth-of-type(1)").classList.add("slide-down", "last");
            setTimeout(() => {
                document.querySelector(".toast:nth-of-type(3)").classList.add("entrance");
            }, 300)
        }

        if(toastContainer > 4){
            document.querySelectorAll(".toast").forEach((item, i, array) => {
                item.classList.remove("slide-down");
                if (i !== array.length - 1){ 
                    item.classList.add("stacked");
                }
            })
            document.querySelector(".toast:nth-of-type("+(toastContainer - 2)+")").style.top = "40px";
            document.querySelector(".toast:nth-of-type("+(toastContainer - 3)+")").style.top = "80px";
            document.querySelector(".toast:nth-of-type("+(toastContainer - 4)+")").style.top = "140px";
            setTimeout(() => {
                document.querySelector(".toast:nth-of-type("+(toastContainer - 1)+")").classList.add("entrance");
            }, 300)
        }
    }

    function handleReplay(e){
        e.target.classList.add("clicked");
        setTimeout(() => {
            e.target.classList.remove("clicked")
        }, 300)
        getRandomProduct(store, historySelector);
        document.querySelector(".viewport .container").style.left = "0%";
        setResetSlider(!resetSlider);
        setGameStatusState(store, "running");
        setTime(timerSelector);
        document.querySelector(".progress-bar").classList.remove("active", "paused");
        setTimeout(() => {
            document.querySelector(".progress-bar").classList.add("active");
        }, 1)
        setNbrGuess(0);
        setToastContainer([]);
        document.querySelector(".guess-input .input").value = "";
    }

    function handleGetBack(){
        document.querySelector(".get-back").classList.add("clicked");
        document.querySelector(".progress-bar").classList.add("paused");
        if(statusSelector === "running"){
            setGameStatusState(store, "paused");
        }
        setTimeout(() => {
            document.querySelector(".get-back").classList.remove("clicked");
            document.querySelector(".homepage").classList.remove("game-started")
        }, 200)
    }

    return (
        <div className="in-game">
            <div className="top">
                <img className="logo" src={process.env.PUBLIC_URL+"logo.svg"} />
                <div className="timer-back">
                    <div className="get-back" onClick={handleGetBack}>
                        <Back />
                    </div>
                    <Timer time={time}/>
                </div>
            </div>

            <Caroussel imageContainer={imageContainer} sliderLength={sliderLength} resetSlider={resetSlider}/>

            <div className={"guess-toasts "+statusClass}>
                <div className="guess-input">
                    <input className="input" type={"number"} placeholder={"Guess"} onChange={handleInput}></input>
                    <div className="guess" onClick={handleGuess}>
                        <Arrow />
                    </div>
                </div>
                <div className="toasts">
                    {
                        toastContainer.map((toast, i, {length}) => {
                            return(
                                <Toast color={toast.color} text={toast.text}/>
                            )
                        })
                    }
                    <div className="overlay"></div>
                </div> 
            </div>
            <div className={"game-finished "+statusClass}>
                <div className="title">{ statusClass === "timesup" ? "Times up" : "Well done"}</div>
                <div className="price"><MoneyBag />{selectProduct.price}€</div>
                <div className="nbr-guesses"><Logo />{nbrGuess} guesses</div>
                <div className="bottom">
                    <a href={"https://"+selectProduct.link} className="link">
                        <LinkIcon />
                        <span>{selectProduct.link}</span>
                    </a>
                    <div className="replay" onClick={handleReplay}>
                        Replay
                    </div>
                </div>
            </div>
        </div>
    )
}