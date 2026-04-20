import { useEffect, useState } from "react";
import { ITEMS_PER_PAGE } from "../../../app/constants";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllOrdersAsync,
  selectOrders,
  selectTotalOrders,
  updateOrderAsync,
} from "../../order/orderSlice";
import {
  PencilIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline";
import Pagination from "../../common/Pagination";

function AdminOrders() {
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const totalOrders = useSelector(selectTotalOrders);
  const [editableOrderId, setEditableOrderId] = useState(-1);
  const [sort, setSort] = useState({});

  const handleEdit = (order) => {
    setEditableOrderId(order.id);
  };

  const handleOrderStatus = (e, order) => {
    const updatedOrder = { ...order, status: e.target.value };
    dispatch(updateOrderAsync(updatedOrder));
    setEditableOrderId(-1);
  };

  const handleOrderPaymentStatus = (e, order) => {
    const updatedOrder = { ...order, paymentStatus: e.target.value };
    dispatch(updateOrderAsync(updatedOrder));
    setEditableOrderId(-1);
  };

  const handlePage = (page) => {
    setPage(page);
  };

  const handleSort = (sortOption) => {
    const sort = { _sort: sortOption.sort, _order: sortOption.order };
    console.log({ sort });
    setSort(sort);
  };

  const chooseColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-purple-200 text-purple-600";
      case "dispatched":
        return "bg-yellow-200 text-yellow-600";
      case "delivered":
        return "bg-green-200 text-green-600";
      case "received":
        return "bg-green-200 text-green-600";
      case "cancelled":
        return "bg-red-200 text-red-600";
      default:
        return "bg-purple-200 text-purple-600";
    }
  };

  useEffect(() => {
    const pagination = { _page: page, _limit: ITEMS_PER_PAGE };
    dispatch(fetchAllOrdersAsync({ sort, pagination }));
  }, [dispatch, page, sort]);

  return (
    <div className="w-full px-2 sm:px-4 py-4">
      <div className="bg-gray-100 min-h-screen font-sans">
        <div className="w-full max-w-screen-xl mx-auto">
          <div className="bg-white shadow-md rounded-lg my-4 sm:my-6 overflow-hidden">
            {/* ── Desktop table (hidden on small screens) ── */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full table-auto text-sm">
                <thead>
                  <tr className="bg-gray-200 text-gray-600 uppercase text-xs leading-normal">
                    <th
                      className="py-3 px-3 text-left cursor-pointer whitespace-nowrap hover:bg-gray-300 transition-colors"
                      onClick={() =>
                        handleSort({
                          sort: "id",
                          order: sort?._order === "asc" ? "desc" : "asc",
                        })
                      }
                    >
                      Order#{" "}
                      {sort._sort === "id" &&
                        (sort._order === "asc" ? (
                          <ArrowUpIcon className="w-3 h-3 inline" />
                        ) : (
                          <ArrowDownIcon className="w-3 h-3 inline" />
                        ))}
                    </th>
                    <th className="py-3 px-3 text-left">Items</th>
                    <th
                      className="py-3 px-3 text-left cursor-pointer whitespace-nowrap hover:bg-gray-300 transition-colors"
                      onClick={() =>
                        handleSort({
                          sort: "totalAmount",
                          order: sort?._order === "asc" ? "desc" : "asc",
                        })
                      }
                    >
                      Total{" "}
                      {sort._sort === "totalAmount" &&
                        (sort._order === "asc" ? (
                          <ArrowUpIcon className="w-3 h-3 inline" />
                        ) : (
                          <ArrowDownIcon className="w-3 h-3 inline" />
                        ))}
                    </th>
                    <th className="py-3 px-3 text-left">Shipping Address</th>
                    <th className="py-3 px-3 text-center">Order Status</th>
                    <th className="py-3 px-3 text-center">Payment Method</th>
                    <th className="py-3 px-3 text-center">Payment Status</th>
                    <th
                      className="py-3 px-3 text-left cursor-pointer whitespace-nowrap hover:bg-gray-300 transition-colors"
                      onClick={() =>
                        handleSort({
                          sort: "createdAt",
                          order: sort?._order === "asc" ? "desc" : "asc",
                        })
                      }
                    >
                      Order Time{" "}
                      {sort._sort === "createdAt" &&
                        (sort._order === "asc" ? (
                          <ArrowUpIcon className="w-3 h-3 inline" />
                        ) : (
                          <ArrowDownIcon className="w-3 h-3 inline" />
                        ))}
                    </th>
                    <th
                      className="py-3 px-3 text-left cursor-pointer whitespace-nowrap hover:bg-gray-300 transition-colors"
                      onClick={() =>
                        handleSort({
                          sort: "updatedAt",
                          order: sort?._order === "asc" ? "desc" : "asc",
                        })
                      }
                    >
                      Last Updated{" "}
                      {sort._sort === "updatedAt" &&
                        (sort._order === "asc" ? (
                          <ArrowUpIcon className="w-3 h-3 inline" />
                        ) : (
                          <ArrowDownIcon className="w-3 h-3 inline" />
                        ))}
                    </th>
                    <th className="py-3 px-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-3 text-left whitespace-nowrap">
                        <span className="font-semibold text-gray-800">
                          #{order.id}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-left max-w-xs">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 mb-1 last:mb-0"
                          >
                            <img
                              className="w-7 h-7 rounded-full object-cover flex-shrink-0 border border-gray-200"
                              src={item.product.thumbnail}
                              alt={item.product.title}
                            />
                            <span className="truncate text-xs">
                              {item.product.title} &times;{item.quantity} — ₹
                              {item.product.discountPrice}
                            </span>
                          </div>
                        ))}
                      </td>
                      <td className="py-3 px-3 text-center font-semibold text-gray-800 whitespace-nowrap">
                        ₹{order.totalAmount}
                      </td>
                      <td className="py-3 px-3 text-left text-xs leading-relaxed">
                        <div>
                          <strong>{order.selectedAddress.name}</strong>
                        </div>
                        <div>{order.selectedAddress.street},</div>
                        <div>
                          {order.selectedAddress.city},{" "}
                          {order.selectedAddress.state}
                        </div>
                        <div>{order.selectedAddress.pinCode}</div>
                        <div className="text-gray-500">
                          {order.selectedAddress.phone}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        {order.id === editableOrderId ? (
                          <select
                            className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-400"
                            onChange={(e) => handleOrderStatus(e, order)}
                          >
                            <option value="pending">Pending</option>
                            <option value="dispatched">Dispatched</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        ) : (
                          <span
                            className={`${chooseColor(order.status)} py-1 px-3 rounded-full text-xs font-medium`}
                          >
                            {order.status}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center text-xs">
                        {order.paymentMethod}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {order.id === editableOrderId ? (
                          <select
                            className="text-xs border border-gray-300 rounded px-2 py-1 pr-6 bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                            onChange={(e) => handleOrderPaymentStatus(e, order)}
                          >
                            <option value="pending">Pending</option>
                            <option value="received">Received</option>
                          </select>
                        ) : (
                          <span
                            className={`${chooseColor(order.paymentStatus)} py-1 px-3 rounded-full text-xs font-medium`}
                          >
                            {order.paymentStatus}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center text-xs whitespace-nowrap">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleString()
                          : null}
                      </td>
                      <td className="py-3 px-3 text-center text-xs whitespace-nowrap">
                        {order.updatedAt
                          ? new Date(order.updatedAt).toLocaleString()
                          : null}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          className="p-1.5 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-colors"
                          title="Edit order"
                          onClick={() => handleEdit(order)}
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Mobile cards (visible on small/medium screens) ── */}
            <div className="lg:hidden divide-y divide-gray-200">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  {/* Card header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="font-bold text-gray-800 text-base">
                        Order #{order.id}
                      </span>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleString()
                          : null}
                      </div>
                    </div>
                    <button
                      className="p-2 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-colors"
                      title="Edit order"
                      onClick={() => handleEdit(order)}
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Items */}
                  <div className="mb-3 space-y-1.5">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <img
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-gray-200"
                          src={item.product.thumbnail}
                          alt={item.product.title}
                        />
                        <span className="text-xs text-gray-600 truncate">
                          {item.product.title} &times;{item.quantity} — ₹
                          {item.product.discountPrice}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Meta grid */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs mb-3">
                    <div>
                      <span className="text-gray-400 uppercase tracking-wide font-medium block mb-0.5">
                        Total
                      </span>
                      <span className="font-bold text-gray-800 text-sm">
                        ₹{order.totalAmount}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 uppercase tracking-wide font-medium block mb-0.5">
                        Payment
                      </span>
                      <span className="text-gray-700">
                        {order.paymentMethod}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 uppercase tracking-wide font-medium block mb-0.5">
                        Order Status
                      </span>
                      {order.id === editableOrderId ? (
                        <select
                          className="text-xs border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-purple-400"
                          onChange={(e) => handleOrderStatus(e, order)}
                        >
                          <option value="pending">Pending</option>
                          <option value="dispatched">Dispatched</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      ) : (
                        <span
                          className={`${chooseColor(order.status)} py-0.5 px-2.5 rounded-full text-xs font-medium inline-block`}
                        >
                          {order.status}
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="text-gray-400 uppercase tracking-wide font-medium block mb-0.5">
                        Payment Status
                      </span>
                      {order.id === editableOrderId ? (
                        <select
                          className="text-xs border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-purple-400"
                          onChange={(e) => handleOrderPaymentStatus(e, order)}
                        >
                          <option value="pending">Pending</option>
                          <option value="received">Received</option>
                        </select>
                      ) : (
                        <span
                          className={`${chooseColor(order.paymentStatus)} py-0.5 px-2.5 rounded-full text-xs font-medium inline-block`}
                        >
                          {order.paymentStatus}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 leading-relaxed">
                    <span className="text-gray-400 uppercase tracking-wide font-medium block mb-1">
                      Shipping Address
                    </span>
                    <div>
                      <strong>{order.selectedAddress.name}</strong>,{" "}
                      {order.selectedAddress.street},
                    </div>
                    <div>
                      {order.selectedAddress.city},{" "}
                      {order.selectedAddress.state} —{" "}
                      {order.selectedAddress.pinCode}
                    </div>
                    <div className="text-gray-500">
                      {order.selectedAddress.phone}
                    </div>
                  </div>

                  {/* Last updated */}
                  {order.updatedAt && (
                    <div className="mt-2 text-xs text-gray-400">
                      Last updated: {new Date(order.updatedAt).toLocaleString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Pagination
        page={page}
        setPage={setPage}
        handlePage={handlePage}
        totalItems={totalOrders}
      />
    </div>
  );
}

export default AdminOrders;