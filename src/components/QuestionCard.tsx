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
    <Card className="mb-6 animate-slide-up shadow-elegant border border-gold/30 bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold/80 flex items-center justify-center text-gold-foreground font-bold text-lg shadow-lg">
            {questionIndex + 1}
          </div>
          
          <div className="flex-1 space-y-5">
            <p className="text-foreground font-semibold text-lg leading-relaxed">
              {question.texto}
            </p>

            {question.tipo === "simnao" && (
              <div className="flex gap-4">
                <Button
                  onClick={() => onAnswer(question.id, "sim")}
                  variant={answer === "sim" ? "default" : "outline"}
                  className={`flex-1 h-14 font-bold text-lg transition-all duration-300 ${
                    answer === "sim" 
                      ? "bg-gradient-to-r from-success to-success/90 text-success-foreground shadow-xl hover:shadow-2xl transform hover:scale-105" 
                      : "border-2 border-success/50 text-success hover:bg-success/10 hover:border-success"
                  }`}
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  ✅ Sim
                </Button>
                <Button
                  onClick={() => onAnswer(question.id, "nao")}
                  variant={answer === "nao" ? "default" : "outline"}
                  className={`flex-1 h-14 font-bold text-lg transition-all duration-300 ${
                    answer === "nao" 
                      ? "bg-gradient-to-r from-destructive to-destructive/90 text-destructive-foreground shadow-xl hover:shadow-2xl transform hover:scale-105" 
                      : "border-2 border-destructive/50 text-destructive hover:bg-destructive/10 hover:border-destructive"
                  }`}
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
                className="h-14 text-lg border-2 border-gold/30 focus:border-gold focus:ring-gold/20 shadow-sm"
              />
            )}

            {question.tipo === "data" && answer === "sim" && (
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="date"
                  value={dateValue || ""}
                  onChange={(e) => onDateChange(question.id, e.target.value)}
                  className="h-14 pl-12 text-lg border-2 border-gold/30 focus:border-gold focus:ring-gold/20 shadow-sm"
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}