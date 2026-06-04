'use client'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import api from '@/lib/api'

const LINHAS_MOVEIS = ['Colmeia','Cross','Deluxe','Nature','Palhinha','Ripa','Seven','Simpla','Slim','Telinha','Vintage']

export default function RelatoriosPage() {
  const [estoque, setEstoque] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [catSel, setCatSel] = useState({ moveis: true, ud: true, infantil: true })
  const [linhasSel, setLinhasSel] = useState<string[]>(LINHAS_MOVEIS)

  const load = () => {
    api.get('/api/stock/positions').then(r => {
      setEstoque(r.data)
      setLoading(false)
    })
  }

  useEffect(load, [])

  const isMovel = (e: any) =>
    !e.product?.name?.toLowerCase().includes('bacia') &&
    !e.product?.name?.toLowerCase().includes('balde') &&
    !e.product?.name?.toLowerCase().includes('infantil') &&
    !e.product?.name?.toLowerCase().includes('relax')

  const isUD = (e: any) =>
    e.product?.name?.toLowerCase().includes('bacia') ||
    e.product?.name?.toLowerCase().includes('balde')

  const isInfantil = (e: any) =>
    e.product?.name?.toLowerCase().includes('infantil') ||
    e.product?.name?.toLowerCase().includes('relax')

  const moveis = estoque.filter(isMovel)
  const ud = estoque.filter(isUD)
  const infantil = estoque.filter(isInfantil)

  const moveisFiltered = moveis.filter(e =>
    linhasSel.some(l => e.product?.name?.toLowerCase().includes(l.toLowerCase()))
  )

  const totalMoveis = moveis.reduce((acc, e) => acc + e.quantity, 0)
  const totalUD = ud.reduce((acc, e) => acc + e.quantity, 0)
  const totalInfantil = infantil.reduce((acc, e) => acc + e.quantity, 0)

  const toggleLinha = (linha: string) => {
    setLinhasSel(prev =>
      prev.includes(linha) ? prev.filter(l => l !== linha) : [...prev, linha]
    )
  }

  const Secao = ({ titulo, itens, total }: { titulo: string, itens: any[], total: number }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 print-section">
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
          {itens.sort((a, b) => a.product?.name?.localeCompare(b.product?.name)).map((item, i) => (
            <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="py-2 text-gray-700">{item.product?.name}</td>
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

        {/* Controles — não aparecem na impressão */}
        <div className="no-print">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-500">Estoque atual por categoria</p>
            <button onClick={() => window.print()} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
              🖨️ Imprimir / Salvar PDF
            </button>
          </div>

          {/* Filtro de categorias */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Categorias</p>
            <div className="flex gap-4">
              {[
                { key: 'moveis', label: '🪑 Móveis' },
                { key: 'ud', label: '🪣 Utilidades' },
                { key: 'infantil', label: '🧒 Infantil' },
              ].map(c => (
                <label key={c.key} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={catSel[c.key as keyof typeof catSel]}
                    onChange={() => setCatSel(prev => ({ ...prev, [c.key]: !prev[c.key as keyof typeof catSel] }))}
                    className="w-4 h-4" />
                  <span className="text-sm text-gray-700">{c.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Filtro de linhas (só aparece se Móveis estiver selecionado) */}
          {catSel.moveis && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm font-medium text-gray-700">Linhas de móveis</p>
                <div className="flex gap-2">
                  <button onClick={() => setLinhasSel(LINHAS_MOVEIS)} className="text-xs text-blue-600 hover:underline">Todas</button>
                  <span className="text-gray-300">|</span>
                  <button onClick={() => setLinhasSel([])} className="text-xs text-gray-500 hover:underline">Nenhuma</button>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {LINHAS_MOVEIS.map(linha => (
                  <label key={linha} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={linhasSel.includes(linha)}
                      onChange={() => toggleLinha(linha)} className="w-4 h-4" />
                    <span className="text-sm text-gray-700">{linha}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <p className="text-gray-500">Carregando...</p>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {catSel.moveis && <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <p className="text-sm text-gray-500 mb-1">Móveis</p>
                <p className="text-2xl font-bold text-gray-800">{totalMoveis.toLocaleString('pt-BR')}</p>
              </div>}
              {catSel.ud && <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <p className="text-sm text-gray-500 mb-1">Utilidades</p>
                <p className="text-2xl font-bold text-gray-800">{totalUD.toLocaleString('pt-BR')}</p>
              </div>}
              {catSel.infantil && <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <p className="text-sm text-gray-500 mb-1">Infantil</p>
                <p className="text-2xl font-bold text-gray-800">{totalInfantil.toLocaleString('pt-BR')}</p>
              </div>}
            </div>

            {catSel.moveis && <Secao titulo="Móveis" itens={moveisFiltered} total={moveisFiltered.reduce((a, e) => a + e.quantity, 0)} />}
            {catSel.ud && <Secao titulo="Utilidades Domésticas" itens={ud} total={totalUD} />}
            {catSel.infantil && <Secao titulo="Linha Infantil" itens={infantil} total={totalInfantil} />}
          </>
        )}
      </main>

      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          nav { display: none !important; }
        }
      `}</style>
    </div>
  )
}