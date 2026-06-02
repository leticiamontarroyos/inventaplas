'use client'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import api from '@/lib/api'

export default function RelatoriosPage() {
  const [estoque, setEstoque] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    api.get('/api/stock/positions').then(r => {
      setEstoque(r.data)
      setLoading(false)
    })
  }

  useEffect(load, [])

  const moveis = estoque.filter(e =>
    !e.product_name?.toLowerCase().includes('bacia') &&
    !e.product_name?.toLowerCase().includes('balde') &&
    !e.product_name?.toLowerCase().includes('infantil') &&
    !e.product_name?.toLowerCase().includes('relax')
  )

  const ud = estoque.filter(e =>
    e.product_name?.toLowerCase().includes('bacia') ||
    e.product_name?.toLowerCase().includes('balde')
  )

  const infantil = estoque.filter(e =>
    e.product_name?.toLowerCase().includes('infantil') ||
    e.product_name?.toLowerCase().includes('relax')
  )

  const totalMoveis = moveis.reduce((acc, e) => acc + e.quantity, 0)
  const totalUD = ud.reduce((acc, e) => acc + e.quantity, 0)
  const totalInfantil = infantil.reduce((acc, e) => acc + e.quantity, 0)

  const Secao = ({ titulo, itens, total }: { titulo: string, itens: any[], total: number }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">{titulo}</h2>
        <span className="text-lg font-bold text-blue-600">{total.toLocaleString('pt-BR')} un</span>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left py-2 text-gray-500 font-medium">Produto</th>
            <th className="text-right py-2 text-gray-500 font-medium">Quantidade</th>
          </tr>
        </thead>
        <tbody>
          {itens.sort((a, b) => a.product_name?.localeCompare(b.product_name)).map((item, i) => (
            <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="py-2 text-gray-700">{item.product_name}</td>
              <td className="py-2 text-right font-medium text-gray-800">{item.quantity.toLocaleString('pt-BR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Relatórios</h1>
        <p className="text-sm text-gray-500 mb-8">Estoque atual por categoria</p>

        {loading ? (
          <p className="text-gray-500">Carregando...</p>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <p className="text-sm text-gray-500 mb-1">Móveis</p>
                <p className="text-2xl font-bold text-gray-800">{totalMoveis.toLocaleString('pt-BR')}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <p className="text-sm text-gray-500 mb-1">Utilidades</p>
                <p className="text-2xl font-bold text-gray-800">{totalUD.toLocaleString('pt-BR')}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <p className="text-sm text-gray-500 mb-1">Infantil</p>
                <p className="text-2xl font-bold text-gray-800">{totalInfantil.toLocaleString('pt-BR')}</p>
              </div>
            </div>

            <Secao titulo="Móveis" itens={moveis} total={totalMoveis} />
            <Secao titulo="Utilidades Domésticas" itens={ud} total={totalUD} />
            <Secao titulo="Linha Infantil" itens={infantil} total={totalInfantil} />
          </>
        )}
      </main>
    </div>
  )
}