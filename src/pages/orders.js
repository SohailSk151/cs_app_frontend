import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const columns = [
  { id: "sno", label: "S.No", align: "center" },
  { id: "orderId", label: "Order ID", align: "left" },
  { id: "customer", label: "Customer", align: "left" },
  { id: "createdAt", label: "Created At", align: "center" },
  { id: "fulfillment", label: "Fulfillment", align: "center" },
  { id: "payment", label: "Payment", align: "center" },
  { id: "total", label: "Total", align: "right" },
  { id: "action", label: "", align: "center" },
];

const alignClass = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const StatusBadge = ({ value, type }) => {
  const styles = {
    fulfillment: {
      fulfilled: "bg-green-100 text-green-700",
      partial: "bg-yellow-100 text-yellow-700",
      unfulfilled: "bg-red-100 text-red-700",
    },
    payment: {
      paid: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      refunded: "bg-red-100 text-red-700",
    },
  };

  const key = value?.toLowerCase() || "";
  const cls = styles[type][key] || "bg-gray-100 text-gray-700";

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${cls}`}>
      {value || "-"}
    </span>
  );
};

export default function OrdersTable() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetch("http://localhost:4000/api/orders/all")
      .then((res) => res.json())
      .then((res) => setOrders(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const rows = useMemo(() => {
    return orders.map((o) => ({
      rawId: o.id,
      orderId: `${o.name}-${o.id.substring(20, 34)}`,
      customer: o.customer
        ? `${o.customer.firstName} ${o.customer.lastName}`
        : o.billingAddress
        ? `${o.billingAddress.firstName} ${o.billingAddress.lastName}`
        : "Guest",
      createdAt: new Date(o.createdAt).toLocaleString(),
      fulfillment: o.displayFulfillmentStatus,
      payment: o.displayFinancialStatus,
      total: Number(o.totalPriceSet?.shopMoney?.amount || 0).toFixed(2),
    }));
  }, [orders]);

  const filteredRows = useMemo(() => {
    if (!search) return rows;
    return rows.filter((r) =>
      Object.values(r)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [rows, search]);

  const paginatedRows = filteredRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);

  return (
    <div className="w-[95%] mx-auto mt-6 space-y-4">
      {/* Top Controls */}
      <div className="flex justify-end items-center">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          placeholder="Search orders..."
          className="w-80 px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-x-auto shadow-sm">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gray-100 border-b z-10">
            <tr>
              {columns.map((c) => (
                <th
                  key={c.id}
                  className={`px-4 py-3 font-semibold ${alignClass[c.align]}`}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center">
                  <div className="animate-pulse h-4 bg-gray-200 rounded w-full" />
                </td>
              </tr>
            ) : paginatedRows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="p-8 text-center text-gray-500"
                >
                  No orders found
                </td>
              </tr>
            ) : (
              paginatedRows.map((row, idx) => (
                <tr
                  key={row.rawId}
                  className="group border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 text-center">
                    {page * rowsPerPage + idx + 1}
                  </td>

                  <td
                    className="px-4 py-3 font-mono cursor-pointer hover:underline"
                    title={row.rawId}
                    onClick={() =>
                      navigator.clipboard.writeText(row.rawId)
                    }
                  >
                    {row.orderId}
                  </td>

                  <td className="px-4 py-3 font-mono">
                    {row.customer}
                  </td>

                  <td className="px-4 py-3 text-center font-mono">
                    {row.createdAt}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <StatusBadge
                      value={row.fulfillment}
                      type="fulfillment"
                    />
                  </td>

                  <td className="px-4 py-3 text-center">
                    <StatusBadge value={row.payment} type="payment" />
                  </td>

                  <td className="px-4 py-3 text-right font-mono">
                    ₹{row.total}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => navigate(`/order/${row.rawId.substring(20, 34)}`)}
                      className="opacity-0 group-hover:opacity-100 text-indigo-600 hover:underline transition"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination – Bottom Only */}
      <div className="flex justify-between items-center text-sm pt-2">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setPage(0);
            }}
            className="px-2 py-1 border rounded"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>

        <span>
          {filteredRows.length === 0
            ? "0"
            : `${page * rowsPerPage + 1}–${Math.min(
                (page + 1) * rowsPerPage,
                filteredRows.length
              )}`}{" "}
          of {filteredRows.length}
        </span>

        <div className="flex gap-2">
          <button
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            className="px-4 py-1 border rounded disabled:opacity-40"
          >
            Previous
          </button>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage(page + 1)}
            className="px-4 py-1 border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
