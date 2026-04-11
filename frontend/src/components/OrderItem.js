import React from "react";

function OrderItem({ item, removeFromOrder }) {
  const numericPrice =
    typeof item.price === "string"
      ? parseFloat(item.price.replace("$", ""))
      : item.price;

  return (
    <div className="order-item">
      <h4>{item.name}</h4>
      <p>Quantity: {item.quantity}</p>
      <p>Price: ${(numericPrice * item.quantity).toFixed(2)}</p>
      <button onClick={() => removeFromOrder(item.flavorId)}>
        Remove Item
      </button>
    </div>
  );
}

export default OrderItem;