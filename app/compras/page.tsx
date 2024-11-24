"use client"
import { Button } from '@/components/ui/button'
import { Minus, Plus, Trash } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Product } from '../carrinho/page'

export default function ComprasPage() {
    const [isLoading, setIsLoading] = useState(true)
    const [products, setProducts] = useState<Product[] | null>(null)

    useEffect(() => {
      fetch(`http://localhost:8080/purchase`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(async (response) => {
        if (!response.ok) {
          throw new Error('Falha ao realizar a compra')
        }
  
        const data = await response.json()
        
        const allProducts = data.flatMap(item => item.products || []);
       
        setProducts(allProducts)
      }).catch((err) => {
        console.log(err)
      }).finally(() => {
        setIsLoading(false)
      })
    }, [])

   if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span>Carregando...</span>
      </div>
    )
   }
   if (products!.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span>Você ainda não realizou nenhuma compra.</span>
      </div>
    )
    }
    return (
      <div className="container p-4 max-w-2xl h-full">
        <h1 className="text-2xl font-bold text-gray-800">Minhas Compras</h1>
        <p>Aqui você verá todas as compras que realizou.</p>
        <div className="space-y-4 h-max overflow-y-auto max-h-96">
          {products.map(product => (
            <div key={product.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
              <div>
                <h2 className="font-semibold">{product.name}</h2>
                <p className="text-gray-600">R$ {product.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  