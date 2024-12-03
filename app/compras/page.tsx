"use client"
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';

interface Product { // interface para definir o tipo de produto do carrinho
  id: number
  name: string
  description: string
  price: number
  urlImage: string
  quantity: number
}

export default function ComprasPage() { 
  const [isLoading, setIsLoading] = useState(true) // useState para verificar se a página está carregando
  const [products, setProducts] = useState<Product[] | null>(null) // useState para armazenar os produtos
  const router = useRouter();  // cria uma instacia do router para navegar entre as páginas
  
  useEffect(() => { // faz o fetch do front com o back
    fetch(`http://localhost:8080/purchase`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(async (response) => { // pega a resposta do back
      if (!response.ok) {
        throw new Error('Falha ao carregar as compras')
      }

      const data = await response.json() // pega os dados da resposta

      const allProducts = data.flatMap(item => item.products || []); // mapeia os produtos
      setProducts(allProducts)
    }).catch((err) => {
      console.log(err)
    }).finally(() => { // finaliza o fetch
      setIsLoading(false)
    })
  }, [])


  const handleDeletePurchases = async () => { // função para deletar as compras
    try {
      const response = await fetch(`http://localhost:8080/purchase`, { // faz o fetch do front com o back para deletar as compras
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) { // caso a resposta não seja ok, lança um erro
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

  if (isLoading) { // se a página estiver carregando, exibe uma mensagem
    return (
      <div className="flex justify-center items-center h-screen">
        <span>Carregando...</span>
      </div>
    )
  }

  if (products!.length === 0) { // se não houver produtos, exibe uma mensagem
    return (
      <div className="flex justify-center items-center h-screen">
        <span>Você ainda não realizou nenhuma compra.</span>
      </div>
    )
  }

  return ( // retorna a página de compras
    <div className="container p-4 max-w-2xl h-full">
      <h1 className="text-2xl font-bold text-gray-800">Minhas Compras</h1>
      <p>Itens que você ira comprar.</p>
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
