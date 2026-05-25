'use client'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import api from '@/lib/api'

export default function EstoquePage() {
  const [positions, setPositions] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/stock/positions').then(r => setPositions(r.data)).finally(() => setLoading(false))
  }, [])

  const filtered = positions.filter(p =>
    p.product.name.toLowerCase().includes(search.toLowerCase()) ||
    p.product.sku.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Estoque atual</h1>
        <input placeholder="Buscar por nome ou SKU..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full md:w-80 border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        {loading ? <p className="text-gray-400">Carregando...</p> : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Produto</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">SKU</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Galpão</th>
                  <th className="text-right px-4 py-3 text-gray-600 font-medium">Quantidade</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                    <td className="px-4 py-3 text-gray-800">{p.product.name}</td>
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">{p.product.sku}</td>
                    <td className="px-4 py-3 text-gray-600">{p.warehouse.name}</td>
                    <td className={`px-4 py-3 text-right font-semibold ${p.quantity === 0 ? 'text-red-500' : p.quantity < 50 ? 'text-yellow-600' : 'text-gray-800'}`}>
                      {p.quantity.toLocaleString('pt-BR')}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">Nenhum resultado</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}