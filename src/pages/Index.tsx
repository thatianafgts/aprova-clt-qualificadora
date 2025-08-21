import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { QuestionCard } from "@/components/QuestionCard";
import { ProgressBar } from "@/components/ProgressBar";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, Settings, Building } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Question {
  id: number;
  texto: string;
  tipo: "simnao" | "texto" | "data";
  contaBarra: boolean;
  condicional?: {
    dependeDa: number;
    resposta: string;
  };
}

const Index = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [dates, setDates] = useState<Record<number, string>>({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [logo, setLogo] = useState<string>("");
  const [customColors, setCustomColors] = useState({
    bg: "#ffffff",
    title: "#1e40af",
    text: "#64748b",
    field: "#ffffff",
    btnYes: "#059669",
    btnNo: "#dc2626",
    aprovaCltTitle: "#1e40af",
    questionNumbers: "#1e40af",
    approvalChances: "#1e40af"
  });
  const { toast } = useToast();

  useEffect(() => {
    // Load questions from localStorage
    const savedQuestions = localStorage.getItem("aprovaclt_questions");
    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions));
    } else {
      // Default questions
      const defaultQuestions: Question[] = [
        {id:1, texto:"Você é maior de 18 anos?", tipo:"simnao", contaBarra:true},
        {id:2, texto:"Você tem mais de 12 meses de carteira assinada no atual emprego?", tipo:"simnao", contaBarra:true},
        {id:3, texto:"O cargo que você ocupa, tem baixa rotatividade?", tipo:"simnao", contaBarra:true},
        {id:4, texto:"Você já fez algum empréstimo CLT?", tipo:"simnao", contaBarra:true},
        {id:5, texto:"Você tem outros empréstimos pessoais?", tipo:"simnao", contaBarra:true},
        {id:6, texto:"Sabe se algum outro colega na sua empresa fez empréstimo CLT?", tipo:"simnao", contaBarra:true},
        {id:7, texto:"A empresa em que você trabalha, tem mais de 24 meses de atividade?", tipo:"simnao", contaBarra:true},
        {id:8, texto:"A empresa em que você trabalha fez alteração de CNPJ nos últimos 12 meses?", tipo:"simnao", contaBarra:true},
        {id:9, texto:"A empresa em que você trabalha tem mais de 10 funcionários?", tipo:"simnao", contaBarra:true},
        {id:10, texto:"Você tem conta no Banco do Brasil?", tipo:"simnao", contaBarra:false, condicional:{dependeDa:6, resposta:"nao"}}
      ];
      setQuestions(defaultQuestions);
    }

    // Load logo
    const savedLogo = localStorage.getItem("aprovaclt_logo");
    if (savedLogo) {
      setLogo(savedLogo);
    }

    // Load custom colors
    setCustomColors({
      bg: localStorage.getItem("aprovaclt_custom_bg") || "#ffffff",
      title: localStorage.getItem("aprovaclt_custom_title") || "#1e40af",
      text: localStorage.getItem("aprovaclt_custom_text") || "#64748b",
      field: localStorage.getItem("aprovaclt_custom_field") || "#ffffff",
      btnYes: localStorage.getItem("aprovaclt_custom_btn_yes") || "#059669",
      btnNo: localStorage.getItem("aprovaclt_custom_btn_no") || "#dc2626",
      aprovaCltTitle: localStorage.getItem("aprovaclt_custom_aprovaclt_title") || "#1e40af",
      questionNumbers: localStorage.getItem("aprovaclt_custom_question_numbers") || "#1e40af",
      approvalChances: localStorage.getItem("aprovaclt_custom_approval_chances") || "#1e40af"
    });
  }, []);

  const isQuestionVisible = (question: Question) => {
    if (!question.condicional) return true;
    return answers[question.condicional.dependeDa] === question.condicional.resposta;
  };

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleDateChange = (questionId: number, value: string) => {
    setDates(prev => ({ ...prev, [questionId]: value }));
  };

  const visibleQuestions = questions.filter(isQuestionVisible);
  const answeredProgressQuestions = visibleQuestions.filter(q => q.contaBarra && answers[q.id]);
  const yesCount = answeredProgressQuestions.filter(q => answers[q.id] === "sim").length;
  const noCount = answeredProgressQuestions.filter(q => answers[q.id] === "nao").length;
  const totalAnswered = yesCount + noCount;

  const formatPhone = (value: string) => {
    // Remove tudo exceto números
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a formatação (XX) XXXXX-XXXX
    if (numbers.length <= 2) {
      return `(${numbers}`;
    } else if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    }
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const validatePhone = (phone: string) => {
    // Remove formatação e verifica se tem 10 ou 11 dígitos
    const numbers = phone.replace(/\D/g, '');
    return numbers.length >= 10 && numbers.length <= 11;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
  };

  const validateEmail = (email: string) => {
    if (!email) return true; // Email é opcional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleWhatsAppSubmit = async () => {
    // Verificar campos obrigatórios
    if (!name.trim() || !phone.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha nome e telefone.",
        variant: "destructive"
      });
      return;
    }

    // Validar formato do telefone
    if (!validatePhone(phone)) {
      toast({
        title: "Telefone inválido",
        description: "Use o formato (11) 99999-9999 ou apenas números com DDD.",
        variant: "destructive"
      });
      return;
    }

    // Validar formato do email
    if (!validateEmail(email)) {
      toast({
        title: "Email inválido",
        description: "Digite um endereço de email válido (ex: usuario@email.com).",
        variant: "destructive"
      });
      return;
    }

    // Verificar se todas as perguntas visíveis foram respondidas
    const unansweredQuestions = visibleQuestions.filter(q => !answers[q.id]);
    if (unansweredQuestions.length > 0) {
      toast({
        title: "Perguntas não respondidas",
        description: "Por favor, responda todas as perguntas antes de continuar.",
        variant: "destructive"
      });
      return;
    }

    // Save response to Supabase and localStorage
    const response = {
      nome: name,
      telefone: phone,
      email: email || null,
      assunto: "Empréstimo CLT",
      respostas: answers,
      datas: dates,
      sim: yesCount,
      nao: noCount,
      percentual_aprovacao: totalAnswered > 0 ? (yesCount / totalAnswered) * 100 : 0
    };

    try {
      // Save to Supabase
      const { error } = await supabase
        .from('respostas')
        .insert([response]);

      if (error) {
        console.error('Erro ao salvar no Supabase:', error);
        toast({
          title: "Aviso",
          description: "Dados salvos localmente. Conexão com servidor indisponível.",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Erro de conexão:', error);
    }

    // Also save to localStorage as backup
    const localResponse = {
      ...response,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    
    const savedResponses = localStorage.getItem("aprovaclt_responses");
    const responses = savedResponses ? JSON.parse(savedResponses) : [];
    responses.push(localResponse);
    localStorage.setItem("aprovaclt_responses", JSON.stringify(responses));

    // Open WhatsApp
    const savedWhatsapp = localStorage.getItem("aprovaclt_whatsapp") || "5511999999999";
    const message = "Oi, quero fazer empréstimo CLT com especialista";
    const whatsappUrl = `https://wa.me/${savedWhatsapp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");

    toast({
      title: "Redirecionando para WhatsApp",
      description: "Seus dados foram salvos com sucesso!",
    });
  };

  return (
    <div 
      className="min-h-screen transition-colors duration-300"
      style={{ 
        backgroundColor: customColors.bg,
        background: `linear-gradient(135deg, ${customColors.bg}, ${customColors.bg}f0)`
      }}
    >
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-lg border-b border-gold/30 shadow-elegant">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            {logo ? (
              <img src={logo} alt="Logo" className="h-10 w-10 sm:h-14 sm:w-14 object-contain rounded-xl shadow-lg" />
            ) : (
              <div className="h-10 w-10 sm:h-14 sm:w-14 bg-gradient-to-br from-primary to-primary-hover rounded-xl flex items-center justify-center shadow-lg animate-pulse-gold">
                <Building className="h-5 w-5 sm:h-8 sm:w-8 text-primary-foreground" />
              </div>
            )}
            <div>
              <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-primary via-gold to-primary bg-clip-text text-transparent" style={{ color: customColors.aprovaCltTitle }}>
                AprovaCLT
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">💰 Qualificação de Empréstimo Profissional</p>
            </div>
          </div>
          
          <Link to="/admin">
            <Button variant="outline" size="sm" className="shadow-lg hover:shadow-xl transition-all duration-300 text-xs sm:text-sm">
              <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Admin
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="text-center mb-8 sm:mb-10">
          <h2 
            className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6 animate-slide-up px-2"
            style={{ color: customColors.title }}
          >
            🎯 Descubra suas Chances de Conseguir um Empréstimo CLT
          </h2>
          <p 
            className="text-base sm:text-xl font-medium leading-relaxed max-w-2xl mx-auto px-4"
            style={{ color: customColors.text }}
          >
            ✨ Responda algumas perguntas e veja sua probabilidade de aprovação em tempo real
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Personal Info */}
            <Card className="shadow-elegant border border-gold/20 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-lg sm:text-xl font-bold text-primary flex items-center gap-2">
                  👤 Seus Dados Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <Input
                  placeholder="📝 Nome completo *"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 sm:h-14 text-base sm:text-lg shadow-sm border-2"
                  style={{ 
                    backgroundColor: customColors.field,
                    borderColor: `${customColors.title}30`,
                    color: customColors.title
                  }}
                />
                <Input
                  placeholder="📱 Celular (WhatsApp) * - Ex: (11) 99999-9999"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="h-12 sm:h-14 text-base sm:text-lg shadow-sm border-2"
                  style={{ 
                    backgroundColor: customColors.field,
                    borderColor: `${customColors.title}30`,
                    color: customColors.title
                  }}
                  maxLength={15}
                />
                {phone && !validatePhone(phone) && (
                  <p className="text-sm text-red-600 font-medium">
                    ⚠️ Digite seu telefone com DDD: (11) 99999-9999
                  </p>
                )}
                <Input
                  placeholder="📧 Email (opcional) - Ex: usuario@email.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 sm:h-14 text-base sm:text-lg shadow-sm border-2"
                  style={{ 
                    backgroundColor: customColors.field,
                    borderColor: `${customColors.title}30`,
                    color: customColors.title
                  }}
                />
                {email && !validateEmail(email) && (
                  <p className="text-sm text-red-600 font-medium">
                    ⚠️ Digite um email válido: usuario@email.com
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Questions */}
            {visibleQuestions.map((question, index) => (
              <QuestionCard
                key={question.id}
                question={question}
                answer={answers[question.id]}
                dateValue={dates[question.id]}
                onAnswer={handleAnswer}
                onDateChange={handleDateChange}
                isVisible={isQuestionVisible(question)}
                questionIndex={index}
              />
            ))}

            {/* WhatsApp Button */}
            <Button
              onClick={handleWhatsAppSubmit}
              className="w-full h-14 sm:h-16 text-lg sm:text-xl font-bold bg-gradient-to-r from-success to-success/90 hover:from-success/90 hover:to-success shadow-xl hover:shadow-2xl transition-all duration-300 animate-pulse-gold"
              disabled={!name.trim() || !phone.trim()}
            >
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
              🚀 Seguir com Especialista
            </Button>
          </div>

          {/* Progress Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <ProgressBar
                yesCount={yesCount}
                noCount={noCount}
                totalAnswered={totalAnswered}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;