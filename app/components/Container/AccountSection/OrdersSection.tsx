"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  ClipboardList,
  Package,
  PackageCheck,
  TrendingUp,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { openAuthModal } from "@/app/store/slice/authModalSlice";
import { fetchOrders, type Order } from "@/app/store/slice/orderSlice";
import type { RootState } from "@/app/store/rootReducer";
import type { AppDispatch } from "@/app/store/store";
import AccountDashboardHeader from "./AccountDashboardHeader";

const formatCurrency = (amount: number) =>
  `₹${Number(amount || 0).toLocaleString("en-IN")}`;

const formatDate = (date?: string) => {
  if (!date) return "Date unavailable";
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "Date unavailable";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(parsedDate);
};

const formatStatus = (status: string) =>
  status.charAt(0).toUpperCase() + status.slice(1);

const statusClassName = (status: Order["orderStatus"]) => {
  if (status === "delivered") return "bg-emerald-100 text-emerald-700";
  if (status === "cancelled") return "bg-red-100 text-red-700";
  if (status === "shipped") return "bg-blue-100 text-blue-700";
  return "bg-amber-100 text-amber-800";
};

function OrderCard({ order }: { order: Order }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-gray-100 border-l-4 border-l-[#08703a] bg-white shadow-sm transition hover:shadow-md">
      <div className="flex flex-col justify-between gap-4 bg-gradient-to-r from-white to-[#f8faf8] p-5 sm:flex-row sm:items-center sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eaf4ed] text-[#08703a]">
            <PackageCheck size={20} />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Order number
            </p>
            <h2 className="mt-1 font-semibold text-gray-900">
              {order.orderNumber || order._id}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Placed {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusClassName(order.orderStatus)}`}
          >
            {formatStatus(order.orderStatus)}
          </span>
          <span className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600">
            {formatStatus(order.paymentStatus)} payment
          </span>
        </div>
      </div>

      <div className="space-y-3 px-5 py-4 sm:px-6">
        {order.items.map((item, index) => (
          <div
            key={item._id || `${item.product}-${index}`}
            className="flex items-start gap-3 rounded-2xl bg-[#f8faf8] p-3 sm:p-4"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#003b1f] shadow-sm">
              <Package size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-gray-900">{item.name}</p>
              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                Size {item.size} <span aria-hidden="true">·</span> {item.color}{" "}
                <span aria-hidden="true">·</span> Qty {item.quantity}
              </p>
            </div>
            <p className="shrink-0 text-sm font-medium text-gray-900">
              {formatCurrency(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div className="text-sm text-gray-600">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Delivering to
          </p>
          <p className="mt-1.5 leading-5">
            {order.shippingAddress.fullName}, {order.shippingAddress.address},{" "}
            {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
            {order.shippingAddress.pincode}
          </p>
        </div>
        <div className="flex items-end justify-between gap-4 sm:flex-col sm:items-end">
          <p className="text-xs text-gray-500">
            {order.paymentMethod === "cod" ? "Cash on delivery" : "Razorpay"}
          </p>
          <p className="text-lg font-bold text-[#003b1f]">
            {formatCurrency(order.totalAmount)}
          </p>
        </div>
      </div>
    </article>
  );
}

function OrdersSection() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );
  const { orders, isLoading, error } = useSelector(
    (state: RootState) => state.order,
  );

  useEffect(() => {
    if (isAuthenticated) void dispatch(fetchOrders());
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <section className="mx-auto flex min-h-[50vh] max-w-3xl items-center justify-center px-4 py-12">
        <div className="w-full rounded-2xl bg-white p-8 text-center shadow-sm">
          <ClipboardList className="mx-auto text-[#003b1f]" size={32} />
          <h1 className="mt-4 text-2xl font-semibold text-gray-900">
            My Orders
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to view your order history.
          </p>
          <button
            type="button"
            onClick={() => dispatch(openAuthModal("login"))}
            className="mt-6 rounded-lg bg-[#003b1f] px-5 py-3 text-sm font-semibold text-white hover:bg-[#002d18]"
          >
            Sign in
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[65vh] bg-[#f7f8f6] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <AccountDashboardHeader
          activeTab="orders"
          userName={user?.name}
          description="Follow your purchases from checkout to delivery."
        />

        {isLoading ? (
          <div className="space-y-4" aria-label="Loading orders">
            {Array.from({ length: 2 }, (_, index) => (
              <div
                key={index}
                className="h-52 animate-pulse rounded-2xl bg-white"
              />
            ))}
          </div>
        ) : error ? (
          <div role="alert" className="rounded-xl bg-white p-8 text-center">
            <p className="text-sm text-red-600">
              Could not load your orders: {error}
            </p>
            <button
              type="button"
              onClick={() => void dispatch(fetchOrders())}
              className="mt-4 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Total orders</p>
                  <span className="rounded-xl bg-[#eaf4ed] p-2 text-[#08703a]">
                    <ClipboardList size={17} />
                  </span>
                </div>
                <p className="mt-3 text-2xl font-bold text-gray-900">
                  {orders.length}
                </p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">In progress</p>
                  <span className="rounded-xl bg-amber-50 p-2 text-amber-700">
                    <Package size={17} />
                  </span>
                </div>
                <p className="mt-3 text-2xl font-bold text-gray-900">
                  {
                    orders.filter(
                      (order) =>
                        order.orderStatus !== "delivered" &&
                        order.orderStatus !== "cancelled",
                    ).length
                  }
                </p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Order value</p>
                  <span className="rounded-xl bg-blue-50 p-2 text-blue-700">
                    <TrendingUp size={17} />
                  </span>
                </div>
                <p className="mt-3 text-2xl font-bold text-gray-900">
                  {formatCurrency(
                    orders.reduce(
                      (total, order) =>
                        order.orderStatus === "cancelled"
                          ? total
                          : total + order.totalAmount,
                      0,
                    ),
                  )}
                </p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="rounded-3xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eaf4ed] text-[#08703a]">
                  <Package size={28} />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-gray-900">
                  No orders yet
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Your purchases will appear here after checkout.
                </p>
                <Link
                  href="/products"
                  className="mt-6 inline-flex rounded-xl bg-[#003b1f] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#002d18]"
                >
                  Start shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-end justify-between px-1">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Order history
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Your latest purchases and delivery information
                    </p>
                  </div>
                  <span className="text-sm font-medium text-gray-500">
                    {orders.length} {orders.length === 1 ? "order" : "orders"}
                  </span>
                </div>
                {orders.map((order) => (
                  <OrderCard key={order._id} order={order} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default OrdersSection;
