"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { addWorkRequest } from "@/server/work-requests"
import { toast } from "sonner"
import { useTransition, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Form, FormItem, FormControl, FormLabel, FormMessage, FormField } from "@/components/ui/form";
import InputField from "@/components/form/input/InputField";
import Textarea from "@/components/form/input/TextArea";
import ComponentCard from "../common/ComponentCard"
import DynamicSelect from "@/components/form/DynamicSelect"
import Select from "@/components/form/Select"

const formSchema = z.object({
    requestNumber: z.string().min(1, "Le numéro de demande est requis"),
    requesterLastName: z.string().min(1, "Le nom du demandeur est requis"),
    requesterFirstName: z.string().min(1, "Le prénom du demandeur est requis"),
    equipmentName: z.string().min(1, "Le nom de l'équipement est requis"),
    equipmentId: z.string().optional(),
    failureType: z.enum(["mécanique", "électrique"]),
    failureDescription: z.string().min(1, "La description de la panne est requise"),
})

type FormValues = z.infer<typeof formSchema>;

export default function WorkRequestForm() {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const [equipments, setEquipments] = useState<Array<{id: string, name: string}>>([])
    
    // Charger les équipements au montage du composant
    useEffect(() => {
        const loadEquipments = async () => {
            try {
                const { getEquipements } = await import("@/server/equipement")
                const result = await getEquipements()
                if (result.success && result.data) {
                    setEquipments(result.data)
                }
            } catch (error) {
                console.error("Erreur lors du chargement des équipements:", error)
            }
        }
        loadEquipments()
     }, [])
     
     // Fonction pour gérer la sélection d'équipement
     const handleEquipmentChange = (equipmentId: string) => {
         const selectedEquipment = equipments.find(eq => eq.id === equipmentId)
         if (selectedEquipment) {
             form.setValue('equipmentId', equipmentId)
             form.setValue('equipmentName', selectedEquipment.name)
         }
     }
     
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            requestNumber: "",
            requesterLastName: "",
            requesterFirstName: "",
            equipmentName: "",
            equipmentId: "",
            failureType: "mécanique",
            failureDescription: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        startTransition(async () => {
            try {
                await addWorkRequest(values)
                toast.success("Demande d'intervention créée avec succès")
                router.push("/interventions/requests")
            } catch (error) {
                toast.error("Erreur lors de la création de la demande")
            }
        })
    }

    return (
        <ComponentCard title="Ajouter une demande d'intervention">
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
                                                    onChange={handleEquipmentChange}
                                                    value={form.watch('equipmentId')}
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
                                            <FormLabel>Nom du demandeur</FormLabel>
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
                                            <FormLabel>Prénom du demandeur</FormLabel>
                                            <FormControl>
                                                <InputField placeholder="Prénom du demandeur" {...field} />
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
                                name="failureType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type de panne</FormLabel>
                                        <FormControl>
                                            <Select
                                                options={[
                                                    { value: "mécanique", label: "Panne mécanique" },
                                                    { value: "électrique", label: "Panne électrique" }
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
                                            <Textarea placeholder="Description détaillée de la panne" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        
                        <div>
                            <button 
                                className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600" 
                                type="submit" 
                                disabled={isPending}
                            >
                                {isPending ? "Ajout en cours..." : "Ajouter la demande"}
                            </button>
                        </div>
                    </form>
                </Form>
                </div>
            </div>
        </ComponentCard>
    )
}