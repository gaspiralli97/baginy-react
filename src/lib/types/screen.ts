
/** REACT APP STATE */

import { Member } from "./member";
import { Order } from "./order";
import { Product } from "./product";

export interface AppRootState {
    homePage:HomePageState;
    productsPage:ProductsPageState;
    ordersPage: OrdersPageState;
}

/**Home Page */

export interface HomePageState{
    popularDishes:Product[];
    newDishes:Product[];
    topUsers:Member[];
}

/**Products Page */
  export interface ProductsPageState{
    seller:Member | null;
    chosenProduct:Product | null;
    products:Product[];
  }
/**Orders Page */

export interface OrdersPageState{
  pausedOrders:Order[];
  processOrders:Order[];
  finishedOrders:Order[];
}