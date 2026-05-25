'use client'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import api from '@/lib/api'
import Link from 'next/link'

export default function Dashboard() {
  const [summary, setSummary] = useState({ total: 0, products: 0 })

  useEffect(() => {
    Promise.all([
      api.get('/api/stock/positions'),
      api.get('/api/products/'),
    ]).then(([pos, prods]) => {
      const total = pos.data.reduce((s: number, p: any) => s + p.quantity, 0)
      setSummary({ total, products: prods.data.length })
    }).catch(() => {})
  }, [])

  const cards = [
    { label: 'Unidades em estoque', value: summary.total.toLocaleString('pt-BR'), href: '/estoque', color: 'text-blue-600' },
    { label: 'Produtos cadastrados', value: summary.products, href: '/produtos', color: 'text-green-600' },
    { label: 'Lançar produção', value: '→', href: '/producao', color: 'text-purple-600' },
    { label: 'Registrar expedição', value: '→', href: '/expedicao', color: 'text-orange-600' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Painel principal</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {cards.map(c => (
            <Link key={c.href} href={c.href}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 transition-colors">
              <p className="text-sm text-gray-500 mb-1">{c.label}</p>
              <p className={`text-2xl font-semibold ${c.color}`}>{c.value}</p>
            </Link>
          ))}
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-medium text-gray-700 mb-3">Ações rápidas</p>
          <div className="flex flex-wrap gap-3">
            {[
              { href: '/producao', label: 'Lançar produção', bg: 'bg-purple-50 text-purple-700 hover:bg-purple-100' },
              { href: '/expedicao', label: 'Registrar saída', bg: 'bg-orange-50 text-orange-700 hover:bg-orange-100' },
              { href: '/ajuste', label: 'Ajustar estoque', bg: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100' },
              { href: '/historico', label: 'Ver histórico', bg: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
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