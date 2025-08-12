"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { updateWorkOrder, getWorkOrderById } from "@/server/work-orders"
import { toast } from "sonner"
import { useTransition, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Form, FormItem, FormControl, FormLabel, FormMessage, FormField } from "@/components/ui/form";
import InputField from "@/components/form/input/InputField";
import Textarea from "@/components/form/input/TextArea";
import ComponentCard from "../common/ComponentCard"
import { Loader2 } from "lucide-react"
import Select from "../form/Select"
import DynamicSelect from "@/components/form/DynamicSelect"

const formSchema = z.object({
    workOrderNumber: z.string().min(1, "Le numéro d'ordre de travail est requis"),
    workRequestNumber: z.string().min(1, "Le numéro de demande de travail est requis"),
    interventionType: z.enum(["préventive", "curative"]),
    numberOfIntervenants: z.coerce.number().min(1, "Le nombre d'intervenants est requis") as z.ZodNumber,
    interventionDateTime: z.string().min(1, "La date et heure d'intervention est requise"),
    approximateDuration: z.coerce.number() as z.ZodNumber,
    stepsToFollow: z.string().min(1, "Les étapes à suivre sont requises"),
})

type FormValues = z.infer<typeof formSchema>

interface WorkOrderEditFormProps {
    workOrderId: string;
}

export default function WorkOrderEditForm({ workOrderId }: WorkOrderEditFormProps) {
    const [isPending, startTransition] = useTransition()
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            workOrderNumber: "",
            workRequestNumber: "",
            interventionType: "préventive",
            numberOfIntervenants: 1,
            interventionDateTime: "",
            approximateDuration: 0,
            stepsToFollow: "",
        },
    })

    useEffect(() => {
        const loadWorkOrder = async () => {
            const { success, data } = await getWorkOrderById(workOrderId)
            if (success && data) {
                form.reset({
                    workOrderNumber: data.workOrderNumber || "",
                    workRequestNumber: data.workRequestNumber || "",
                    interventionType: data.interventionType as "préventive" | "curative",
                    numberOfIntervenants: data.numberOfIntervenants || 1,
                    interventionDateTime: data.interventionDateTime ? new Date(data.interventionDateTime).toISOString().slice(0, 16) : "",
                    approximateDuration: data.approximateDuration || 0,
                    stepsToFollow: data.stepsToFollow || "",
                })
            } else {
                toast.error("Ordre de travail non trouvé")
                router.push("/interventions/work-orders")
            }
            setIsLoading(false)
        }
        loadWorkOrder()
    }, [workOrderId, form, router])

    const onSubmit = (data: FormValues) => {
        startTransition(async () => {
            const { success, message } = await updateWorkOrder(workOrderId, {
                ...data,
                interventionDateTime: data.interventionDateTime ? new Date(data.interventionDateTime) : undefined,
            })
            if (success) {
                toast.success(message)
                router.push("/interventions/work-orders")
            } else {
                toast.error(message)
            }
        })
    }

    if (isLoading) {
        return (
            <ComponentCard title="Modifier l'ordre de travail">
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </div>
            </ComponentCard>
        )
    }

    return (
        <ComponentCard title="Modifier l'ordre de travail">
            <div className="flex flex-col flex-1 items-center justify-center lg:w-1/2 w-full overflow-y-auto no-scrollbar">
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
                                            <FormLabel>Numéro de demande de travail</FormLabel>
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
                                                <Select placeholder="Sélectionnez" {...field} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" options={[
                                                    { value: "préventive", label: "Préventive" },
                                                    { value: "curative", label: "Curative" }
                                                ]} />
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
                                                <InputField type="number" min="1" placeholder="Entrez le nombre d'intervenants" {...field} />
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
                                name="interventionDateTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date et heure d'intervention</FormLabel>
                                        <FormControl>
                                            <InputField type="datetime-local" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                            <div className="sm:col-span-1">
                                <FormField
                                    control={form.control}
                                    name="approximateDuration"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Durée approximative (heures)</FormLabel>
                                            <FormControl>
                                                <InputField type="number" min="0" step="any" placeholder="Entrez la durée approximative" {...field} />
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
                                name="stepsToFollow"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Étapes à suivre</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Décrivez les étapes à suivre pour cette intervention" {...field} />
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
                                {isPending ? "Modification..." : "Modifier"}
                            </button>
                        </div>
                    </form>
                </Form>
            </div>
        </ComponentCard>
    )
}