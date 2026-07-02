'use client'
import { useEffect, useState } from 'react'

export default function EstoqueNegativoPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const url = process.env.NEXT_PUBLIC_API_URL + '/api/stock/negative'
    fetch(url, { headers: { Authorization: 'Bearer ' + token } })
      .then(r => r.json())
      .then(d => { setItems(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-6">Carregando...</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Estoque Negativo</h1>
      {items.length === 0 ? <p className="text-green-600">Nenhum produto negativo!</p> : (
        <table className="w-full bg-white shadow rounded text-sm">
          <thead className="bg-red-50 text-red-700">
            <tr><th className="text-left p-3">Produto</th><th className="text-right p-3">Qtd</th></tr>
          </thead>
          <tbody>
            {items.map((i: any) => (
              <tr key={i.id} className="border-t">
                <td className="p-3">{i.product.name}</td>
                <td className="p-3 text-right text-red-600 font-bold">{i.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}