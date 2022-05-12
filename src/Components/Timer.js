import { useEffect } from "react";
import { useSelector } from "react-redux"
import { selectTimer } from "../Utils/selector"

export default function Timer(props){
    const timerSelector = useSelector(selectTimer);

    useEffect(() => {
        document.documentElement.style.setProperty("--timer", timerSelector+"s")
    }, [timerSelector])
    
    return (
        <div className="timer">
                    <div className="time">{props.time}</div>
                    <div className="time-bar">
                        <svg className="progress-bar" width="40" height="40" viewBox="0 0 75 75" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="37" cy="37" r="32" stroke="url(#paint0_linear_15_42)" strokeWidth="10" />
                            <defs>
                                <linearGradient id="paint0_linear_15_42" x1="36" y1="0" x2="36" y2="70" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#5F61FB"/>
                                    <stop offset="1" stopColor="#64C8FE"/>
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                </div>
    )
}