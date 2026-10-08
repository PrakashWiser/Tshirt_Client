"use client";

import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch } from "../store/store";
import type { RootState } from "../store/rootReducer";

import {
  addToCart as addToCartThunk,
  fetchCart,
  updateCartItem as updateCartItemThunk,
  removeCartItem as removeCartItemThunk,
  clearCart as clearCartThunk,
} from "../store/slice/cartSlice";

interface AddToCartArgs {
  productId: string;
  size: string;
  color: string;
  quantity?: number;
}

export function useCart() {
  const dispatch = useDispatch<AppDispatch>();

  const cart = useSelector(
    (state: RootState) => state.cart.cart,
  );

  const isMutating = useSelector(
    (state: RootState) => state.cart.isMutating,
  );

  const itemCount =
    cart?.items.reduce(
      (sum, item) => sum + item.quantity,
      0,
    ) ?? 0;

  const subtotal =
    cart?.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    ) ?? 0;

  const fetchCartData = useCallback(() => {
    return dispatch(fetchCart());
  }, [dispatch]);

  const addCartItem = useCallback(
    (payload: AddToCartArgs) => {
      return dispatch(addToCartThunk(payload));
    },
    [dispatch],
  );

  const updateCartItemData = useCallback(
    (itemId: string, quantity: number) => {
      return dispatch(
        updateCartItemThunk({
          itemId,
          quantity,
        }),
      );
    },
    [dispatch],
  );

  const removeCartItemData = useCallback(
    (itemId: string) => {
      return dispatch(removeCartItemThunk(itemId));
    },
    [dispatch],
  );

  const clearCartData = useCallback(() => {
    return dispatch(clearCartThunk());
  }, [dispatch]);

  return {
    cart,
    itemCount,
    subtotal,
    isMutating,
    addToCart: addCartItem,
    fetchCart: fetchCartData,
    updateCartItem: updateCartItemData,
    removeCartItem: removeCartItemData,
    clearCart: clearCartData,
  };
}