"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronLeft,
  MapPin,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "@/app/store/rootReducer";
import type { AppDispatch } from "@/app/store/store";

import {
  createAddress,
  deleteAddress,
  fetchAddresses,
  updateAddress,
  type Address,
  type CreateAddressPayload,
} from "@/app/store/slice/addressSlice";

import { createOrder, type PaymentMethod } from "@/app/store/slice/orderSlice";
import { useCart } from "@/app/utils/useCart";
import InputField from "@/app/common/CommonInput";

const emptyAddress: CreateAddressPayload = {
  fullName: "",
  mobile: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
  isDefault: false,
};

function CheckoutSkeleton() {
  return (
    <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
          <div className="mt-5 space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-lg bg-gray-100"
              />
            ))}
          </div>
          <div className="mt-4 h-12 animate-pulse rounded-lg bg-gray-100" />
        </div>
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
          <div className="mt-4 space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-lg bg-gray-100"
              />
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <div className="h-6 w-36 animate-pulse rounded bg-gray-200" />
          <div className="mt-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="h-16 w-14 animate-pulse rounded bg-gray-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
                  <div className="h-3 w-2/3 animate-pulse rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 h-12 animate-pulse rounded-lg bg-gray-100" />
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSection() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { cart, subtotal, fetchCart } = useCart();
  const items = cart?.items ?? [];

  const {
    addresses,
    isLoading: addressLoading,
    isMutating,
    error: addressError,
  } = useSelector((state: RootState) => state.address);
  const {
    order,
    isMutating: orderMutating,
    error: orderError,
  } = useSelector((state: RootState) => state.order);

  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [form, setForm] = useState<CreateAddressPayload>(emptyAddress);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    void fetchCart();
    void dispatch(fetchAddresses());
  }, [dispatch, fetchCart]);

  useEffect(() => {
    if (!showSuccessModal) return;

    const redirectTimer = window.setTimeout(() => {
      router.push("/orders");
    }, 3000);

    return () => window.clearTimeout(redirectTimer);
  }, [router, showSuccessModal]);

  const shippingCharge = subtotal > 2000 ? 0 : 100;
  const totalAmount = subtotal + shippingCharge;
  const selectedAddress =
    addresses.find((address) => address._id === selectedAddressId) ??
    addresses.find((address) => address.isDefault) ??
    addresses[0];
  const resolvedSelectedAddressId = selectedAddress?._id ?? "";

  const openCreateAddress = () => {
    setEditingAddress(null);
    setForm({ ...emptyAddress });
    setFormError("");
    setShowAddressModal(true);
  };

  const openEditAddress = (address: Address) => {
    setEditingAddress(address);
    setForm({ ...address });
    setFormError("");
    setShowAddressModal(true);
  };

  const closeAddressModal = () => {
    if (isMutating) return;
    setShowAddressModal(false);
    setEditingAddress(null);
    setForm({ ...emptyAddress });
    setFormError("");
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSaveAddress = async () => {
    setFormError("");
    if (Object.values(form).some((v) => typeof v === "string" && !v.trim())) {
      setFormError("Please fill all address fields.");
      return;
    }
    try {
      if (editingAddress) {
        const updated = await dispatch(
          updateAddress({ id: editingAddress._id, data: form }),
        ).unwrap();
        setSelectedAddressId(updated._id);
      } else {
        const created = await dispatch(createAddress(form)).unwrap();
        setSelectedAddressId(created._id);
      }
      setShowAddressModal(false);
      setEditingAddress(null);
      setForm({ ...emptyAddress });
    } catch (error) {
      setFormError(
        typeof error === "string" ? error : "Failed to save address.",
      );
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await dispatch(deleteAddress(id)).unwrap();
      if (selectedAddressId === id) {
        const remaining = addresses.filter((a) => a._id !== id);
        setSelectedAddressId(remaining[0]?._id ?? "");
      }
    } catch {}
  };

  const handlePlaceOrder = async () => {
    if (!resolvedSelectedAddressId || orderMutating) return;
    try {
      await dispatch(
        createOrder({
          shippingAddressId: resolvedSelectedAddressId,
          paymentMethod,
        }),
      ).unwrap();
      setShowSuccessModal(true);
    } catch {}
  };

  if (items.length === 0) {
    return (
      <section className="min-h-screen bg-[#F4F7F5] py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg bg-white py-20 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Your cart is empty
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Add some products before checkout.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-flex rounded bg-[#1a1a1a] px-6 py-3 text-sm font-semibold text-white"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="min-h-screen w-full bg-[#F4F7F5] py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/cart"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50"
            >
              <ChevronLeft size={18} />
            </Link>
            <h1 className="text-lg font-bold tracking-wider text-gray-900 sm:text-xl">
              CHECKOUT
            </h1>
          </div>

          {addressLoading ? (
            <CheckoutSkeleton />
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
              <div className="space-y-6">
                {/* Address Section */}
                <div className="rounded-lg bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-gray-900 sm:text-lg">
                        DELIVERY ADDRESS
                      </h2>
                      <p className="mt-1 text-xs text-gray-500">
                        Select where you want your order delivered.
                      </p>
                    </div>
                    <MapPin size={20} className="text-gray-500" />
                  </div>

                  {addresses.length === 0 ? (
                    <div className="mt-5 rounded-lg border border-dashed border-gray-300 p-8 text-center">
                      <MapPin size={28} className="mx-auto text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">
                        No delivery address found.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-5 space-y-3">
                      {addresses.map((address) => {
                        const selected = address._id === resolvedSelectedAddressId;
                        return (
                          <div
                            key={address._id}
                            onClick={() => setSelectedAddressId(address._id)}
                            className={`cursor-pointer rounded-lg border p-4 transition ${
                              selected
                                ? "border-gray-900 bg-gray-50"
                                : "border-gray-200 bg-white hover:border-gray-400"
                            }`}
                          >
                            <div className="flex gap-3">
                              <div
                                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                                  selected
                                    ? "border-gray-900"
                                    : "border-gray-300"
                                }`}
                              >
                                {selected && (
                                  <div className="h-2.5 w-2.5 rounded-full bg-gray-900" />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <p className="text-sm font-semibold text-gray-900">
                                      {address.fullName}
                                    </p>
                                    <p className="mt-0.5 text-xs text-gray-500">
                                      {address.mobile}
                                    </p>
                                  </div>
                                  {address.isDefault && (
                                    <span className="rounded bg-gray-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-gray-700">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <p className="mt-2 text-sm leading-5 text-gray-600">
                                  {address.address}
                                  <br />
                                  {address.city}, {address.state} -{" "}
                                  {address.pincode}
                                  <br />
                                  {address.country}
                                </p>
                                <div className="mt-3 flex items-center gap-4">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openEditAddress(address);
                                    }}
                                    className="inline-flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-black"
                                  >
                                    <Pencil size={12} /> EDIT
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      void handleDeleteAddress(address._id);
                                    }}
                                    className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 size={12} /> DELETE
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {addressError && (
                    <div className="mt-4 rounded-lg bg-red-50 p-3 text-xs text-red-600">
                      {addressError}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={openCreateAddress}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-400 bg-white px-4 py-3 text-sm font-semibold text-gray-800 transition hover:border-gray-900 hover:bg-gray-50"
                  >
                    <Plus size={16} /> ADD NEW ADDRESS
                  </button>
                </div>

                {/* Payment Section */}
                <div className="rounded-lg bg-white p-5 shadow-sm">
                  <h2 className="text-base font-bold text-gray-900 sm:text-lg">
                    PAYMENT METHOD
                  </h2>
                  <div className="mt-4 space-y-3">
                    {(["cod", "razorpay"] as const).map((method) => (
                      <label
                        key={method}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${
                          paymentMethod === method
                            ? "border-gray-900 bg-gray-50"
                            : "border-gray-200"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method}
                          checked={paymentMethod === method}
                          onChange={() => setPaymentMethod(method)}
                          className="h-4 w-4 accent-black"
                        />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {method === "cod" ? "Cash on Delivery" : "Razorpay"}
                          </p>
                          <p className="mt-0.5 text-xs text-gray-500">
                            {method === "cod"
                              ? "Pay when your order arrives."
                              : "Pay securely online."}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
                <div className="rounded-lg bg-white p-5 shadow-sm">
                  <h2 className="text-base font-bold text-gray-900 sm:text-lg">
                    ORDER SUMMARY
                  </h2>
                  <div className="mt-4 space-y-4">
                    {items.map((item) => {
                      const variant = item.product?.variants?.find(
                        (v) => v.size === item.size && v.color === item.color,
                      );
                      const image =
                        variant?.images?.[0] ?? item.product?.images?.[0] ?? "";
                      return (
                        <div key={item._id} className="flex gap-3">
                          <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded bg-gray-100">
                            {image && (
                              <Image
                                src={image}
                                alt={item.product?.name ?? ""}
                                fill
                                sizes="56px"
                                className="object-cover"
                              />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-2 text-xs font-medium text-gray-900">
                              {item.product?.name}
                            </p>
                            <p className="mt-1 text-[11px] text-gray-500">
                              {item.size} / {item.color}
                            </p>
                            <div className="mt-1 flex items-center justify-between">
                              <span className="text-xs text-gray-500">
                                Qty: {item.quantity}
                              </span>
                              <span className="text-sm font-semibold text-gray-900">
                                Rs{" "}
                                {(item.price * item.quantity).toLocaleString()}
                                .00
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="my-5 border-t border-gray-100" />
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-medium text-gray-900">
                        Rs {subtotal.toLocaleString()}.00
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Shipping</span>
                      <span className="font-medium text-gray-900">
                        {shippingCharge === 0
                          ? "FREE"
                          : `Rs ${shippingCharge.toLocaleString()}.00`}
                      </span>
                    </div>
                  </div>
                  <div className="my-4 border-t border-gray-200" />
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-gray-900">
                      TOTAL
                    </span>
                    <span className="text-lg font-bold text-red-600">
                      Rs {totalAmount.toLocaleString()}.00
                    </span>
                  </div>

                  {orderError && (
                    <div className="mt-4 rounded-lg bg-red-50 p-3 text-xs text-red-600">
                      {orderError}
                    </div>
                  )}

                  <button
                    type="button"
                    disabled={!resolvedSelectedAddressId || orderMutating}
                    onClick={() => void handlePlaceOrder()}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#1a1a1a] px-4 py-3.5 text-sm font-semibold tracking-wide text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {orderMutating ? (
                      "PLACING ORDER..."
                    ) : (
                      <>
                        PLACE ORDER <Check size={16} />
                      </>
                    )}
                  </button>
                  <Link
                    href="/cart"
                    className="mt-3 flex w-full items-center justify-center rounded-lg border border-gray-900 bg-white px-4 py-3 text-sm font-semibold tracking-wide text-gray-900 transition hover:bg-gray-50"
                  >
                    BACK TO CART
                  </Link>
                </div>

                {selectedAddress && (
                  <div className="rounded-lg bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2">
                      <MapPin size={15} />
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-900">
                        Delivering to
                      </p>
                    </div>
                    <p className="mt-2 text-sm font-semibold">
                      {selectedAddress.fullName}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      {selectedAddress.city}, {selectedAddress.state} -{" "}
                      {selectedAddress.pincode}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Address Modal */}
      <AnimatePresence>
        {showAddressModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={closeAddressModal}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white p-5 shadow-2xl sm:p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {editingAddress ? "EDIT ADDRESS" : "ADD NEW ADDRESS"}
                  </h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Enter your delivery information.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeAddressModal}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  <X size={17} />
                </button>
              </div>

              {formError && (
                <div className="mt-4 rounded-lg bg-red-50 p-3 text-xs text-red-600">
                  {formError}
                </div>
              )}

              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <InputField
                  name="fullName"
                  placeholder="Enter your full name"
                  value={form.fullName}
                  onChange={handleFormChange}
                  required
                />
                <InputField
                  name="mobile"
                  type="tel"
                  placeholder="Enter your mobile number"
                  value={form.mobile}
                  onChange={handleFormChange}
                  required
                />
                <div className="sm:col-span-2">
                  <InputField
                    name="address"
                    placeholder="Enter your address"
                    value={form.address}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <InputField
                  name="city"
                  placeholder="Enter your city"
                  value={form.city}
                  onChange={handleFormChange}
                  required
                />
                <InputField
                  name="state"
                  placeholder="Enter your state"
                  value={form.state}
                  onChange={handleFormChange}
                  required
                />
                <InputField
                  name="pincode"
                  type="text"
                  placeholder="Enter your pincode"
                  value={form.pincode}
                  onChange={handleFormChange}
                  required
                />
                <InputField
                  name="country"
                  placeholder="Enter your country"
                  value={form.country}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <label className="mt-5 flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={form.isDefault}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      isDefault: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 accent-black"
                />
                Set as default address
              </label>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={closeAddressModal}
                  disabled={isMutating}
                  className="flex-1 rounded-lg border border-gray-900 px-4 py-3 text-sm font-semibold text-gray-900"
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  onClick={() => void handleSaveAddress()}
                  disabled={isMutating}
                  className="flex-1 rounded-lg bg-[#1a1a1a] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {isMutating
                    ? "SAVING..."
                    : editingAddress
                      ? "UPDATE ADDRESS"
                      : "SAVE ADDRESS"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && order && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.7, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-2xl"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: "spring" }}
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-5xl"
              >
                🎉
              </motion.div>
              <h2 className="mt-5 text-2xl font-bold text-gray-900">
                Order Placed!
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Your order has been placed successfully.
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Redirecting to My Orders in a few seconds...
              </p>
              <button
                type="button"
                onClick={() => router.push("/orders")}
                className="mt-6 w-full rounded-xl bg-[#003b1f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#002d18]"
              >
                View my orders
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
