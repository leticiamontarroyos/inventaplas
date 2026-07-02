'use client'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/dashboard', label: 'Início' },
  { href: '/estoque', label: 'Estoque' },
  { href: '/producao', label: 'Produção' },
  { href: '/expedicao', label: 'Expedição' },
  { href: '/ajuste', label: 'Ajuste' },
  { href: '/historico', label: 'Histórico' },
  { href: '/produtos', label: 'Produtos' },
  { href: '/relatorios', label: 'Relatórios' },
  { href: '/estoque-negativo', label: '⚠️ Negativos' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const path = usePathname()
  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-1 flex-wrap">
          <span className="font-semibold text-gray-800 mr-4">InventaPlas</span>
          {links.map(l => (
            <Link key={l.href} href={l.href}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${
                path === l.href ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'
              }`}>
              {l.label}
            </Link>
          ))}
        </div>
        {user && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{user.name}</span>
            <button onClick={logout} className="text-sm text-red-500 hover:text-red-700">Sair</button>
          </div>
        )}
      </div>
    </nav>
  )
}