import Arrow from "./Arrow";

export default function(props){
    return(
        <div className={"toast"} >
            <div className={"text "+props.color}>{props.text}</div>
            <Arrow color={props.color}/>
        </div>
    )
}