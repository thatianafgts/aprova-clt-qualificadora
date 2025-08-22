import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import bcrypt from "bcryptjs";
import { useToast } from "@/hooks/use-toast";

interface AdminSetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onOpenLogin?: () => void;
  isFirstAccess: boolean;
}

export function AdminSetPasswordModal({ isOpen, onClose, onSuccess, onOpenLogin, isFirstAccess }: AdminSetPasswordModalProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const validatePasswords = () => {
    if (!newPassword.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Nova senha é obrigatória.",
        variant: "destructive",
      });
      return false;
    }

    if (!confirmPassword.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Confirmação de senha é obrigatória.",
        variant: "destructive",
      });
      return false;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Senhas não coincidem",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return false;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswords()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      
      const { error } = await supabase
        .from('admin_settings')
        .upsert({
          username: 'admin',
          password_hash: hashedPassword,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving password:', error);
        toast({
          title: "Erro",
          description: "Erro ao salvar senha.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      toast({
        title: "Senha salva",
        description: "Senha cadastrada/atualizada com sucesso!",
        variant: "default",
      });

      setNewPassword("");
      setConfirmPassword("");
      
      if (isFirstAccess && onOpenLogin) {
        // First access - open login modal after success
        setTimeout(() => {
          onOpenLogin();
        }, 1000);
      } else {
        onSuccess();
      }
    } catch (error) {
      console.error('Error hashing password:', error);
      toast({
        title: "Erro",
        description: "Erro ao processar senha.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const handleCancel = () => {
    if (isFirstAccess) {
      // First access - can't cancel, must set password
      return;
    }
    setNewPassword("");
    setConfirmPassword("");
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e as any);
    } else if (e.key === 'Escape' && !isFirstAccess) {
      handleCancel();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="w-full max-w-md mx-auto p-6" onKeyDown={handleKeyDown}>
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Cadastrar/Alterar Senha do Administrador
          </DialogTitle>
        </DialogHeader>
        
        {isFirstAccess && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
            Primeiro acesso: cadastre a senha. O login será 'admin'.
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">Nova Senha</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite a nova senha"
                className="pr-10"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowNewPassword(!showNewPassword)}
                disabled={isLoading}
                aria-label={showNewPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme a nova senha"
                className="pr-10"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
                aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showConfirmPassword ? (
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
              disabled={isLoading}
            >
              {isLoading ? "Salvando..." : "Salvar Senha"}
            </Button>
            
            {!isFirstAccess && (
              <Button 
                type="button" 
                variant="outline" 
                className="w-full min-h-[44px]"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}