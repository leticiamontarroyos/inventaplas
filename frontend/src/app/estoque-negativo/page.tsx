'use client'

import { useEffect, useState } from 'react'

interface StockItem {
  id: string
  quantity: number
  product: { name: string }
  warehouse: { name: string }
}

export default function EstoqueNegativoPage() {
  const [items, setItems] = useState<StockItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/stock/negative`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setItems(data)
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-red-600 mb-6">⚠️ Estoque Negativo</h1>

      {loading ? (
        <p className="text-gray-500">Carregando...</p>
      ) : items.length === 0 ? (
        <p className="text-green-600 font-semibold">✅ Nenhum produto com estoque negativo!</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-red-50 text-red-700">
              <tr>
                <th className="text-left p-4">Produto</th>
                <th className="text-left p-4">Galpão</th>
                <th className="text-right p-4">Quantidade</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-t border-gray-100 hover:bg-red-50">
                  <td className="p-4 font-medium text-gray-800">{item.product.name}</td>
                  <td className="p-4 text-gray-600">{item.warehouse.name}</td>
                  <td className="p-4 text-right font-bold text-red-600">{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 bg-red-50 text-right text-sm text-red-700 font-semibold">
            {items.length} produto(s) com saldo negativo
          </div>
        </div>
      )}
    </div>
  )
}