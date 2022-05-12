import { collection, query, limit, getDocs, orderBy, doc, deleteDoc} from "firebase/firestore"
import { useEffect, useState } from "react";
import { FBDB, FbStorage } from "../Utils/firebaseConfig";
import { DataGrid } from '@mui/x-data-grid';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Avatar, Button } from "@mui/material";
import { ref, getDownloadURL } from "firebase/storage";
import ConfirmDialog from "../Components/ConfirmDialog";
import { deleteProduct, removeImageFromStorage } from "../Feature/product";
import { useStore } from "react-redux";

export default function ProductList(){
    const [productsList, setProductsList] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [toDelete, setToDelete] = useState();
    const store = useStore();
    /* const [lastVisible, setLastVisible] = useState();
    const [colorPagination, setColorPagination] = useState("action"); */
    const rowPerPage = 5;

    const columns = [
        { field: 'id', headerName: 'Id', flex: 1 },
        { field: 'title', headerName: 'Titre',  flex: 1  },
        { field: 'price', headerName: 'Prix', flex: 1 },
        { field: 'action', headerName: 'Actions', flex: 1 , renderCell: (param) => {
            return(
                <div className={"actions"}>
                    <Button variant={"outlined"} onClick={() => {window.location = "/product/"+param.row.id}}>EDIT</Button>
                    <Button variant={"outlined"} color={"error"} onClick={() => {handleClickDelete(param.row.id, param.row.images)}}>DELETE</Button>
                </div>
            )
        }}
      ];

    async function getProducts(){
        // Query the first page of docs
        const first = query(collection(FBDB, "products"), orderBy("title", "asc"));
        const documentSnapshots = await getDocs(first);

        // Get the last visible document
        //setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length-1]);
        setProductsListState(documentSnapshots);
    }
    
   /*  async function getNext(){
        // Construct a new query starting at this document
        const next = query(collection(FBDB, "products"), orderBy("title", "asc"), startAfter(lastVisible), limit(rowPerPage));
        const documentSnapshots = await getDocs(next);
        setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length-1])

        setProductsListState(documentSnapshots);
    }


    async function getPrev(){
        // Construct a new query starting at this document
        const prev = query(collection(FBDB, "products"), orderBy("title", "desc"), endBefore(lastVisible), limitToLast(rowPerPage));
        const documentSnapshots = await getDocs(prev);
        setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length-1]);
        setProductsListState(documentSnapshots);
    } */

    function handleClickDelete(id, images){
        setOpenDialog(true);
        setToDelete({
            id: id,
            images: images
        });
    }

    async function handleCloseDialog(bool){
        setOpenDialog(false);
        setToDelete();
        if(bool){
            deleteProduct(toDelete.id, store);
            toDelete.images.forEach((img) => {
                removeImageFromStorage("products/"+img)
            })
        }
    }

    function setProductsListState(data){
        let tempArray = [];
        data.forEach((doc) => {
            let tempObject = {};
            tempObject.id = doc.id;
            Object.entries(doc.data()).forEach((entries) => {
                tempObject[entries[0]] = entries[1];
            });
            tempArray.push(tempObject);
        });
        setProductsList(tempArray)
    }

    useEffect(() => {
        getProducts();
    }, []);


    return (
        <div>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                  rows={productsList}
                  columns={columns}
                  pageSize={rowPerPage}
                  disableSelectionOnClick
                />
                {/* <div className={"pagination"}>
                    <div className={"prev-next"}>
                        <span onClick={getPrev}><KeyboardArrowLeftIcon color={colorPagination}/></span>
                        <span onClick={getNext}><KeyboardArrowRightIcon color={colorPagination}/></span>
                    </div>
                </div> */}
            </div>
            <ConfirmDialog open={openDialog} close={handleCloseDialog} />
        </div>
    )
}