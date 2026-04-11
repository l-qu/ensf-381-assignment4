import React, { useEffect, useState } from "react";
import FlavorItem from "./FlavorItem";

function FlavorCatalog() {
    const [flavors, setFlavors] = useState([]);
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
        }, [status]
    );

    useEffect(() => {
        const fetchFlavors = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/flavors");
            const data = await response.json();

            if (!response.ok) {
                setStatus({
                    type: "error",
                    message: data.message || "Failed to load flavors."
                });
                return;
            }
            setFlavors(data.flavors || []);
        } catch (error) {
            setStatus({
                type: "error",
                message: "Could not connect to backend."
            });
        }};
        fetchFlavors();
    }, []);

    const addToOrder = async (flavor) => {
        if (!userId) {
            setStatus({
                type: "error",
                message: "Flavor not added: you must be logged in."
            });
            return;
        }

        try {
            const cartResponse = await fetch(`http://127.0.0.1:5000/cart?userId=${userId}`);
            const cartData = await cartResponse.json();

            if (!cartResponse.ok) {
                setStatus({
                    type: "error",
                    message: cartData.message || "Flavor not added."
                });
                return;
            }

            const existingItem = (cartData.cart || []).find(
                (item) => item.flavorId === flavor.id);

            let response;

            if (!existingItem) {
                response = await fetch("http://127.0.0.1:5000/cart", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId: Number(userId),
                        flavorId: flavor.id,
                    }),
                });
            } else {
                response = await fetch("http://127.0.0.1:5000/cart", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId: Number(userId),
                        flavorId: flavor.id,
                        quantity: existingItem.quantity + 1,
                    }),
                });
            }

            const data = await response.json();

            if (!response.ok) {
                setStatus({
                    type: "error",
                    message: data.message || "Flavor not added."
                });
                return;
            }
            setStatus({
                type: "success",
                message: "Flavor added to cart!"
            });
            window.dispatchEvent(new Event("cartUpdated"));
        } catch (error) {
        setStatus({
            type: "error",
            message: "Flavor not added: cannot connect to backend."
        });
        }
    };

  return (
    <>
      <h2>Ice Cream Flavors</h2>
      {status && (
        <p
          style={{
            color: status.type === "success" ? "green" : "red",
            fontWeight: "bold"
          }}
        >
          {status.message}
        </p>
      )}

      <div className="flavor-grid">
        {flavors.map((f) => (
          <FlavorItem
            key={f.id}
            flavor={f}
            addToOrder={addToOrder}
          />
        ))}
      </div>
    </>
  );
}

export default FlavorCatalog;