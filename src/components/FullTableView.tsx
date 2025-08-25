import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Download, X, FileSpreadsheet, FileJson } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ResponseFilters } from "./ResponseFilters";
import { supabase } from "@/integrations/supabase/client";

interface FullTableViewProps {
  isOpen: boolean;
  onClose: () => void;
  questions: any[];
}

export function FullTableView({ isOpen, onClose, questions }: FullTableViewProps) {
  const [responses, setResponses] = useState<any[]>([]);
  const [filteredResponses, setFilteredResponses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadResponses();
    }
  }, [isOpen]);

  const loadResponses = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('lovable_respostas')
        .select('*')
        .order('criado_em', { ascending: false });

      if (error) throw error;
      
      setResponses(data || []);
      setFilteredResponses(data || []);
    } catch (error) {
      console.error('Error loading responses:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar respostas.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilter = (filters: any) => {
    let filtered = [...responses];

    if (filters.nome) {
      filtered = filtered.filter(r => 
        r.respostas?.nome?.toLowerCase().includes(filters.nome.toLowerCase())
      );
    }

    if (filters.cpf) {
      filtered = filtered.filter(r => 
        r.respostas?.cpf?.includes(filters.cpf)
      );
    }

    if (filters.dataInicial) {
      filtered = filtered.filter(r => 
        new Date(r.criado_em) >= filters.dataInicial
      );
    }

    if (filters.dataFinal) {
      const endOfDay = new Date(filters.dataFinal);
      endOfDay.setHours(23, 59, 59, 999);
      filtered = filtered.filter(r => 
        new Date(r.criado_em) <= endOfDay
      );
    }

    setFilteredResponses(filtered);
  };

  const handleClearFilters = () => {
    setFilteredResponses(responses);
  };

  const downloadCSV = () => {
    const headers = ["Nome", "Telefone", "Email", "Data", ...questions.map(q => q.texto), "Respostas Sim", "Respostas Não", "Taxa de Aprovação"];
    const csvContent = [
      headers.join(","),
      ...filteredResponses.map(r => {
        const row = [
          r.respostas?.nome || "",
          r.respostas?.telefone || "",
          r.respostas?.email || "",
          new Date(r.criado_em).toLocaleDateString('pt-BR'),
          ...questions.map(q => r.respostas?.respostas?.[q.id] || ""),
          r.respostas?.sim || 0,
          r.respostas?.nao || 0,
          r.respostas?.percentual_aprovacao || Math.round((r.respostas?.sim / (r.respostas?.sim + r.respostas?.nao)) * 100) + "%"
        ];
        return row.map(cell => `"${cell}"`).join(",");
      })
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `respostas_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download realizado",
      description: "Arquivo CSV gerado com sucesso e salvo no seu computador.",
    });
  };

  const downloadJSON = () => {
    const jsonContent = JSON.stringify(filteredResponses, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `respostas_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download realizado",
      description: "Arquivo JSON gerado com sucesso e salvo no seu computador.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">Tabela Completa de Respostas</DialogTitle>
            <div className="flex gap-2">
              <Button onClick={downloadCSV} size="sm" variant="outline">
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                CSV
              </Button>
              <Button onClick={downloadJSON} size="sm" variant="outline">
                <FileJson className="w-4 h-4 mr-2" />
                JSON
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <ResponseFilters onFilter={handleFilter} onClear={handleClearFilters} />
        
        <ScrollArea className="flex-1 w-full">
          <div className="min-w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky left-0 bg-background">Nome</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Data</TableHead>
                  {questions.map(q => (
                    <TableHead key={q.id} className="min-w-[150px]">
                      {q.texto}
                    </TableHead>
                  ))}
                  <TableHead>Sim</TableHead>
                  <TableHead>Não</TableHead>
                  <TableHead>Aprovação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={questions.length + 7} className="text-center">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : filteredResponses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={questions.length + 7} className="text-center">
                      Nenhuma resposta encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredResponses.map((response) => (
                    <TableRow key={response.id}>
                      <TableCell className="sticky left-0 bg-background font-medium">
                        {response.respostas?.nome}
                      </TableCell>
                      <TableCell>{response.respostas?.telefone}</TableCell>
                      <TableCell>{response.respostas?.email || "-"}</TableCell>
                      <TableCell>{new Date(response.criado_em).toLocaleDateString('pt-BR')}</TableCell>
                      {questions.map(q => (
                        <TableCell key={q.id}>
                          {q.tipo === "simnao" ? (
                            <Badge 
                              variant={response.respostas?.respostas?.[q.id] === "sim" ? "default" : "destructive"}
                              className={response.respostas?.respostas?.[q.id] === "sim" ? "bg-success text-white" : ""}
                            >
                              {response.respostas?.respostas?.[q.id] === "sim" ? "Sim" : response.respostas?.respostas?.[q.id] === "nao" ? "Não" : "-"}
                            </Badge>
                          ) : (
                            response.respostas?.respostas?.[q.id] || "-"
                          )}
                        </TableCell>
                      ))}
                      <TableCell>
                        <Badge variant="outline" className="text-success border-success">
                          {response.respostas?.sim || 0}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-destructive border-destructive">
                          {response.respostas?.nao || 0}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {response.respostas?.percentual_aprovacao || Math.round((response.respostas?.sim / (response.respostas?.sim + response.respostas?.nao)) * 100)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}