"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { updateWorkRequest, getWorkRequestById } from "@/server/work-requests"
import { toast } from "sonner"
import { useTransition, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Form, FormItem, FormControl, FormLabel, FormMessage, FormField } from "@/components/ui/form";
import InputField from "@/components/form/input/InputField";
import Textarea from "@/components/form/input/TextArea";
import ComponentCard from "../common/ComponentCard"
import { Loader2 } from "lucide-react"
import DynamicSelect from "@/components/form/DynamicSelect"
import Select from "@/components/form/Select"

const formSchema = z.object({
    requestNumber: z.string().min(1, "Le numéro de demande est requis"),
    requesterLastName: z.string().min(1, "Le nom du demandeur est requis"),
    requesterFirstName: z.string().min(1, "Le prénom du demandeur est requis"),
    equipmentName: z.string().min(1, "Le nom de l'équipement est requis"),
    failureType: z.enum(["mécanique", "électrique"]),
    failureDescription: z.string().min(1, "La description de la panne est requise"),
})

type FormValues = z.infer<typeof formSchema>

interface WorkRequestEditFormProps {
    workRequestId: string;
}

export default function WorkRequestEditForm({ workRequestId }: WorkRequestEditFormProps) {
    const [isPending, startTransition] = useTransition()
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            requestNumber: "",
            requesterLastName: "",
            requesterFirstName: "",
            equipmentName: "",
            failureType: "mécanique",
            failureDescription: "",
        }
    })

    useEffect(() => {
        const loadWorkRequest = async () => {
            const { success, data } = await getWorkRequestById(workRequestId)
            if (success && data) {
                form.reset({
                    requestNumber: data.requestNumber ?? "",
                    requesterLastName: data.requesterLastName ?? "",
                    requesterFirstName: data.requesterFirstName ?? "",
                    equipmentName: data.equipmentName ?? "",
                    failureType: (data.failureType as "mécanique" | "électrique") ?? "mécanique",
                    failureDescription: data.failureDescription ?? "",
                })
            } else {
                toast.error("Demande d'intervention non trouvée")
                router.push("/interventions/requests")
            }
            setIsLoading(false)
        }
        loadWorkRequest()
    }, [workRequestId, form, router])

    const onSubmit = (data: FormValues) => {
        startTransition(async () => {
            const { success, message } = await updateWorkRequest(workRequestId, data)
            if (success) {
                toast.success(message)
                router.push("/interventions/requests")
            } else {
                toast.error(message)
            }
        })
    }

    if (isLoading) {
        return (
            <ComponentCard title="Modifier la demande d'intervention">
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </div>
            </ComponentCard>
        )
    }

    return (
        <ComponentCard title="Modifier la demande d'intervention">
            <div className="flex flex-col flex-1 items-center justify-center w-full overflow-y-auto no-scrollbar">
                <div className="w-full max-w-4xl mx-auto px-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div className="sm:col-span-1">
                                <FormField
                                    control={form.control}
                                    name="requestNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Numéro de demande</FormLabel>
                                            <FormControl>
                                                <InputField placeholder="Entrez le numéro de demande" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="sm:col-span-1">
                                <FormField
                                    control={form.control}
                                    name="equipmentName"
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
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div className="sm:col-span-1">
                                <FormField
                                    control={form.control}
                                    name="requesterLastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <InputField placeholder="Nom du demandeur" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="sm:col-span-1">
                                <FormField
                                    control={form.control}
                                    name="requesterFirstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <InputField placeholder="Prénom du demandeur" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
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
                        <div className="flex gap-4">
                            <button 
                                type="button"
                                onClick={() => router.push("/interventions/work-requests")}
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