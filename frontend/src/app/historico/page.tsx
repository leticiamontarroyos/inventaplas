'use client'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import api from '@/lib/api'

const typeLabel: Record<string, { label: string; color: string }> = {
  entrada: { label: 'ENTRADA', color: 'bg-green-100 text-green-700' },
  saida: { label: 'SAÍDA', color: 'bg-red-100 text-red-700' },
  ajuste: { label: 'AJUSTE', color: 'bg-yellow-100 text-yellow-700' },
  abertura: { label: 'ABERTURA', color: 'bg-blue-100 text-blue-700' },
}

export default function HistoricoPage() {
  const [movements, setMovements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/stock/movements?limit=200').then(r => setMovements(r.data)).finally(() => setLoading(false))
  }, [])

  const fmt = (dt: string) => new Date(dt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Histórico de movimentações</h1>
        {loading ? <p className="text-gray-400">Carregando...</p> : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Data</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Tipo</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Produto</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Galpão</th>
                  <th className="text-right px-4 py-3 text-gray-600 font-medium">Variação</th>
                  <th className="text-right px-4 py-3 text-gray-600 font-medium">Saldo</th>
                </tr>
              </thead>
              <tbody>
                {movements.map((m, i) => {
                  const t = typeLabel[m.move_type] || { label: m.move_type, color: 'bg-gray-100 text-gray-600' }
                  return (
                    <tr key={m.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                      <td className="px-4 py-3 text-gray-500 text-xs">{fmt(m.created_at)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${t.color}`}>{t.label}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-800">{m.product.name}</td>
                      <td className="px-4 py-3 text-gray-500">{m.warehouse.name}</td>
                      <td className={`px-4 py-3 text-right font-semibold ${m.qty_delta > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {m.qty_delta > 0 ? '+' : ''}{m.qty_delta}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-800 font-medium">{m.qty_after.toLocaleString('pt-BR')}</td>
                    </tr>
                  )
                })}
                {movements.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Nenhuma movimentação ainda</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}