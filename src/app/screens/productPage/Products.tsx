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
import { ProductCollection, ProductVolume } from "../../../lib/enums/product.enum";
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
  const [productSearch, setProductSearch] = useState<ProductInquiry>({
      page:1,
      limit: 8,
      order:"createdAt",
      productCollection:ProductCollection.DISH,
      search:"",
  });
  const [searchText, setSearchText] = useState<string>("");

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
            <Box className="title">Burak Restaurant</Box>
            <Stack className="search">
              <input
                className="input-text"
                type={"search"}
                name={"singleResearch"}
                value={searchText}
                placeholder={"Type here"}
                
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e)=>{
                  if(e.key === "Enter") searchProductHandler();
                }}
              />
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
            <Stack className={"dishes-filter-box"} spacing={1}>
              <Button variant="contained" color={productSearch.order === "createdAt" ? "primary" : "secondary" } onClick={()=>searchOrderHandler("createdAt")}>
                New
              </Button>
              <Button variant="contained"  color={productSearch.order === "productPrice" ? "primary" : "secondary" } onClick={()=>searchOrderHandler("productPrice")}>
                Price
              </Button>
              <Button variant="contained"  color={productSearch.order === "productViews" ? "primary" : "secondary" } onClick={()=>searchOrderHandler("productViews")}>
                Views
              </Button>
            </Stack>
          </Stack>
          <Stack className={"list-category-section"} spacing={2}>
            <Stack className="prod-cat" direction="row" spacing={1}>
              <Button variant="contained" color={productSearch.productCollection === ProductCollection.OTHER ? "primary" :"secondary"} onClick={() =>searchCollectionHandler(ProductCollection.OTHER)}>
                Other
              </Button>
              <Button variant="contained" color={productSearch.productCollection === ProductCollection.DESSERT? "primary" :"secondary"} onClick={() =>searchCollectionHandler(ProductCollection.DESSERT)}>
                Dessert
              </Button>
              <Button variant="contained" color={productSearch.productCollection === ProductCollection.DRINK ? "primary" :"secondary"} onClick={() =>searchCollectionHandler(ProductCollection.DRINK)}>
                Drink
              </Button>
              <Button variant="contained" color={productSearch.productCollection === ProductCollection.SALAD ? "primary" :"secondary"} onClick={() =>searchCollectionHandler(ProductCollection.SALAD)}>
                Salad
              </Button>
              <Button variant="contained" color={productSearch.productCollection === ProductCollection.DISH ? "primary" :"secondary"} onClick={() =>searchCollectionHandler(ProductCollection.DISH)}>
                Dish
              </Button>
            </Stack>
            <Stack className="product-wrapper" direction="row" flexWrap="wrap" gap={2}>
                 {products.length !== 0 ? (
                     products.map((product:Product)=>{
                      const imagePath= `${serverApi}/${product.productImages[0]}`;
                      const sizeVolume=product.productCollection === ProductCollection.DRINK 
                          ? product.productVolume + "L" 
                          : product.productSize + " size";
                         return (
                            <Stack key={product._id} className="product-card" onClick={()=>chosenDishHandler(product._id)}>
                              <Stack
                                  className="product-img"
                                  
                                  sx={{
                                     backgroundImage:`url(${imagePath})`,
                                    backgroundSize: "cover",
                                 }}
                                >
                                  <div className="product-sale">{sizeVolume}</div>
                                   <Button 
                                   className="shop-btn"
                                   onClick={(e) =>{
                                    
                                    onAdd({
                                      _id:product._id,
                                      quantity:1,
                                      name:product.productName,
                                      price:product.productPrice,
                                      image:product.productImages[0],
                                    });
                                    e.stopPropagation();
                                   }}
                                   >
                                        <img src="/icons/shopping-cart.svg" alt="" />
                                   </Button>
                                   <Button className="view-btn" sx={{ right: "36px" }}>
                                        <Badge badgeContent={product.productViews} color="secondary">
                                            <RemoveRedEyeIcon sx={{ color:product.productViews === 0 ? "grey" : "white", }} />
                                        </Badge>
                                   </Button>
                              </Stack>
                              <Box className="product-desc">
                                   <span className="product-title">{product.productName}</span>
                                   <div className="product-desc">
                                       <MonetizationOnIcon /> {product.productPrice}
                                   </div>
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
        <Stack className="brand-title">Our Family Brands</Stack>
        <Stack className="brand-card" direction="row" spacing={2}>
          <Box className="card1" />
          <Box className="card2" />
          <Box className="card3" />
          <Box className="card4" />
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