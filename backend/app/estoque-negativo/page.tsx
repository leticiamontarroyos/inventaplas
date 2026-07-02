'use client'
import { useEffect, useState } from 'react'

export default function EstoqueNegativoPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    fetch(process.env.NEXT_PUBLIC_API_URL + '/api/stock/negative', {
      headers: { Authorization: 'Bearer ' + token }
    })
      .then(res => res.json())
      .then(data => {
        setItems(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-6">Carregando...</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-red-600 mb-6">Estoque Negativo</h1>
      {items.length === 0 ? (
        <p className="text-green-600">Nenhum produto negativo!</p>
      ) : (
        <table className="w-full bg-white rounded shadow text-sm">
          <thead className="bg-red-50 text-red-700">
            <tr>
              <th className="text-left p-3">Produto</th>
              <th className="text-right p-3">Quantidade</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item: any) => (
              <tr key={item.id} className="border-t">
                <td className="p-3">{item.product.name}</td>
                <td className="p-3 text-right text-red-600 font-bold">{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}