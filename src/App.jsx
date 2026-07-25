import { useState, useEffect, useCallback } from 'react'
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  DollarSign,
  AlertTriangle,
  Plus,
  Search,
  Trash2,
  Minus,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Receipt,
  UserCircle,
  Menu,
  X,
  Loader2,
  RefreshCw,
  CreditCard,
  FileText,
} from 'lucide-react'

import {
  listProducts,
  listClients,
  listSales,
  createProduct,
  createClient,
  processSale,
} from './lib/appwrite'

import {
  SignedIn,
  SignedOut,
  SignIn,
  UserButton,
  OrganizationProfile,
  useAuth,
  useOrganization
} from '@clerk/clerk-react'

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// ============================================================
// SIDEBAR COMPONENT
// ============================================================
const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'ventas', label: 'Ventas (POS)', icon: ShoppingCart },
  { key: 'inventario', label: 'Inventario', icon: Package },
  { key: 'clientes', label: 'Clientes', icon: Users },
  { key: 'suscripcion', label: 'Suscripción', icon: CreditCard },
  { key: 'reportes', label: 'Reportes', icon: FileText },
]

function Sidebar({ activeModule, setActiveModule, mobileOpen, setMobileOpen, orgRole }) {
  const isCashier = orgRole === 'org:member'
  const filteredNavItems = navItems.filter(item => {
    if (isCashier && item.key !== 'ventas') return false
    return true
  })

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-[260px] bg-[#0a235c] flex flex-col
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
          <img
            src="/logo.jpeg"
            alt="Businessia Logo"
            className="w-11 h-11 rounded-xl object-cover bg-white shadow-md"
          />
          <div>
            <h1 className="text-white font-extrabold text-lg tracking-tight leading-none">
              Businessia
            </h1>
            <span className="text-cyan-300 text-[11px] font-medium tracking-wide">
              Crecemos contigo
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto lg:hidden text-white/60 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          {filteredNavItems.map((item) => {
            const Icon = item.icon
            const isActive = activeModule === item.key
            return (
              <button
                key={item.key}
                onClick={() => {
                  setActiveModule(item.key)
                  setMobileOpen(false)
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                  transition-all duration-200 cursor-pointer group
                  ${isActive
                    ? 'bg-[#128bb5] text-white shadow-lg shadow-cyan-500/20'
                    : 'text-white/60 hover:text-white hover:bg-white/8'
                  }
                `}
              >
                <Icon
                  size={19}
                  className={`transition-transform duration-200 ${isActive ? '' : 'group-hover:scale-110'}`}
                />
                {item.label}
                {isActive && <ChevronRight size={15} className="ml-auto opacity-60" />}
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#128bb5] flex items-center justify-center">
              <span className="text-white text-xs font-bold">PV</span>
            </div>
            <div>
              <p className="text-white text-xs font-semibold">Portoviejo</p>
              <p className="text-white/40 text-[10px]">Sucursal Principal</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

// ============================================================
// HEADER COMPONENT
// ============================================================
function Header({ activeModule, setMobileOpen }) {
  const titles = {
    dashboard: 'Panel Principal',
    ventas: 'Punto de Venta',
    inventario: 'Gestión de Inventario',
    clientes: 'Gestión de Clientes',
    suscripcion: 'Suscripción y Planes',
    reportes: 'Reportes y PDF',
  }

  const now = new Date()
  const dateStr = now.toLocaleDateString('es-EC', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="flex items-center justify-between px-5 lg:px-8 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-600"
          >
            <Menu size={20} />
          </button>
          <div>
            <h2 className="text-lg lg:text-xl font-extrabold text-[#0a235c] tracking-tight">
              {titles[activeModule]}
            </h2>
            <p className="text-xs text-gray-400 capitalize mt-0.5">{dateStr}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2 border border-gray-100">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-gray-500 font-medium">En línea</span>
          </div>
          <div className="flex items-center gap-2.5 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
            <UserButton />
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-gray-700 leading-none">Mi Cuenta</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Gestión de Perfil</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

// ============================================================
// LOADING SPINNER
// ============================================================
function LoadingSpinner({ text = 'Cargando...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 size={40} className="text-[#128bb5] animate-spin mb-3" />
      <p className="text-sm text-gray-500 font-medium">{text}</p>
    </div>
  )
}

// ============================================================
// KPI CARD COMPONENT
// ============================================================
function KpiCard({ icon: Icon, label, value, subtext, bgColor, iconColor, trend }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow duration-300 group">
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 ${bgColor} rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
          <Icon size={20} className={iconColor} />
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
            <TrendingUp size={12} />
            {trend}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-extrabold text-[#0a235c] tracking-tight">{value}</p>
        <p className="text-sm text-gray-500 font-medium mt-0.5">{label}</p>
        {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
      </div>
    </div>
  )
}

// ============================================================
// ADD PRODUCT MODAL
// ============================================================
function AddProductModal({ onClose, onSave }) {
  const [form, setForm] = useState({ name: '', category: '', price: '', stock: '', sku: '' })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!form.name || !form.category || !form.price || !form.stock || !form.sku) return
    setSaving(true)
    try {
      await onSave({
        name: form.name,
        category: form.category,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        sku: form.sku,
      })
      onClose()
    } catch (e) {
      console.error('Error creating product:', e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-[#0a235c]">Añadir Producto</h3>
        <div className="space-y-3">
          {[
            { key: 'name', label: 'Nombre', placeholder: 'Ej: Arroz (Saco 50lb)' },
            { key: 'category', label: 'Categoría', placeholder: 'Ej: Granos' },
            { key: 'sku', label: 'SKU', placeholder: 'Ej: GR-004' },
            { key: 'price', label: 'Precio ($)', placeholder: '0.00', type: 'number' },
            { key: 'stock', label: 'Stock Inicial', placeholder: '0', type: 'number' },
          ].map((field) => (
            <div key={field.key}>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">{field.label}</label>
              <input
                type={field.type || 'text'}
                placeholder={field.placeholder}
                value={form[field.key]}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#128bb5]/30 focus:border-[#128bb5]"
              />
            </div>
          ))}
        </div>
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#128bb5] to-[#0a235c] text-white text-sm font-semibold shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// ADD CLIENT MODAL
// ============================================================
function AddClientModal({ onClose, onSave }) {
  const [form, setForm] = useState({ name: '', cedula: '', phone: '' })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!form.name || !form.cedula || !form.phone) return
    setSaving(true)
    try {
      await onSave({
        name: form.name,
        cedula: form.cedula,
        phone: form.phone,
        purchases: 0,
      })
      onClose()
    } catch (e) {
      console.error('Error creating client:', e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-[#0a235c]">Registrar Cliente</h3>
        <div className="space-y-3">
          {[
            { key: 'name', label: 'Nombre Completo', placeholder: 'Ej: María López' },
            { key: 'cedula', label: 'Cédula', placeholder: 'Ej: 1312345678' },
            { key: 'phone', label: 'Teléfono', placeholder: 'Ej: 0991234567' },
          ].map((field) => (
            <div key={field.key}>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">{field.label}</label>
              <input
                type="text"
                placeholder={field.placeholder}
                value={form[field.key]}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#128bb5]/30 focus:border-[#128bb5]"
              />
            </div>
          ))}
        </div>
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#128bb5] to-[#0a235c] text-white text-sm font-semibold shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// DASHBOARD MODULE
// ============================================================
function DashboardModule({ products, clients, sales, loading, onNavigate }) {
  if (loading) return <LoadingSpinner text="Cargando dashboard..." />

  const lowStock = products.filter((p) => p.stock < 5).length

  // Calculate today's sales
  const today = new Date().toISOString().slice(0, 10)
  const todaySales = sales.filter((s) => s.createdDate && s.createdDate.slice(0, 10) === today)
  const todayTotal = todaySales.reduce((sum, s) => sum + s.total, 0)
  const todayCount = todaySales.length

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          icon={DollarSign}
          label="Ventas del Día"
          value={`$${todayTotal.toFixed(2)}`}
          subtext={`${todayCount} transaccion${todayCount !== 1 ? 'es' : ''} hoy`}
          bgColor="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <KpiCard
          icon={Package}
          label="Total Productos"
          value={products.length}
          subtext="En catálogo activo"
          bgColor="bg-blue-50"
          iconColor="text-blue-600"
        />
        <KpiCard
          icon={Users}
          label="Clientes"
          value={clients.length}
          subtext="Clientes registrados"
          bgColor="bg-violet-50"
          iconColor="text-violet-600"
        />
        <KpiCard
          icon={AlertTriangle}
          label="Alertas de Stock"
          value={lowStock}
          subtext="Productos con stock bajo"
          bgColor="bg-amber-50"
          iconColor="text-amber-600"
        />
      </div>

      {/* Quick Actions + Recent Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-sm font-bold text-[#0a235c] uppercase tracking-wider mb-4">
            Acciones Rápidas
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => onNavigate('ventas')}
              className="w-full flex items-center gap-3 bg-gradient-to-r from-[#128bb5] to-[#0a235c] text-white rounded-xl px-4 py-3.5 text-sm font-semibold shadow-md shadow-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
            >
              <ShoppingCart size={18} />
              Nueva Venta
            </button>
            <button
              onClick={() => onNavigate('inventario')}
              className="w-full flex items-center gap-3 bg-white border-2 border-dashed border-gray-200 text-gray-600 rounded-xl px-4 py-3.5 text-sm font-semibold hover:border-[#128bb5] hover:text-[#128bb5] transition-all duration-300 cursor-pointer"
            >
              <Plus size={18} />
              Añadir Producto
            </button>
            <button
              onClick={() => onNavigate('clientes')}
              className="w-full flex items-center gap-3 bg-white border-2 border-dashed border-gray-200 text-gray-600 rounded-xl px-4 py-3.5 text-sm font-semibold hover:border-[#128bb5] hover:text-[#128bb5] transition-all duration-300 cursor-pointer"
            >
              <Users size={18} />
              Registrar Cliente
            </button>
          </div>
        </div>

        {/* Recent Sales */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#0a235c] uppercase tracking-wider">
              Ventas Recientes
            </h3>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Clock size={12} />
              Últimas registradas
            </span>
          </div>
          <div className="space-y-3">
            {sales.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No hay ventas registradas aún</p>
            ) : (
              sales.slice(0, 5).map((sale) => {
                const timeAgo = getTimeAgo(sale.createdDate)
                return (
                  <div
                    key={sale.id}
                    className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0a235c] to-[#128bb5] flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {sale.clientName.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{sale.clientName}</p>
                        <p className="text-xs text-gray-400">
                          {sale.itemCount} producto{sale.itemCount !== 1 ? 's' : ''} · {timeAgo}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-emerald-600">
                      ${sale.total.toFixed(2)}
                    </span>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Low Stock Alerts */}
      {lowStock > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-sm font-bold text-[#0a235c] uppercase tracking-wider mb-4">
            ⚠️ Productos con Stock Bajo
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {products
              .filter((p) => p.stock < 5)
              .map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-red-100 bg-red-50/50"
                >
                  <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                    <AlertTriangle size={16} className="text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 leading-tight">{p.name}</p>
                    <p className="text-xs text-red-500 font-medium">{p.stock} unidades</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================
// INVENTORY MODULE
// ============================================================
function InventoryModule({ products, loading, onRefresh, productLimit }) {
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('Todos')
  const [showAddModal, setShowAddModal] = useState(false)

  if (loading) return <LoadingSpinner text="Cargando inventario..." />

  const categories = ['Todos', ...new Set(products.map((p) => p.category))]

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = filterCategory === 'Todos' || p.category === filterCategory
    return matchesSearch && matchesCategory
  })

  // Submit Producto
  const handleAddProduct = async (e) => {
    e.preventDefault()
    if (!organization?.id) {
      alert('Debes seleccionar una organización.')
      return
    }
    
    try {
      if (editMode) {
        await updateProduct(editMode.id, formData)
      } else {
        await createProduct(organization.id, formData)
      }
      setEditMode(null)
      setShowAddModal(false)
      fetchData()
    } catch (e) {
      alert('Error guardando producto')
    }
  }

  return (
    <div className="space-y-5">
      {showAddModal && (
        <AddProductModal 
          onClose={() => { setShowAddModal(false); setEditMode(null); }} 
          onSave={handleAddProduct} 
          formData={formData}
          setFormData={setFormData}
          editMode={editMode}
        />
      )}

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar producto por nombre o SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#128bb5]/30 focus:border-[#128bb5] transition-all duration-200"
            />
          </div>
          <button
            onClick={() => {
              if (products.length >= productLimit) {
                alert('Has alcanzado el límite de productos de tu plan actual. Por favor, mejora tu plan en la pestaña de Suscripción.')
                return
              }
              setShowAddModal(true)
            }}
            disabled={products.length >= productLimit}
            className={`flex items-center gap-1.5 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md ${
              products.length >= productLimit
                ? 'bg-gray-400 cursor-not-allowed opacity-70'
                : 'bg-[#128bb5] hover:bg-[#0e7a9f] cursor-pointer shadow-cyan-500/20'
            }`}
          >
            <Plus size={14} />
            Nuevo Producto
          </button>
          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-2.5 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <RefreshCw size={14} />
          </button>
        </div>
        <div className="flex gap-2 flex-wrap mt-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                filterCategory === cat
                  ? 'bg-[#128bb5] text-white shadow-md shadow-cyan-500/20'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
            <Package size={16} className="text-blue-600" />
          </div>
          <div>
            <p className="text-lg font-extrabold text-[#0a235c]">{products.length}</p>
            <p className="text-[10px] text-gray-400 font-medium">Total Productos</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center">
            <CheckCircle2 size={16} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-lg font-extrabold text-[#0a235c]">{products.filter((p) => p.stock >= 5).length}</p>
            <p className="text-[10px] text-gray-400 font-medium">Disponibles</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center">
            <AlertTriangle size={16} className="text-red-500" />
          </div>
          <div>
            <p className="text-lg font-extrabold text-[#0a235c]">{products.filter((p) => p.stock < 5).length}</p>
            <p className="text-[10px] text-gray-400 font-medium">Stock Bajo</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 bg-violet-50 rounded-lg flex items-center justify-center">
            <DollarSign size={16} className="text-violet-600" />
          </div>
          <div>
            <p className="text-lg font-extrabold text-[#0a235c]">
              ${products.reduce((s, p) => s + p.price * p.stock, 0).toFixed(0)}
            </p>
            <p className="text-[10px] text-gray-400 font-medium">Valor Inventario</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Producto</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Categoría</th>
                <th className="text-right px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Precio</th>
                <th className="text-center px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="text-center px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product, i) => (
                <tr
                  key={product.id}
                  className={`border-b border-gray-50 hover:bg-gray-50/80 transition-colors duration-150 ${
                    i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                  }`}
                >
                  <td className="px-5 py-3.5 text-xs text-gray-400 font-mono">{product.sku}</td>
                  <td className="px-5 py-3.5 font-semibold text-gray-800">{product.name}</td>
                  <td className="px-5 py-3.5">
                    <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-lg">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right font-bold text-[#0a235c]">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-5 py-3.5 text-center font-semibold text-gray-700">{product.stock}</td>
                  <td className="px-5 py-3.5 text-center">
                    {product.stock < 5 ? (
                      <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 text-xs font-semibold px-3 py-1 rounded-full">
                        <XCircle size={12} />
                        Bajo Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 text-xs font-semibold px-3 py-1 rounded-full">
                        <CheckCircle2 size={12} />
                        Disponible
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    <Package size={40} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No se encontraron productos</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            Mostrando {filtered.length} de {products.length} productos
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-600">
              Uso del Plan: {products.length} / {productLimit === Infinity ? 'Ilimitado' : productLimit}
            </span>
            {products.length >= productLimit && (
              <span className="text-[10px] bg-red-100 text-red-600 px-2 py-1 rounded-md font-bold uppercase tracking-wide">
                Límite Alcanzado
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// SALES (POS) MODULE
// ============================================================
function SalesModule({ products, onRefresh, organization, fetchData }) {
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState([])
  const [clientName, setClientName] = useState('Consumidor Final')
  const [processing, setProcessing] = useState(false)
  const [saleSuccess, setSaleSuccess] = useState(false)

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        if (existing.qty >= product.stock) return prev
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      }
      return [...prev, { ...product, qty: 1, originalStock: product.stock }]
    })
  }

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId))
  }

  const updateQty = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id !== productId) return item
          const newQty = Math.max(0, Math.min(item.originalStock, item.qty + delta))
          return { ...item, qty: newQty }
        })
        .filter((item) => item.qty > 0)
    )
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  const iva = subtotal * 0.15
  const total = subtotal + iva

  // Checkout Venta
  const handleCheckout = async () => {
    if (cart.length === 0 || processing) return
    if (!organization?.id) {
      alert('Debes seleccionar una organización.')
      return
    }
    setProcessing(true)
    try {
      await processSale(organization.id, cart, clientName)
      setSaleSuccess(true)
      setCart([])
      setClientName('Consumidor Final')
      fetchData()
      setTimeout(() => setSaleSuccess(false), 3000)
    } catch (e) {
      console.error('Error processing sale:', e)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-5 h-[calc(100vh-130px)]">
      {/* Success Toast */}
      {saleSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-500 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-bounce">
          <CheckCircle2 size={18} />
          <span className="text-sm font-semibold">¡Venta registrada exitosamente!</span>
        </div>
      )}

      {/* Products Panel - 70% */}
      <div className="lg:w-[70%] flex flex-col gap-4 min-h-0">
        {/* Search */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar productos para agregar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#128bb5]/30 focus:border-[#128bb5] transition-all duration-200"
            />
          </div>
        </div>

        {/* Product Grid */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {filteredProducts.map((product) => {
              const inCart = cart.find((item) => item.id === product.id)
              return (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  disabled={product.stock < 1}
                  className={`
                    relative text-left p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer group
                    ${inCart
                      ? 'border-[#128bb5] bg-cyan-50/50 shadow-md shadow-cyan-500/10'
                      : 'border-gray-100 hover:border-[#128bb5]/40 hover:shadow-md'
                    }
                    ${product.stock < 1 ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {inCart && (
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#128bb5] text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                      {inCart.qty}
                    </span>
                  )}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-800 group-hover:text-[#0a235c] transition-colors line-clamp-1">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{product.category} · {product.sku}</p>
                    </div>
                    <p className="text-sm font-extrabold text-[#128bb5] whitespace-nowrap">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      product.stock < 5 ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      Stock: {product.stock}
                    </span>
                    <Plus size={16} className="text-gray-300 group-hover:text-[#128bb5] transition-colors" />
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Cart Panel - 30% */}
      <div className="lg:w-[30%] bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col min-h-0">
        {/* Cart Header */}
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-[#0a235c] flex items-center justify-center">
              <Receipt size={16} className="text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0a235c]">Resumen de Venta</h3>
              <p className="text-[10px] text-gray-400">
                {cart.length} producto{cart.length !== 1 ? 's' : ''} en carrito
              </p>
            </div>
          </div>
          {/* Client input */}
          <input
            type="text"
            placeholder="Nombre del cliente..."
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#128bb5]/30 focus:border-[#128bb5]"
          />
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-300">
              <ShoppingCart size={48} className="mb-3 opacity-30" />
              <p className="text-sm font-medium text-gray-400">Carrito vacío</p>
              <p className="text-xs text-gray-300 mt-1">Selecciona productos para agregar</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">${item.price.toFixed(2)} c/u</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => updateQty(item.id, -1)}
                    className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-colors cursor-pointer"
                  >
                    <Minus size={12} className="text-gray-500" />
                  </button>
                  <span className="w-7 text-center text-sm font-bold text-[#0a235c]">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.id, 1)}
                    className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-emerald-50 hover:border-emerald-200 transition-colors cursor-pointer"
                  >
                    <Plus size={12} className="text-gray-500" />
                  </button>
                </div>
                <div className="text-right ml-1">
                  <p className="text-sm font-bold text-[#0a235c]">${(item.price * item.qty).toFixed(2)}</p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors cursor-pointer mt-0.5"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Footer */}
        <div className="border-t border-gray-100 px-5 py-4 space-y-3">
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-semibold text-gray-700">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">IVA (15%)</span>
              <span className="font-semibold text-gray-700">${iva.toFixed(2)}</span>
            </div>
            <div className="h-px bg-gray-100 my-2" />
            <div className="flex justify-between">
              <span className="text-base font-bold text-[#0a235c]">Total</span>
              <span className="text-xl font-extrabold text-[#0a235c]">${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            disabled={cart.length === 0 || processing}
            onClick={handleCheckout}
            className={`
              w-full py-3.5 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer
              ${cart.length > 0 && !processing
                ? 'bg-gradient-to-r from-[#128bb5] to-[#0a235c] text-white shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/35 hover:-translate-y-0.5 active:translate-y-0'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            <span className="flex items-center justify-center gap-2">
              {processing ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  Confirmar Venta
                </>
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// CLIENTS MODULE
// ============================================================
function ClientsModule({ clients, loading, onRefresh, organization, fetchData }) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [clientFormData, setClientFormData] = useState({ name: '', cedula: '', phone: '' })
  const [editClientMode, setEditClientMode] = useState(null)

  if (loading) return <LoadingSpinner text="Cargando clientes..." />

    <div className="space-y-5">
      {showAddModal && (
        <AddClientModal onClose={() => setShowAddModal(false)} onSave={handleAddClient} />
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-11 h-11 bg-violet-50 rounded-xl flex items-center justify-center">
            <Users size={20} className="text-violet-600" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-[#0a235c]">{clients.length}</p>
            <p className="text-sm text-gray-500 font-medium">Clientes Registrados</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center">
            <TrendingUp size={20} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-[#0a235c]">
              {clients.reduce((s, c) => s + c.purchases, 0)}
            </p>
            <p className="text-sm text-gray-500 font-medium">Compras Totales</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-11 h-11 bg-amber-50 rounded-xl flex items-center justify-center">
            <DollarSign size={20} className="text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-[#0a235c]">
              {clients.length > 0
                ? `$${(clients.reduce((s, c) => s + c.purchases, 0) * 30).toLocaleString()}`
                : '$0'}
            </p>
            <p className="text-sm text-gray-500 font-medium">Valor Estimado</p>
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#0a235c] uppercase tracking-wider">
            Directorio de Clientes
          </h3>
          <div className="flex gap-2">
            <button
              onClick={onRefresh}
              className="flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <RefreshCw size={14} />
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 bg-[#128bb5] text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-[#0e7a9f] transition-colors cursor-pointer shadow-md shadow-cyan-500/20"
            >
              <Plus size={14} />
              Nuevo Cliente
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Cédula</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Teléfono</th>
                <th className="text-center px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Compras</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client, i) => (
                <tr
                  key={client.id}
                  className={`border-b border-gray-50 hover:bg-gray-50/80 transition-colors duration-150 ${
                    i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                  }`}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0a235c] to-[#128bb5] flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {client.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <span className="font-semibold text-gray-800">{client.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 font-mono text-xs">{client.cedula}</td>
                  <td className="px-5 py-3.5 text-gray-500">{client.phone}</td>
                  <td className="px-5 py-3.5 text-center">
                    <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                      {client.purchases}
                    </span>
                  </td>
                </tr>
              ))}
              {clients.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-gray-400">
                    <Users size={40} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No hay clientes registrados</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// HELPER: Time Ago
// ============================================================
function getTimeAgo(dateString) {
  if (!dateString) return ''
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Justo ahora'
  if (diffMins < 60) return `Hace ${diffMins} min`
  if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`
  return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`
}

// ============================================================
// REPORTES COMPONENT
// ============================================================
function ReportesModule({ products, clients, sales, organization }) {
  const [options, setOptions] = useState({
    ventas: true,
    inventario: true,
    clientes: true,
    facturacion: true,
  })

  const handleToggle = (key) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const generarPDF = async () => {
    try {
      let primaryColor = [18, 139, 181] // Default teal
      let logoDataUrl = null
      let logoW = 0
      let logoH = 0

      // Try to load organization image and extract color
      if (organization?.hasImage && organization.imageUrl) {
        try {
          const img = new Image()
          img.crossOrigin = "Anonymous"
          img.src = organization.imageUrl
          await new Promise((resolve, reject) => {
            img.onload = resolve
            img.onerror = reject
          })
          
          const canvas = document.createElement('canvas')
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0)
          
          try {
            const imgData = ctx.getImageData(0, 0, img.width, img.height).data
            
            // Advanced Dominant Color Extraction (Color Quantization & Saturation Weighting)
            const colorBins = {}
            let maxScore = 0
            let bestBin = null

            const getSaturation = (r, g, b) => {
              const max = Math.max(r, g, b)
              const min = Math.min(r, g, b)
              return max === 0 ? 0 : (max - min) / max
            }

            for (let i = 0; i < imgData.length; i += 4 * 4) { // Sample every 4th pixel for high accuracy
              const r = imgData[i]
              const g = imgData[i+1]
              const b = imgData[i+2]
              const a = imgData[i+3]
              
              // Ignore highly transparent pixels
              if (a < 127) continue
              
              // Ignore near-white (background) pixels
              if (r > 240 && g > 240 && b > 240) continue

              // Ignore near-black (usually text) if we want a brand color, but keep if it's the only color
              const isDark = r < 30 && g < 30 && b < 30

              // Quantize colors (group similar colors)
              const binSize = 24
              const rBin = Math.round(r / binSize) * binSize
              const gBin = Math.round(g / binSize) * binSize
              const bBin = Math.round(b / binSize) * binSize
              
              const binKey = `${rBin},${gBin},${bBin}`
              
              if (!colorBins[binKey]) {
                colorBins[binKey] = { r: 0, g: 0, b: 0, count: 0, score: 0 }
              }
              
              // Score pixel. Saturated colors get a big bonus to prioritize brand colors over gray text.
              const saturation = getSaturation(r, g, b)
              let score = 1
              if (!isDark) {
                 score += saturation * 15 // Heavily weight saturated colors
              }
              
              colorBins[binKey].r += r
              colorBins[binKey].g += g
              colorBins[binKey].b += b
              colorBins[binKey].count += 1
              colorBins[binKey].score += score
              
              if (colorBins[binKey].score > maxScore) {
                maxScore = colorBins[binKey].score
                bestBin = colorBins[binKey]
              }
            }
            
            // If we found a dominant color, calculate its exact average
            if (bestBin && bestBin.count > 0) {
              primaryColor = [
                Math.floor(bestBin.r / bestBin.count),
                Math.floor(bestBin.g / bestBin.count),
                Math.floor(bestBin.b / bestBin.count)
              ]
            }
          } catch(e) {
            console.error('Advanced color extraction failed', e)
          }
          
          logoDataUrl = canvas.toDataURL('image/png')
          const ratio = img.width / img.height
          logoH = 20
          logoW = logoH * ratio
        } catch(e) {
          console.error('Error loading logo for PDF', e)
        }
      }

      const doc = new jsPDF()
      const now = new Date()
      const dateStr = now.toLocaleDateString('es-EC', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
      const orgName = organization?.name || 'Mi Organización'
      
      // Top colored bar
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
      doc.rect(0, 0, doc.internal.pageSize.width, 4, 'F')
      
      let textX = 14
      if (logoDataUrl) {
        doc.addImage(logoDataUrl, 'PNG', 14, 10, logoW, logoH)
        textX = 14 + logoW + 5
      }
      
      doc.setFontSize(22)
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
      doc.setFont('helvetica', 'bold')
      doc.text(orgName, textX, 20)
      
      doc.setFontSize(14)
      doc.setTextColor(100, 100, 100)
      doc.setFont('helvetica', 'normal')
      doc.text('Reporte General del Sistema', textX, 28)
      
      let yPos = Math.max(35, logoH + 15)
      
      doc.setFontSize(10)
      doc.setTextColor(150, 150, 150)
      doc.text(`Fecha de generación: ${dateStr}`, 14, yPos)
      yPos += 12

      if (options.ventas) {
        if (yPos > 250) { doc.addPage(); yPos = 20; }
        doc.setFontSize(14)
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
        doc.setFont('helvetica', 'bold')
        doc.text('Resumen de Ventas', 14, yPos)
        yPos += 5
        
        const tableData = sales.map(s => [
          new Date(s.createdDate).toLocaleDateString('es-EC'),
          s.clientName,
          s.itemCount?.toString() || '0',
          `$${(s.total || 0).toFixed(2)}`
        ])
        
        autoTable(doc, {
          startY: yPos,
          head: [['Fecha', 'Cliente', 'Artículos', 'Total']],
          body: tableData,
          theme: 'striped',
          headStyles: { fillColor: primaryColor, textColor: 255, fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [245, 247, 250] },
          styles: { font: 'helvetica', fontSize: 10, cellPadding: 4 }
        })
        yPos = doc.lastAutoTable.finalY + 15
      }

      if (options.inventario) {
        if (yPos > 250) { doc.addPage(); yPos = 20; }
        doc.setFontSize(14)
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
        doc.setFont('helvetica', 'bold')
        doc.text('Inventario de Productos', 14, yPos)
        yPos += 5
        
        const tableData = products.map(p => [
          p.name,
          p.category || 'N/A',
          p.stock?.toString() || '0',
          `$${(p.price || 0).toFixed(2)}`
        ])
        
        autoTable(doc, {
          startY: yPos,
          head: [['Producto', 'Categoría', 'Stock', 'Precio Unitario']],
          body: tableData,
          theme: 'striped',
          headStyles: { fillColor: primaryColor, textColor: 255, fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [245, 247, 250] },
          styles: { font: 'helvetica', fontSize: 10, cellPadding: 4 }
        })
        yPos = doc.lastAutoTable.finalY + 15
      }

      if (options.clientes) {
        if (yPos > 250) { doc.addPage(); yPos = 20; }
        doc.setFontSize(14)
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
        doc.setFont('helvetica', 'bold')
        doc.text('Listado de Clientes', 14, yPos)
        yPos += 5
        
        const tableData = clients.map(c => [
          c.name,
          c.cedula || 'N/A',
          c.phone || 'N/A',
          c.purchases?.toString() || '0'
        ])
        
        autoTable(doc, {
          startY: yPos,
          head: [['Nombre', 'Cédula', 'Teléfono', 'Compras Realizadas']],
          body: tableData,
          theme: 'striped',
          headStyles: { fillColor: primaryColor, textColor: 255, fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [245, 247, 250] },
          styles: { font: 'helvetica', fontSize: 10, cellPadding: 4 }
        })
        yPos = doc.lastAutoTable.finalY + 15
      }

      if (options.facturacion) {
        if (yPos > 250) { doc.addPage(); yPos = 20; }
        doc.setFontSize(14)
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
        doc.setFont('helvetica', 'bold')
        doc.text('Resumen de Facturación Mensual', 14, yPos)
        yPos += 5
        
        const factData = []
        let totalGeneral = 0
        const obj = {}
        sales.forEach(s => {
          const d = new Date(s.createdDate)
          const key = d.toLocaleString('es-EC', { month: 'long', year: 'numeric' })
          if (!obj[key]) obj[key] = { ventas: 0, ingresos: 0 }
          obj[key].ventas += 1
          obj[key].ingresos += (s.total || 0)
          totalGeneral += (s.total || 0)
        })
        
        for (let k in obj) {
          factData.push([k, obj[k].ventas.toString(), `$${obj[k].ingresos.toFixed(2)}`])
        }
        
        factData.push(['TOTAL', '-', `$${totalGeneral.toFixed(2)}`])
        
        autoTable(doc, {
          startY: yPos,
          head: [['Mes', 'Total Ventas', 'Ingresos Estimados']],
          body: factData,
          theme: 'striped',
          headStyles: { fillColor: primaryColor, textColor: 255, fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [245, 247, 250] },
          styles: { font: 'helvetica', fontSize: 10, cellPadding: 4 }
        })
      }

      // Add "Powered by Businessia" footer to all pages
      const pageCount = doc.internal.getNumberOfPages()
      for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setTextColor(150, 150, 150)
        doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' })
      }

      doc.save('businessia-reportes.pdf')
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Hubo un error al generar el PDF. Revisa la consola.')
    }
  }

  const checkboxOptions = [
    { key: 'ventas', label: 'Ventas' },
    { key: 'inventario', label: 'Inventario' },
    { key: 'clientes', label: 'Clientes' },
    { key: 'facturacion', label: 'Facturación' },
  ]

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 max-w-md mx-auto mt-10">
      <h3 className="text-xl font-bold text-[#0a235c] mb-6">Reportes</h3>
      
      <div className="space-y-4 mb-8">
        {checkboxOptions.map(opt => (
          <label key={opt.key} className="flex items-center gap-3 cursor-pointer group">
            <input 
              type="checkbox" 
              className="hidden" 
              checked={options[opt.key]}
              onChange={() => handleToggle(opt.key)} 
            />
            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${options[opt.key] ? 'bg-[#128bb5] border-[#128bb5]' : 'border-gray-300 group-hover:border-[#128bb5]'}`}>
              {options[opt.key] && <CheckCircle2 size={14} className="text-white" />}
            </div>
            <span className="text-gray-700 font-medium">{opt.label}</span>
          </label>
        ))}
      </div>

      <button
        onClick={generarPDF}
        className="w-full bg-[#128bb5] hover:bg-[#0a235c] text-white py-3 rounded-xl font-semibold transition-colors shadow-lg shadow-cyan-500/20"
      >
        [ Generar PDF ]
      </button>
    </div>
  )
}

// ============================================================
// MAIN APP COMPONENT
// ============================================================
export default function App() {
  const { has, orgRole } = useAuth()
  const [activeModule, setActiveModule] = useState('dashboard')
  const [mobileOpen, setMobileOpen] = useState(false)

  // SaaS Limits (Clerk billing requires checking permissions, roles, or entitlements/features)
  const isEmpresarial = has ? (has({ permission: 'org:empresarial' }) || has({ role: 'org:empresarial' }) || has({ entitlement: 'empresarial' }) || has({ entitlement: 'plan_empresarial' }) || has({ feature: 'empresarial' }) || has({ feature: 'plan_empresarial' })) : false
  const isEmprendedor = has ? (has({ permission: 'org:emprendedor' }) || has({ role: 'org:emprendedor' }) || has({ entitlement: 'emprendedor' }) || has({ entitlement: 'plan_emprendedor' }) || has({ feature: 'emprendedor' }) || has({ feature: 'plan_emprendedor' })) : false
  
  const productLimit = isEmpresarial ? Infinity : (isEmprendedor ? 500 : 1)
  const userLimit = isEmpresarial ? Infinity : (isEmprendedor ? 2 : 1)

  // Redirect Cashiers (org:member) to POS directly
  useEffect(() => {
    if (orgRole === 'org:member' && activeModule !== 'ventas') {
      setActiveModule('ventas')
    }
  }, [orgRole, activeModule])

  // Data state from Appwrite
  const [products, setProducts] = useState([])
  const [clients, setClients] = useState([])
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch all data
  const { organization } = useOrganization()
  
  const fetchData = useCallback(async () => {
    if (!organization?.id) {
      setProducts([])
      setClients([])
      setSales([])
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const [productsData, clientsData, salesData] = await Promise.all([
        listProducts(organization.id),
        listClients(organization.id),
        listSales(organization.id),
      ])
      setProducts(productsData)
      setClients(clientsData)
      setSales(salesData)
    } catch (e) {
      console.error('Error fetching data:', e)
    } finally {
      setLoading(false)
    }
  }, [organization?.id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return (
          <DashboardModule
            products={products}
            clients={clients}
            sales={sales}
            loading={loading}
            onNavigate={setActiveModule}
          />
        )
      case 'ventas':
        return <SalesModule products={products} onRefresh={fetchData} organization={organization} fetchData={fetchData} />
      case 'inventario':
        return <InventoryModule products={products} loading={loading} onRefresh={fetchData} productLimit={productLimit} organization={organization} fetchData={fetchData} />
      case 'clientes':
        return <ClientsModule clients={clients} loading={loading} onRefresh={fetchData} organization={organization} fetchData={fetchData} />
      case 'reportes':
        return <ReportesModule products={products} clients={clients} sales={sales} organization={organization} />
      case 'suscripcion':
        return (
          <div className="flex flex-col items-center py-8 h-full overflow-y-auto">
            <div className="mb-6 bg-blue-50 border border-blue-100 p-5 rounded-2xl text-center max-w-2xl w-full">
              <h4 className="font-bold text-[#0a235c] text-lg mb-2">Tu Plan Actual: {isEmpresarial ? 'Empresarial' : (isEmprendedor ? 'Emprendedor' : 'Free')}</h4>
              <p className="text-sm text-[#128bb5] mb-2 font-medium">Límite de Cajeros (Usuarios): {userLimit === Infinity ? 'Ilimitado' : userLimit} &nbsp;|&nbsp; Límite de Productos: {productLimit === Infinity ? 'Ilimitado' : productLimit}</p>
              
              {!isEmpresarial && (
                <div className="bg-white/60 p-3 rounded-xl mt-3 text-sm text-gray-700">
                  {!isEmprendedor ? (
                    <p className="text-red-600 font-semibold mb-1">¡Estás en el plan Free!</p>
                  ) : (
                    <p className="text-orange-600 font-semibold mb-1">Plan Emprendedor activo</p>
                  )}
                  <p>Asegúrate de no sobrepasar el límite de tu plan al invitar nuevos miembros de equipo en el panel de abajo. Si invitas a más usuarios de los permitidos, el sistema podría bloquear sus accesos.</p>
                </div>
              )}
            </div>
            <div className={`w-full flex justify-center ${!isEmpresarial && !isEmprendedor ? 'opacity-90 pointer-events-auto' : ''}`}>
              <OrganizationProfile routing="hash" />
            </div>
          </div>
        )
      default:
        return (
          <DashboardModule
            products={products}
            clients={clients}
            sales={sales}
            loading={loading}
            onNavigate={setActiveModule}
          />
        )
    }
  }

  return (
    <>
      <SignedIn>
        <div className="flex h-screen bg-gray-50 font-sans">
          <Sidebar
            activeModule={activeModule}
            setActiveModule={setActiveModule}
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
            orgRole={orgRole}
          />

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <Header activeModule={activeModule} setMobileOpen={setMobileOpen} />

            <main className="flex-1 overflow-y-auto p-5 lg:p-7">
              {renderModule()}
            </main>
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <div className="flex h-screen items-center justify-center bg-gray-50 font-sans">
          <SignIn routing="hash" />
        </div>
      </SignedOut>
    </>
  )
}
