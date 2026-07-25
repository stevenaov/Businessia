import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navbar */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center gap-3">
              <img src="/logo.jpeg" alt="Businessia Logo" className="h-9 w-9 rounded-xl object-cover" />
              <span className="text-xl font-extrabold text-[#0a235c] tracking-tight">Businessia</span>
            </Link>
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

      {/* Content */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-3xl font-extrabold text-[#0a235c] mb-6">Términos de Servicio</h1>
          <p className="text-gray-500 mb-8 text-sm">Última actualización: 25 de Julio de 2026</p>

          <div className="space-y-6 text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-[#0a235c] mb-3">1. Aceptación de los Términos</h2>
              <p>Al acceder y utilizar Businessia, aceptas estar sujeto a estos Términos de Servicio. Businessia es un software desarrollado como parte de un proyecto de investigación científica para las PYMES de Portoviejo, Ecuador.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0a235c] mb-3">2. Uso de la Plataforma</h2>
              <p>El sistema está diseñado para la gestión de inventario, clientes y ventas (POS). Te comprometes a proporcionar información precisa y a no utilizar la plataforma para fines ilícitos o no autorizados. Eres responsable de mantener la confidencialidad de tus credenciales de acceso.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0a235c] mb-3">3. Planes y Pagos</h2>
              <p>Los planes (Emprendedor y Empresarial) mostrados en la plataforma son exclusivamente para propósitos de demostración técnica dentro del contexto del proyecto universitario. Las transacciones en el entorno de desarrollo utilizan tarjetas de prueba. El uso de la plataforma en su estado actual no genera obligaciones financieras reales vinculantes más allá del uso de los servicios de prueba de Stripe.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0a235c] mb-3">4. Limitación de Responsabilidad</h2>
              <p>Dado que Businessia es un proyecto académico de investigación, el servicio se proporciona "tal cual" y "según disponibilidad". No nos hacemos responsables por pérdidas de datos, interrupciones del servicio o impactos comerciales derivados del uso del sistema.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0a235c] mb-3">5. Modificaciones</h2>
              <p>Nos reservamos el derecho de modificar estos términos en cualquier momento para adaptarnos a las necesidades de la investigación. Los cambios entrarán en vigor inmediatamente después de su publicación en esta página.</p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100">
            <Link to="/" className="inline-flex items-center gap-2 text-[#128bb5] hover:text-[#0a235c] font-semibold transition-colors">
              <ChevronRight className="rotate-180" size={16} />
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
