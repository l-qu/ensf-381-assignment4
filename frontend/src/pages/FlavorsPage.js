// src/pages/FlavorsPage.js
import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FlavorCatalog from "../components/FlavorCatalog";
import OrderList from "../components/OrderList";
import { Navigate } from "react-router-dom";

function FlavorsPage() {
  const userId = localStorage.userId;

  if (!userId) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flavors-page">
      <Header />
      <div className="content">
        <FlavorCatalog />
        <OrderList />
      </div>
      <Footer />
    </div>
  );
}

export default FlavorsPage;