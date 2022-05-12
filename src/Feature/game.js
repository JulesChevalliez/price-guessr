import { createSlice } from "@reduxjs/toolkit";
import { doc, collection, query, where, getDocs, limit } from "firebase/firestore";
import { useSelector } from "react-redux";
import { FBDB } from "../Utils/firebaseConfig";
import { selectGamesHistory } from "../Utils/selector";

const initialState = {
    status: "void",
    game_status: "void",
    error: null,
    history: [],
    product: {
        id: "",
        title: "",
        description: "",
        price: "",
        link: "",
        images: []
    },
    settings: {
        timer: 60,
        difficulty: "easy"
    }
};

export async function getRandomProduct(store, history){
    store.dispatch(actions.fetching());
    let docSnap;

    const docRef = doc(collection(FBDB, "products"));
    let queryConstraint = [];
    if(history.length > 0){
        queryConstraint.push(where('__name__', "not-in", history))
    }

    const q = query(collection(FBDB, "products"), where('__name__', ">=", docRef.id), limit(1), ...queryConstraint);
    docSnap = await getDocs(q);
    
    if(docSnap.size < 1){
        const docRef = doc(collection(FBDB, "products"));
        const q = query(collection(FBDB, "products"), where('__name__', "<", docRef.id), limit(1), ...queryConstraint);
        docSnap = await getDocs(q);
    }
    
    
    docSnap.forEach((doc) => {
        Object.entries(doc.data()).forEach((value, key) => {
            store.dispatch(actions.setProductField(value[0], value[1]))
        });
        store.dispatch(actions.setProductField("id", doc.id));
        store.dispatch(actions.resolved());
    })

}

export async function setGameStatusState(store, value){
    store.dispatch(actions.setGameStatus(value))
}

export async function setHistoryState(store, value){
    store.dispatch(actions.setHistory(value));
}

export async function setDifficultyState(store, value){
    store.dispatch(actions.setDifficulty(value))
}

const {actions, reducer} = createSlice({
    name: "game",
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
        },
        setGameStatus: {
            prepare: (value) => ({
                payload: value
            }),
            reducer: (draft, action) => {
                draft.game_status = action.payload;
                return;
            }
        },
        setHistory: {
            prepare: (value) => ({
                payload: value
            }),
            reducer: (draft, action) => {
                if(draft.history.length > 9){
                    draft.history.splice(0,1);
                }
                draft.history.push(action.payload);
                return;
            }
        },
        setDifficulty: {
            prepare: (value) => ({
                payload: value
            }),
            reducer: (draft, action) => {
                draft.settings.difficulty = action.payload;
                if(action.payload === "easy"){
                    draft.settings.timer = 60;
                }
                if(action.payload === "medium"){
                    draft.settings.timer = 30;
                }
                if(action.payload === "hard"){
                    draft.settings.timer = 15;
                }
                return;
            }
        }
    }
});

export const {fetching, resolved, rejected, setProductField, setGameStatus, setHistory} = actions;

export default reducer;