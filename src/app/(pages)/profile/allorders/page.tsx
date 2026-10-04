"use client";

import React, { useEffect, useState } from "react";
import {
  Calendar,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import ProductImage from "@/components/ProductImage/ProductImage";
import Loading from "@/components/Loadingg/page";

export default function AllOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setLoading(false);
      return;
    }

    async function fetchOrders() {
      try {
        const res = await fetch(
          `https://ecommerce.routemisr.com/api/v1/orders/user/${userId}`
        );
        if (!res.ok) throw new Error("Unable to load orders");
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : data.data ?? []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  if (loading)
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white z-50">
        <Loading />
      </div>
    );

  if (!orders.length)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen w-full mx-auto space-y-4 text-center">
        <h2 className="text-gray-700 font-semibold text-lg">
          No Orders Yet 🛍️
        </h2>
        <p className="text-xl md:text-2xl text-gray-500 mb-8 max-w-xl">
          Looks like you haven’t ordered anything yet. Start adding products to see
          them here!
        </p>
      </div>
    );

  return (
    <div className="px-6 md:px-12 lg:px-20 pt-16 pb-10 bg-gradient-to-br min-h-screen">
      <div className="max-w-screen-2xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl mt-4 md:mt-20 font-extrabold leading-tight text-green-700">
            All Orders
          </h1>
          <p className="text-gray-600 mt-4 text-xl font-medium">
            {orders.length} order(s) found
          </p>
        </header>

        <div className="flex flex-col gap-10">
          {orders.map((order: any, index) => (
            <motion.div
              key={order._id || index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative overflow-hidden rounded-3xl border border-green-200 bg-white/80 backdrop-blur-xl shadow-xl hover:shadow-green-200 transition-all duration-500 p-10"
            >
              <div className="flex justify-between items-center border-b pb-4 mb-6">
                <div>
                  <h2 className="font-bold text-2xl text-gray-800">
                    Order #{String(order._id || "").slice(-8).padStart(8, "0")}
                  </h2>
                  <div className="flex items-center text-gray-500 text-sm gap-2 mt-2">
                    <Calendar size={16} />
                    <span>
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString("en-US", {
                            dateStyle: "long",
                            timeStyle: "short",
                          })
                        : "Unknown Date"}
                    </span>
                  </div>
                </div>
                <span className="bg-green-100 text-green-700 px-5 py-2 text-sm rounded-full font-semibold">
                  {order.status || "Pending"}
                </span>
              </div>

              {/* عرض كل صور المنتجات داخل الأوردر */}
              <div className="flex flex-col md:flex-row gap-6 items-center">
                {order.cartItems?.map((item: any, idx: number) => (
                  <motion.div
                    key={item._id || idx}
                    whileHover={{ scale: 1.05 }}
                    className="w-full md:w-1/4 flex-shrink-0 overflow-hidden rounded-2xl shadow-lg bg-gray-100"
                  >
                    <ProductImage
                      src={item.product?.imageCover}
                      alt={item.product?.title || "Order image"}
                      className="object-cover w-full h-60"
                    />
                  </motion.div>
                ))}

                <div className="flex-1 space-y-6 text-gray-800">
                  <div className="text-3xl font-bold text-green-600 dark:text-white">
                    EGP {order.totalOrderPrice || 0}
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-green-700 flex items-center gap-2">
                      <Mail className="text-green-500" size={20} /> Customer Info
                    </h3>
                    <p className="flex items-center gap-3 text-gray-600 text-lg">
                      <Mail size={18} /> {order.user?.email || "No email"}
                    </p>
                    <p className="flex items-center gap-3 text-gray-600 text-lg">
                      <Phone size={18} /> {order.user?.phone || "No phone"}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-green-700 flex items-center gap-2">
                      <MapPin className="text-green-500" size={20} /> Shipping
                      Address
                    </h3>
                    <p className="flex items-center gap-3 text-gray-600 text-lg">
                      {order.shippingAddress?.details || "No address"}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-green-700 flex items-center gap-2">
                      <CreditCard className="text-green-500" size={20} /> Payment
                      & Delivery
                    </h3>

                    <p className="flex items-center gap-3 text-gray-700 text-lg">
                      <CreditCard size={18} /> Payment Method:{" "}
                      <span className="font-medium">
                        {order.paymentMethodType || "Cash"}
                      </span>
                    </p>

                    <p className="flex items-center gap-3 text-gray-700 text-lg">
                      {order.isPaid ? (
                        <CheckCircle className="text-green-500" size={20} />
                      ) : (
                        <XCircle className="text-red-500" size={20} />
                      )}
                      {order.isPaid
                        ? "Payment Completed"
                        : "Payment Pending"}
                    </p>

                    <p className="flex items-center gap-3 text-gray-700 text-lg">
                      {order.isDelivered ? (
                        <CheckCircle className="text-green-500" size={20} />
                      ) : (
                        <Truck className="text-gray-500" size={20} />
                      )}
                      {order.isDelivered
                        ? "Delivered"
                        : "Not Delivered Yet"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
