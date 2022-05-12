import productReducer from '../Feature/product'
import gameReducer from '../Feature/game'
import { configureStore } from "@reduxjs/toolkit"


const store = configureStore({
  reducer: {
    product: productReducer,
    game: gameReducer
  }
})

export default store;