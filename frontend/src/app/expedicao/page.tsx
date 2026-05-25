'use client'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import api from '@/lib/api'

export default function ExpedicaoPage() {
  const [products, setProducts] = useState<any[]>([])
  const [warehouses, setWarehouses] = useState<any[]>([])
  const [entries, setEntries] = useState<any[]>([])
  const [form, setForm] = useState({ product_id: '', warehouse_id: '', quantity: '', order_number: '', client: '', truck_plate: '', notes: '' })
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  const load = () => {
    api.get('/api/products/').then(r => setProducts(r.data))
    api.get('/api/warehouses/').then(r => setWarehouses(r.data))
    api.get('/api/stock/dispatch').then(r => setEntries(r.data.slice(0, 20)))
  }
  useEffect(load, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMsg('')
    try {
      await api.post('/api/stock/dispatch', { ...form, quantity: Number(form.quantity) })
      setMsg('Saída registrada com sucesso!')
      setForm({ ...form, quantity: '', order_number: '', client: '', truck_plate: '', notes: '' })
      load()
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao registrar')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Registrar expedição</h1>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <form onSubmit={submit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Produto *</label>
                <select value={form.product_id} onChange={e => setForm(f => ({ ...f, product_id: e.target.value }))} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Selecione...</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Galpão *</label>
                <select value={form.warehouse_id} onChange={e => setForm(f => ({ ...f, warehouse_id: e.target.value }))} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Selecione...</option>
                  {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Quantidade *</label>
                <input type="number" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} required min={1}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Nº do pedido</label>
                <input value={form.order_number} onChange={e => setForm(f => ({ ...f, order_number: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Cliente</label>
                <input value={form.client} onChange={e => setForm(f => ({ ...f, client: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Placa do caminhão</label>
                <input value={form.truck_plate} onChange={e => setForm(f => ({ ...f, truck_plate: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              {msg && <p className="text-sm text-green-600">{msg}</p>}
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button type="submit" className="bg-orange-500 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-orange-600">
                Confirmar saída
              </button>
            </form>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-sm font-medium text-gray-700 mb-3">Últimas saídas</p>
            <div className="flex flex-col gap-2">
              {entries.map(e => (
                <div key={e.id} className="flex justify-between items-start py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{e.product.name}</p>
                    <p className="text-xs text-gray-400">{e.client || '—'} · {e.truck_plate || '—'}</p>
                  </div>
                  <span className="text-sm font-semibold text-red-500">-{e.quantity}</span>
                </div>
              ))}
              {entries.length === 0 && <p className="text-sm text-gray-400">Nenhuma saída ainda</p>}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}