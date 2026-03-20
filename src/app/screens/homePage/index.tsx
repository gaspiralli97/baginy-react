import React, { useEffect } from "react";
import { Container } from "@mui/material";
import NewDishes from "./NewDishes";
import Advertisement from "./Advertisement";
import ActiveUsers from "./ActiveUsers";
import Events from "./Events";
import PopularDishes from "./PopularDishes";
import Statistics from "./Statistics";
import { useDispatch, } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setNewDishes, setPopularDishes, setTopUsers } from "./slice";
import { Product } from "../../../lib/types/product";
import ProductService from "../../services/ProductService";
import { ProductCollection, ProductMode } from "../../../lib/enums/product.enum";
import "../../../css/home.css";
import { Member } from "../../../lib/types/member";
import MemberService from "../../services/MemberService";
import { useGlobals } from "../../hooks/useGlobals";

//Redux Slice & Selector
const actionDispatch= (dispatch:Dispatch)=>({
  setPopularDishes:(data:Product [])=> dispatch(setPopularDishes(data)),
  setNewDishes:(data:Product [])=> dispatch(setNewDishes(data)),
  setTopUsers:(data:Member [])=> dispatch(setTopUsers(data)),
});



export default function HomePage() {
  const {setPopularDishes, setNewDishes, setTopUsers} = actionDispatch(useDispatch());
  const {goldMode} = useGlobals();

  //console.log(process.env.REACT_APP_API_URL);

 useEffect(()=>{
    //backend derver data fetch=>data
    const product= new ProductService();
    const currentMode = goldMode ? ProductMode.PREMIUM : ProductMode.ELEGANT;

    product.getProducts({
      page:1,
      limit: 4,
      order:"productViews",
      productCollection:ProductCollection.TRAVEL,
      productMode: currentMode,
    })
    .then((data) =>{

      setPopularDishes(data);
    })
    .catch((err)=>console.log(err));


    product.getProducts({
      page:1,
      limit: 4,
      order:"createdAt",
      productMode: currentMode,
      //productCollection:ProductCollection.DISH,
    })
    .then((data) =>{

      setNewDishes(data);
    })
    .catch((err)=>console.log(err));

   const member = new MemberService();
   member
   .getTopUsers()
   .then((data) =>{
      setTopUsers(data);
   })
   .catch((err) =>console.log(err));
}, [goldMode]);


 
  return( 
  <div className={"homepage"}>
      <Statistics/>
      <PopularDishes/>
      <NewDishes/>
      <Advertisement/>
      <ActiveUsers/>
      <Events/>
  </div>
  );
}