"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { addInterventionReport } from "@/server/intervention-reports"
import { toast } from "sonner"
import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Form, FormItem, FormControl, FormLabel, FormMessage, FormField } from "@/components/ui/form";
import InputField from "@/components/form/input/InputField";
import Textarea from "@/components/form/input/TextArea";
import ComponentCard from "../common/ComponentCard"
import DynamicSelect from "@/components/form/DynamicSelect"
import Select from "@/components/form/Select"

const formSchema = z.object({
    reportNumber: z.string().min(1, "Le numéro de rapport est requis"),
    workOrderNumber: z.string().optional(),
    failureType: z.enum(["mécanique", "électrique"]),
    failureDescription: z.string().min(1, "La description de la panne est requise"),
    interventionType: z.enum(["préventive", "curative"]),
    materialUsed: z.string().optional(),
    numberOfIntervenants: z.coerce.number().min(1, "Le nombre d'intervenants est requis") as z.ZodNumber,
    causes: z.string().min(1, "Les causes sont requises"),
    symptoms: z.string().min(1, "Les symptômes sont requis"),
    effectsOnEquipment: z.string().min(1, "Les effets sur l'équipement sont requis"),
    repairTime: z.coerce.number().min(0, "Le temps de réparation est requis") as z.ZodNumber,
    stepsFollowed: z.string().min(1, "Les étapes suivies sont requises"),
    equipmentId: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function InterventionReportForm() {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            reportNumber: "",
            workOrderNumber: "",
            failureType: "mécanique",
            failureDescription: "",
            interventionType: "préventive",
            materialUsed: "",
            numberOfIntervenants: 1,
            causes: "",
            symptoms: "",
            effectsOnEquipment: "",
            repairTime: 0,
            stepsFollowed: "",
            equipmentId: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        startTransition(async () => {
            try {
                // Le createdById sera automatiquement géré côté serveur
                const result = await addInterventionReport(values)
                if (result.success) {
                    toast.success(result.message)
                    router.push("/interventions/reports")
                } else {
                    toast.error(result.message)
                }
            } catch (error) {
                toast.error("Erreur lors de la création du rapport")
            }
        })
    }

    return (
        <ComponentCard title="Ajouter un compte rendu d'intervention">
            <div className="flex flex-col flex-1 items-center justify-center w-full overflow-y-auto no-scrollbar">
                <div className="w-full max-w-4xl mx-auto px-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div className="sm:col-span-1">
                                <FormField
                                    control={form.control}
                                    name="reportNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Numéro de rapport</FormLabel>
                                            <FormControl>
                                                <InputField placeholder="Entrez le numéro de rapport" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="sm:col-span-1">
                                <FormField
                                    control={form.control}
                                    name="workOrderNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Ordre de travail</FormLabel>
                                            <FormControl>
                                                <DynamicSelect 
                                                    dataSource="workOrders"
                                                    placeholder="Sélectionnez un ordre de travail"
                                                    onChange={field.onChange}
                                                    value={field.value}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div className="sm:col-span-1">
                                <FormField
                                    control={form.control}
                                    name="failureType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Type de panne</FormLabel>
                                            <FormControl>
                                                <Select
                                                    options={[
                                                        { value: "mécanique", label: "Mécanique" },
                                                        { value: "électrique", label: "Électrique" }
                                                    ]}
                                                    placeholder="Sélectionnez le type de panne"
                                                    onChange={field.onChange}
                                                    defaultValue={field.value}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="sm:col-span-1">
                                <FormField
                                    control={form.control}
                                    name="equipmentId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Équipement</FormLabel>
                                            <FormControl>
                                                <DynamicSelect 
                                                    dataSource="equipments"
                                                    placeholder="Sélectionnez un équipement"
                                                    onChange={field.onChange}
                                                    value={field.value}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                            <div className="sm:col-span-1">
                                <FormField
                                    control={form.control}
                                    name="interventionType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Type d'intervention</FormLabel>
                                            <FormControl>
                                                <Select
                                                    options={[
                                                        { value: "préventive", label: "Préventive" },
                                                        { value: "curative", label: "Curative" }
                                                    ]}
                                                    placeholder="Sélectionnez le type d'intervention"
                                                    onChange={field.onChange}
                                                    defaultValue={field.value}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="sm:col-span-1">
                                <FormField
                                    control={form.control}
                                    name="numberOfIntervenants"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombre d'intervenants</FormLabel>
                                            <FormControl>
                                                <InputField type="number" min="1" placeholder="Nombre d'intervenants" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="sm:col-span-1">
                                <FormField
                                    control={form.control}
                                    name="repairTime"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Temps de réparation (heures)</FormLabel>
                                            <FormControl>
                                                <InputField type="number" min="0" step="any" placeholder="Temps de réparation (heures)" {...field} />
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
                                name="materialUsed"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Matériel utilisé</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Matériel utilisé (optionnel)" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div>
                            <FormField
                                control={form.control}
                                name="failureDescription"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description de la panne</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Description de la panne" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div>
                            <FormField
                                control={form.control}
                                name="causes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Causes</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Causes" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div>
                            <FormField
                                control={form.control}
                                name="symptoms"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Symptômes</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Symptômes" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div>
                            <FormField
                                control={form.control}
                                name="effectsOnEquipment"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Effets sur l'équipement</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Effets sur l'équipement" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div>
                            <FormField
                                control={form.control}
                                name="stepsFollowed"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Étapes suivies</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Étapes suivies" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex gap-4">
                            <button 
                                type="button"
                                onClick={() => router.push("/interventions/reports")}
                                className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-gray-700 transition rounded-lg bg-gray-200 shadow-theme-xs hover:bg-gray-300"
                            >
                                Annuler
                            </button>
                            <button 
                                className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600" 
                                type="submit" 
                                disabled={isPending}
                            >
                                {isPending ? "Ajout..." : "Ajouter"}
                            </button>
                        </div>
                    </form>
                </Form>
                </div>
            </div>
        </ComponentCard>
    )
}