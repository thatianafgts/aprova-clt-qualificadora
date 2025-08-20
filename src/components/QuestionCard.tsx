import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle, Calendar } from "lucide-react";
import { useState, useEffect } from "react";

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

interface QuestionCardProps {
  question: Question;
  answer?: string;
  dateValue?: string;
  onAnswer: (questionId: number, value: string) => void;
  onDateChange: (questionId: number, value: string) => void;
  isVisible: boolean;
  questionIndex: number;
}

export function QuestionCard({
  question,
  answer,
  dateValue,
  onAnswer,
  onDateChange,
  isVisible,
  questionIndex
}: QuestionCardProps) {
  const [customColors, setCustomColors] = useState({
    bg: "#ffffff",
    title: "#1e40af",
    text: "#64748b",
    field: "#ffffff",
    btnYes: "#059669",
    btnNo: "#dc2626"
  });

  useEffect(() => {
    // Load custom colors from localStorage
    setCustomColors({
      bg: localStorage.getItem("aprovaclt_custom_bg") || "#ffffff",
      title: localStorage.getItem("aprovaclt_custom_title") || "#1e40af",
      text: localStorage.getItem("aprovaclt_custom_text") || "#64748b",
      field: localStorage.getItem("aprovaclt_custom_field") || "#ffffff",
      btnYes: localStorage.getItem("aprovaclt_custom_btn_yes") || "#059669",
      btnNo: localStorage.getItem("aprovaclt_custom_btn_no") || "#dc2626"
    });
  }, []);

  if (!isVisible) return null;

  return (
    <Card className="mb-6 animate-slide-up shadow-elegant border-2 bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div 
            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg text-white"
            style={{ backgroundColor: customColors.title }}
          >
            {questionIndex + 1}
          </div>
          
          <div className="flex-1 space-y-5">
            <p 
              className="font-semibold text-lg leading-relaxed"
              style={{ color: customColors.title }}
            >
              {question.texto}
            </p>

            {question.tipo === "simnao" && (
              <div className="flex gap-4">
                <Button
                  onClick={() => onAnswer(question.id, "sim")}
                  variant={answer === "sim" ? "default" : "outline"}
                  className={`flex-1 h-14 font-bold text-lg transition-all duration-300 ${
                    answer === "sim" 
                      ? "text-white shadow-xl hover:shadow-2xl transform hover:scale-105" 
                      : "hover:scale-105"
                  }`}
                  style={{
                    backgroundColor: answer === "sim" ? customColors.btnYes : 'transparent',
                    borderColor: customColors.btnYes,
                    color: answer === "sim" ? 'white' : customColors.btnYes,
                    borderWidth: '2px'
                  }}
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  ✅ Sim
                </Button>
                <Button
                  onClick={() => onAnswer(question.id, "nao")}
                  variant={answer === "nao" ? "default" : "outline"}
                  className={`flex-1 h-14 font-bold text-lg transition-all duration-300 ${
                    answer === "nao" 
                      ? "text-white shadow-xl hover:shadow-2xl transform hover:scale-105" 
                      : "hover:scale-105"
                  }`}
                  style={{
                    backgroundColor: answer === "nao" ? customColors.btnNo : 'transparent',
                    borderColor: customColors.btnNo,
                    color: answer === "nao" ? 'white' : customColors.btnNo,
                    borderWidth: '2px'
                  }}
                >
                  <XCircle className="w-5 h-5 mr-2" />
                  ❌ Não
                </Button>
              </div>
            )}

            {question.tipo === "texto" && (
              <Input
                type="text"
                placeholder="📝 Digite sua resposta..."
                value={answer || ""}
                onChange={(e) => onAnswer(question.id, e.target.value)}
                className="h-14 text-lg shadow-sm border-2"
                style={{ 
                  backgroundColor: customColors.field,
                  borderColor: `${customColors.title}30`,
                  color: customColors.title
                }}
              />
            )}

            {question.tipo === "data" && answer === "sim" && (
              <div className="relative">
                <Calendar 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" 
                  style={{ color: customColors.text }}
                />
                <Input
                  type="date"
                  value={dateValue || ""}
                  onChange={(e) => onDateChange(question.id, e.target.value)}
                  className="h-14 pl-12 text-lg shadow-sm border-2"
                  style={{ 
                    backgroundColor: customColors.field,
                    borderColor: `${customColors.title}30`,
                    color: customColors.title
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}