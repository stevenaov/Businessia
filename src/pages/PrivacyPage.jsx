import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function PrivacyPage() {
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
          <h1 className="text-3xl font-extrabold text-[#0a235c] mb-6">Política de Privacidad</h1>
          <p className="text-gray-500 mb-8 text-sm">Última actualización: 25 de Julio de 2026</p>

          <div className="space-y-6 text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-[#0a235c] mb-3">1. Recopilación de Información</h2>
              <p>Businessia recopila únicamente la información necesaria para el funcionamiento del sistema en el contexto de la investigación académica. Esto incluye:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Datos de registro (Nombre, correo electrónico) gestionados a través de nuestro proveedor seguro Clerk.</li>
                <li>Datos ingresados por el usuario relativos a su PYME (inventario, registro de clientes, ventas) alojados en Appwrite.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0a235c] mb-3">2. Uso de la Información</h2>
              <p>Los datos almacenados son utilizados exclusivamente para que puedas gestionar tu negocio en la plataforma de prueba. No utilizamos tus datos para enviar publicidad no solicitada ni rastreamos tu comportamiento fuera del sistema.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0a235c] mb-3">3. Compartición de Datos</h2>
              <p>Garantizamos estrictamente que <strong>tus datos no son vendidos, alquilados ni compartidos con terceros</strong>. Los únicos terceros involucrados (Clerk, Appwrite y Stripe) actúan únicamente como proveedores de infraestructura técnica bajo estándares rigurosos de seguridad.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0a235c] mb-3">4. Seguridad</h2>
              <p>Implementamos medidas de seguridad estándares de la industria, incluyendo encriptación en tránsito y reposo, y autenticación robusta mediante tokens. No obstante, te recordamos que ningún sistema es 100% infalible frente a ataques cibernéticos.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0a235c] mb-3">5. Tus Derechos</h2>
              <p>Como usuario, tienes el derecho de acceder, corregir o solicitar la eliminación total de tus datos y los datos de tus clientes registrados en la plataforma en cualquier momento. Para ello, puedes contactarnos directamente.</p>
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
