'use client'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import api from '@/lib/api'

const emptyForm = { sku: '', name: '', line: '', model: '', color: '', base: '', finish: '' }

export default function ProdutosPage() {
  const [products, setProducts] = useState<any[]>([])
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState<string | null>(null)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  const load = () => api.get('/api/products/').then(r => setProducts(r.data))
  useEffect(() => { load() }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMsg('')
    try {
      if (editing) {
        await api.put(`/api/products/${editing}`, form)
        setMsg('Produto atualizado!')
      } else {
        await api.post('/api/products/', form)
        setMsg('Produto cadastrado!')
      }
      setForm(emptyForm)
      setEditing(null)
      load()
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao salvar')
    }
  }

  const edit = (p: any) => {
    setForm({ sku: p.sku, name: p.name, line: p.line || '', model: p.model || '', color: p.color || '', base: p.base || '', finish: p.finish || '' })
    setEditing(p.id)
    setMsg('')
    setError('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Produtos</h1>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-sm font-medium text-gray-700 mb-4">{editing ? 'Editar produto' : 'Novo produto'}</p>
            <form onSubmit={submit} className="flex flex-col gap-3">
              {[
                ['SKU *', 'sku'],
                ['Nome completo *', 'name'],
                ['Linha', 'line'],
                ['Modelo', 'model'],
                ['Cor', 'color'],
                ['Base', 'base'],
                ['Acabamento', 'finish'],
              ].map(([label, key]) => (
                <div key={key}>
                  <label className="block text-sm text-gray-600 mb-1">{label}</label>
                  <input
                    value={(form as any)[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    required={label.includes('*')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
              {msg && <p className="text-sm text-green-600">{msg}</p>}
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button type="submit" className="bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700">
                {editing ? 'Salvar alterações' : 'Cadastrar produto'}
              </button>
              {editing && (
                <button type="button" onClick={() => { setEditing(null); setForm(emptyForm) }}
                  className="border border-gray-300 text-gray-600 rounded-lg py-2 text-sm hover:bg-gray-50">
                  Cancelar edição
                </button>
              )}
            </form>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">SKU</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Nome</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={p.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.sku}</td>
                    <td className="px-4 py-3 text-gray-800">{p.name}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => edit(p)} className="text-xs text-blue-500 hover:text-blue-700">editar</button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr><td colSpan={3} className="px-4 py-8 text-center text-gray-400">Nenhum produto cadastrado</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}