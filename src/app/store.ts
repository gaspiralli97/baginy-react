import { configureStore, ThunkAction, Action, getDefaultMiddleware } from "@reduxjs/toolkit";
import HomePageReducer from "./screens/homePage/slice";
import reduxLogger from "redux-logger";

import ProductsPageReducer from "./screens/productPage/slice";
import OrdersPageReducer from "./screens/ordersPage/slice";

export const store = configureStore({
  middleware:(getDefaultMiddleware)=>
    //@ts-ignore
    getDefaultMiddleware().concat(reduxLogger),
  reducer: {
    homePage:HomePageReducer,
    productsPage:ProductsPageReducer,
    ordersPage:OrdersPageReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
