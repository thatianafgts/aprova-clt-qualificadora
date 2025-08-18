import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ProgressBarProps {
  yesCount: number;
  noCount: number;
  totalAnswered: number;
}

export function ProgressBar({ yesCount, noCount, totalAnswered }: ProgressBarProps) {
  const percentage = totalAnswered > 0 ? (yesCount / totalAnswered) * 100 : 0;
  
  let status = "neutral";
  let bgColor = "bg-muted";
  let textColor = "text-muted-foreground";
  let icon = <Minus className="w-5 h-5" />;
  let message = "Responda as perguntas para ver suas chances";

  if (totalAnswered > 0) {
    if (percentage > 70) {
      status = "excellent";
      bgColor = "bg-success";
      textColor = "text-success-foreground";
      icon = <TrendingUp className="w-5 h-5" />;
      message = "Excelente! Suas chances são muito altas!";
    } else if (percentage >= 50) {
      status = "good";
      bgColor = "bg-warning";
      textColor = "text-warning-foreground";
      icon = <TrendingUp className="w-5 h-5" />;
      message = "Boas chances! Continue respondendo.";
    } else if (percentage >= 30) {
      status = "fair";
      bgColor = "bg-warning";
      textColor = "text-warning-foreground";
      icon = <Minus className="w-5 h-5" />;
      message = "Chances moderadas. Vamos analisar seu perfil.";
    } else {
      status = "low";
      bgColor = "bg-destructive";
      textColor = "text-destructive-foreground";
      icon = <TrendingDown className="w-5 h-5" />;
      message = "Vamos encontrar alternativas para você.";
    }
  }

  return (
    <div className="space-y-4 p-6 bg-card rounded-xl shadow-lg border border-gold/20">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground text-lg">
          Chances de Aprovação
        </h3>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${bgColor} ${textColor}`}>
          {icon}
          <span className="font-medium">
            {Math.round(percentage)}%
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <Progress 
          value={percentage} 
          className="h-3 bg-muted"
          style={
            {
              '--progress-width': `${percentage}%`
            } as React.CSSProperties
          }
        />
        
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Respostas Positivas: {yesCount}</span>
          <span>Total Respondidas: {totalAnswered}</span>
        </div>
      </div>

      <div className={`text-center p-3 rounded-lg ${
        status === "excellent" ? "bg-success/10 text-success" :
        status === "good" ? "bg-warning/10 text-warning" :
        status === "fair" ? "bg-warning/10 text-warning" :
        status === "low" ? "bg-destructive/10 text-destructive" :
        "bg-muted/50 text-muted-foreground"
      }`}>
        <p className="font-medium">{message}</p>
      </div>
    </div>
  );
}