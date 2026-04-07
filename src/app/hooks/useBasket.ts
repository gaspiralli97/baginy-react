import { useState } from "react";
import { CartItem } from "../../lib/types/search";
import { useGlobals } from "./useGlobals";


const useBasket = () =>{
    const { authMember } = useGlobals();

    // Har user uchun alohida key: login qilingan => "cartData_userId", yo'q => "cartData_guest"
    const cartKey = authMember ? `cartData_${authMember._id}` : "cartData_guest";

    const cartJson: string | null = localStorage.getItem(cartKey);
    const currentCart = cartJson ? JSON.parse(cartJson) : [];
    const [cartItems, setCartItems] = useState<CartItem[]>(currentCart);

    const onAdd = (input: CartItem) => {
        const exist: any = cartItems.find(
          (item: CartItem) => item._id === input._id
        );
        if (exist) {
          const cartUpdate = cartItems.map((item: CartItem) =>
            item._id === input._id
              ? { ...exist, quantity: exist.quantity + 1 }
              : item
          );
          setCartItems(cartUpdate);
          localStorage.setItem(cartKey, JSON.stringify(cartUpdate));
        } else {
          const cartUpdate = [...cartItems, { ...input }];
          setCartItems(cartUpdate);
          localStorage.setItem(cartKey, JSON.stringify(cartUpdate));
        }
      };

      const onRemove = (input: CartItem) => {
        const exist: any = cartItems.find(
          (item: CartItem) => item._id === input._id
        );
        if (exist.quantity === 1) {
          const cartUpdate = cartItems.filter(
            (item: CartItem) => item._id !== input._id
          );
          setCartItems(cartUpdate);
          localStorage.setItem(cartKey, JSON.stringify(cartUpdate));
        } else {
          const cartUpdate = cartItems.map((item: CartItem) =>
            item._id === input._id
              ? { ...exist, quantity: exist.quantity - 1 }
              : item
          );
          setCartItems(cartUpdate);
          localStorage.setItem(cartKey, JSON.stringify(cartUpdate));
        }
      };

      const onDelete = (input: CartItem) => {
        const cartUpdate = cartItems.filter(
          (item: CartItem) => item._id !== input._id
        );
        setCartItems(cartUpdate);
        localStorage.setItem(cartKey, JSON.stringify(cartUpdate));
      };

      const onDeleteAll = () => {
        setCartItems([]);
        localStorage.removeItem(cartKey);
      };

      return {
        cartItems,
        onAdd,
        onRemove,
        onDelete,
        onDeleteAll,
      };

};

export default useBasket;
