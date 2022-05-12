import { useMatch } from "@tanstack/react-location"
import { Card, CardContent, Grid, TextField, Stack, Button, Input } from "@mui/material"
import { addProduct, getProduct, setProduct, updateProduct } from "../Feature/product";
import { useEffect, useRef, useState } from "react";
import { useStore, useSelector } from "react-redux";
import { produce } from "immer";
import { selectProduct, selectProductImages } from "../Utils/selector";
import UploadImages from "../Components/UploadImages";

export default function Product(){
    const [validFormBtn, setValidFormBtn] = useState(null);
    const [files, setFiles] = useState([]);//LES IMAGES SONT STOCKEES ICI CAR LE STORE REDUX NE DOIT PAS COMPORTER DE VALEURS NON SERIALIZER

    const store = useStore();
    const productSelect = useSelector(selectProduct);
    const imageState = useSelector(selectProductImages);

    const handleProduct = (e) => {
        const id = e.target.id;
        const value = e.target.value;
        
        switch(id){
            case "file":
                break;
            default: setProduct(id, value, store);

        }
    };

    const params = useMatch().params;
    const imgDeletedRef = useRef(false);

    useEffect(() => {
        if(params.id){
            getProduct(params.id, store);
        }
    }, []);

    useEffect(() => {// Obligé de passer dans un useeffect pour recupérer le state à jour
        if(params.id){
            setValidFormBtn(
                <Button variant="contained" onClick={updatePrdct}>Sauvegarder</Button>
            )
        }else{
            setValidFormBtn(
                <Button variant="contained" onClick={addPrdct}>Ajouter</Button>
            )
        }
    }, [files])

    useEffect(() => {
        if(imgDeletedRef.current){
            updateProduct(productSelect, [], store, params);
            imgDeletedRef.current = false;
        }
    }, [productSelect])

    function handleFiles(fileEntrie){        
        setFiles(
            produce((draft) => {
                draft.push(fileEntrie);
            })
        );

        let images = [...productSelect.images];
        images = [...images, fileEntrie[1]];
        setProduct("images", images, store);
        
    }

    function removeFiles(timestamp){
        setFiles(files.filter(files => files[1] !== timestamp))
        let newImgState = imageState.filter(img => img !== timestamp)
        setProduct("images", newImgState, store);
        imgDeletedRef.current = true;
    }
    

    function addPrdct(){
        addProduct(store.getState().product.product, files, store)
    }

    function updatePrdct(){
        updateProduct(store.getState().product.product, files, store, params)
    }

    return (
        <Card sx={{maxWidth: "80vw", maxHeight: "80vh", margin: "auto"}}>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Stack spacing={2} xs={6}>
                            <TextField id="title" label="Titre" variant="outlined" value={productSelect.title} onChange={handleProduct}/>
                            <TextField id="description" label="Description" variant="outlined" multiline value={productSelect.description} onChange={handleProduct}/>
                            <TextField id="price" label="Prix" variant="outlined"  value={productSelect.price} onChange={handleProduct}
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}/>
                            <TextField id="link" label="Source (lien)" variant="outlined"  value={productSelect.link} onChange={handleProduct} />
                        </Stack>
                    </Grid>
                    <Grid item xs={6}>  
                        <Stack spacing={2}>
                            <UploadImages handleFiles={handleFiles} removeFiles={removeFiles}/>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    {validFormBtn}
                                </Grid>
                                <Grid item xs={6}>
                                    <Button variant="outlined" onClick={() => {window.location = "/products-list"}}>Annuler</Button>
                                </Grid>
                            </Grid>
                        </Stack>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}