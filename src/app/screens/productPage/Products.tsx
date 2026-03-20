import React, { ChangeEvent, useEffect, useState } from "react";
import {Box,Button,Container,InputBase,Stack,} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import Badge from "@mui/material/Badge";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { useDispatch, useSelector} from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setProducts} from "./slice";
import { Product, ProductInquiry } from "../../../lib/types/product";
import { retrieveProducts } from "./selector";
import { createSelector} from "reselect";
import ProductService from "../../services/ProductService";
import { ProductCollection, ProductMode} from "../../../lib/enums/product.enum";
import { useGlobals } from "../../hooks/useGlobals";
import { serverApi } from "../../../lib/config";
import { useHistory } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";

//Redux Slice & Selector
const actionDispatch= (dispatch:Dispatch)=>({
  setProducts:(data:Product [])=> dispatch(setProducts(data)),
  
});

const productsRetriever =createSelector(retrieveProducts, (products)=>({products}));


interface ProductsProps{
  onAdd:(item:CartItem) =>void;
}

export default function Products(props:ProductsProps) {
  const{onAdd}= props;
  const {setProducts} = actionDispatch(useDispatch());
  const {products} = useSelector(productsRetriever);
  const {goldMode} = useGlobals();
  const [productSearch, setProductSearch] = useState<ProductInquiry>({
      page:1,
      limit: 8,
      order:"createdAt",
      productCollection:ProductCollection.BUSINESS,
      productMode: goldMode ? ProductMode.PREMIUM : ProductMode.ELEGANT,
      search:"",
  });
  const [searchText, setSearchText] = useState<string>("");
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("searchHistory") || "[]"); } catch { return []; }
  });
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const history =useHistory();

  useEffect(()=>{
    //backend derver data fetch=>data
    const product= new ProductService();
    product
    .getProducts(productSearch)
    .then((data) =>{
      setProducts(data);
    })
    .catch((err)=>console.log(err));
}, [productSearch]);

useEffect(()=>{
    //backend derver data fetch=>data
    if (searchText === "") {
      productSearch.search = "";
      setProductSearch({... productSearch});
    }
}, [searchText]);

useEffect(()=>{
    productSearch.page = 1;
    productSearch.productMode = goldMode ? ProductMode.PREMIUM : ProductMode.ELEGANT;
    setProductSearch({...productSearch});
}, [goldMode]);

// handler

const searchCollectionHandler =(collection:ProductCollection) => {
  productSearch.page = 1;
  productSearch.productCollection = collection;
  setProductSearch({...productSearch});

};

const searchOrderHandler =(order:string) => {
  productSearch.page = 1;
  productSearch.order = order;
  setProductSearch({...productSearch});

};

const searchProductHandler = () =>{
  productSearch.search = searchText;
  setProductSearch({...productSearch});
  if (searchText.trim()) {
    const updated = [searchText, ...searchHistory.filter(h => h !== searchText)].slice(0, 8);
    setSearchHistory(updated);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
  }
  setShowSuggestions(false);
};

const paginationHandler = (e:ChangeEvent<any>, value:number) =>{
  productSearch.page= value;
  setProductSearch({...productSearch});
};

