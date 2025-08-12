"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { addWorkOrder } from "@/server/work-orders"
import { toast } from "sonner"
import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Form, FormItem, FormControl, FormLabel, FormMessage, FormField } from "@/components/ui/form";
import InputField from "@/components/form/input/InputField";
import Textarea from "@/components/form/input/TextArea";
import ComponentCard from "../common/ComponentCard"
import { getCurrentUser } from "@/server/users"
import DynamicSelect from "@/components/form/DynamicSelect"
import Select from "@/components/form/Select"

const formSchema = z.object({
    workOrderNumber: z.string().min(1, "Le numéro d'ordre de travail est requis"),
    workRequestNumber: z.string().min(1, "Le numéro de demande de travail est requis"),
    interventionType: z.enum(["préventive", "curative"]),
    numberOfIntervenants: z.coerce.number().min(1, "Le nombre d'intervenants est requis") as z.ZodNumber,
    interventionDateTime: z.string().min(1, "La date et heure d'intervention est requise"),
    approximateDuration: z.coerce.number().min(0, "La durée approximative doit être supérieure à 0") as z.ZodNumber,
    stepsToFollow: z.string().min(1, "Les étapes à suivre sont requises"),
})

type FormValues = z.infer<typeof formSchema>

export default function WorkOrderForm() {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            workOrderNumber: "",
            workRequestNumber: "",
            interventionType: "préventive",
            numberOfIntervenants: 1,
            interventionDateTime: new Date().toISOString(),
            approximateDuration: 0,
            stepsToFollow: "",
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const user = await getCurrentUser()
            const result = await addWorkOrder({
                ...values,
                interventionDateTime: values.interventionDateTime ? new Date(values.interventionDateTime) : new Date("00/00/2000 00:00"),
                createdById: user?.session?.user?.id,
            })

            if (result.success) {
                toast.success("Ordre de travail créé avec succès")
                router.push("/interventions/work-orders")
            } else {
                toast.error("Erreur lors de la création")
            }
        } catch (error) {
            console.error("Erreur lors de la création:", error)
            toast.error("Erreur lors de la création de l'ordre de travail")
        }
    }

    return (
        <ComponentCard title="Ajouter un ordre de travail">
            <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div className="sm:col-span-1">
                                <FormField
                                    control={form.control}
                                    name="workOrderNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Numéro d'ordre de travail</FormLabel>
                                            <FormControl>
                                                <InputField placeholder="Entrez le numéro d'ordre de travail" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="sm:col-span-1">
                                <FormField
                                    control={form.control}
                                    name="workRequestNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Demande de travail</FormLabel>
                                            <FormControl>
                                                <DynamicSelect 
                                                    dataSource="workRequests"
                                                    placeholder="Sélectionnez une demande de travail"
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
                                                <InputField placeholder="Entrez le nombre d'intervenants" {...field} />
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
                                    name="interventionDateTime"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Date et heure d'intervention</FormLabel>
                                            <FormControl>
                                                <InputField type="datetime-local" placeholder="Sélectionnez la date et l'heure d'intervention" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="sm:col-span-1">
                                <FormField
                                    control={form.control}
                                    name="approximateDuration"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Durée approximative</FormLabel>
                                            <FormControl>
                                                <InputField placeholder="Entrez la durée approximative" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                                <FormField
                                    control={form.control}
                                    name="stepsToFollow"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Étapes à suivre</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Décrivez les étapes à suivre" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        <div className="flex gap-4">
                            <button 
                                type="button"
                                onClick={() => router.push("/interventions/work-orders")}
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
        </ComponentCard>
    )
}