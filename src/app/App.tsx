import React, { useEffect, useState } from "react";

import { Box, Button, Container, Stack, Typography } from "@mui/material";import { orange } from "@mui/material/colors";
import { Link, Route, Switch, useLocation } from "react-router-dom";
import HomePage from "./screens/homePage";
import ProductsPage from "./screens/productPage";
import OrdersPage  from "./screens/ordersPage";
import UserPage  from "./screens/userPage";
import  HelpPage  from "./screens/helpPage";
import HomeNavbar from "./components/headers/HomeNavbar";
import  OtherNavbar from "./components/headers/OtherNavbar";
import Footer from "./components/footer";
import "../css/app.css";
import "../css/navbar.css";
import "../css/footer.css";
import Test from "./screens/Test";

import useBasket from "./hooks/useBasket";
import AuthenticationModal from "./components/auth";
import { T } from "../lib/types/common";
import { sweetErrorHandling, sweetTopSuccessAlert } from "../lib/sweetAlert";
import { Message } from "@mui/icons-material";
import { Messages } from "../lib/config";
import MemberService from "./services/MemberService";
import { GlobalContext, useGlobals } from "./hooks/useGlobals";


function App() {
  const location =useLocation();
  const {setAuthMember, goldMode}= useGlobals();

  useEffect(() => {
    if (goldMode) {
      document.body.classList.add("gold-mode");
    } else {
      document.body.classList.remove("gold-mode");
    }
  }, [goldMode]);
  const {cartItems, onAdd, onRemove, onDelete, onDeleteAll } = useBasket();
  const [signupOpen, setSignupOpen] = useState<boolean>(false);
  const [loginOpen, setLoginOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  //Handlers

  const handleSignupClose = () => setSignupOpen(false);
  const handleLoginClose = () => setLoginOpen(false);

  const handleLogoutClick = (e: React.MouseEvent<HTMLElement>) =>{
    setAnchorEl(e.currentTarget);
  }

  const handleCloseLogout =()=> setAnchorEl(null);

  const handleLogoutRequest = async ()=>{
    try{
       const member = new MemberService();
       await member.logout();
       await sweetTopSuccessAlert("success", 700);
       setAuthMember(null);
    }catch(err) {
      console.log(err);
      sweetErrorHandling(Messages.error1);
    }
  };

  

  return ( 
    <>
       {location.pathname === "/" 
         ? <HomeNavbar 
            cartItems={cartItems}
            onRemove={onRemove} 
            onDelete={onDelete} 
            onDeleteAll={onDeleteAll} 
            onAdd={onAdd} 
            setSignupOpen={setSignupOpen}
            setLoginOpen={setLoginOpen}
            anchorEl={anchorEl}
            handleLogoutClick={handleLogoutClick}
            handleCloseLogout={handleCloseLogout}
            handleLogoutRequest={handleLogoutRequest}
         />
         : <OtherNavbar 
            cartItems={cartItems}
            onRemove={onRemove} 
            onDelete={onDelete} 
            onDeleteAll={onDeleteAll} 
            onAdd={onAdd} 
            setSignupOpen={setSignupOpen}
            setLoginOpen={setLoginOpen}
            anchorEl={anchorEl}
            handleLogoutClick={handleLogoutClick}
            handleCloseLogout={handleCloseLogout}
            handleLogoutRequest={handleLogoutRequest}
         />
         }
        <Switch>
          <Route path="/products">
            <ProductsPage onAdd={onAdd} />
          </Route>
          <Route path="/orders">
            <OrdersPage />
          </Route>
          <Route path="/member-page">
            <UserPage />
          </Route>
          <Route path="/help">
            <HelpPage />
          </Route>
          <Route path="/">
          
            <HomePage />
          </Route>
        </Switch>
        <Footer/>
        <AuthenticationModal 
          signupOpen={signupOpen}
          loginOpen={loginOpen}
          handleSignupClose={handleSignupClose}
          handleLoginClose={handleLoginClose}

        />
      </>
  );
}




export default App;