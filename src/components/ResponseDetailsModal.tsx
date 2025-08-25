import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";

interface ResponseDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  response: any;
  questions: any[];
}

export function ResponseDetailsModal({ isOpen, onClose, response, questions }: ResponseDetailsModalProps) {
  if (!response) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">Detalhes da Resposta</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* User Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informações do Usuário</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nome</p>
                <p className="font-medium">{response.nome}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Telefone</p>
                <p className="font-medium">{response.telefone}</p>
              </div>
              {response.email && (
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{response.email}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Data de Resposta</p>
                <p className="font-medium">
                  {new Date(response.criado_em || response.timestamp).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Answers */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Respostas</h3>
            <div className="space-y-3">
              {questions.map((question) => {
                const answer = response.respostas?.[question.id];
                if (!answer) return null;
                
                return (
                  <div key={question.id} className="border rounded-lg p-3 space-y-2">
                    <p className="font-medium text-sm">{question.texto}</p>
                    <div>
                      {question.tipo === "simnao" ? (
                        <Badge 
                          variant={answer === "sim" ? "default" : "destructive"}
                          className={answer === "sim" ? "bg-success text-white" : ""}
                        >
                          {answer === "sim" ? "Sim" : "Não"}
                        </Badge>
                      ) : question.tipo === "data" ? (
                        <Badge variant="outline">
                          {response.datas?.[question.id] || answer}
                        </Badge>
                      ) : (
                        <p className="text-sm text-muted-foreground">{answer}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Statistics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Estatísticas</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <Badge variant="default" className="mb-2 bg-success text-white">
                  {response.sim || 0} Sim
                </Badge>
                <p className="text-xs text-muted-foreground">Respostas Positivas</p>
              </div>
              <div className="text-center">
                <Badge variant="destructive" className="mb-2">
                  {response.nao || 0} Não
                </Badge>
                <p className="text-xs text-muted-foreground">Respostas Negativas</p>
              </div>
              <div className="text-center">
                <Badge variant="outline" className="mb-2">
                  {response.percentual_aprovacao || Math.round((response.sim / (response.sim + response.nao)) * 100)}%
                </Badge>
                <p className="text-xs text-muted-foreground">Taxa de Aprovação</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}