"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { addEquipement } from "@/server/equipement"
import { toast } from "sonner"
import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Form, FormItem, FormControl, FormLabel, FormMessage, FormField } from "@/components/ui/form";
import InputField from "@/components/form/input/InputField";
import Textarea from "@/components/form/input/TextArea";
import ComponentCard from "../../common/ComponentCard"

const formSchema = z.object({
    name: z.string().min(1, "Le nom est requis"),
    machineName: z.string().optional(),
    subAssemblies: z.string().optional(),
    criticalityIndex: z.coerce.number().optional() as z.ZodOptional<z.ZodNumber>,
    plan: z.string().optional(),
    characteristics: z.string().optional(),
    technicalFolder: z.string().optional(),
    failureOccurrence: z.coerce.number().optional() as z.ZodOptional<z.ZodNumber>,
    mtbf: z.coerce.number().optional() as z.ZodOptional<z.ZodNumber>,
    mttr: z.coerce.number().optional() as z.ZodOptional<z.ZodNumber>,

})

type FormValues = z.infer<typeof formSchema>;

export default function EquipementForm() {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const form = useForm<FormValues>({
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
        }
    })

    const onSubmit = (data: FormValues) => {
        startTransition(async () => {
            const { success, message } = await addEquipement(data)
            if (success) {
                toast.success(message)
                router.push("/equipements")
            } else {
                toast.error(message)
            }
        })
    }

    return (
        <ComponentCard title="Ajouter un équipement">
            <div className="flex flex-col flex-1 items-center justify-center w-full overflow-y-auto no-scrollbar">
                <div className="w-full max-w-4xl mx-auto px-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            {/* <!-- First Name --> */}
                            <div className="sm:col-span-1">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <InputField placeholder="Entrez le nom de l'équipement" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            {/* <!-- Last Name --> */}
                            <div className="sm:col-span-1">
                                <FormField
                                    control={form.control}
                                    name="machineName"
                                    render={({ field }) => (
                                        <FormItem>
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
                                        <FormControl>
                                            <InputField placeholder="Entrez les sous-assemblées" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        {/* <!-- Password --> */}
                        <div>
                            <FormField
                                control={form.control}
                                name="criticalityIndex"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <InputField placeholder="Entrez la criticité" {...field} />
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
                                        <FormControl>
                                            <Textarea placeholder="Entrez le dossier technique" {...field} />
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
                                        <FormControl>
                                            <InputField type="number" step="any" placeholder="Entrez le MTBF" {...field} />
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
                                        <FormControl>
                                            <InputField type="number" step="any" placeholder="Entrez le MTTR" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        {/* <!-- Button --> */}
                        <div>
                            <button className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600" type="submit" disabled={isPending}>
                                Ajouter
                            </button>
                        </div>
                    </form>
                </Form>
                </div>
            </div>
        </ComponentCard>
    )
}