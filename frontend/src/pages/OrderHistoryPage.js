import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Navigate } from "react-router-dom";
import DisplayStatus from "../components/DisplayStatus";

function OrderHistory() {
    const userId = localStorage.getItem("userId");
    const [orders, setOrders] = useState([]);
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
        if (!userId) {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:5000/orders?userId=${userId}`);
            const data = await response.json();

            if (!response.ok) {
            setStatus({
                type: "error",
                message: data.message || "Failed to load order history."
            });
            setLoading(false);
            return;
            }

            setOrders(data.orders || []);
        } catch (error) {
            setStatus({
            type: "error",
            message: "Could not connect to backend."
            });
        } finally {
            setLoading(false);
        }
        };
        fetchOrders();
    }, [userId]);

    if (!userId) {
        return <Navigate to="/login" replace />;
    }

  return (
    <div>
      <Header />

      <main className="order-history-page">
        <h2>Order History</h2>

        {loading && <p>Loading your orders...</p>}
        {status && <DisplayStatus type={status.type} message={status.message} />}

        {!loading && !status && orders.length === 0 && (
            <div className="order-history-card">
                <p>You have not placed any orders yet.</p>
            </div>
        )}

        {!loading && orders.length > 0 && (
          <div className="order-history-list">
            {orders.map((order) => (
              <div key={order.orderId} className="order-history-card">
                <h3>Order #{order.orderId}</h3>
                <p><strong>Date:</strong> {order.timestamp}</p>
                {order.items.map((item) => (
                <div key={`${order.orderId}-${item.flavorId}`} className="order-history-item">
                    <p>{item.name} x {item.quantity} = {(Number(item.price) * Number(item.quantity)).toFixed(2)}</p>
                </div>
                ))}
                <p><strong>Total:</strong> ${Number(order.total).toFixed(2)}</p>
                </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default OrderHistory;