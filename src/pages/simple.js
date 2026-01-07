import React, { useEffect, useState } from "react";

function Simple() {
  const [orders, setOrders] = useState([]);
  //const [loading, setLoading] = useState(true);
  //const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:4000/api/orders/all")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch orders");
        }
        return res.json();
      })
      .then((result) => {
        setOrders(result.data || []);
      })
      
  }, []);

  

  return (
    <div style={{ padding: 20 }}>
      <h2>Recent Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table border="1" cellPadding="8" cellSpacing="0">
          <thead>
            <tr>
              <th>Order</th>
              <th>Email</th>
              <th>Total</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.name}</td>
                <td>{order.email || "-"}</td>
                <td>
                  {order.totalPriceSet?.shopMoney?.amount}{" "}
                  {order.totalPriceSet?.shopMoney?.currencyCode}
                </td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Simple;
