import React, { useEffect, useState } from "react";
import OrderItem from "./OrderItem";
import DisplayStatus from "./DisplayStatus";

function OrderList() {
  const [order, setOrder] = useState([]);
  const [status, setStatus] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!status){
      return;
    }
    const timer = setTimeout(() => {
      setStatus(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, [status]);

  const fetchCart = async () => {
    if (!userId) {
      setOrder([]);
      return;
    }
    try {
      const response = await fetch(`http://127.0.0.1:5000/cart?userId=${userId}`);
      const data = await response.json();

      if (!response.ok) {
        setStatus({ type: "error", message: data.message || "Could not load cart." });
        return;
      }

      setOrder(data.cart || []);
    } catch (error) {
      setStatus({ type: "error", message: "Could not connect to backend." });
    }
  };

  useEffect(() => {
    fetchCart();
    const refreshCart = () => {
      fetchCart();
    };
    window.addEventListener("cartUpdated", refreshCart);
    return () => {
      window.removeEventListener("cartUpdated", refreshCart);
    };
  }, [userId]);

  const removeFromOrder = async (flavorId) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/cart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: Number(userId),
          flavorId: flavorId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus({
          type: "error",
          message: data.message || "Flavor cannot removed..."
        });
        return;
      }

      setOrder(data.cart || []);
      setStatus({
        type: "success",
        message: "Flavor removed successfully!"
      });

      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      setStatus({
        type: "error",
        message: "Flavor not removed: cannot connect to backend."
      });
    }
  };

  const placeOrder = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: Number(userId),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus({
          type: "error",
          message: data.message || "Order not submitted..."
        });
        return;
      }
      setOrder([]);
      setStatus({
        type: "success",
        message: "Order submitted!"
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: "Order not submitted: cannot connect to backend."
      });
    }
  };

  const totalPrice = order.reduce((sum, item) => {
    const numericPrice =
      typeof item.price === "string"
        ? parseFloat(item.price.replace("$", ""))
        : item.price;

    return sum + numericPrice * item.quantity;
  }, 0);

  return (
    <>
      <h3>Your Order</h3>

      {status && <DisplayStatus type={status.type} message={status.message} />}
      
      <div className="order-list">
        {order.length === 0 && <p>No items in your order.</p>}
        {order.map((item) => (
          <OrderItem
            key={item.flavorId}
            item={item}
            removeFromOrder={removeFromOrder}
          />
        ))}

        {order.length > 0 && (
          <div>
            <h4>Total: ${totalPrice.toFixed(2)}</h4>
            <button onClick={placeOrder}>Place Order</button>
          </div>
        )}
      </div>
    </>
  );
}

export default OrderList;