import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoicesAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const invoiceSchema = z.object({
  clientName: z.string().min(1, "Le nom du client est requis"),
  clientEmail: z.string().email("Email invalide").optional().or(z.literal("")),
  clientPhone: z.string().optional(),
  amount: z.string().min(1, "Le montant est requis"),
  description: z.string().optional(),
  dueDate: z.string().optional(),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InvoiceModal({ isOpen, onClose }: InvoiceModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
  });

  const createInvoiceMutation = useMutation({
    mutationFn: invoicesAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/summary"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      
      toast({
        title: "Facture créée",
        description: "La facture a été créée avec succès.",
      });
      
      reset();
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer la facture.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InvoiceFormData) => {
    createInvoiceMutation.mutate({
      clientName: data.clientName,
      clientEmail: data.clientEmail || null,
      clientPhone: data.clientPhone || null,
      amount: data.amount,
      description: data.description || null,
      status: "pending",
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Nouvelle facture</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="clientName">Client *</Label>
            <Input
              id="clientName"
              {...register("clientName")}
              placeholder="Nom du client"
              className="mt-1"
            />
            {errors.clientName && (
              <p className="text-sm text-red-500 mt-1">{errors.clientName.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="clientEmail">Email</Label>
            <Input
              id="clientEmail"
              type="email"
              {...register("clientEmail")}
              placeholder="email@exemple.com"
              className="mt-1"
            />
            {errors.clientEmail && (
              <p className="text-sm text-red-500 mt-1">{errors.clientEmail.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="clientPhone">Téléphone</Label>
            <Input
              id="clientPhone"
              {...register("clientPhone")}
              placeholder="+243 xxx xxx xxx"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="amount">Montant (FC) *</Label>
            <Input
              id="amount"
              type="number"
              {...register("amount")}
              placeholder="0"
              className="mt-1"
            />
            {errors.amount && (
              <p className="text-sm text-red-500 mt-1">{errors.amount.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Description des services/produits"
              className="mt-1"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="dueDate">Date d'échéance</Label>
            <Input
              id="dueDate"
              type="date"
              {...register("dueDate")}
              className="mt-1"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={createInvoiceMutation.isPending}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="flex-1 gifa-btn-primary"
              disabled={createInvoiceMutation.isPending}
            >
              {createInvoiceMutation.isPending ? "Création..." : "Créer facture"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
