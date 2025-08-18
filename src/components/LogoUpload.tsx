import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LogoUploadProps {
  currentLogo?: string;
  onLogoChange: (logoUrl: string) => void;
}

export function LogoUpload({ currentLogo, onLogoChange }: LogoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erro no upload",
        description: "Por favor, selecione apenas arquivos de imagem.",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "Arquivo muito grande",
        description: "O arquivo deve ter no máximo 5MB.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    // Convert to base64 for localStorage
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target?.result as string;
      onLogoChange(base64String);
      localStorage.setItem('aprovaclt_logo', base64String);
      setIsUploading(false);
      
      toast({
        title: "Logo atualizado!",
        description: "Sua logo foi carregada com sucesso.",
      });
    };
    
    reader.onerror = () => {
      setIsUploading(false);
      toast({
        title: "Erro no upload",
        description: "Ocorreu um erro ao carregar a imagem.",
        variant: "destructive"
      });
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="flex items-center gap-4">
      {currentLogo ? (
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-card border-2 border-gold/20 shadow-sm">
          <img
            src={currentLogo}
            alt="Logo AprovaCLT"
            className="w-full h-full object-contain"
          />
        </div>
      ) : (
        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center border-2 border-dashed border-muted-foreground/30">
          <ImageIcon className="w-6 h-6 text-muted-foreground" />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          variant="outline"
          size="sm"
          className="h-8 px-3 text-xs hover:border-gold hover:text-gold"
        >
          <Upload className="w-3 h-3 mr-1" />
          {isUploading ? "Carregando..." : currentLogo ? "Alterar Logo" : "Adicionar Logo"}
        </Button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
}