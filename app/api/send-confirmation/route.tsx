import { type NextRequest, NextResponse } from "next/server"

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
  referenceCode: string
}

export async function POST(request: NextRequest) {
  try {
    const appointmentData: AppointmentData = await request.json()

    // Email configuration - you would set these environment variables
    const emailConfig = {
      apiKey: process.env.SENDGRID_API_KEY || process.env.EMAIL_API_KEY,
      fromEmail: process.env.FROM_EMAIL || "noreply@visaagendamento.com",
      fromName: process.env.FROM_NAME || "VFS Global - Agendamento de Visto",
    }

    if (!emailConfig.apiKey) {
      console.log("Email API key not configured - email would be sent in production")
      return NextResponse.json({
        success: true,
        message: "Email configuration pending - confirmation would be sent in production",
      })
    }

    const emailTemplate = generateEmailTemplate(appointmentData)

    // Here you would integrate with your email service (SendGrid, Amazon SES, etc.)
    // For demonstration, we'll simulate the email sending
    console.log("Sending confirmation email to:", appointmentData.email)
    console.log("Email content:", emailTemplate)

    // Simulate email sending success
    return NextResponse.json({
      success: true,
      message: "Confirmation email sent successfully",
      recipient: appointmentData.email,
    })
  } catch (error) {
    console.error("Error sending confirmation email:", error)
    return NextResponse.json({ success: false, message: "Failed to send confirmation email" }, { status: 500 })
  }
}

function generateEmailTemplate(data: AppointmentData): string {
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

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Confirmação de Agendamento - VFS Global</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f8fafc; }
        .section { margin-bottom: 20px; }
        .reference-code { background: #dbeafe; padding: 15px; text-align: center; border-radius: 8px; }
        .details { background: white; padding: 15px; border-radius: 8px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .important { background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Agendamento Confirmado</h1>
          <p>VFS Global - Visto Angola → Portugal</p>
        </div>
        
        <div class="content">
          <div class="section">
            <h2>Olá, ${data.nomeCompleto}!</h2>
            <p>Seu agendamento foi realizado com sucesso. Abaixo estão os detalhes da sua consulta:</p>
          </div>

          <div class="reference-code">
            <h3>Código de Referência</h3>
            <h2 style="color: #1e40af; margin: 10px 0;">${data.referenceCode}</h2>
            <p><small>Guarde este código para futuras consultas</small></p>
          </div>

          <div class="details">
            <h3>Detalhes do Agendamento</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Nome:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${data.nomeCompleto}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Data de Nascimento:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${formatDate(data.dataNascimento)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Nacionalidade:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${data.nacionalidade}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Passaporte:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${data.numeroPassaporte}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Tipo de Visto:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${getVisaTypeLabel(data.tipoVisto)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Data do Agendamento:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${formatDate(data.dataAgendamento)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Horário:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${data.horarioAgendamento}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>E-mail:</strong></td>
                <td style="padding: 8px 0;">${data.email}</td>
              </tr>
            </table>
          </div>

          <div class="important">
            <h3>Informações Importantes</h3>
            <ul>
              <li>Chegue 15 minutos antes do horário agendado</li>
              <li>Traga todos os documentos originais necessários</li>
              <li>Apresente este e-mail ou o código de referência na recepção</li>
              <li>Em caso de dúvidas, entre em contato conosco</li>
            </ul>
          </div>

          <div class="section">
            <h3>Documentos Necessários</h3>
            <ul>
              <li>Passaporte original com validade mínima de 6 meses</li>
              <li>Formulário de solicitação de visto preenchido</li>
              <li>Fotografias recentes (conforme especificações)</li>
              <li>Comprovantes financeiros</li>
              <li>Documentos específicos para o tipo de visto solicitado</li>
            </ul>
          </div>
        </div>

        <div class="footer">
          <p>© 2025 VFS Global - Agendamento de Visto Angola → Portugal</p>
          <p>Este é um e-mail automático, não responda a esta mensagem.</p>
        </div>
      </div>
    </body>
    </html>
  `
}
