import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Image src="/vfs-logo.png" alt="VFS Global" width={120} height={40} className="h-10 w-auto" />
            </Link>
            <div className="h-8 w-px bg-gray-300" />
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-900">Agendamento de Visto</h1>
              <p className="text-sm text-gray-600">Angola → Portugal</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-balance">Agende sua data para pedido de visto para Portugal</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Processo rápido e seguro para agendamento de vistos
            <br />
            Centro de atendimento VFS Global em Luanda
          </p>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-md mx-auto p-8 bg-blue-50 border-blue-200">
            <CardContent className="pt-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-blue-800">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Pronto para agendar?</h3>
              <p className="text-gray-600 mb-6">O processo leva apenas alguns minutos</p>
              <Link href="/agendamento">
                <Button
                  size="lg"
                  className="w-full hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors bg-orange-500"
                >
                  Agendar Agora
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Process Steps */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">Como funciona</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Dados Pessoais", desc: "Preencha suas informações" },
              { step: "2", title: "Escolha Data", desc: "Selecione data e horário" },
              { step: "3", title: "Pagamento", desc: "Finalize com segurança" },
              { step: "4", title: "Confirmação", desc: "Receba por e-mail" },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold bg-blue-700 text-white">
                  {item.step}
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <p className="text-center text-gray-600 text-sm">
            AR-8.0.2 © 2025 VFS Global Group. Todos os Direitos Reservados. Informações compatíveis com ISO 23026.
            Nossos sites são criados para visualização em navegadores modernos; usuários do Internet Explorer, por
            favor, atualizem.
          </p>
        </div>
      </footer>
    </div>
  )
}
