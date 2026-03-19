
import { createSlice } from "@reduxjs/toolkit";
import { ProductsPageState } from "../../../lib/types/screen";

const initialState:ProductsPageState={
    seller:null,
    chosenProduct:null,
    products:[],
};

const productsPageSlice= createSlice({
    name:"productsPage",
    initialState,
    reducers:{
        setSeller:(state, action) =>{
            state.seller = action.payload;
        },

        setChosenProduct:(state, action) =>{
            state.chosenProduct = action.payload;
        },

        setProducts:(state, action) =>{
            state.products = action.payload;
        },
    },
});

export const {setSeller, setChosenProduct,  setProducts} =productsPageSlice.actions;

const ProductsPageReducer = productsPageSlice.reducer;

export default ProductsPageReducer;