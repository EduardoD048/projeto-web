'use client'

import { use, useEffect, useState } from 'react'
import { Plus, Minus, Save, ShoppingCart, Trash } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Toaster, toast } from "sonner";
import { useRouter } from 'next/navigation';

export interface Product { // interface para definir o tipo de produto
  id: number
  name: string
  description: string
  price: number
  quantity: number
}

export default function Component() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter();

  useEffect(() => { // função para carregar os produtos do carrinho
     const cart = localStorage.getItem("cart")
      if (cart) {
        setProducts(JSON.parse(cart))
      }
  }, [])
  
  const updateQuantity = (id: number, change: number) => { // função para atualizar a quantidade de produtos
    setProducts(products.map(product => 
      product.id === id ? { ...product, quantity: Math.max(0, product.quantity + change) } : product
    ))
  }

  const removeProduct = (id: number) => { // função para remover um produto
    setProducts(products.filter(product => product.id !== id))
  }

  const totalPrice = products.reduce((sum, product) => sum + product.price * product.quantity, 0) // função para calcular o preço total

  const saveChanges = () => { // função para salvar as alterações
    localStorage.setItem("cart", JSON.stringify(products))
    toast.success(`Tudo certo! 🎉`, {
      description: `O produto foi adicionado ao carrinho com sucesso!`,
    });
  }

  const proceedToPurchase = async () => {  // função para realizar a compra
    const cart = localStorage.getItem("cart")

    if (!cart) return

    const parsedCart = JSON.parse(cart) 

    try {
      setIsLoading (true) 

      const response = await fetch(`http://localhost:8080/purchase`, { // faz o fetch do front com o back para realizar a compra
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedCart.map((cart: any) => ({
          id: cart.id,
          quantity: cart.quantity,
          price: cart.price,
          name: cart.name,
          urlImage: cart.url
        }))),
      })

      if (!response.ok) { // tratamento de erro 
        throw new Error('Falha ao realizar a compra')
      }

      toast.success(`Compra realizada com sucesso!`, { // tratamento
        description: `A compra foi um sucesso!`,
      });

      router.push('/compras')
    } catch (err) {
      console.log(err)
      toast.error(`Error`, {
        description: `Ocorreu um erro ao fazer a compra`,
      });
    } finally {
      setIsLoading(false)
    }
  }

   
  return ( // retorna o carrinho de compras
    <div className="container p-4 max-w-2xl h-full">
      <h1 className="text-2xl font-bold mb-4">Carrinho de Compras</h1>
      <div className="space-y-4 h-max overflow-y-auto max-h-96">
        {products.map(product => (
          <div key={product.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
            <div>
              <h2 className="font-semibold">{product.name}</h2>
              <p className="text-gray-600">R$ {product.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => updateQuantity(product.id, -1)}
                disabled={product.quantity === 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center">{product.quantity}</span>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => updateQuantity(product.id, 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => removeProduct(product.id)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold">Total:</span>
          <span className="font-bold text-lg">R$ {totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex space-x-4">
          <Button onClick={saveChanges} className="flex-1">
            <Save className="mr-2 h-4 w-4" /> Salvar Alterações
          </Button>
          <Button disabled={products.length === 0} onClick={proceedToPurchase} className="flex-1">
            {isLoading ? (
              <span className="text-white text-sm">Carregando...</span>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Comprar
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}