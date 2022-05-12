import { createSlice } from "@reduxjs/toolkit";
import { doc, getDocs, query, collection, onSnapshot, addDoc } from "firebase/firestore";
import { FBDB } from "../Utils/firebaseConfig";


export async function getUsers(store) {
    
    /* const unsubscribe = onSnapshot(collection(FBDB, "users"), 
        (snapshot) => {
            snapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                store.dispatch(actions.addUserToList(doc.id, doc.data()))
        
            });
        },
        (error) => {
          // ...
        }); */


    store.dispatch(actions.fetching())
    const querySnapshot = await getDocs(collection(FBDB, "users"));
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        store.dispatch(actions.addUserToList(doc.id, doc.data()))

    });
    store.dispatch(actions.resolved())
}

export async function addUser(name, firstname, age){
    // Add a new document with a generated id.
    const docRef = await addDoc(collection(FBDB, "users"), {
        name: name,
        firstname: firstname,
        age: age
    })
} 

const initialState = {
    status: "void",
    users: {},
    error: null
};

const {actions, reducer} = createSlice({
    name: "firestore",
    initialState,
    reducers: {
        fetching:{
            reducer: (draft, action) => {
                draft.status = "pending";
                return;
            }
        },
        resolved: {
            reducer: (draft, action) => {
                draft.status = "resolved";
                return;
            }
        },
        rejected: {
            prepare: (error) => ({
                payload: {error}
            }),
            reducer: (draft, action) => {
                draft.status = "rejected";
                draft.error = action.payload.error;
                return;
            }
        },
        addUserToList: {
            prepare: (docId, data) => ({
                payload: {docId, data}
            }),
            reducer: (draft, action) => {
                if(draft.status === "pending"){
                    draft.users[action.payload.docId] = action.payload.data;
                    return;
                }
                return;
            }
        }
    }
})

export const {fetching, resolved, rejected} = actions;

export default reducer;