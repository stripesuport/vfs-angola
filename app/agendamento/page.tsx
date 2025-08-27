"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Calendar, User, ChevronLeft, ChevronRight, FileText, Camera, CreditCard } from "lucide-react"

interface FormData {
  nome: string
  apelido: string
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
  passaporteFile: File | null
  fotoFile: File | null
}

export default function AgendamentoPage() {
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    apelido: "",
    dataNascimento: "",
    genero: "",
    numeroPassaporte: "",
    dataValidadePassaporte: "",
    nacionalidade: "",
    email: "",
    telefone: "",
    tipoVisto: "",
    dataAgendamento: "",
    horarioAgendamento: "",
    passaporteFile: null,
    fotoFile: null,
  })

  const [currentStep, setCurrentStep] = useState(1)

  const availableDates = ["1", "2", "3", "4", "5"]

  const timeSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
  ]

  const generateCalendarDays = () => {
    const days = []
    const daysInMonth = 30
    const firstDayOfMonth = 0 // Monday = 0, Tuesday = 1, etc. (SEG=0, TER=1, QUA=2, QUI=3, SEX=4, SAB=5, DOM=6)

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (field: "passaporteFile" | "fotoFile", file: File | null) => {
    setFormData((prev) => ({ ...prev, [field]: file }))
  }

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleConfirmAndPay = () => {
    // Store form data in localStorage for later use
    localStorage.setItem("appointmentData", JSON.stringify(formData))
    const successUrl = encodeURIComponent(`${window.location.origin}/confirmacao`)
    window.location.href = `https://buy.stripe.com/9B65kDeuNfag6BV85D5wI00?success_url=${successUrl}`
  }

  const handleDateSelect = (day: number) => {
    if (availableDates.includes(day.toString())) {
      setFormData((prev) => ({ ...prev, dataAgendamento: `2025-09-${day.toString().padStart(2, "0")}` }))
    }
  }

  const isDateAvailable = (day: number) => {
    return availableDates.includes(day.toString())
  }

  const isDateSelected = (day: number) => {
    return formData.dataAgendamento === `2025-09-${day.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image src="/vfs-logo.png" alt="VFS Global" width={120} height={40} className="h-10 w-auto" />
              <div className="h-8 w-px bg-gray-300" />
              
            </div>
            <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold shadow-xs ${
                    step <= currentStep ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step}
                </div>
                {step < 4 && <div className={`w-16 h-1 mx-2 ${step < currentStep ? "bg-blue-600" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-gray-600">
              {currentStep === 1 && "Dados Pessoais"}
              {currentStep === 2 && "Documentos e Contato"}
              {currentStep === 3 && "Escolha Data e Horário"}
              {currentStep === 4 && "Resumo e Pagamento"}
            </p>
          </div>
        </div>

        {/* Step 1: Personal Data */}
        {currentStep === 1 && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Dados Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <p className="text-sm text-red-500">
                  Por favor, forneça informações sobre o tipo de visto que deseja solicitar. Esteja ciente de que a
                  categoria de agendamento que o Requerente 1 escolher será aplicada a cada um dos requerentes
                  adicionados à sua reserva de agendamento.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => handleInputChange("nome", e.target.value)}
                    placeholder="Digite seu nome"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apelido">Apelido</Label>
                  <Input
                    id="apelido"
                    value={formData.apelido}
                    onChange={(e) => handleInputChange("apelido", e.target.value)}
                    placeholder="Digite seu apelido"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                  <Input
                    id="dataNascimento"
                    type="date"
                    value={formData.dataNascimento}
                    onChange={(e) => handleInputChange("dataNascimento", e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="genero">Gênero</Label>
                  <Select value={formData.genero} onValueChange={(value) => handleInputChange("genero", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="feminino">Feminino</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nacionalidade">Nacionalidade</Label>
                <Select
                  value={formData.nacionalidade}
                  onValueChange={(value) => handleInputChange("nacionalidade", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione sua nacionalidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="afeganistao">Afeganistão</SelectItem>
                    <SelectItem value="africa-do-sul">África do Sul</SelectItem>
                    <SelectItem value="albania">Albânia</SelectItem>
                    <SelectItem value="alemanha">Alemanha</SelectItem>
                    <SelectItem value="andorra">Andorra</SelectItem>
                    <SelectItem value="angola">Angola</SelectItem>
                    <SelectItem value="antigua-e-barbuda">Antígua e Barbuda</SelectItem>
                    <SelectItem value="arabia-saudita">Arábia Saudita</SelectItem>
                    <SelectItem value="argelia">Argélia</SelectItem>
                    <SelectItem value="argentina">Argentina</SelectItem>
                    <SelectItem value="armenia">Armênia</SelectItem>
                    <SelectItem value="australia">Austrália</SelectItem>
                    <SelectItem value="austria">Áustria</SelectItem>
                    <SelectItem value="azerbaijao">Azerbaijão</SelectItem>
                    <SelectItem value="bahamas">Bahamas</SelectItem>
                    <SelectItem value="bahrein">Bahrein</SelectItem>
                    <SelectItem value="bangladesh">Bangladesh</SelectItem>
                    <SelectItem value="barbados">Barbados</SelectItem>
                    <SelectItem value="belarus">Belarus</SelectItem>
                    <SelectItem value="belgica">Bélgica</SelectItem>
                    <SelectItem value="belize">Belize</SelectItem>
                    <SelectItem value="benin">Benin</SelectItem>
                    <SelectItem value="bolivia">Bolívia</SelectItem>
                    <SelectItem value="bosnia-e-herzegovina">Bósnia e Herzegovina</SelectItem>
                    <SelectItem value="botswana">Botswana</SelectItem>
                    <SelectItem value="brasil">Brasil</SelectItem>
                    <SelectItem value="brunei">Brunei</SelectItem>
                    <SelectItem value="bulgaria">Bulgária</SelectItem>
                    <SelectItem value="burkina-faso">Burkina Faso</SelectItem>
                    <SelectItem value="burundi">Burundi</SelectItem>
                    <SelectItem value="butao">Butão</SelectItem>
                    <SelectItem value="cabo-verde">Cabo Verde</SelectItem>
                    <SelectItem value="camaroes">Camarões</SelectItem>
                    <SelectItem value="camboja">Camboja</SelectItem>
                    <SelectItem value="canada">Canadá</SelectItem>
                    <SelectItem value="catar">Catar</SelectItem>
                    <SelectItem value="cazaquistao">Cazaquistão</SelectItem>
                    <SelectItem value="chade">Chade</SelectItem>
                    <SelectItem value="chile">Chile</SelectItem>
                    <SelectItem value="china">China</SelectItem>
                    <SelectItem value="chipre">Chipre</SelectItem>
                    <SelectItem value="colombia">Colômbia</SelectItem>
                    <SelectItem value="comores">Comores</SelectItem>
                    <SelectItem value="congo">Congo</SelectItem>
                    <SelectItem value="coreia-do-norte">Coreia do Norte</SelectItem>
                    <SelectItem value="coreia-do-sul">Coreia do Sul</SelectItem>
                    <SelectItem value="costa-do-marfim">Costa do Marfim</SelectItem>
                    <SelectItem value="costa-rica">Costa Rica</SelectItem>
                    <SelectItem value="croacia">Croácia</SelectItem>
                    <SelectItem value="cuba">Cuba</SelectItem>
                    <SelectItem value="dinamarca">Dinamarca</SelectItem>
                    <SelectItem value="djibouti">Djibouti</SelectItem>
                    <SelectItem value="dominica">Dominica</SelectItem>
                    <SelectItem value="egito">Egito</SelectItem>
                    <SelectItem value="el-salvador">El Salvador</SelectItem>
                    <SelectItem value="emirados-arabes-unidos">Emirados Árabes Unidos</SelectItem>
                    <SelectItem value="equador">Equador</SelectItem>
                    <SelectItem value="eritreia">Eritreia</SelectItem>
                    <SelectItem value="eslovaquia">Eslováquia</SelectItem>
                    <SelectItem value="eslovenia">Eslovênia</SelectItem>
                    <SelectItem value="espanha">Espanha</SelectItem>
                    <SelectItem value="estados-unidos">Estados Unidos</SelectItem>
                    <SelectItem value="estonia">Estônia</SelectItem>
                    <SelectItem value="etiopia">Etiópia</SelectItem>
                    <SelectItem value="fiji">Fiji</SelectItem>
                    <SelectItem value="filipinas">Filipinas</SelectItem>
                    <SelectItem value="finlandia">Finlândia</SelectItem>
                    <SelectItem value="franca">França</SelectItem>
                    <SelectItem value="gabao">Gabão</SelectItem>
                    <SelectItem value="gambia">Gâmbia</SelectItem>
                    <SelectItem value="gana">Gana</SelectItem>
                    <SelectItem value="georgia">Geórgia</SelectItem>
                    <SelectItem value="granada">Granada</SelectItem>
                    <SelectItem value="grecia">Grécia</SelectItem>
                    <SelectItem value="guatemala">Guatemala</SelectItem>
                    <SelectItem value="guiana">Guiana</SelectItem>
                    <SelectItem value="guine">Guiné</SelectItem>
                    <SelectItem value="guine-bissau">Guiné-Bissau</SelectItem>
                    <SelectItem value="guine-equatorial">Guiné Equatorial</SelectItem>
                    <SelectItem value="haiti">Haiti</SelectItem>
                    <SelectItem value="honduras">Honduras</SelectItem>
                    <SelectItem value="hungria">Hungria</SelectItem>
                    <SelectItem value="iemen">Iêmen</SelectItem>
                    <SelectItem value="ilhas-marshall">Ilhas Marshall</SelectItem>
                    <SelectItem value="ilhas-salomao">Ilhas Salomão</SelectItem>
                    <SelectItem value="india">Índia</SelectItem>
                    <SelectItem value="indonesia">Indonésia</SelectItem>
                    <SelectItem value="ira">Irã</SelectItem>
                    <SelectItem value="iraque">Iraque</SelectItem>
                    <SelectItem value="irlanda">Irlanda</SelectItem>
                    <SelectItem value="islandia">Islândia</SelectItem>
                    <SelectItem value="israel">Israel</SelectItem>
                    <SelectItem value="italia">Itália</SelectItem>
                    <SelectItem value="jamaica">Jamaica</SelectItem>
                    <SelectItem value="japao">Japão</SelectItem>
                    <SelectItem value="jordania">Jordânia</SelectItem>
                    <SelectItem value="kuwait">Kuwait</SelectItem>
                    <SelectItem value="laos">Laos</SelectItem>
                    <SelectItem value="lesoto">Lesoto</SelectItem>
                    <SelectItem value="letonia">Letônia</SelectItem>
                    <SelectItem value="libano">Líbano</SelectItem>
                    <SelectItem value="liberia">Libéria</SelectItem>
                    <SelectItem value="libia">Líbia</SelectItem>
                    <SelectItem value="liechtenstein">Liechtenstein</SelectItem>
                    <SelectItem value="lituania">Lituânia</SelectItem>
                    <SelectItem value="luxemburgo">Luxemburgo</SelectItem>
                    <SelectItem value="macedonia">Macedônia</SelectItem>
                    <SelectItem value="madagascar">Madagascar</SelectItem>
                    <SelectItem value="malasia">Malásia</SelectItem>
                    <SelectItem value="malawi">Malawi</SelectItem>
                    <SelectItem value="maldivas">Maldivas</SelectItem>
                    <SelectItem value="mali">Mali</SelectItem>
                    <SelectItem value="malta">Malta</SelectItem>
                    <SelectItem value="marrocos">Marrocos</SelectItem>
                    <SelectItem value="mauricio">Maurício</SelectItem>
                    <SelectItem value="mauritania">Mauritânia</SelectItem>
                    <SelectItem value="mexico">México</SelectItem>
                    <SelectItem value="micronesia">Micronésia</SelectItem>
                    <SelectItem value="mocambique">Moçambique</SelectItem>
                    <SelectItem value="moldavia">Moldávia</SelectItem>
                    <SelectItem value="monaco">Mônaco</SelectItem>
                    <SelectItem value="mongolia">Mongólia</SelectItem>
                    <SelectItem value="montenegro">Montenegro</SelectItem>
                    <SelectItem value="myanmar">Myanmar</SelectItem>
                    <SelectItem value="namibia">Namíbia</SelectItem>
                    <SelectItem value="nauru">Nauru</SelectItem>
                    <SelectItem value="nepal">Nepal</SelectItem>
                    <SelectItem value="nicaragua">Nicarágua</SelectItem>
                    <SelectItem value="niger">Níger</SelectItem>
                    <SelectItem value="nigeria">Nigéria</SelectItem>
                    <SelectItem value="noruega">Noruega</SelectItem>
                    <SelectItem value="nova-zelandia">Nova Zelândia</SelectItem>
                    <SelectItem value="oma">Omã</SelectItem>
                    <SelectItem value="paises-baixos">Países Baixos</SelectItem>
                    <SelectItem value="palau">Palau</SelectItem>
                    <SelectItem value="panama">Panamá</SelectItem>
                    <SelectItem value="papua-nova-guine">Papua-Nova Guiné</SelectItem>
                    <SelectItem value="paquistao">Paquistão</SelectItem>
                    <SelectItem value="paraguai">Paraguai</SelectItem>
                    <SelectItem value="peru">Peru</SelectItem>
                    <SelectItem value="polonia">Polônia</SelectItem>
                    <SelectItem value="portugal">Portugal</SelectItem>
                    <SelectItem value="quenia">Quênia</SelectItem>
                    <SelectItem value="quirguistao">Quirguistão</SelectItem>
                    <SelectItem value="reino-unido">Reino Unido</SelectItem>
                    <SelectItem value="republica-centro-africana">República Centro-Africana</SelectItem>
                    <SelectItem value="republica-checa">República Checa</SelectItem>
                    <SelectItem value="republica-democratica-do-congo">República Democrática do Congo</SelectItem>
                    <SelectItem value="republica-dominicana">República Dominicana</SelectItem>
                    <SelectItem value="romenia">Romênia</SelectItem>
                    <SelectItem value="ruanda">Ruanda</SelectItem>
                    <SelectItem value="russia">Rússia</SelectItem>
                    <SelectItem value="samoa">Samoa</SelectItem>
                    <SelectItem value="san-marino">San Marino</SelectItem>
                    <SelectItem value="santa-lucia">Santa Lúcia</SelectItem>
                    <SelectItem value="sao-cristovao-e-nevis">São Cristóvão e Nevis</SelectItem>
                    <SelectItem value="sao-tome-e-principe">São Tomé e Príncipe</SelectItem>
                    <SelectItem value="sao-vicente-e-granadinas">São Vicente e Granadinas</SelectItem>
                    <SelectItem value="seicheles">Seicheles</SelectItem>
                    <SelectItem value="senegal">Senegal</SelectItem>
                    <SelectItem value="serra-leoa">Serra Leoa</SelectItem>
                    <SelectItem value="servia">Sérvia</SelectItem>
                    <SelectItem value="singapura">Singapura</SelectItem>
                    <SelectItem value="siria">Síria</SelectItem>
                    <SelectItem value="somalia">Somália</SelectItem>
                    <SelectItem value="sri-lanka">Sri Lanka</SelectItem>
                    <SelectItem value="suazilandia">Suazilândia</SelectItem>
                    <SelectItem value="sudao">Sudão</SelectItem>
                    <SelectItem value="sudao-do-sul">Sudão do Sul</SelectItem>
                    <SelectItem value="suecia">Suécia</SelectItem>
                    <SelectItem value="suica">Suíça</SelectItem>
                    <SelectItem value="suriname">Suriname</SelectItem>
                    <SelectItem value="tailandia">Tailândia</SelectItem>
                    <SelectItem value="taiwan">Taiwan</SelectItem>
                    <SelectItem value="tajiquistao">Tajiquistão</SelectItem>
                    <SelectItem value="tanzania">Tanzânia</SelectItem>
                    <SelectItem value="timor-leste">Timor-Leste</SelectItem>
                    <SelectItem value="togo">Togo</SelectItem>
                    <SelectItem value="tonga">Tonga</SelectItem>
                    <SelectItem value="trinidad-e-tobago">Trinidad e Tobago</SelectItem>
                    <SelectItem value="tunisia">Tunísia</SelectItem>
                    <SelectItem value="turcomenistao">Turcomenistão</SelectItem>
                    <SelectItem value="turquia">Turquia</SelectItem>
                    <SelectItem value="tuvalu">Tuvalu</SelectItem>
                    <SelectItem value="ucrania">Ucrânia</SelectItem>
                    <SelectItem value="uganda">Uganda</SelectItem>
                    <SelectItem value="uruguai">Uruguai</SelectItem>
                    <SelectItem value="uzbequistao">Uzbequistão</SelectItem>
                    <SelectItem value="vanuatu">Vanuatu</SelectItem>
                    <SelectItem value="vaticano">Vaticano</SelectItem>
                    <SelectItem value="venezuela">Venezuela</SelectItem>
                    <SelectItem value="vietna">Vietnã</SelectItem>
                    <SelectItem value="zambia">Zâmbia</SelectItem>
                    <SelectItem value="zimbabue">Zimbábue</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleNextStep} className="bg-blue-600 hover:bg-blue-700">
                  Continuar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Documents and Contact */}
        {currentStep === 2 && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Documentos e Contato
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numeroPassaporte">Número do Passaporte</Label>
                  <Input
                    id="numeroPassaporte"
                    value={formData.numeroPassaporte}
                    onChange={(e) => handleInputChange("numeroPassaporte", e.target.value)}
                    placeholder="Ex: A1234567"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataValidadePassaporte">Data de Validade do Passaporte</Label>
                  <Input
                    id="dataValidadePassaporte"
                    type="date"
                    value={formData.dataValidadePassaporte}
                    onChange={(e) => handleInputChange("dataValidadePassaporte", e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="passaporteUpload">Upload do Passaporte</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    id="passaporteUpload"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange("passaporteFile", e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <label htmlFor="passaporteUpload" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="w-8 h-8 text-gray-400" />
                      {formData.passaporteFile ? (
                        <div className="text-sm">
                          <p className="text-green-600 font-medium">{formData.passaporteFile.name}</p>
                          <p className="text-gray-500">Clique para alterar</p>
                        </div>
                      ) : (
                        <div className="text-sm">
                          <p className="text-gray-600 font-medium">Clique para fazer upload do passaporte</p>
                          <p className="text-gray-500">PDF ou imagem (máx. 10MB)</p>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fotoUpload">Foto para Reconhecimento Facial</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    id="fotoUpload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange("fotoFile", e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <label htmlFor="fotoUpload" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-2">
                      <Camera className="w-8 h-8 text-gray-400" />
                      {formData.fotoFile ? (
                        <div className="text-sm">
                          <p className="text-green-600 font-medium">{formData.fotoFile.name}</p>
                          <p className="text-gray-500">Clique para alterar</p>
                        </div>
                      ) : (
                        <div className="text-sm">
                          <p className="text-gray-600 font-medium">Clique para fazer upload da foto</p>
                          <p className="text-gray-500">Imagem clara do rosto (máx. 5MB)</p>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  A foto deve mostrar claramente seu rosto, sem óculos escuros ou chapéu, para verificação de
                  identidade.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    type="tel"
                    value={formData.telefone}
                    onChange={(e) => handleInputChange("telefone", e.target.value)}
                    placeholder="+244 123 456 789"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipoVisto">Tipo de Visto</Label>
                <Select value={formData.tipoVisto} onValueChange={(value) => handleInputChange("tipoVisto", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de visto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="turismo">Turismo</SelectItem>
                    <SelectItem value="estudo">Estudo</SelectItem>
                    <SelectItem value="contrato-trabalho">Contrato de Trabalho</SelectItem>
                    <SelectItem value="procura-trabalho">Procura de Trabalho</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={handlePrevStep}>
                  Voltar
                </Button>
                <Button onClick={handleNextStep} className="bg-blue-600 hover:bg-blue-700">
                  Continuar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Calendar Selection */}
        {currentStep === 3 && (
          <Card className="max-w-2xl mx-auto font-extralight">
            <CardContent className="p-3">
              <div className="space-y-3">
                <h2 className="text-base font-medium text-gray-900">Escolha uma data de agendamento</h2>

                {/* Calendar */}
                <div className="bg-white border border-gray-200 rounded-lg p-2">
                  {/* Month Navigation */}
                  <div className="flex items-center justify-between mb-2">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <ChevronLeft className="w-3 h-3 text-gray-600" />
                    </button>
                    <h3 className="text-sm font-medium text-gray-900">Setembro 2025</h3>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <ChevronRight className="w-3 h-3 text-gray-600" />
                    </button>
                  </div>

                  {/* Days of Week Header */}
                  <div className="grid grid-cols-7 gap-0.5 mb-1">
                    {["SEG", "TER", "QUA", "QUI", "SEX", "SAB", "DOM"].map((day) => (
                      <div key={day} className="p-0.5 text-xs font-medium text-gray-600 text-left">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-0.5">
                    {generateCalendarDays().map((day, index) => (
                      <div key={index} className="aspect-square w-8 h-8">
                        {day && (
                          <button
                            onClick={() => handleDateSelect(day)}
                            disabled={!isDateAvailable(day)}
                            className={`w-full h-full flex items-center justify-center text-xs font-medium rounded transition-colors ${
                              isDateSelected(day)
                                ? "bg-teal-600 text-white"
                                : isDateAvailable(day)
                                  ? "bg-teal-500 text-white hover:bg-teal-600"
                                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            {day}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Legend */}
                  <div className="flex items-center gap-2 mt-2 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-teal-500 rounded"></div>
                      <span className="text-gray-700">Disponível</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-gray-200 rounded"></div>
                      <span className="text-gray-700">Indisponível</span>
                    </div>
                  </div>
                </div>

                {/* Time Selection */}
                {formData.dataAgendamento && (
                  <div className="space-y-2">
                    <h2 className="text-base font-medium text-gray-900">Escolha um horário de agendamento</h2>

                    <Select
                      value={formData.horarioAgendamento}
                      onValueChange={(value) => handleInputChange("horarioAgendamento", value)}
                    >
                      <SelectTrigger className="w-full h-8 text-sm">
                        <SelectValue placeholder="Selecione um horário" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time} className="text-sm py-1">
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex justify-between pt-2">
                  <Button variant="outline" onClick={handlePrevStep}>
                    Voltar
                  </Button>
                  <Button
                    onClick={handleNextStep}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={!formData.dataAgendamento || !formData.horarioAgendamento}
                  >
                    Continuar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Booking Summary and Payment */}
        {currentStep === 4 && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                Resumo e Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Booking Summary */}
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-3">Resumo do Agendamento</h4>
                <div className="space-y-2 text-sm text-blue-800">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p>
                        <span className="font-medium">Nome:</span>
                      </p>
                      <p className="text-blue-700">
                        {formData.nome || formData.apelido
                          ? `${formData.nome} ${formData.apelido}`.trim()
                          : "Não informado"}
                      </p>
                    </div>
                    <div>
                      <p>
                        <span className="font-medium">Nacionalidade:</span>
                      </p>
                      <p className="text-blue-700">{formData.nacionalidade || "Não informado"}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p>
                        <span className="font-medium">Data:</span>
                      </p>
                      <p className="text-blue-700">
                        {formData.dataAgendamento
                          ? formData.dataAgendamento.split("-").reverse().join("/")
                          : "Não selecionada"}
                      </p>
                    </div>
                    <div>
                      <p>
                        <span className="font-medium">Horário:</span>
                      </p>
                      <p className="text-blue-700">{formData.horarioAgendamento || "Não selecionado"}</p>
                    </div>
                  </div>

                  <div>
                    <p>
                      <span className="font-medium">Tipo de Visto:</span>
                    </p>
                    <p className="text-blue-700">{formData.tipoVisto.replace("-", " ") || "Não informado"}</p>
                  </div>

                  {formData.email && (
                    <div>
                      <p>
                        <span className="font-medium">E-mail:</span>
                      </p>
                      <p className="text-blue-700">{formData.email}</p>
                    </div>
                  )}

                  {formData.telefone && (
                    <div>
                      <p>
                        <span className="font-medium">Telefone:</span>
                      </p>
                      <p className="text-blue-700">{formData.telefone}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Informações de Pagamento</h4>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>
                    <span className="font-medium">Taxa de Agendamento:</span> €38,00
                  </p>
                  <p>
                    <span className="font-medium">Taxa de Processamento:</span> €5,00
                  </p>
                  <hr className="my-2" />
                  <p className="font-semibold text-lg">
                    <span>Total:</span> €43,00
                  </p>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={handlePrevStep}>
                  Voltar
                </Button>
                <Button onClick={handleConfirmAndPay} className="hover:bg-blue-700 bg-green-700">
                  Confirmar e Pagar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
