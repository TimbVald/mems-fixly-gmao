"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { updateEquipement, getEquipementById } from "@/server/equipement"
import { toast } from "sonner"
import { useTransition, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Form, FormItem, FormControl, FormLabel, FormMessage, FormField } from "@/components/ui/form";
import InputField from "@/components/form/input/InputField";
import ImageUpload from "@/components/form/input/ImageUpload";
import DocumentUpload from "@/components/form/input/DocumentUpload";
import Textarea from "@/components/form/input/TextArea";
import ComponentCard from "../../common/ComponentCard"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
    name: z.string().min(1, "Le nom est requis"),
    machineName: z.string().optional(),
    subAssemblies: z.string().optional(),
    criticalityIndex: z.number().optional(),
    plan: z.string().optional(),
    characteristics: z.string().optional(),
    technicalFolder: z.string().optional(),
    failureOccurrence: z.number().optional(),
    mtbf: z.number().optional(),
    mttr: z.number().optional(),
    image: z.string().optional(),
})

interface EquipementEditFormProps {
    equipementId: string;
}

export default function EquipementEditForm({ equipementId }: EquipementEditFormProps) {
    const [isPending, startTransition] = useTransition()
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            machineName: "",
            subAssemblies: "",
            criticalityIndex: undefined,
            plan: "",
            characteristics: "",
            technicalFolder: "",
            failureOccurrence: undefined,
            mtbf: undefined,
            mttr: undefined,
            image: "",
        }
    })

    // useEffect(() => {
    //     const loadEquipement = async () => {
    //         const { success, data } = await getEquipementById(equipementId)
    //         if (success && data) {
    //             form.reset({
    //                 name: data.name || "",
    //                 machineName: data.machineName || "",
    //                 subAssemblies: data.subAssemblies || "",
    //                 criticalityIndex: data.criticalityIndex || undefined,
    //                 plan: data.plan || "",
    //                 characteristics: data.characteristics || "",
    //                 technicalFolder: data.technicalFolder || "",
    //                 failureOccurrence: data.failureOccurrence || undefined,
    //                 mtbf: data.mtbf || undefined,
    //                 mttr: data.mttr || undefined,
    //             })
    //         } else {
    //             toast.error("Équipement non trouvé")
    //             router.push("/equipements")
    //         }
    //         setIsLoading(false)
    //     }
    //     loadEquipement()
    // }, [equipementId, form, router])

    useEffect(() => {
    const loadEquipement = async () => {
        // ... votre code de fetch
        const { success, data } = await getEquipementById(equipementId);
        if (success && data) {
            // La méthode reset met à jour les valeurs du formulaire
            form.reset({
                name: data.name ?? "",
                machineName: data.machineName ?? "",
                subAssemblies: data.subAssemblies ?? "",
                criticalityIndex: data.criticalityIndex ?? undefined,
                plan: data.plan ?? "",
                characteristics: data.characteristics ?? "",
                technicalFolder: data.technicalFolder ?? "",
                failureOccurrence: data.failureOccurrence ?? undefined,
                mtbf: data.mtbf ?? undefined,
                mttr: data.mttr ?? undefined,
                image: data.image ?? "",
            });
        } else {
            toast.error("Équipement non trouvé");
            router.push("/equipements");
        }
        setIsLoading(false);
    };

    if (equipementId) {
        loadEquipement();
    }
}, [equipementId]); // Seule dépendance nécessaire

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        startTransition(async () => {
            const { success, message } = await updateEquipement(equipementId, data)
            if (success) {
                toast.success(message)
                router.push("/equipements")
            } else {
                toast.error(message)
            }
        })
    }

    if (isLoading) {
        return (
            <ComponentCard title="Modifier l'équipement">
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </div>
            </ComponentCard>
        )
    }

    return (
        <ComponentCard title="Modifier l'équipement">
            <div className="flex flex-col flex-1 items-center justify-center w-full overflow-y-auto no-scrollbar">
                <div className="w-full max-w-4xl mx-auto px-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div className="sm:col-span-1">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nom de l'équipement</FormLabel>
                                            <FormControl>
                                                <InputField placeholder="Entrez le nom de l'équipement" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="sm:col-span-1">
                                <FormField
                                    control={form.control}
                                    name="machineName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nom de la machine</FormLabel>
                                            <FormControl>
                                                <InputField placeholder="Entrez le nom de la machine" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <div>
                            <FormField
                                control={form.control}
                                name="subAssemblies"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sous-assemblées</FormLabel>
                                        <FormControl>
                                            <InputField placeholder="Entrez les sous-assemblées" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div>
                            <FormField
                                control={form.control}
                                name="criticalityIndex"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Indice de criticité</FormLabel>
                                        <FormControl>
                                            <InputField type="number" placeholder="Entrez la criticité" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div>
                            <FormField
                                control={form.control}
                                name="plan"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Plan</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Entrez le plan" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div>
                            <FormField
                                control={form.control}
                                name="characteristics"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Caractéristiques</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Entrez les caractéristiques" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div>
                            <FormField
                                control={form.control}
                                name="technicalFolder"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Dossier technique</FormLabel>
                                        <FormControl>
                                            <DocumentUpload
                                                value={field.value || ""}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div>
                            <FormField
                                control={form.control}
                                name="failureOccurrence"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Occurrence de panne</FormLabel>
                                        <FormControl>
                                            <InputField type="number" placeholder="Entrez la fréquence d'occurrence" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div>
                            <FormField
                                control={form.control}
                                name="mtbf"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>MTBF</FormLabel>
                                        <FormControl>
                                            <InputField type="number" placeholder="Entrez le MTBF" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div>
                            <FormField
                                control={form.control}
                                name="mttr"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>MTTR</FormLabel>
                                        <FormControl>
                                            <InputField type="number" placeholder="Entrez le MTTR" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div>
                             <FormField
                                 control={form.control}
                                 name="image"
                                 render={({ field }) => (
                                     <FormItem>
                                         <FormLabel>Image</FormLabel>
                                         <FormControl>
                                             <ImageUpload
                                                 value={field.value || ''}
                                                 onChange={field.onChange}
                                                 placeholder="Sélectionnez une image pour l'équipement"
                                             />
                                         </FormControl>
                                         <FormMessage />
                                     </FormItem>
                                 )}
                             />
                         </div>
                        <div className="flex gap-4">
                            <button 
                                type="button"
                                onClick={() => router.push("/equipements")}
                                className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-gray-700 transition rounded-lg bg-gray-200 shadow-theme-xs hover:bg-gray-300"
                            >
                                Annuler
                            </button>
                            <button 
                                className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600" 
                                type="submit" 
                                disabled={isPending}
                            >
                                {isPending ? "Modification..." : "Modifier"}
                            </button>
                        </div>
                    </form>
                </Form>
                </div>
            </div>
        </ComponentCard>
    )
}