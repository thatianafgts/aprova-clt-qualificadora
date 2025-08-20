import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ProgressBarProps {
  yesCount: number;
  noCount: number;
  totalAnswered: number;
}

export function ProgressBar({ yesCount, noCount, totalAnswered }: ProgressBarProps) {
  // Iniciar vazia (0%) se não há respostas
  const percentage = totalAnswered > 0 ? (yesCount / totalAnswered) * 100 : 0;
  
  let status = "neutral";
  let bgColor = "bg-muted";
  let textColor = "text-muted-foreground";
  let icon = <Minus className="w-5 h-5" />;
  let message = "Responda as perguntas para ver suas chances";
  let progressColor = "bg-muted"; // Cor da barra de progresso

  if (totalAnswered > 0) {
    // Lógica baseada no número de respostas "Não"
    if (noCount === 0) {
      // Verde: nenhuma resposta negativa
      status = "excellent";
      bgColor = "bg-success";
      textColor = "text-success-foreground";
      icon = <TrendingUp className="w-5 h-5" />;
      message = "Excelente! Suas chances são muito altas!";
      progressColor = "bg-success";
    }
    else if (noCount === 1) {
      // Laranja: uma resposta negativa
      status = "moderate";
      bgColor = "bg-warning";
      textColor = "text-warning-foreground";
      icon = <Minus className="w-5 h-5" />;
      message = "Boas chances! Vamos analisar seu perfil.";
      progressColor = "bg-warning";
    }
    else {
      // Vermelho: duas ou mais respostas negativas
      status = "low";
      bgColor = "bg-destructive";
      textColor = "text-destructive-foreground";
      icon = <TrendingDown className="w-5 h-5" />;
      message = "Vamos encontrar alternativas para você.";
      progressColor = "bg-destructive";
    }
  }

  return (
    <div className="space-y-4 p-6 bg-card rounded-xl shadow-elegant border border-gold/30 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-foreground text-xl bg-gradient-to-r from-primary to-gold bg-clip-text text-transparent" style={{ color: localStorage.getItem("aprovaclt_custom_approval_chances") || "#1e40af" }}>
          Chances de Aprovação
        </h3>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg ${bgColor} ${textColor} animate-slide-up`}>
          {icon}
          <span className="font-bold text-lg">
            {Math.round(percentage)}%
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="w-full h-4 bg-muted rounded-full overflow-hidden shadow-inner">
          <div 
            className={`h-full transition-all duration-700 ease-out rounded-full ${progressColor} shadow-lg`}
            style={{ 
              width: `${percentage}%`,
              background: status === "excellent" ? "linear-gradient(90deg, hsl(var(--success)), hsl(140 100% 35%))" :
                         status === "moderate" ? "linear-gradient(90deg, hsl(var(--warning)), hsl(35 100% 60%))" :
                         status === "low" ? "linear-gradient(90deg, hsl(var(--destructive)), hsl(0 100% 55%))" :
                         "hsl(var(--muted-foreground))"
            }}
          />
        </div>
        
        <div className="flex justify-between text-sm text-muted-foreground font-medium">
          <span>✅ Positivas: {yesCount}</span>
          <span>📊 Total: {totalAnswered}</span>
        </div>
      </div>

      <div className={`text-center p-4 rounded-xl shadow-inner transition-all duration-300 ${
        status === "excellent" ? "bg-gradient-to-br from-success-light to-success-light/50 text-success border border-success/20" :
        status === "moderate" ? "bg-gradient-to-br from-warning-light to-warning-light/50 text-warning border border-warning/20" :
        status === "low" ? "bg-gradient-to-br from-destructive-light to-destructive-light/50 text-destructive border border-destructive/20" :
        "bg-gradient-to-br from-muted to-muted/50 text-muted-foreground border border-muted"
      }`}>
        <p className="font-bold text-lg">{message}</p>
      </div>
    </div>
  );
}