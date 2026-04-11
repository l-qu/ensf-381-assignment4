import React, { useState } from "react";

function FlavorItem({ flavor, addToOrder }) {
  const [showDesc, setShowDesc] = useState(false);

  return (
    <div
      className="flavor-card"
      onMouseEnter={() => setShowDesc(true)}
      onMouseLeave={() => setShowDesc(false)}
    >
      <img
        src={flavor.image}
        alt={flavor.name}
        className="flavor-image"
      />

      <h3 className="flavor-name">{flavor.name}</h3>

      <p className="flavor-price">
        {typeof flavor.price === "string" ? flavor.price : `$${flavor.price.toFixed(2)}`}
      </p>

      {showDesc && (
        <p className="flavor-description">{flavor.description}</p>
      )}

      <button
        className="add-button"
        onClick={() => addToOrder(flavor)}
      >
        Add to Order
      </button>
    </div>
  );
}

export default FlavorItem;