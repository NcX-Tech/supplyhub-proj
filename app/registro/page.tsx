"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Eye, EyeOff, Package, ArrowRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function RegistroPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const { user, signUp } = useAuth()

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (user) {
      router.push("/")
    }
  }, [user, router])

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    tipoUsuario: "produtor",
    nomeEmpresa: "",
    cnpj: "",
    telefone: "",
    cep: "",
    estado: "",
    cidade: "",
    endereco: "",
    website: "",
    bio: "",
    termos: false,
    newsletter: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, tipoUsuario: value }))
  }

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1)
  }

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const handleSubmit = async () => {
    if (formData.senha !== formData.confirmarSenha) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      })
      return
    }

    if (!formData.termos) {
      toast({
        title: "Erro",
        description: "Você deve aceitar os termos de uso",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const { error } = await signUp(formData.email, formData.senha, formData)

      if (error) throw error

      toast({
        title: "Sucesso!",
        description: "Conta criada com sucesso.",
      })

      // Forçar redirecionamento após registro bem-sucedido
      router.push("/")
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar conta",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex items-center">
          <Link href="/" className="flex items-center">
            <Package className="w-8 h-8 text-primary mr-2" />
            <span className="text-xl font-bold">
              Supply<span className="text-primary">Hub</span>
            </span>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <CardTitle className="text-2xl">Criar Conta</CardTitle>
            <CardDescription>
              {currentStep === 1
                ? "Informe seus dados para criar uma conta"
                : currentStep === 2
                  ? "Informações da sua empresa"
                  : "Finalize seu cadastro"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8">
              <div className="w-full flex items-center">
                <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-semibold">
                  {currentStep > 1 ? <CheckCircle className="w-5 h-5" /> : "1"}
                </div>
                <div className={`flex-1 h-1 ${currentStep > 1 ? "bg-primary" : "bg-gray-200"}`}></div>
              </div>
              <div className="w-full flex items-center">
                <div
                  className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                    currentStep > 1 ? "bg-primary text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {currentStep > 2 ? <CheckCircle className="w-5 h-5" /> : "2"}
                </div>
                <div className={`flex-1 h-1 ${currentStep > 2 ? "bg-primary" : "bg-gray-200"}`}></div>
              </div>
              <div className="flex items-center">
                <div
                  className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                    currentStep > 2 ? "bg-primary text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  3
                </div>
              </div>
            </div>

            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <Label htmlFor="nome">Nome completo</Label>
                    <Input
                      id="nome"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      placeholder="Seu nome completo"
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="seu.email@exemplo.com"
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      placeholder="(00) 00000-0000"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="senha">Senha</Label>
                    <div className="relative">
                      <Input
                        id="senha"
                        name="senha"
                        type={showPassword ? "text" : "password"}
                        value={formData.senha}
                        onChange={handleChange}
                        placeholder="Senha"
                        className="mt-1"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5 text-gray-400" />
                        ) : (
                          <Eye className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Mínimo de 8 caracteres, incluindo uma letra maiúscula e um número
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="confirmarSenha">Confirmar Senha</Label>
                    <Input
                      id="confirmarSenha"
                      name="confirmarSenha"
                      type={showPassword ? "text" : "password"}
                      value={formData.confirmarSenha}
                      onChange={handleChange}
                      placeholder="Confirme sua senha"
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label>Tipo de Usuário</Label>
                    <RadioGroup
                      value={formData.tipoUsuario}
                      onValueChange={handleRadioChange}
                      className="flex space-x-6 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="produtor" id="produtor" />
                        <Label htmlFor="produtor" className="cursor-pointer">
                          Produtor/Fornecedor
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="comprador" id="comprador" />
                        <Label htmlFor="comprador" className="cursor-pointer">
                          Comprador/Indústria
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Company Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="nomeEmpresa">Nome da Empresa</Label>
                    <Input
                      id="nomeEmpresa"
                      name="nomeEmpresa"
                      value={formData.nomeEmpresa}
                      onChange={handleChange}
                      placeholder="Nome da sua empresa"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input
                      id="cnpj"
                      name="cnpj"
                      value={formData.cnpj}
                      onChange={handleChange}
                      placeholder="00.000.000/0000-00"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input
                      id="endereco"
                      name="endereco"
                      value={formData.endereco}
                      onChange={handleChange}
                      placeholder="Rua, número, bairro"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cep">CEP</Label>
                    <Input
                      id="cep"
                      name="cep"
                      value={formData.cep}
                      onChange={handleChange}
                      placeholder="00000-000"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input
                      id="cidade"
                      name="cidade"
                      value={formData.cidade}
                      onChange={handleChange}
                      placeholder="Cidade"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="estado">Estado</Label>
                    <Input
                      id="estado"
                      name="estado"
                      value={formData.estado}
                      onChange={handleChange}
                      placeholder="Estado"
                      className="mt-1"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="website">Website (opcional)</Label>
                    <Input
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://www.exemplo.com"
                      className="mt-1"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="bio">Descrição da empresa (opcional)</Label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Conte um pouco sobre sua empresa..."
                      className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Terms and Conditions */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <Card className="bg-gray-50">
                  <CardContent className="p-4 text-sm text-gray-700 h-48 overflow-y-auto">
                    <h3 className="font-medium mb-2">Termos de Uso e Políticas de Privacidade</h3>
                    <p className="mb-2">
                      Bem-vindo ao Supply Hub! Ao utilizar nossa plataforma, você concorda com os termos e condições
                      descritos neste documento.
                    </p>
                    <p className="mb-2">
                      O Supply Hub é uma plataforma que conecta produtores e compradores de forma sustentável. Nós nos
                      empenhamos em criar um ambiente seguro e confiável para todos os usuários.
                    </p>
                    <p className="mb-2">
                      Ao se cadastrar, você concorda em fornecer informações verdadeiras e completas sobre você e sua
                      empresa. Você é responsável por manter a confidencialidade de sua conta e senha.
                    </p>
                    <p>
                      Nós coletamos e processamos seus dados pessoais de acordo com nossa Política de Privacidade. Seus
                      dados serão utilizados apenas para os fins descritos nesta política.
                    </p>
                  </CardContent>
                </Card>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="termos"
                    checked={formData.termos}
                    onCheckedChange={(checked) => handleCheckboxChange("termos", checked as boolean)}
                  />
                  <Label htmlFor="termos" className="text-sm leading-tight cursor-pointer">
                    Li e concordo com os Termos de Uso e Políticas de Privacidade
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="newsletter"
                    checked={formData.newsletter}
                    onCheckedChange={(checked) => handleCheckboxChange("newsletter", checked as boolean)}
                  />
                  <Label htmlFor="newsletter" className="text-sm leading-tight cursor-pointer">
                    Desejo receber novidades, ofertas e conteúdos do Supply Hub por email
                  </Label>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between">
            {currentStep > 1 ? (
              <Button variant="outline" onClick={prevStep} disabled={loading}>
                Voltar
              </Button>
            ) : (
              <Link href="/login">
                <Button variant="outline">Já tenho uma conta</Button>
              </Link>
            )}

            {currentStep < 3 ? (
              <Button onClick={nextStep} className="bg-primary hover:bg-orange-600">
                Próximo <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="bg-primary hover:bg-orange-600"
                disabled={!formData.termos || loading}
              >
                {loading ? "Criando conta..." : "Criar conta"}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>

      <footer className="bg-white py-4 text-center text-gray-500 text-sm">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} Supply Hub. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
