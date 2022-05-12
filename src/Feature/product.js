import { createSlice } from "@reduxjs/toolkit";
import { doc, getDocs, query, collection, onSnapshot, addDoc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { FBDB, FbStorage} from "../Utils/firebaseConfig";
import { getStorage, ref, uploadBytes, deleteObject } from "firebase/storage";
import { async } from "@firebase/util";
import { useSelector } from "react-redux";
import { selectProduct } from "../Utils/selector";
import { getDownloadURL } from "firebase/storage";


const initialState = {
    status: "void",
    error: null,
    product: {
        title: "",
        description: "",
        price: "",
        link: "",
        images: []
    }
};


// GET FROM FIRESTORE
export async function getProduct(id, store){
    store.dispatch(actions.fetching())

    const docRef = doc(FBDB, "products", id);
    const docSnap = await getDoc(docRef);
    

    if (docSnap.exists()) {
        let product = docSnap.data();
        Object.entries(product).forEach((value, key) => {
            store.dispatch(actions.setProductField(value[0], value[1]))
        })
        store.dispatch(actions.resolved())

    } else {
        store.dispatch(actions.rejected("No such document!"))
    }
}

// ADD TO FIRESTORE
export async function addProduct(product, files, store){
    store.dispatch(actions.fetching())

    // Add a new document with a generated id.
    const docRef = await addDoc(collection(FBDB, "products"), {
        title: product.title,
        description: product.description,
        price: parseInt(product.price),
        link: product.link,
        images: product.images
    })

    files.forEach((file, id) => {
        const storageRef = ref(getStorage(), 'products/'+file[1]);
        uploadBytes(storageRef, file[0]).then((snapshot) => {
            console.log(snapshot);
        });
    });
   

    store.dispatch(actions.resolved())
}

export async function updateProduct(product, files, store, params){
    store.dispatch(actions.fetching())

    const refProduct = doc(FBDB, "products", params.id);

    await updateDoc(refProduct, product);


    files.forEach((file, id) => {
        const storageRef = ref(getStorage(), 'products/'+file[1]);
        uploadBytes(storageRef, file[0]).then((snapshot) => {
            console.log(snapshot);
        });
    });
}

export async function deleteProduct(id, store){
    store.dispatch(actions.fetching())
    await deleteDoc(doc(FBDB, "products", id));
}

// UPDATE STATE
export async function setProduct(field, value, store){
    store.dispatch(actions.setProductField(field, value))
}

export async function removeImageFromStorage(pathReference){
    const storage = getStorage();

    const desertRef = ref(storage, pathReference);

    deleteObject(desertRef).then((res) => {
        console.log(res)
    }).catch((error) => {
        console.log(error)
    });
}

const {actions, reducer} = createSlice({
    name: "product",
    initialState,
    reducers: {
        fetching:{
            reducer: (draft) => {
                draft.status = "pending";
                return;
            }
        },
        resolved: {
            reducer: (draft) => {
                draft.status = "resolved";
                return;
            }
        },
        rejected: {
            prepare: (error) => ({
                payload: error
            }),
            reducer: (draft, action) => {
                draft.status = "rejected";
                draft.error = action.payload;
                return;
            }
        },
        setProductState: {
            prepare: (product) => ({
                payload: product
            }),
            reducer: (draft, action) => {
                draft.product = action.payload;
                return;
            }
        },
        setProductField: {
            prepare: (field, value) => ({
                payload: {
                    field: field,
                    value: value
                }
            }),
            reducer: (draft, action) => {
                draft.product[action.payload.field] = action.payload.value;
                return;
            }
        }
    }
})

export const {fetching, resolved, rejected, setProductState, setProductField} = actions;

export default reducer;