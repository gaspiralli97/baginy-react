import React, { useState } from "react";
import { Box, Stack, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import TabPanel from "@mui/lab/TabPanel";
import moment from "moment";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { Product } from "../../../lib/types/product";
import { Messages, serverApi } from "../../../lib/config";
import { retrievePausedOrders } from "./selector";
import { Order, OrderItem, OrderUpdateInput } from "../../../lib/types/order";
import { useGlobals } from "../../hooks/useGlobals";
import { OrderStatus } from "../../../lib/enums/order.enum";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import OrderService from "../../services/OrderService";
import { T } from "../../../lib/types/common";

// Redux Slice & Selecto

const pausedOrdersRetriever = createSelector(
  retrievePausedOrders,
  (pausedOrders) => ({ pausedOrders })
);
interface PausedOrdersProps {
  setValue: (input: string) => void;
}
export default function PausedOrders(props: PausedOrdersProps) {
  const { setValue } = props;
  const { pausedOrders } = useSelector(pausedOrdersRetriever);
  const { authMember, setOrderBuilder } = useGlobals();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmType, setConfirmType] = useState<"delete" | "process">("delete");
  const [pendingOrderId, setPendingOrderId] = useState<string>("");

  /**Handlers**/
  const deleteOrderHandler = (e: T) => {
    setPendingOrderId(e.target.value);
    setConfirmType("delete");
    setConfirmOpen(true);
  };

  const processOrderHandler = (e: T) => {
    setPendingOrderId(e.target.value);
    setConfirmType("process");
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    setConfirmOpen(false);
    try {
      if (!authMember) throw new Error(Messages.error2);
      if (confirmType === "delete") {
        const input: OrderUpdateInput = { orderId: pendingOrderId, orderStatus: OrderStatus.DELETE };
        const order = new OrderService();
        await order.updateOrder(input);
        setOrderBuilder(new Date());
      } else {
        const input: OrderUpdateInput = { orderId: pendingOrderId, orderStatus: OrderStatus.PROCESS };
        const order = new OrderService();
        await order.updateOrder(input);
        setValue("2");
        setOrderBuilder(new Date());
      }
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };
  
  return (
    <TabPanel value="1">
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
          {confirmType === "delete" ? "Cancel Order" : "Proceed to Payment"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily: "Poppins", fontSize: "14px", color: "#616164" }}>
            {confirmType === "delete"
              ? "Are you sure you want to cancel this order? This action cannot be undone."
              : "Are you sure you want to proceed with the payment for this order?"}
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
            No, go back
          </Button>
          <Button
            onClick={handleConfirm}
            sx={{
              fontFamily: "Poppins", fontSize: "13px", fontWeight: 600,
              textTransform: "none", borderRadius: "10px",
              background: confirmType === "delete" ? "#0C0C0C" : "#0C0C0C",
              color: "#FFFFFF", px: 3,
              "&:hover": { background: "#333" },
            }}
            variant="contained"
          >
            {confirmType === "delete" ? "Yes, cancel" : "Yes, proceed"}
          </Button>
        </DialogActions>
      </Dialog>

      <Stack>
        {pausedOrders?.map((order: Order) => {
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
                      <img src={imagePath} className="order-dish-img" />
                      <p className="title-dish">{product.productName}</p>
                      <Box className="price-box">
                        <p>${item.itemPrice}</p>
                        <img
                          src="/icons/close.svg"
                          style={{
                            width: "18px",
                            height: "55px",
                          }}
                        />
                        <p>{item.itemQuantity}</p>
                        <img
                          src="/icons/pause.svg"
                          style={{
                            width: "18px",
                            height: "55px",
                          }}
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
                    style={{
                      width: "18px",
                      height: "55px",
                    }}
                  />
                  <p>Delivery cost</p>
                  <p>${order.orderDelivery}</p>
                  <img
                    src={"/icons/pause.svg"}
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
                  className="cancel-button"
                  onClick={deleteOrderHandler}
                  value={order._id}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  className="payment-button"
                  onClick={processOrderHandler}
                  value={order._id}
                >
                  Payment
                </Button>
              </Box>
            </Box>
          );
        })}
        {!pausedOrders ||
          (pausedOrders.length === 0 && (
            <Box display="flex" flexDirection="row" justifyContent="center">
              <img
                src={"/icons/noimage-list.svg"}
                style={{ width: 300, height: 300 }}
              />
            </Box>
          ))}
      </Stack>
    </TabPanel>
  );
}
