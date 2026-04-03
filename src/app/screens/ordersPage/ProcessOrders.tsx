import React, { useState } from "react";
import { Box, Stack, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import TabPanel from "@mui/lab/TabPanel";
import moment from "moment";
import { createSelector } from "@reduxjs/toolkit";
import { retrieveProcessOrders } from "./selector";
import { Order, OrderItem, OrderUpdateInput } from "../../../lib/types/order";
import { Product } from "../../../lib/types/product";
import { Messages, serverApi } from "../../../lib/config";
import { useSelector } from "react-redux";
import { OrderStatus } from "../../../lib/enums/order.enum";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import OrderService from "../../services/OrderService";
import { useGlobals } from "../../hooks/useGlobals";
import { T } from "../../../lib/types/common";
// Redux Slice & Selecto

const processOrdersRetriever = createSelector(
  retrieveProcessOrders,
  (processOrders) => ({ processOrders })
);
interface ProcessOrdersProps {
  setValue: (input: string) => void;
}
export default function ProcessOrders(props: ProcessOrdersProps) {
  const { processOrders } = useSelector(processOrdersRetriever);
  const { setValue } = props;
  const { authMember, setOrderBuilder } = useGlobals();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState<string>("");

  const finishOrderHandler = (e: T) => {
    setPendingOrderId(e.target.value);
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    setConfirmOpen(false);
    try {
      if (!authMember) throw new Error(Messages.error2);
      const input: OrderUpdateInput = { orderId: pendingOrderId, orderStatus: OrderStatus.FINISH };
      const order = new OrderService();
      await order.updateOrder(input);
      setValue("3");
      setOrderBuilder(new Date());
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };

  return (
    <TabPanel value="2">
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            padding: "12px 8px",
            minWidth: "360px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "18px", pb: 1 }}>
          Confirm Receipt
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily: "Poppins", fontSize: "14px", color: "#616164" }}>
            Have you received your order? This will mark the order as completed.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={() => setConfirmOpen(false)}
            sx={{
              fontFamily: "Poppins", fontSize: "13px", fontWeight: 500,
              textTransform: "none", borderRadius: "10px",
              border: "1.5px solid #E0E0E0", color: "#0C0C0C",
              px: 3, "&:hover": { background: "#F5F5F5" },
            }}
          >
            Not yet
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            sx={{
              fontFamily: "Poppins", fontSize: "13px", fontWeight: 600,
              textTransform: "none", borderRadius: "10px",
              background: "#0C0C0C", color: "#FFFFFF", px: 3,
              "&:hover": { background: "#333" },
              boxShadow: "none",
            }}
          >
            Yes, received
          </Button>
        </DialogActions>
      </Dialog>

      <Stack>
        {processOrders?.map((order: Order) => {
          return (
            <Box key={order._id} className="order-main-box">
              <Box className="order-box-scroll">
                {order?.orderItems?.map((item: OrderItem) => {
                  const product: Product = order.productData.filter(
                    (ele: Product) => item.productId === ele._id
                  )[0];

                  const imagePath = `${serverApi}/${product.productImages[0]}`;
                  return (
                    <Box key={item._id} className="orders-name-price">
                      <img src={imagePath} className="order-dish-img" alt="" />
                      <p className="title-dish">{product.productName}</p>
                      <Box className="price-box">
                        <p>${item.itemPrice}</p>
                        <img src="/icons/close.svg" alt="" />
                        <p>{item.itemQuantity}</p>
                        <img
                          src="/icons/pause.svg"
                          alt=""
                          style={{ marginLeft: "15px" }}
                        />
                        <p>${item.itemQuantity * item.itemPrice}</p>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
              <Box className="total-price-box">
                <Box className="box-total">
                  <p>Product price</p>
                  <p>${order.orderTotal - order.orderDelivery}</p>
                  <img
                    src={"/icons/plus.svg"}
                    alt=""
                    style={{
                      width: "18px",
                      height: "55px",
                    }}
                  />
                  <p>Delivery cost</p>
                  <p>${order.orderDelivery}</p>
                  <img
                    src={"/icons/pause.svg"}
                    alt=""
                    style={{
                      width: "18px",
                      height: "55px",
                    }}
                  />
                  <p>Total</p>
                  <p>${order.orderTotal}</p>
                </Box>
                <p className="data-compl">
                  {moment().format("YY-MM-DD HH:mm")}
                </p>
                <Button
                  variant="contained"
                  className="process-payment-button"
                  onClick={finishOrderHandler}
                  value={order._id}
                >
                  Verify for Fulfill
                </Button>
              </Box>
            </Box>
          );
        })}
        {!processOrders ||
          (processOrders.length === 0 && (
            <Box display="flex" flexDirection="row" justifyContent="center">
              <img
                src={"/icons/noimage-list.svg"}
                alt=""
                style={{ width: 300, height: 300 }}
              />
            </Box>
          ))}
      </Stack>
    </TabPanel>
  );
}
