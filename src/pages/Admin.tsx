import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LogoUpload } from "@/components/LogoUpload";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Users, TrendingUp, Settings, LogOut, Home, Phone, Eye, EyeOff, Palette } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AdminPasswordModal } from "@/components/AdminPasswordModal";
import { AdminSetPasswordModal } from "@/components/AdminSetPasswordModal";
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

interface Response {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  respostas: Record<number, string>;
  datas: Record<number, string>;
  sim: number;
  nao: number;
  timestamp: string;
}

export default function Admin() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSetPasswordModal, setShowSetPasswordModal] = useState(false);
  const [isFirstAccess, setIsFirstAccess] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<Response[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    texto: "",
    tipo: "simnao",
    contaBarra: true,
    condicional: undefined
  });
  const [logo, setLogo] = useState<string>("");
  const [whatsappNumber, setWhatsappNumber] = useState<string>("");
  
  // Color customization states
  const [customBg, setCustomBg] = useState<string>("#ffffff");
  const [customTitle, setCustomTitle] = useState<string>("#1e40af");
  const [customText, setCustomText] = useState<string>("#64748b");
  const [customField, setCustomField] = useState<string>("#ffffff");
  const [customBtnYes, setCustomBtnYes] = useState<string>("#059669");
  const [customBtnNo, setCustomBtnNo] = useState<string>("#dc2626");
  const [customAprovaCltTitle, setCustomAprovaCltTitle] = useState<string>("#1e40af");
  const [customQuestionNumbers, setCustomQuestionNumbers] = useState<string>("#1e40af");
  const [customApprovalChances, setCustomApprovalChances] = useState<string>("#1e40af");
  
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data } = await supabase
        .from('admin_settings')
        .select('username')
        .eq('username', 'admin')
        .maybeSingle();

      if (!data) {
        // First access - no password set yet
        setIsFirstAccess(true);
        setShowSetPasswordModal(true);
      } else {
        // Password exists - show login modal
        setShowLoginModal(true);
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      setShowLoginModal(true);
    }
  };

  const loadData = () => {
    // Load questions
    const savedQuestions = localStorage.getItem("aprovaclt_questions");
    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions));
    } else {
      // Initialize with default questions
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
      localStorage.setItem("aprovaclt_questions", JSON.stringify(defaultQuestions));
    }

    // Load responses
    const savedResponses = localStorage.getItem("aprovaclt_responses");
    if (savedResponses) {
      setResponses(JSON.parse(savedResponses));
    }

    // Load logo
    const savedLogo = localStorage.getItem("aprovaclt_logo");
    if (savedLogo) {
      setLogo(savedLogo);
    }

    // Load WhatsApp number
    const savedWhatsapp = localStorage.getItem("aprovaclt_whatsapp");
    if (savedWhatsapp) {
      setWhatsappNumber(savedWhatsapp);
    }

    // Load custom colors
    const savedCustomBg = localStorage.getItem("aprovaclt_custom_bg");
    if (savedCustomBg) setCustomBg(savedCustomBg);
    
    const savedCustomTitle = localStorage.getItem("aprovaclt_custom_title");
    if (savedCustomTitle) setCustomTitle(savedCustomTitle);
    
    const savedCustomText = localStorage.getItem("aprovaclt_custom_text");
    if (savedCustomText) setCustomText(savedCustomText);
    
    const savedCustomField = localStorage.getItem("aprovaclt_custom_field");
    if (savedCustomField) setCustomField(savedCustomField);
    
    const savedCustomBtnYes = localStorage.getItem("aprovaclt_custom_btn_yes");
    if (savedCustomBtnYes) setCustomBtnYes(savedCustomBtnYes);
    
    const savedCustomBtnNo = localStorage.getItem("aprovaclt_custom_btn_no");
    if (savedCustomBtnNo) setCustomBtnNo(savedCustomBtnNo);
    
    const savedCustomAprovaCltTitle = localStorage.getItem("aprovaclt_custom_aprovaclt_title");
    if (savedCustomAprovaCltTitle) setCustomAprovaCltTitle(savedCustomAprovaCltTitle);
    
    const savedCustomQuestionNumbers = localStorage.getItem("aprovaclt_custom_question_numbers");
    if (savedCustomQuestionNumbers) setCustomQuestionNumbers(savedCustomQuestionNumbers);
    
    const savedCustomApprovalChances = localStorage.getItem("aprovaclt_custom_approval_chances");
    if (savedCustomApprovalChances) setCustomApprovalChances(savedCustomApprovalChances);
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    setIsAuthenticated(true);
    loadData();
    toast({
      title: "Login realizado!",
      description: "Bem-vindo ao painel administrativo.",
    });
  };

  const handleSetPasswordSuccess = () => {
    setShowSetPasswordModal(false);
    if (isFirstAccess) {
      // After first password setup, show login modal
      setIsFirstAccess(false);
      setShowLoginModal(true);
    } else {
      toast({
        title: "Senha atualizada!",
        description: "Senha alterada com sucesso.",
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    checkAdminAccess();
  };

  const handleBackToHome = () => {
    setShowLoginModal(false);
    setShowSetPasswordModal(false);
    navigate("/");
  };

  const saveQuestion = () => {
    if (!newQuestion.texto?.trim()) {
      toast({
        title: "Erro",
        description: "O texto da pergunta é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    const questionToSave: Question = {
      id: editingQuestion?.id || Date.now(),
      texto: newQuestion.texto || "",
      tipo: newQuestion.tipo || "simnao",
      contaBarra: newQuestion.contaBarra ?? true,
      condicional: newQuestion.condicional
    };

    const updatedQuestions = editingQuestion
      ? questions.map(q => q.id === editingQuestion.id ? questionToSave : q)
      : [...questions, questionToSave];

    setQuestions(updatedQuestions);
    localStorage.setItem("aprovaclt_questions", JSON.stringify(updatedQuestions));
    
    setNewQuestion({ texto: "", tipo: "simnao", contaBarra: true, condicional: undefined });
    setEditingQuestion(null);
    
    toast({
      title: editingQuestion ? "Pergunta atualizada!" : "Pergunta adicionada!",
      description: "As alterações foram salvas com sucesso.",
    });
  };

  const deleteQuestion = (id: number) => {
    const updatedQuestions = questions.filter(q => q.id !== id);
    setQuestions(updatedQuestions);
    localStorage.setItem("aprovaclt_questions", JSON.stringify(updatedQuestions));
    
    toast({
      title: "Pergunta removida!",
      description: "A pergunta foi deletada com sucesso.",
    });
  };

  const editQuestion = (question: Question) => {
    setEditingQuestion(question);
    setNewQuestion(question);
  };

  if (!isAuthenticated) {
    return (
      <>
        <AdminPasswordModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onSuccess={handleLoginSuccess}
          onOpenSetPassword={() => {
            setShowLoginModal(false);
            setShowSetPasswordModal(true);
          }}
          onBackToHome={handleBackToHome}
        />
        
        <AdminSetPasswordModal
          isOpen={showSetPasswordModal}
          onClose={() => setShowSetPasswordModal(false)}
          onSuccess={handleSetPasswordSuccess}
          onOpenLogin={() => {
            setShowSetPasswordModal(false);
            setShowLoginModal(true);
          }}
          isFirstAccess={isFirstAccess}
        />
      </>
    );
  }

  const totalResponses = responses.length;
  const averageApprovalRate = responses.length > 0 
    ? responses.reduce((acc, r) => acc + (r.sim + r.nao > 0 ? (r.sim / (r.sim + r.nao)) * 100 : 0), 0) / responses.length
    : 0;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Painel Administrativo</h1>
            <p className="text-muted-foreground">Gerencie perguntas e analise respostas</p>
          </div>
          <div className="flex gap-2">
            <Link to="/">
              <Button variant="outline">
                <Home className="w-4 h-4 mr-2" />
                Voltar ao Início
              </Button>
            </Link>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total de Respostas</p>
                  <p className="text-2xl font-bold">{totalResponses}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-success/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Taxa Média de Aprovação</p>
                  <p className="text-2xl font-bold">{Math.round(averageApprovalRate)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gold/10 rounded-lg">
                  <Settings className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Perguntas Ativas</p>
                  <p className="text-2xl font-bold">{questions.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Color Customization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Personalização de Cores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Customize as cores da página inicial do questionário
              </p>
              
              <Button
                onClick={() => navigate("/colors")}
                className="w-full"
              >
                <Palette className="w-4 h-4 mr-2" />
                Abrir Personalização de Cores
              </Button>
            </CardContent>
          </Card>

          {/* Logo Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configurações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Logo da Empresa</Label>
                  <div className="mt-2">
                    <LogoUpload currentLogo={logo} onLogoChange={setLogo} />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="whatsapp">Número do WhatsApp</Label>
                  <div className="flex gap-2 mt-2">
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-muted-foreground mr-2" />
                    </div>
                    <Input
                      id="whatsapp"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="5511999999999"
                      className="flex-1"
                    />
                    <Button
                      onClick={() => {
                        localStorage.setItem("aprovaclt_whatsapp", whatsappNumber);
                        toast({
                          title: "WhatsApp atualizado!",
                          description: "Número salvo com sucesso.",
                        });
                      }}
                      size="sm"
                    >
                      Salvar
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Formato: código do país + DDD + número (ex: 5511999999999)
                  </p>
                </div>

                <div>
                  <Button
                    onClick={() => {
                      setShowSetPasswordModal(true);
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Alterar Senha do Admin
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Question Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                {editingQuestion ? "Editar Pergunta" : "Nova Pergunta"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Texto da Pergunta</Label>
                <Textarea
                  value={newQuestion.texto}
                  onChange={(e) => setNewQuestion({ ...newQuestion, texto: e.target.value })}
                  placeholder="Digite o texto da pergunta..."
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Tipo</Label>
                <Select
                  value={newQuestion.tipo}
                  onValueChange={(value: any) => setNewQuestion({ ...newQuestion, tipo: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simnao">Sim/Não</SelectItem>
                    <SelectItem value="texto">Texto</SelectItem>
                    <SelectItem value="data">Data</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="contaBarra"
                  checked={newQuestion.contaBarra}
                  onChange={(e) => setNewQuestion({ ...newQuestion, contaBarra: e.target.checked })}
                />
                <Label htmlFor="contaBarra">Conta para barra de progresso</Label>
              </div>

              <div className="flex gap-2">
                <Button onClick={saveQuestion} className="flex-1">
                  {editingQuestion ? "Atualizar" : "Adicionar"}
                </Button>
                {editingQuestion && (
                  <Button
                    onClick={() => {
                      setEditingQuestion(null);
                      setNewQuestion({ texto: "", tipo: "simnao", contaBarra: true, condicional: undefined });
                    }}
                    variant="outline"
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Questions List */}
        <Card>
          <CardHeader>
            <CardTitle>Perguntas Configuradas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {questions.map((question) => (
                <div key={question.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{question.texto}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary">{question.tipo}</Badge>
                      {question.contaBarra && (
                        <Badge variant="outline" className="text-success border-success">
                          Conta para progresso
                        </Badge>
                      )}
                      {question.condicional && (
                        <Badge variant="outline" className="text-warning border-warning">
                          Condicional
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => editQuestion(question)} size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button onClick={() => deleteQuestion(question.id)} size="sm" variant="outline">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Responses */}
        {responses.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Últimas Respostas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {responses.slice(-10).reverse().map((response) => (
                  <div key={response.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{response.nome}</p>
                        <p className="text-sm text-muted-foreground">{response.telefone}</p>
                        {response.email && (
                          <p className="text-sm text-muted-foreground">{response.email}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          {new Date(response.timestamp).toLocaleDateString('pt-BR')}
                        </p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className="text-success border-success">
                            {response.sim} Sim
                          </Badge>
                          <Badge variant="outline" className="text-destructive border-destructive">
                            {response.nao} Não
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <AdminPasswordModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
        onOpenSetPassword={() => {
          setShowLoginModal(false);
          setShowSetPasswordModal(true);
        }}
        onBackToHome={handleBackToHome}
      />
      
      <AdminSetPasswordModal
        isOpen={showSetPasswordModal}
        onClose={() => setShowSetPasswordModal(false)}
        onSuccess={handleSetPasswordSuccess}
        onOpenLogin={() => {
          setShowSetPasswordModal(false);
          setShowLoginModal(true);
        }}
        isFirstAccess={isFirstAccess}
      />
    </div>
  );
}