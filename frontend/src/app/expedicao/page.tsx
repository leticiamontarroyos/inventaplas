'use client'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import api from '@/lib/api'

const SENHA_ADMIN = 'admin123'

export default function ExpedicaoPage() {
  const [products, setProducts] = useState<any[]>([])
  const [warehouses, setWarehouses] = useState<any[]>([])
  const [entries, setEntries] = useState<any[]>([])
  const [form, setForm] = useState({ product_id: '', warehouse_id: '', quantity: '', order_number: '', client: '', truck_plate: '', notes: '' })
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  // Modal excluir
  const [modalExcluir, setModalExcluir] = useState<any>(null)
  const [senhaExcluir, setSenhaExcluir] = useState('')
  const [erroSenha, setErroSenha] = useState('')

  // Modal editar
  const [modalEditar, setModalEditar] = useState<any>(null)
  const [formEditar, setFormEditar] = useState({ quantity: '', client: '', truck_plate: '', order_number: '', notes: '', senha: '' })
  const [erroEditar, setErroEditar] = useState('')
  const [msgEditar, setMsgEditar] = useState('')

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

  const confirmarExcluir = async () => {
    if (senhaExcluir !== SENHA_ADMIN) {
      setErroSenha('Senha incorreta!')
      return
    }
    try {
      await api.delete(`/api/stock/dispatch/${modalExcluir.id}`)
      setModalExcluir(null)
      setSenhaExcluir('')
      setErroSenha('')
      load()
    } catch {
      setErroSenha('Erro ao excluir. Tente novamente.')
    }
  }

  const abrirEditar = (entry: any) => {
    setFormEditar({ quantity: entry.quantity, client: entry.client || '', truck_plate: entry.truck_plate || '', order_number: entry.order_number || '', notes: entry.notes || '', senha: '' })
    setErroEditar('')
    setMsgEditar('')
    setModalEditar(entry)
  }

  const confirmarEditar = async () => {
    if (formEditar.senha !== SENHA_ADMIN) {
      setErroEditar('Senha incorreta!')
      return
    }
    try {
      await api.patch(`/api/stock/dispatch/${modalEditar.id}`, {
        quantity: Number(formEditar.quantity),
        client: formEditar.client,
        truck_plate: formEditar.truck_plate,
        order_number: formEditar.order_number,
        notes: formEditar.notes,
      })
      setMsgEditar('Atualizado com sucesso!')
      setTimeout(() => { setModalEditar(null); load() }, 1000)
    } catch {
      setErroEditar('Erro ao editar. Tente novamente.')
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
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-red-500">-{e.quantity}</span>
                    <button onClick={() => abrirEditar(e)} className="text-gray-400 hover:text-blue-600 text-xs px-1">✏️</button>
                    <button onClick={() => { setModalExcluir(e); setSenhaExcluir(''); setErroSenha('') }} className="text-gray-400 hover:text-red-600 text-xs px-1">🗑️</button>
                  </div>
                </div>
              ))}
              {entries.length === 0 && <p className="text-sm text-gray-400">Nenhuma saída ainda</p>}
            </div>
          </div>
        </div>
      </main>

      {/* Modal Excluir */}
      {modalExcluir && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">Excluir saída</h2>
            <p className="text-sm text-gray-500 mb-4">{modalExcluir.product.name} · -{modalExcluir.quantity} unidades</p>
            <p className="text-sm text-red-500 mb-3">⚠️ O estoque será revertido automaticamente.</p>
            <label className="block text-sm text-gray-600 mb-1">Senha de confirmação</label>
            <input type="password" value={senhaExcluir} onChange={e => setSenhaExcluir(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-red-400" placeholder="Digite a senha" />
            {erroSenha && <p className="text-xs text-red-500 mb-2">{erroSenha}</p>}
            <div className="flex gap-2 mt-2">
              <button onClick={() => setModalExcluir(null)} className="flex-1 border border-gray-300 rounded-lg py-2 text-sm text-gray-600 hover:bg-gray-50">Cancelar</button>
              <button onClick={confirmarExcluir} className="flex-1 bg-red-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-red-700">Excluir</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar */}
      {modalEditar && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">Editar saída</h2>
            <p className="text-sm text-gray-500 mb-4">{modalEditar.product.name}</p>
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Quantidade</label>
                <input type="number" value={formEditar.quantity} onChange={e => setFormEditar(f => ({ ...f, quantity: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Cliente</label>
                <input value={formEditar.client} onChange={e => setFormEditar(f => ({ ...f, client: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Placa do caminhão</label>
                <input value={formEditar.truck_plate} onChange={e => setFormEditar(f => ({ ...f, truck_plate: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Nº do pedido</label>
                <input value={formEditar.order_number} onChange={e => setFormEditar(f => ({ ...f, order_number: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Senha de confirmação</label>
                <input type="password" value={formEditar.senha} onChange={e => setFormEditar(f => ({ ...f, senha: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Digite a senha" />
              </div>
              {erroEditar && <p className="text-xs text-red-500">{erroEditar}</p>}
              {msgEditar && <p className="text-xs text-green-600">{msgEditar}</p>}
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setModalEditar(null)} className="flex-1 border border-gray-300 rounded-lg py-2 text-sm text-gray-600 hover:bg-gray-50">Cancelar</button>
              <button onClick={confirmarEditar} className="flex-1 bg-orange-500 text-white rounded-lg py-2 text-sm font-medium hover:bg-orange-600">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}