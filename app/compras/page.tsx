"use client"
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';

interface Product {
  id: number
  name: string
  description: string
  price: number
  urlImage: string
  quantity: number
}

export default function ComprasPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [products, setProducts] = useState<Product[] | null>(null)
  const router = useRouter(); 
  
  useEffect(() => {
    fetch(`http://localhost:8080/purchase`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(async (response) => {
      if (!response.ok) {
        throw new Error('Falha ao carregar as compras')
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

  console.log(products)

  const handleDeletePurchases = async () => {
    try {
      const response = await fetch(`http://localhost:8080/purchase`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Erro ao finalizar a compra')
      }

      setProducts([]) 
      router.push('/')
      localStorage.clear("cart")
    } catch (err) {
      console.error(err)
      toast.error(`Erro`, {
        description: `Ocorreu um erro ao finalizar a compra.`,
      });
    } 
  }

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
      <p>Suas compras.</p>
      <div className="space-y-4 h-max overflow-y-auto max-h-96">
        {!products ? <p className="text-white">Sem nenhum item</p> :  products.map(product => (
          <div key={product.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
            <div className='flex gap-x-4 items-center'>
              <img className='size-12' src={product.urlImage} />
              <div className='flex flex-col'>
                <h2 className="font-semibold">{product.name}</h2>
                <p className="text-gray-600">R$ {product.price.toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Button
        className="mt-4 px-4 py-2 bg-red-500 text-white font-bold rounded hover:bg-red-600 transition"
        onClick={handleDeletePurchases}
      >
        Finalizar Compra
      </Button>
    </div>
  );
}
