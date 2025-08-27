import { createContext, useContext, useReducer, ReactNode } from "react";
import { Product } from "@shared/schema";

interface CartItem {
  product: Product;
  quantity: number;
  size: string;
}

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: { product: Product; size: string; quantity?: number } }
  | { type: "REMOVE_ITEM"; payload: { productId: string; size: string } }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; size: string; quantity: number } }
  | { type: "CLEAR_CART" };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addToCart: (product: Product, size: string, quantity?: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  getCartCount: () => number;
} | null>(null);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, size, quantity = 1 } = action.payload;
      const existingItemIndex = state.items.findIndex(
        item => item.product.id === product.id && item.size === size
      );

      let newItems;
      if (existingItemIndex >= 0) {
        newItems = [...state.items];
        newItems[existingItemIndex].quantity += quantity;
      } else {
        newItems = [...state.items, { product, size, quantity }];
      }

      const total = newItems.reduce(
        (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
        0
      );

      return { items: newItems, total };
    }

    case "REMOVE_ITEM": {
      const { productId, size } = action.payload;
      const newItems = state.items.filter(
        item => !(item.product.id === productId && item.size === size)
      );

      const total = newItems.reduce(
        (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
        0
      );

      return { items: newItems, total };
    }

    case "UPDATE_QUANTITY": {
      const { productId, size, quantity } = action.payload;
      if (quantity <= 0) {
        return cartReducer(state, { type: "REMOVE_ITEM", payload: { productId, size } });
      }

      const newItems = state.items.map(item =>
        item.product.id === productId && item.size === size
          ? { ...item, quantity }
          : item
      );

      const total = newItems.reduce(
        (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
        0
      );

      return { items: newItems, total };
    }

    case "CLEAR_CART":
      return { items: [], total: 0 };

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  const addToCart = (product: Product, size: string, quantity = 1) => {
    dispatch({ type: "ADD_ITEM", payload: { product, size, quantity } });
  };

  const removeFromCart = (productId: string, size: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { productId, size } });
  };

  const updateQuantity = (productId: string, size: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, size, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const getCartCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        state,
        dispatch,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
