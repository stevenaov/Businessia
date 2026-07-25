import { Link } from 'react-router-dom'
import { CheckCircle2, ChevronRight, Package, Users, ShoppingCart } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navbar */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <img src="/logo.jpeg" alt="Businessia Logo" className="h-9 w-9 rounded-xl object-cover" />
              <span className="text-xl font-extrabold text-[#0a235c] tracking-tight">Businessia</span>
            </div>
            <div>
              <Link
                to="/app"
                className="bg-[#128bb5] text-white px-5 py-2 rounded-xl font-semibold text-sm hover:bg-[#0a235c] transition-colors"
              >
                Ingresar al Sistema
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-[#0a235c] tracking-tight mb-6 leading-tight">
          Gestiona tu PYME comercial<br/>
          <span className="text-[#128bb5]">sin complicaciones</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          Businessia es el software en la nube diseñado específicamente para los comercios de Portoviejo. Controla tus ventas, inventario y clientes desde cualquier lugar.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/app"
            className="bg-[#0a235c] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#128bb5] transition-colors flex items-center gap-2 shadow-lg shadow-blue-900/20"
          >
            Comenzar ahora <ChevronRight size={18} />
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white py-24 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-[#0a235c]">Todo lo que tu negocio necesita</h2>
            <p className="text-gray-500 mt-3 text-lg">Integrado en una sola plataforma fácil de usar.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm mb-6">
                <ShoppingCart className="w-7 h-7 text-[#128bb5]" />
              </div>
              <h3 className="text-xl font-bold text-[#0a235c] mb-3">Punto de Venta (POS)</h3>
              <p className="text-gray-500 leading-relaxed">Registra ventas de forma rápida, calcula el IVA automáticamente y mantén el flujo de caja al día.</p>
            </div>
            <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm mb-6">
                <Package className="w-7 h-7 text-[#128bb5]" />
              </div>
              <h3 className="text-xl font-bold text-[#0a235c] mb-3">Inventario en Vivo</h3>
              <p className="text-gray-500 leading-relaxed">Conoce siempre qué productos tienes, recibe alertas de stock bajo y evita perder ventas por falta de mercadería.</p>
            </div>
            <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm mb-6">
                <Users className="w-7 h-7 text-[#128bb5]" />
              </div>
              <h3 className="text-xl font-bold text-[#0a235c] mb-3">Fidelización de Clientes</h3>
              <p className="text-gray-500 leading-relaxed">Mantén una base de datos segura de tus clientes más frecuentes y analiza su historial de compras.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-[#0a235c]">Planes para cada etapa de tu negocio</h2>
          <p className="text-gray-500 mt-4 text-lg">Precios accesibles pensados en la economía de las PYMES manabitas.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Plan Básico */}
          <div className="p-8 rounded-[2rem] bg-white border border-gray-200 shadow-sm flex flex-col">
            <h3 className="text-2xl font-bold text-[#0a235c] mb-2">Plan Emprendedor</h3>
            <p className="text-gray-500 mb-6">Ideal para pequeños comercios que están empezando.</p>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-5xl font-extrabold text-gray-900">$15</span>
              <span className="text-gray-500 font-medium">/mes</span>
            </div>
            <ul className="space-y-4 mb-10 flex-1">
              <li className="flex items-center gap-3 text-gray-700 font-medium"><CheckCircle2 className="text-[#128bb5] w-5 h-5" /> 1 Sucursal</li>
              <li className="flex items-center gap-3 text-gray-700 font-medium"><CheckCircle2 className="text-[#128bb5] w-5 h-5" /> Hasta 500 productos</li>
              <li className="flex items-center gap-3 text-gray-700 font-medium"><CheckCircle2 className="text-[#128bb5] w-5 h-5" /> 2 Usuarios (Cajeros)</li>
              <li className="flex items-center gap-3 text-gray-700 font-medium"><CheckCircle2 className="text-[#128bb5] w-5 h-5" /> Soporte por email</li>
            </ul>
            <Link to="/app" className="block w-full py-4 px-4 bg-gray-100 text-[#0a235c] text-center rounded-xl font-bold hover:bg-gray-200 transition-colors">
              Elegir Plan Emprendedor
            </Link>
          </div>
          
          {/* Plan Premium */}
          <div className="p-8 rounded-[2rem] bg-[#0a235c] text-white shadow-2xl relative overflow-hidden flex flex-col transform md:-translate-y-4 border border-blue-900/50">
            <div className="absolute top-0 right-0 bg-[#128bb5] text-[10px] font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-widest">
              Recomendado
            </div>
            <h3 className="text-2xl font-bold mb-2">Plan Empresarial</h3>
            <p className="text-blue-200 mb-6">Para PYMES consolidadas que necesitan máximo control.</p>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-5xl font-extrabold">$30</span>
              <span className="text-blue-300 font-medium">/mes</span>
            </div>
            <ul className="space-y-4 mb-10 flex-1">
              <li className="flex items-center gap-3 text-blue-50 font-medium"><CheckCircle2 className="text-[#128bb5] w-5 h-5" /> Múltiples Sucursales</li>
              <li className="flex items-center gap-3 text-blue-50 font-medium"><CheckCircle2 className="text-[#128bb5] w-5 h-5" /> Productos Ilimitados</li>
              <li className="flex items-center gap-3 text-blue-50 font-medium"><CheckCircle2 className="text-[#128bb5] w-5 h-5" /> Usuarios Ilimitados</li>
              <li className="flex items-center gap-3 text-blue-50 font-medium"><CheckCircle2 className="text-[#128bb5] w-5 h-5" /> Soporte prioritario 24/7</li>
            </ul>
            <Link to="/app" className="block w-full py-4 px-4 bg-[#128bb5] text-white text-center rounded-xl font-bold hover:bg-cyan-500 transition-colors shadow-lg shadow-cyan-500/20">
              Elegir Plan Empresarial
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 text-center border-t border-gray-800">
        <p className="mb-2">© 2026 Businessia. Desarrollado para Portoviejo, Ecuador.</p>
        <p className="text-sm text-gray-500">Un proyecto de investigación científica.</p>
      </footer>
    </div>
  )
}
