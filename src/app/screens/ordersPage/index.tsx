import { useEffect, useState} from "react";
import { SyntheticEvent } from "react";
import { Container, Stack, Box } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import LocationOnIcon from "@mui/icons-material/LocationOn"
import { useDispatch, } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setPausedOrders, setProcessOrders, setFinishedOrders } from "./slice";
import PausedOrders from "./PausedOrders";
import ProcessOrders from "./ProcessOrders";
import FinishedOrders from "./FinishedOrders";

import { Order, OrderInquiry } from "../../../lib/types/order";
import { OrderStatus } from "../../../lib/enums/order.enum";
import OrderService from "../../services/OrderService";
import { useGlobals } from "../../hooks/useGlobals";
import "../../../css/orders.css";
import { Height } from "@mui/icons-material";
import { useHistory } from "react-router-dom";
import { serverApi } from "../../../lib/config";
import { MemberType } from "../../../lib/enums/member.enum";

//Redux Slice & Selector
const actionDispatch= (dispatch:Dispatch)=>({
  setPausedOrders:(data:Order [])=> dispatch(setPausedOrders(data)),
  setProcessOrders:(data:Order [])=> dispatch(setProcessOrders(data)),
  setFinishedOrders:(data:Order [])=> dispatch(setFinishedOrders(data)),
});

export default function OrdersPage() {
  const{setPausedOrders, setProcessOrders, setFinishedOrders}= actionDispatch(useDispatch());
  const history= useHistory();
  const [value, setValue] = useState("1");
  const {orderBuilder, authMember} = useGlobals();
   
  const [orderInquiry, setOrderInquiry] = useState<OrderInquiry>({
    page: 1,
    limit: 5,
    orderStatus: OrderStatus.PAUSE,
  });
  
  useEffect(() => {
    const order = new OrderService();
    order
      .getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.PAUSE })
      .then((data) => {
        setPausedOrders(data);
        console.log("Paused Orders:", data);
      })
      .catch((err) => console.log(err));
    order
      .getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.PROCESS })
      .then((data) => {
        setProcessOrders(data);
      })
      .catch((err) => console.log(err));
    order
      .getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.FINISH })
      .then((data) => {
        setFinishedOrders(data);
      })
      .catch((err) => console.log(err));
  }, [orderInquiry, orderBuilder]);


  //Handlers

  const handleChange = (e:SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  if (!authMember) history.push('/');

  return (
    <div className="order-page">
      <Container className="order-container">
        <Stack className="order-left">
          <TabContext value={value}>
            <Box className="order-nav-frame">
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                  className={"table_list"}
                >
                  <Tab label="PAUSED ORDERS" value="1" />
                  <Tab label="PROCESS ORDERS" value="2" />
                  <Tab label="FINISHED ORDERS" value="3" />
                </Tabs>
              </Box>
            </Box>

            <Stack className={"order-main-content"}>
              <PausedOrders setValue={setValue}/>
              <ProcessOrders setValue={setValue}/>
              <FinishedOrders />
            </Stack>
          </TabContext>
        </Stack>
        <Stack className={"order-right"}>
          <Box className={"order-info-box"}>
            <Box className={"member-box"}>
              <div className={"order-user-img"}>
                <img
                  src={
                    authMember?.memberImage
                         ? `${serverApi}/${authMember.memberImage}`
                        : "/icons/default-user.svg"
                  }
                  className={"order-user-avatar"}
                />
              </div>
              <div className={"order-user-icon-box"}>
                <img
                  src={
                    authMember?.memberType === MemberType.SELLER
                         ? "/icons/restaurant.svg"
                         : "/icons/user-badge.svg"
                  }
                  className={"order-user-prof-img"}
                />
              </div>
              <span className={"order-user-name"}>
                 {""}
                 {authMember?.memberNick}
              </span>
              <span className={"order-user-prof"}>
                {authMember?.memberType}
              </span>
              <Box className={"liner"}></Box>
              <Box className="order-user-address">
                <LocationOnIcon className="location-icon" />
                <span>
                   {authMember?.memberAddress ? authMember.memberAddress : 'Do not exist'}
                </span>
              </Box>
            </Box>
          </Box>

          <Box className={"order-payment-box"}>
            <Box className={"payment-details"}>
              <div className={"payment-input-group"}>
                <label htmlFor="card-number" className={"payment-label"}>
                  
                </label>
                <input
                  type="text"
                  id="card-number"
                  placeholder="Card number"
                  className={"payment-input"}
                />
              </div>

              <div className={"payment-input-row"}>
                <div className={"payment-input-group"}>
                  <label htmlFor="expiry-date" className={"payment-label"}>
                   
                  </label>
                  <input
                    type="text"
                    id="expiry-date"
                    placeholder="MM/YY"
                    className={"payment-input2"}
                  />
                </div>
                <div className={"payment-input-group"}>
                  <label htmlFor="cvv" className={"payment-label"}>
                    
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    placeholder="CVV"
                    className={"payment-input2"}
                  />
                </div>
              </div>

              <div className={"payment-input-group"}>
                <label htmlFor="cardholder-name" className={"payment-label"}>
                  
                </label>
                <input
                 
                  type="text"
                  id="cardholder-name"
                  placeholder="Cardholder name"
                  className={"payment-input"}
                />
              </div>
            </Box>

            <Box className={"payment-icons"}>
              <img src={"/icons/master-card.svg"} alt="MasterCard" />
              <img src={"/icons/paypal-card.svg"} alt="PayPal" />
              <img src={"/icons/visa-card.svg"} alt="Visa" />{" "}
              <img src={"/icons/western-card.svg"} alt="western" />
            </Box>
          </Box>
        </Stack>
      </Container>
    </div>
  );
}