const chosenDishHandler = (id:string) =>{
  history.push(`/products/${id}`);
};

  return (
    <div className="products">
      <Container>
        <Stack flexDirection="column" alignItems={"center"}>
          <Stack className={"avatar-big-box"}>
            <Box className="title">Baginy Collection</Box>
            <Stack className="search" style={{ position: "relative" }}>
              <input
                className="input-text"
                type={"search"}
                name={"singleResearch"}
                value={searchText}
                placeholder={"Type here"}
                autoComplete={"off"}
                onChange={(e) => setSearchText(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                onKeyDown={(e)=>{
                  if(e.key === "Enter") searchProductHandler();
                }}
              />
              {showSuggestions && searchHistory.filter(h => h.toLowerCase().includes(searchText.toLowerCase())).length > 0 && (
                <ul className="search-suggestions">
                  {searchHistory
                    .filter(h => h.toLowerCase().includes(searchText.toLowerCase()))
                    .map((h, i) => (
                      <li key={i} onMouseDown={() => { setSearchText(h); setShowSuggestions(false); }}>
                        {h}
                      </li>
                    ))}
                </ul>
              )}
              <Button
                endIcon={<SearchIcon />}
                variant="contained"
                onClick={searchProductHandler}
                sx={{
                  height: 28,
                  borderRadius: "18px",
                  backgroundColor: "#D7B586",
                  color: "#fff",
                  fontSize: "10px",
                }}
              >
                Search
              </Button>
            </Stack>
          </Stack>
          <Stack className={"dishes-filter-section"}>
            <Stack className={"dishes-filter-box"} direction="row" spacing={1}>
              <span className={productSearch.order === "createdAt" ? "filter-text active" : "filter-text"} onClick={()=>searchOrderHandler("createdAt")}>New</span>
              <span className={productSearch.order === "productPrice" ? "filter-text active" : "filter-text"} onClick={()=>searchOrderHandler("productPrice")}>Price</span>
              <span className={productSearch.order === "productViews" ? "filter-text active" : "filter-text"} onClick={()=>searchOrderHandler("productViews")}>Views</span>
            </Stack>
          </Stack>
          <Stack className={"list-category-section"} spacing={2}>
            <Stack className="prod-cat" direction="row" spacing={1}>
              <span className={productSearch.productCollection === ProductCollection.BUSINESS ? "filter-text active" : "filter-text"} onClick={() =>searchCollectionHandler(ProductCollection.BUSINESS)}>Business</span>
              <span className={productSearch.productCollection === ProductCollection.SPORT ? "filter-text active" : "filter-text"} onClick={() =>searchCollectionHandler(ProductCollection.SPORT)}>Sport</span>
              <span className={productSearch.productCollection === ProductCollection.TRAVEL ? "filter-text active" : "filter-text"} onClick={() =>searchCollectionHandler(ProductCollection.TRAVEL)}>Travel</span>
              <span className={productSearch.productCollection === ProductCollection.SPECIAL ? "filter-text active" : "filter-text"} onClick={() =>searchCollectionHandler(ProductCollection.SPECIAL)}>Special</span>
            </Stack>
            <Stack className="product-wrapper" direction="row" flexWrap="wrap" gap={2}>
                 {products.length !== 0 ? (
                     products.map((product:Product)=>{
                      const imagePath= `${serverApi}/${product.productImages[0]}`;
                         return (
                            <Stack key={product._id} className="product-card" onClick={()=>chosenDishHandler(product._id)}>
                              <Stack
                                  className="product-img"
                                  sx={{
                                    backgroundImage:`url(${imagePath})`,
                                    backgroundSize: "cover",
                                  }}
                                >
                                  <Box className="card-actions">
                                    <Button
                                      className="view-btn"
                                      disableRipple
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Badge badgeContent={product.productViews} color="secondary">
                                        <RemoveRedEyeIcon sx={{ fontSize: 18, color: "#0C0C0C" }} />
                                      </Badge>
                                    </Button>
                                    <Button
                                      className="shop-btn"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onAdd({
                                          _id: product._id,
                                          quantity: 1,
                                          name: product.productName,
                                          price: product.productPrice,
                                          image: product.productImages[0],
                                        });
                                      }}
                                    >
                                      <img src="/icons/shopping-cart.svg" alt="" style={{ width: 18, filter: "invert(1)" }} />
                                    </Button>
                                  </Box>
                              </Stack>
                              <Box className="product-desc">
                                   <span className="product-title">{product.productName}</span>
                                   <span className="product-price">${product.productPrice}</span>
                              </Box>
                            </Stack>
                         );
                     })
              ): (
                <Box className="no-data">New products are not available</Box>
              )}
            </Stack>
          </Stack>
          <Stack className="pagi-section">
            <Pagination
              count={products.length !== 0 ? productSearch.page + 1 : productSearch.page}
              page={productSearch.page}
              renderItem={(item) => (
                <PaginationItem
                  components={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                  {...item}
                  color={"secondary"}
                />
              )}
              onChange={paginationHandler}
            />
          </Stack>
        </Stack>
      </Container>

      <div className="brand-logo">
        <Stack className="brand-title">Our Staff</Stack>
        <Stack className="brand-card" direction="row" spacing={2}>
          <Box className="card1" />
          <Box className="card2" />
          <Box className="card3" />
          <Box className="card4" />
          <Box className="card5" />
        </Stack>
      </div>

      <div className="adress">
        <Container>
          <Stack className="address-area" spacing={2}>
            <Box className="title">Our Address</Box>
            <iframe
              
              style={{ marginTop: 60 }}
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d25333.534506202912!2d126.6818512!3d37.467997849999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2skr!4v1763571622699!5m2!1sen!2skr"
              width="100%"
              height="500"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Stack>
        </Container>
      </div>
    </div>
  );
}