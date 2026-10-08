"use client";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../store/store";
import type { RootState } from "../store/rootReducer";
import {
  addToCart as addToCartThunk,
  fetchCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  type Cart,
} from "../store/slice/cartSlice";

interface AddToCartArgs {
  productId: string;
  size: string;
  color: string;
  quantity?: number;
}

export function useCart() {
  const dispatch = useDispatch<AppDispatch>();
  const cart = useSelector((state: RootState) => state.cart.cart);
  const isMutating = useSelector((state: RootState) => state.cart.isMutating);

  const itemCount =
    cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  const subtotal =
    cart?.items.reduce((sum, item) => sum + item.price * item.quantity, 0) ?? 0;

  return {
    cart,
    itemCount,
    subtotal,
    isMutating,
    addToCart: (payload: AddToCartArgs) => dispatch(addToCartThunk(payload)),
    fetchCart: () => dispatch(fetchCart()),
    updateCartItem: (itemId: string, quantity: number) =>
      dispatch(updateCartItem({ itemId, quantity })),
    removeCartItem: (itemId: string) => dispatch(removeCartItem(itemId)),
    clearCart: () => dispatch(clearCart()),
  };
}
