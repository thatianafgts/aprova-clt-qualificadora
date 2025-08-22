import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import bcrypt from "bcryptjs";
import { useToast } from "@/hooks/use-toast";

interface AdminPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onOpenSetPassword: () => void;
  onBackToHome: () => void;
}

export function AdminPasswordModal({ isOpen, onClose, onSuccess, onOpenSetPassword, onBackToHome }: AdminPasswordModalProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isBlocked) {
      toast({
        title: "Bloqueado",
        description: "Muitas tentativas. Tente novamente em 30s.",
        variant: "destructive",
      });
      return;
    }

    if (!password.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Informe a senha.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('password_hash')
        .eq('username', 'admin')
        .single();

      if (error || !data) {
        toast({
          title: "Erro",
          description: "Erro ao verificar senha.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const isValid = await bcrypt.compare(password, data.password_hash);
      
      if (isValid) {
        setFailedAttempts(0);
        setPassword("");
        onSuccess();
      } else {
        const newFailedAttempts = failedAttempts + 1;
        setFailedAttempts(newFailedAttempts);
        
        if (newFailedAttempts >= 5) {
          setIsBlocked(true);
          setTimeout(() => {
            setIsBlocked(false);
            setFailedAttempts(0);
          }, 30000);
          
          toast({
            title: "Bloqueado",
            description: "Muitas tentativas. Tente novamente em 30s.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Senha incorreta",
            description: "Senha incorreta, tente novamente.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Error verifying password:', error);
      toast({
        title: "Erro",
        description: "Erro ao verificar senha.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const handleForgotPassword = () => {
    toast({
      title: "Recurso indisponível",
      description: "Recurso indisponível. Utilize Cadastrar/Alterar Senha para definir uma nova senha.",
      variant: "destructive",
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e as any);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="w-full max-w-md mx-auto p-6" onKeyDown={handleKeyDown}>
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Acesso ao Painel Administrativo
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="pr-10"
                disabled={isLoading || isBlocked}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading || isBlocked}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              type="submit" 
              className="w-full min-h-[44px]" 
              disabled={isLoading || isBlocked}
            >
              {isLoading ? "Verificando..." : "Acessar"}
            </Button>
            
            <Button 
              type="button" 
              variant="ghost" 
              className="w-full min-h-[44px] text-sm"
              onClick={handleForgotPassword}
              disabled={isLoading}
            >
              Esqueci Minha Senha
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              className="w-full min-h-[44px]"
              onClick={onOpenSetPassword}
              disabled={isLoading}
            >
              Cadastrar/Alterar Senha
            </Button>
          </div>

          <div className="text-center">
            <Button 
              type="button" 
              variant="link" 
              className="text-sm"
              onClick={onBackToHome}
              disabled={isLoading}
            >
              Voltar ao Início
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}