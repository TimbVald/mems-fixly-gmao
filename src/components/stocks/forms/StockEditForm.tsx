"use client";

import React, { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ComponentCard from "../../common/ComponentCard";
import { getStockById, updateStock } from "@/server/stocks";

const stockSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  quantity: z.number().min(0, "La quantité doit être positive"),
  supplier: z.string().optional(),
  price: z.number().min(0, "Le prix doit être positif").optional(),
});

type StockFormData = z.infer<typeof stockSchema>;

interface StockEditFormProps {
  stockId: string;
}

export default function StockEditForm({ stockId }: StockEditFormProps) {
  const [isPending, startTransition] = useTransition();
  const [stock, setStock] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const form = useForm<StockFormData>({
    resolver: zodResolver(stockSchema),
    defaultValues: {
      name: "",
      quantity: 0,
      supplier: "",
      price: undefined,
    },
  });

  useEffect(() => {
    const fetchStock = async () => {
      const { success, message, data } = await getStockById(stockId);
      if (success && data) {
        setStock(data);
        form.reset({
          name: data.name,
          quantity: data.quantity,
          supplier: data.supplier ?? "",
          price: data.price ?? undefined,
        });
      } else {
        toast.error(message);
      }
      setLoading(false);
    };

    fetchStock();
  }, [stockId, form]);

  const onSubmit = async (values: StockFormData) => {
     startTransition(async () => {
       const { success, message } = await updateStock(stockId, {
         name: values.name,
         quantity: values.quantity,
         supplier: values.supplier || undefined,
         price: values.price || undefined,
       });

       if (success) {
         toast.success(message);
         router.push("/stocks");
       } else {
         toast.error(message);
       }
     });
   };

  if (loading) {
    return (
      <ComponentCard title="Modification de l'article">
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </ComponentCard>
    );
  }

  if (!stock) {
    return (
      <ComponentCard title="Article non trouvé">
        <div className="text-center p-8">
          <p className="text-muted-foreground">L'article demandé n'a pas été trouvé.</p>
          <Button 
             onClick={() => router.push("/stocks")} 
             className="mt-4"
           >
             Retour à la liste
           </Button>
        </div>
      </ComponentCard>
    );
  }

  return (
    <ComponentCard title="Modification de l'article">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom de l'article *</FormLabel>
                <FormControl>
                  <Input placeholder="Nom de l'article" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantité *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prix unitaire (€)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === "" ? undefined : Number(value));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="supplier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fournisseur</FormLabel>
                <FormControl>
                  <Input placeholder="Nom du fournisseur" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/stocks")}
               disabled={isPending}
            >
              Annuler
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset({
                  name: stock.name,
                  quantity: stock.quantity,
                  supplier: stock.supplier || "",
                  price: stock.price || undefined,
                });
              }}
              disabled={isPending}
            >
              Réinitialiser
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? "Modification..." : "Modifier l'article"}
            </Button>
          </div>
        </form>
      </Form>
    </ComponentCard>
  );
}