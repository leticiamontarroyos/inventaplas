'use client'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import api from '@/lib/api'

export default function ProducaoPage() {
  const [products, setProducts] = useState<any[]>([])
  const [warehouses, setWarehouses] = useState<any[]>([])
  const [entries, setEntries] = useState<any[]>([])
  const [form, setForm] = useState({ product_id: '', warehouse_id: '', quantity: '', lot: '', shift: 'manha', machine: '', operator_name: '', notes: '' })
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  const load = () => {
    api.get('/api/products/').then(r => setProducts(r.data))
    api.get('/api/warehouses/').then(r => setWarehouses(r.data))
    api.get('/api/stock/production').then(r => setEntries(r.data.slice(0, 20)))
  }
  useEffect(load, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMsg('')
    try {
      await api.post('/api/stock/production', { ...form, quantity: Number(form.quantity) })
      setMsg('Produção lançada com sucesso!')
      setForm({ ...form, quantity: '', lot: '', machine: '', operator_name: '', notes: '' })
      load()
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao lançar')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Lançar produção</h1>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Quantidade *</label>
                  <input type="number" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} required min={1}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Turno</label>
                  <select value={form.shift} onChange={e => setForm(f => ({ ...f, shift: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="manha">Turno A (Manhã)</option>
                    <option value="noite">Turno B (Noite)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Lote</label>
                  <input value={form.lot} onChange={e => setForm(f => ({ ...f, lot: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Máquina</label>
                  <select value={form.machine} onChange={e => setForm(f => ({ ...f, machine: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Selecione a máquina</option>
          <option value="Máquina 1 - 470t">Máquina 1 - 470t</option>
          <option value="Máquina 2 - 800t (I)">Máquina 2 - 800t (I)</option>
          <option value="Máquina 3 - 800t (II)">Máquina 3 - 800t (II)</option>
          <option value="Máquina 4 - 1080t (I)">Máquina 4 - 1080t (I)</option>
          <option value="Máquina 5 - 1300t">Máquina 5 - 1300t</option>
          <option value="Máquina 6 - 1000t">Máquina 6 - 1000t</option>
          <option value="Máquina 7 - 1080t (II)">Máquina 7 - 1080t (II)</option>
          <option value="Máquina 8 - 1400t">Máquina 8 - 1400t</option>
          <option value="Máquina 9 - 3060t">Máquina 9 - 3060t</option>
        </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Operador</label>
                <input value={form.operator_name} onChange={e => setForm(f => ({ ...f, operator_name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Observações</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              {msg && <p className="text-sm text-green-600">{msg}</p>}
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button type="submit" className="bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700">
                Confirmar lançamento
              </button>
            </form>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-sm font-medium text-gray-700 mb-3">Últimos lançamentos</p>
            <div className="flex flex-col gap-2">
              {entries.map(e => (
                <div key={e.id} className="flex justify-between items-start py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{e.product.name}</p>
                    <p className="text-xs text-gray-400">{e.warehouse.name} · {e.shift === 'manha' ? 'Manhã' : 'Noite'} · {e.operator_name || '—'}</p>
                  </div>
                  <span className="text-sm font-semibold text-green-600">+{e.quantity}</span>
                </div>
              ))}
              {entries.length === 0 && <p className="text-sm text-gray-400">Nenhum lançamento ainda</p>}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}