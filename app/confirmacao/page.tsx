"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Calendar, User, Mail, FileText, Clock, Send } from "lucide-react"

interface AppointmentData {
  nomeCompleto: string
  dataNascimento: string
  genero: string
  numeroPassaporte: string
  dataValidadePassaporte: string
  nacionalidade: string
  email: string
  telefone: string
  tipoVisto: string
  dataAgendamento: string
  horarioAgendamento: string
}

export default function ConfirmacaoPage() {
  const [appointmentData, setAppointmentData] = useState<AppointmentData | null>(null)
  const [referenceCode, setReferenceCode] = useState<string>("")
  const [emailSent, setEmailSent] = useState<boolean>(false)
  const [emailSending, setEmailSending] = useState<boolean>(false)

  useEffect(() => {
    // Retrieve appointment data from localStorage
    const storedData = localStorage.getItem("appointmentData")
    if (storedData) {
      const data = JSON.parse(storedData)
      setAppointmentData(data)

      // Generate a reference code
      const code = `VFS${Date.now().toString().slice(-6)}${Math.random().toString(36).substr(2, 3).toUpperCase()}`
      setReferenceCode(code)

      // Send confirmation email
      sendConfirmationEmail({ ...data, referenceCode: code })

      // Clear the stored data
      localStorage.removeItem("appointmentData")
    }
  }, [])

  const sendConfirmationEmail = async (data: AppointmentData & { referenceCode: string }) => {
    setEmailSending(true)
    try {
      const response = await fetch("/api/send-confirmation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()
      if (result.success) {
        setEmailSent(true)
      } else {
        console.error("Failed to send email:", result.message)
      }
    } catch (error) {
      console.error("Error sending email:", error)
    } finally {
      setEmailSending(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getVisaTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      turismo: "Turismo",
      estudo: "Estudo",
      "contrato-trabalho": "Contrato de Trabalho",
      "procura-trabalho": "Procura de Trabalho",
    }
    return types[type] || type
  }

  if (!appointmentData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600">Carregando informações do agendamento...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Image src="/vfs-logo.png" alt="VFS Global" width={120} height={40} className="h-10 w-auto" />
            <div className="h-8 w-px bg-gray-300" />
            <h1 className="text-xl font-semibold text-gray-800">Agendamento Confirmado</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Agendamento Realizado com Sucesso!</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Seu agendamento foi realizado com sucesso. Assim que confirmamos o pagamento, será enviado o recibo e os
            dados do agendamento para seu e-mail.
          </p>
        </div>

        {/* Email Status */}
        <Card className="max-w-md mx-auto mb-8 bg-green-50 border-green-200">
          <CardContent className="pt-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Send className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-green-900">
                {emailSending ? "Enviando confirmação..." : emailSent ? "E-mail enviado!" : "Preparando e-mail..."}
              </h3>
            </div>
            <p className="text-sm text-green-700">
              {emailSent
                ? `Confirmação enviada para ${appointmentData.email}`
                : "Você receberá a confirmação em instantes"}
            </p>
          </CardContent>
        </Card>

        {/* Reference Code */}
        <Card className="max-w-md mx-auto mb-8 bg-blue-50 border-blue-200">
          <CardContent className="pt-6 text-center">
            <h3 className="font-semibold text-blue-900 mb-2">Código de Referência</h3>
            <p className="text-2xl font-bold text-blue-600 tracking-wider">{referenceCode}</p>
            <p className="text-sm text-blue-700 mt-2">Guarde este código para futuras consultas</p>
          </CardContent>
        </Card>

        {/* Appointment Details */}
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Resumo da Reserva
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Personal Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  Dados Pessoais
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nome:</span>
                    <span className="font-medium">{appointmentData.nomeCompleto}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data de Nascimento:</span>
                    <span className="font-medium">{formatDate(appointmentData.dataNascimento)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gênero:</span>
                    <span className="font-medium capitalize">{appointmentData.genero}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nacionalidade:</span>
                    <span className="font-medium capitalize">{appointmentData.nacionalidade}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Documentos
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Passaporte:</span>
                    <span className="font-medium">{appointmentData.numeroPassaporte}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Validade:</span>
                    <span className="font-medium">{formatDate(appointmentData.dataValidadePassaporte)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tipo de Visto:</span>
                    <span className="font-medium">{getVisaTypeLabel(appointmentData.tipoVisto)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    Contato
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">E-mail:</span>
                      <span className="font-medium">{appointmentData.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Telefone:</span>
                      <span className="font-medium">{appointmentData.telefone}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    Agendamento
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Data:</span>
                      <span className="font-medium">{formatDate(appointmentData.dataAgendamento)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Horário:</span>
                      <span className="font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {appointmentData.horarioAgendamento}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Information */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">Informações Importantes</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Chegue 15 minutos antes do horário agendado</li>
                <li>• Traga todos os documentos originais necessários</li>
                <li>• O recibo e instruções detalhadas serão enviados por e-mail</li>
                <li>• Em caso de dúvidas, entre em contato conosco</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="text-center mt-8 space-y-4">
          <p className="text-gray-600">
            Você receberá um e-mail de confirmação em <strong>{appointmentData.email}</strong>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                Voltar ao Início
              </Button>
            </Link>
            <Button onClick={() => window.print()} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
              Imprimir Confirmação
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image src="/vfs-logo.png" alt="VFS Global" width={100} height={32} className="h-8 w-auto" />
          </div>
          <p className="text-center text-gray-600 text-sm">
            © 2025 Agendamento de Visto Angola - Portugal. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
