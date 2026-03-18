import React from "react";
import CardCover from '@mui/joy/CardCover';
import { CssVarsProvider } from "@mui/joy/styles";
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import CardOverflow from "@mui/joy/CardOverflow";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

import { Box, Container, Stack } from "@mui/material";
import { Card } from "@mui/joy";

import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrievePopularDishes } from "./selector";
import { Product } from "../../../lib/types/product";
import { serverApi } from "../../../lib/config";


//Redux Slice & Selector
const popularDishesRetriever= createSelector(
  retrievePopularDishes,
  (popularDishes)=>({popularDishes})
);

export default function PopularDishes(){
   const {popularDishes} = useSelector(popularDishesRetriever);
   console.log("popularDishes:", popularDishes);
   return(
       <div className="popular-dishes-frame">
          <Container>
              <Stack className="popular-section">
                     <Box className="category-title">Popular Dishes</Box>
                     <Stack className="cards-frame">
                         {popularDishes.length !== 0 ?(
                            popularDishes.map((product:Product) =>{
                              const imagePath=`${serverApi}/${product.productImages[0]}`;
                              return(
                                   <CssVarsProvider key={product._id}>
                                          <Card className={"card"}>
                                             <CardCover>
                                                 <img src={imagePath} alt="" />
                                             </CardCover>
                                             <CardCover className={"card-cover"}/>
                                             <CardContent sx={{ justifyContent: 'flex-end' }}>
                                                <Stack flexDirection={"row"} justifyContent={"space-between"}>
                                                   <Typography level="h2" fontSize="lg" mb={1} textColor="#fff">
                                                      {product.productName}
                                                   </Typography>
                                                   <Typography
                                                     sx={{
                                                        fontWeight:"md",
                                                        color:"neutral.300",
                                                        alignItems:"center",
                                                        display:"flex",
                                                     }}
                                                    >
                                                      {product.productViews}
                                                      <VisibilityIcon sx={{fontSize:25, marginLeft:"5px"}}/>
                                                    </Typography>
                                                </Stack>
                                             </CardContent>
                                             <CardOverflow sx={{
                                                 display:"flex",
                                                 gap:1.5,
                                                 py:1.5,
                                                 px:"var(--Card-padding)",
                                                 borderTop:"1px solid",
                                                 height:"60px",
                                             }}>
                                                <Typography startDecorator={<DescriptionOutlinedIcon/>}
                                                            textColor="neutral.300"
                                                 >
                                                   {product.productDesc}
                                                </Typography>
                                             </CardOverflow>
                                           </Card>
  
                                   </CssVarsProvider>
                            );
                         }) 
                         ):(
                             <Box className="no-data">New products are not available</Box>
                         )}
                     </Stack>
              </Stack>
          </Container>
       </div>
    );
}