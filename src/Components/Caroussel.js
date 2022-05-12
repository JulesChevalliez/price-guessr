import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectGameProduct } from "../Utils/selector";
import Arrow from "./Arrow";

export default function Caroussel(props){
    const [sliderIndex, setSliderIndex] = useState(1);

    const selectProduct = useSelector(selectGameProduct);

    useEffect(() => {
        setSliderIndex(1);
    }, [props.resetSlider])

    function handleSlide(e){
        let container = document.querySelector(".viewport .container");

        e.target.classList.toggle("clicked")
        setTimeout(() => {
            e.target.classList.toggle("clicked")
        }, 200)

        if(e.target.classList.contains("previous")){
            if(sliderIndex > 1){
                container.style.left = "-"+(sliderIndex-2)*100+"%"
                setSliderIndex(sliderIndex-1)
            }
        }else{/*NEXT*/
            if(sliderIndex < props.sliderLength+1){
                container.style.left = "-"+sliderIndex*100+"%"
                setSliderIndex(sliderIndex+1)
            }
        }
    }

    return(
        <div className="caroussel">
                <div className="previous" onClick={handleSlide}>
                    <Arrow />
                </div>
                <div className="viewport">
                    <div className="container">
                        {
                            props.imageContainer.map((image) => {
                                return(image)
                            })
                        }
                        <div className="info-slide">
                            <div className="title">{selectProduct.title}</div>
                            <div className="desc">{selectProduct.description}</div>
                        </div>
                        
                    </div>
                </div>
                <div className="next" onClick={handleSlide}>
                    <Arrow />
                </div>
            </div>
    )
}