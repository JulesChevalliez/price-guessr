import { useEffect, useRef, useState } from "react";
import { produce } from "immer";
import { useStore, useSelector } from "react-redux";
import { selectProduct, selectProductImages } from "../Utils/selector";
import { Button } from "@mui/material";
import { getDownloadURL } from "firebase/storage";
import { FbStorage } from "../Utils/firebaseConfig";
import { ref } from "firebase/storage";
import { removeImageFromStorage } from "../Feature/product";
import ConfirmDialog from "./ConfirmDialog";

export default function UploadImages(props){
    const [imageContainer, setImageContainer] = useState([]);
    const productSelect = useSelector(selectProduct)
    const [openDialog, setOpenDialog] = useState(false);

    function addImagesFromFB(){
        productSelect.images?.forEach((image) => {
            const pathReference = ref(FbStorage, 'products/'+image);
            getDownloadURL(pathReference).then((url) => {
                setImageContainer(
                    produce((draft) => {
                        draft.push(
                            <div className={"image"} key={url} data-url={'products/'+image}>
                                <img style={{"maxWidth": "100%"}} src={url}/>
                                <div className={"overlay"} data-url={'products/'+image} data-timestamp={image} onClick={handleDeleteImage}></div>
                            </div>
                        )
                    })
                )
            })
        })
    }

    function handleFiles(e){
        const imagefiles = e.target.files;
        Object.values(imagefiles).forEach((file) => {
            let timestamp = new Date().getTime();
            let fileEntrie = [file, timestamp];
            var reader  = new FileReader();
            reader.onload = function(e)  {
                var image = document.createElement("img");
                image.src = e.target.result;
                setImageContainer(
                    produce((draft) => {
                        draft.push(
                            <div className={"image"} key={timestamp}>
                                <img style={{"maxWidth": "100%"}} src={image.src}/>
                                <div className={"overlay"} data-url={"local-file"} data-timestamp={timestamp} onClick={handleDeleteImage}></div>
                            </div>
                        )
                    })
                )
            }
            reader.readAsDataURL(file);
            props.handleFiles(fileEntrie)
        })
    };

    function handleDeleteImage(e){
        setOpenDialog(true)
        e.target.classList.add('clicked');
    }

    function closeDialog(bool){
        if(bool){
            setOpenDialog(false)
            let overlay = document.querySelector(".overlay.clicked");
            let dataset = overlay.dataset;
            if(dataset.url === "local-file"){
                props.removeFiles(dataset.timestamp);
            }else{
                removeImageFromStorage(dataset.url)
                overlay.parentElement.remove();
                props.removeFiles(parseInt(dataset.timestamp));
            }
        }else{
            setOpenDialog(false)
        }
    }

    const loadImageFromDb = useRef(false);
    useEffect(() => {   
        if(!loadImageFromDb.current){
            if(productSelect.images.length > 0){
                addImagesFromFB();
                loadImageFromDb.current = true;
            }
        }
    }, [productSelect.images]);
    
    return(
        <div>
            <div className={"images-container"}>
            {
                imageContainer.map((image) => {
                    return(image)
                })
            }
            </div>
            <label htmlFor="file">
                <input accept="image/*" id="file" type="file" style={{"display": "none"}} onChange={handleFiles}/>
                <Button variant="contained" component="span">
                    Upload
                </Button>
            </label>
            <ConfirmDialog open={openDialog} close={closeDialog} />
        </div>
        
    )
}