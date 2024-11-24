"use client";
import { useEffect, useState } from "react";
import { Menu, ShoppingCart, Phone } from "lucide-react";
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";
import { products } from "@/Api/ProductMock";
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

export default function ProductCatalog() {
  const handleAddToCart = (product: (typeof products)[0]) => {
    const productwithQuantity = { ...product, quantity: 1 };
    localStorage.setItem(
      "cart",
      JSON.stringify([
        ...JSON.parse(localStorage.getItem("cart") || "[]"),
        productwithQuantity,
      ])
    );
    toast.success(`${product.name} foi adicionado ao carrinho`, {
      description: `Preço: $${product.price.toFixed(2)}`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Pagina de produtos
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                <div className="relative w-[288px]  h-32">
                  <img
                    className="object-contain absolute w-full h-full"
                    src={product.url}
                    alt={product.name}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-gray-600">{product.description}</p>
                  <p className="mt-2 text-xl font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </p>
                  <div className="mt-4">
                    <Button
                      className="w-full"
                      onClick={() => handleAddToCart(product)}
                    >
                      Adicionar ao carrinho
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  );
}
