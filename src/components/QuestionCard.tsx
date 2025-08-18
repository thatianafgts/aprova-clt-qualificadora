import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle, Calendar } from "lucide-react";

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
  if (!isVisible) return null;

  return (
    <Card className="mb-6 animate-slide-up shadow-lg border-0 bg-card/95 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold flex items-center justify-center text-gold-foreground font-semibold text-sm">
            {questionIndex + 1}
          </div>
          
          <div className="flex-1 space-y-4">
            <p className="text-foreground font-medium leading-relaxed">
              {question.texto}
            </p>

            {question.tipo === "simnao" && (
              <div className="flex gap-3">
                <Button
                  onClick={() => onAnswer(question.id, "sim")}
                  variant={answer === "sim" ? "default" : "outline"}
                  className={`flex-1 h-12 font-medium transition-all duration-200 ${
                    answer === "sim" 
                      ? "bg-success hover:bg-success/90 text-success-foreground border-success shadow-lg" 
                      : "hover:border-success hover:text-success"
                  }`}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Sim
                </Button>
                <Button
                  onClick={() => onAnswer(question.id, "nao")}
                  variant={answer === "nao" ? "default" : "outline"}
                  className={`flex-1 h-12 font-medium transition-all duration-200 ${
                    answer === "nao" 
                      ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground border-destructive shadow-lg" 
                      : "hover:border-destructive hover:text-destructive"
                  }`}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Não
                </Button>
              </div>
            )}

            {question.tipo === "texto" && (
              <Input
                type="text"
                placeholder="Digite sua resposta..."
                value={answer || ""}
                onChange={(e) => onAnswer(question.id, e.target.value)}
                className="h-12 border-2 focus:border-gold focus:ring-gold/20"
              />
            )}

            {question.tipo === "data" && answer === "sim" && (
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="date"
                  value={dateValue || ""}
                  onChange={(e) => onDateChange(question.id, e.target.value)}
                  className="h-12 pl-10 border-2 focus:border-gold focus:ring-gold/20"
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}