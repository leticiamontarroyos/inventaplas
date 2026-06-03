'use client'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import api from '@/lib/api'
import Link from 'next/link'

export default function Dashboard() {
  const [positions, setPositions] = useState<any[]>([])
  const [products, setProducts] = useState(0)

  useEffect(() => {
    Promise.all([
      api.get('/api/stock/positions'),
      api.get('/api/products/'),
    ]).then(([pos, prods]) => {
      setPositions(pos.data)
      setProducts(prods.data.length)
    }).catch(() => {})
  }, [])

  const moveis = positions.filter(e =>
    !e.product?.name?.toLowerCase().includes('bacia') &&
    !e.product?.name?.toLowerCase().includes('balde') &&
    !e.product?.name?.toLowerCase().includes('infantil') &&
    !e.product?.name?.toLowerCase().includes('relax')
  )

  const ud = positions.filter(e =>
    e.product?.name?.toLowerCase().includes('bacia') ||
    e.product?.name?.toLowerCase().includes('balde')
  )

  const infantil = positions.filter(e =>
    e.product?.name?.toLowerCase().includes('infantil') ||
    e.product?.name?.toLowerCase().includes('relax')
  )

  const totalMoveis = moveis.reduce((s, p) => s + p.quantity, 0)
  const totalUD = ud.reduce((s, p) => s + p.quantity, 0)
  const totalInfantil = infantil.reduce((s, p) => s + p.quantity, 0)
  const totalGeral = positions.reduce((s, p) => s + p.quantity, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Painel principal</h1>

        {/* Total geral */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
          <p className="text-sm text-gray-500 mb-1">Total em estoque</p>
          <p className="text-3xl font-bold text-blue-600">{totalGeral.toLocaleString('pt-BR')} unidades</p>
        </div>

        {/* Por categoria */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <Link href="/relatorios" className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 transition-colors">
            <p className="text-sm text-gray-500 mb-1">🪑 Móveis</p>
            <p className="text-2xl font-semibold text-gray-800">{totalMoveis.toLocaleString('pt-BR')}</p>
          </Link>
          <Link href="/relatorios" className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 transition-colors">
            <p className="text-sm text-gray-500 mb-1">🪣 Utilidades</p>
            <p className="text-2xl font-semibold text-gray-800">{totalUD.toLocaleString('pt-BR')}</p>
          </Link>
          <Link href="/relatorios" className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 transition-colors">
            <p className="text-sm text-gray-500 mb-1">🧒 Infantil</p>
            <p className="text-2xl font-semibold text-gray-800">{totalInfantil.toLocaleString('pt-BR')}</p>
          </Link>
        </div>

        {/* Produtos e ações */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Link href="/produtos" className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 transition-colors">
            <p className="text-sm text-gray-500 mb-1">Produtos cadastrados</p>
            <p className="text-2xl font-semibold text-green-600">{products}</p>
          </Link>
          <Link href="/historico" className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 transition-colors">
            <p className="text-sm text-gray-500 mb-1">Ver histórico</p>
            <p className="text-2xl font-semibold text-gray-400">→</p>
          </Link>
        </div>

        {/* Ações rápidas */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-medium text-gray-700 mb-3">Ações rápidas</p>
          <div className="flex flex-wrap gap-3">
            {[
              { href: '/producao', label: 'Lançar produção', bg: 'bg-purple-50 text-purple-700 hover:bg-purple-100' },
              { href: '/expedicao', label: 'Registrar saída', bg: 'bg-orange-50 text-orange-700 hover:bg-orange-100' },
              { href: '/ajuste', label: 'Ajustar estoque', bg: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100' },
              { href: '/relatorios', label: 'Ver relatórios', bg: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
            ].map(a => (
              <Link key={a.href} href={a.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${a.bg}`}>
                {a.label}
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}