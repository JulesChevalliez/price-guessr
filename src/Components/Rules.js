import Back from "./Back";

export default function Rules(){

    function handleGetBack(){
        document.querySelector(".rules-container .get-back").classList.add("clicked");
        setTimeout(() => {
            document.querySelector(".rules-container .get-back").classList.remove("clicked");
        }, 200);
        setTimeout(() => {
            document.querySelector(".homepage").classList.remove("in-rules");
        }, 200)
    }


    return(
        <div className="rules-container">
            <div className="title">Rules</div>
            <div className="get-back" onClick={handleGetBack}>
                <Back />
            </div>
        </div>
    )
}