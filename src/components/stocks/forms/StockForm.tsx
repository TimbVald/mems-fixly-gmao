"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { addStock } from "@/server/stocks";

interface Stock {
  id: string;
  name: string;
  quantity: number;
  supplier: string | null;
  price: number | null;
  createdAt: Date;
  updatedAt: Date;
}

const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  quantity: z.union([
    z.number().min(0, "La quantité doit être positive"),
    z.string().transform((val) => {
      if (val === "" || val === undefined) return 0;
      const num = Number(val);
      return isNaN(num) ? 0 : num;
    })
  ]),
  supplier: z.string().optional(),
  price: z.union([
    z.number().min(0, "Le prix doit être positif"),
    z.string().transform((val) => {
      if (val === "" || val === undefined) return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    })
  ]).optional(),
});

interface FormData {
  name: string;
  quantity: string | number;
  supplier?: string;
  price?: string | number;
}

interface StockFormProps {
  onStockCreated: (stock: Stock) => void;
}

export default function StockForm({ onStockCreated }: StockFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      quantity: "",
      supplier: "",
      price: "",
    },
  });

  const onSubmit = async (values: FormData) => {
    setIsSubmitting(true);
    const { success, message, data } = await addStock({
      name: values.name,
      quantity: Number(values.quantity) || 0,
      supplier: values.supplier || undefined,
      price: values.price ? Number(values.price) : undefined,
    });

    if (success && data) {
      onStockCreated(data);
      form.reset();
      toast.success(message);
    } else {
      toast.error(message);
    }
    setIsSubmitting(false);
  };

  return (
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
            onClick={() => form.reset()}
            disabled={isSubmitting}
          >
            Réinitialiser
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Création..." : "Créer l'article"}
          </Button>
        </div>
      </form>
    </Form>
  );
}