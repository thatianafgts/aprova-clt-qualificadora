import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Colors() {
  const navigate = useNavigate();
  const { toast } = useToast();

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

  useEffect(() => {
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
  }, []);

  const handleSave = () => {
    localStorage.setItem("aprovaclt_custom_bg", customBg);
    localStorage.setItem("aprovaclt_custom_title", customTitle);
    localStorage.setItem("aprovaclt_custom_text", customText);
    localStorage.setItem("aprovaclt_custom_field", customField);
    localStorage.setItem("aprovaclt_custom_btn_yes", customBtnYes);
    localStorage.setItem("aprovaclt_custom_btn_no", customBtnNo);
    localStorage.setItem("aprovaclt_custom_aprovaclt_title", customAprovaCltTitle);
    localStorage.setItem("aprovaclt_custom_question_numbers", customQuestionNumbers);
    localStorage.setItem("aprovaclt_custom_approval_chances", customApprovalChances);
    
    toast({
      title: "Cores personalizadas salvas!",
      description: "As alterações serão aplicadas na página inicial.",
    });
    
    navigate("/admin");
  };

  const handleClose = () => {
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-primary">Personalização de Cores</h1>
              <p className="text-muted-foreground">Customize as cores da página inicial</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Salvar
            </Button>
            <Button variant="outline" onClick={handleClose} className="flex items-center gap-2">
              <X className="w-4 h-4" />
              Fechar
            </Button>
          </div>
        </div>

        {/* Color Customization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎨 Personalização de Cores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label>Cor de Fundo</Label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="color"
                    value={customBg}
                    onChange={(e) => setCustomBg(e.target.value)}
                    className="w-10 h-10 rounded border"
                  />
                  <Input
                    value={customBg}
                    onChange={(e) => setCustomBg(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div>
                <Label>Cor do Título</Label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="color"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="w-10 h-10 rounded border"
                  />
                  <Input
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div>
                <Label>Cor do Texto</Label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="color"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    className="w-10 h-10 rounded border"
                  />
                  <Input
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div>
                <Label>Cor dos Campos</Label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="color"
                    value={customField}
                    onChange={(e) => setCustomField(e.target.value)}
                    className="w-10 h-10 rounded border"
                  />
                  <Input
                    value={customField}
                    onChange={(e) => setCustomField(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div>
                <Label>Botão SIM</Label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="color"
                    value={customBtnYes}
                    onChange={(e) => setCustomBtnYes(e.target.value)}
                    className="w-10 h-10 rounded border"
                  />
                  <Input
                    value={customBtnYes}
                    onChange={(e) => setCustomBtnYes(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div>
                <Label>Botão NÃO</Label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="color"
                    value={customBtnNo}
                    onChange={(e) => setCustomBtnNo(e.target.value)}
                    className="w-10 h-10 rounded border"
                  />
                  <Input
                    value={customBtnNo}
                    onChange={(e) => setCustomBtnNo(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div>
                <Label>Título AprovaCLT</Label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="color"
                    value={customAprovaCltTitle}
                    onChange={(e) => setCustomAprovaCltTitle(e.target.value)}
                    className="w-10 h-10 rounded border"
                  />
                  <Input
                    value={customAprovaCltTitle}
                    onChange={(e) => setCustomAprovaCltTitle(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div>
                <Label>Números das Perguntas</Label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="color"
                    value={customQuestionNumbers}
                    onChange={(e) => setCustomQuestionNumbers(e.target.value)}
                    className="w-10 h-10 rounded border"
                  />
                  <Input
                    value={customQuestionNumbers}
                    onChange={(e) => setCustomQuestionNumbers(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div>
                <Label>Chances de Aprovação</Label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="color"
                    value={customApprovalChances}
                    onChange={(e) => setCustomApprovalChances(e.target.value)}
                    className="w-10 h-10 rounded border"
                  />
                  <Input
                    value={customApprovalChances}
                    onChange={(e) => setCustomApprovalChances(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 mt-6">
              <Button onClick={handleSave} className="flex-1 md:flex-initial">
                <Save className="w-4 h-4 mr-2" />
                Salvar Alterações
              </Button>
              <Button variant="outline" onClick={handleClose} className="flex-1 md:flex-initial">
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}