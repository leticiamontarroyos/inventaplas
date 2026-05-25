'use client'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import api from '@/lib/api'

export default function AjustePage() {
  const [products, setProducts] = useState<any[]>([])
  const [warehouses, setWarehouses] = useState<any[]>([])
  const [form, setForm] = useState({ product_id: '', warehouse_id: '', qty_counted: '', reason: '' })
  const [current, setCurrent] = useState<number | null>(null)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/api/products/').then(r => setProducts(r.data))
    api.get('/api/warehouses/').then(r => setWarehouses(r.data))
  }, [])

  useEffect(() => {
    if (!form.product_id || !form.warehouse_id) { setCurrent(null); return }
    api.get('/api/stock/positions').then(r => {
      const pos = r.data.find((p: any) => p.product_id === form.product_id && p.warehouse_id === form.warehouse_id)
      setCurrent(pos ? pos.quantity : 0)
    }).catch(() => setCurrent(0))
  }, [form.product_id, form.warehouse_id])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMsg('')
    try {
      await api.post('/api/stock/adjustment', { ...form, qty_counted: Number(form.qty_counted) })
      setMsg('Ajuste registrado com sucesso!')
      setForm({ product_id: '', warehouse_id: '', qty_counted: '', reason: '' })
      setCurrent(null)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao ajustar')
    }
  }

  const diff = current !== null && form.qty_counted !== '' ? Number(form.qty_counted) - current : null

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Ajuste de estoque</h1>
        <p className="text-sm text-gray-500 mb-6">Use para corrigir divergências após contagem física.</p>
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
            {current !== null && (
              <div className="bg-blue-50 rounded-lg px-4 py-3 text-sm">
                <span className="text-blue-600">Estoque atual no sistema: </span>
                <span className="font-semibold text-blue-800">{current} unidades</span>
              </div>
            )}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Quantidade contada *</label>
              <input type="number" value={form.qty_counted} onChange={e => setForm(f => ({ ...f, qty_counted: e.target.value }))} required min={0}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            {diff !== null && (
              <div className={`rounded-lg px-4 py-3 text-sm ${diff === 0 ? 'bg-green-50 text-green-700' : diff > 0 ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'}`}>
                Diferença: <span className="font-semibold">{diff > 0 ? '+' : ''}{diff} unidades</span>
                {diff === 0 && ' — estoque está correto'}
                {diff > 0 && ' — sobra no físico'}
                {diff < 0 && ' — falta no físico'}
              </div>
            )}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Motivo do ajuste *</label>
              <textarea value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} required rows={2}
                placeholder="Ex: divergência na contagem, devolução de cliente..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            {msg && <p className="text-sm text-green-600">{msg}</p>}
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button type="submit" className="bg-yellow-500 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-yellow-600">
              Confirmar ajuste
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}