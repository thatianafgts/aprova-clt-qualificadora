import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { QuestionCard } from "@/components/QuestionCard";
import { ProgressBar } from "@/components/ProgressBar";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, Settings, Building } from "lucide-react";
import { Link } from "react-router-dom";

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

  const handleWhatsAppSubmit = () => {
    if (!name.trim() || !phone.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha nome e telefone.",
        variant: "destructive"
      });
      return;
    }

    // Save response
    const response = {
      id: Date.now().toString(),
      nome: name,
      telefone: phone,
      email: email,
      respostas: answers,
      datas: dates,
      sim: yesCount,
      nao: noCount,
      timestamp: new Date().toISOString()
    };

    const savedResponses = localStorage.getItem("aprovaclt_responses");
    const responses = savedResponses ? JSON.parse(savedResponses) : [];
    responses.push(response);
    localStorage.setItem("aprovaclt_responses", JSON.stringify(responses));

    // Open WhatsApp
    const phoneNumber = "5511999999999"; // Replace with actual number
    const message = `Olá! Gostaria de simular um empréstimo CLT. Meu nome é ${name}.`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");

    toast({
      title: "Redirecionando para WhatsApp",
      description: "Seus dados foram salvos com sucesso!",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-gold/20 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {logo ? (
              <img src={logo} alt="Logo" className="h-12 w-12 object-contain rounded-lg" />
            ) : (
              <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
                <Building className="h-6 w-6 text-primary-foreground" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-primary">AprovaCLT</h1>
              <p className="text-sm text-muted-foreground">Qualificação de Empréstimo</p>
            </div>
          </div>
          
          <Link to="/admin">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Admin
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary mb-4">
            Descubra suas Chances de Conseguir um Empréstimo CLT
          </h2>
          <p className="text-lg text-muted-foreground">
            Responda algumas perguntas e veja sua probabilidade de aprovação em tempo real
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Info */}
            <Card>
              <CardHeader>
                <CardTitle>Seus Dados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Nome completo *"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12"
                />
                <Input
                  placeholder="Celular (WhatsApp) *"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-12"
                />
                <Input
                  placeholder="Email (opcional)"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                />
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
              className="w-full h-14 text-lg font-semibold bg-success hover:bg-success/90 animate-pulse-gold"
              disabled={!name.trim() || !phone.trim()}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Simular no WhatsApp
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