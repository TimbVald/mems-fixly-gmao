"use client"

import { useState, useEffect, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Loader2, EyeIcon, EyeClosedIcon } from "lucide-react"

import { Modal } from "@/components/ui/modal"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import InputField from "@/components/form/input/InputField"
import Select from "@/components/form/Select"
import Button from "@/components/ui/button/Button"
import { updateUser, getUserById } from "@/server/users"

const formSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom de famille doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  matricule: z.string().optional(),
  role: z.string().min(1, "Le rôle est requis"),
  password: z.string().optional(),
})

const roleOptions = [
  { value: "admin", label: "Administrateur" },
  { value: "manager", label: "Manager" },
  { value: "technician", label: "Technicien" },
  { value: "user", label: "Utilisateur" },
]

interface UserEditModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  userId: string
}

export default function UserEditModal({
  isOpen,
  onClose,
  onSuccess,
  userId,
}: UserEditModalProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      matricule: "",
      role: "",
      password: "",
    },
  })

  useEffect(() => {
    if (isOpen && userId) {
      loadUser()
    }
  }, [isOpen, userId])

  const loadUser = async () => {
    try {
      setIsLoading(true)
      const user = await getUserById(userId)
      if (user) {
        const [firstName, ...lastNameParts] = user.name.split(' ')
        const lastName = lastNameParts.join(' ')
        
        form.reset({
          firstName: firstName || "",
          lastName: lastName || "",
          email: user.email || "",
          matricule: user.matricule || "",
          role: user.role || "",
          password: "",
        })
      }
    } catch (error) {
      console.error("Erreur lors du chargement de l'utilisateur:", error)
      toast.error("Erreur lors du chargement des données")
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      try {
        const fullName = `${values.firstName} ${values.lastName}`
        const updateData: any = {
          name: fullName,
          email: values.email,
          role: values.role,
          matricule: values.matricule || null,
        }

        // Only include password if it's provided
        if (values.password && values.password.trim() !== "") {
          updateData.password = values.password
        }

        const result = await updateUser(userId, updateData)
        
        if (result.success) {
          toast.success("Utilisateur modifié avec succès")
          onSuccess()
        } else {
          toast.error(result.message || "Erreur lors de la modification")
        }
      } catch (error) {
        console.error("Erreur lors de la modification:", error)
        toast.error("Erreur lors de la modification")
      }
    })
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      className="max-w-4xl p-5 lg:p-10"
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
              Modifier l'utilisateur
            </h4>

            {/* Informations personnelles */}
            <div className="mb-6">
              <h5 className="text-md font-medium text-gray-700 dark:text-white/80 mb-4">
                Informations personnelles
              </h5>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom *</FormLabel>
                      <FormControl>
                        <InputField placeholder="Entrez le prénom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de famille *</FormLabel>
                      <FormControl>
                        <InputField placeholder="Entrez le nom de famille" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Informations de contact */}
            <div className="mb-6">
              <h5 className="text-md font-medium text-gray-700 dark:text-white/80 mb-4">
                Informations de contact
              </h5>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <InputField placeholder="Entrez l'adresse email" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="matricule"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Matricule</FormLabel>
                      <FormControl>
                        <InputField placeholder="MAT001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Informations professionnelles */}
            <div className="mb-6">
              <h5 className="text-md font-medium text-gray-700 dark:text-white/80 mb-4">
                Informations professionnelles
              </h5>
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rôle *</FormLabel>
                    <FormControl>
                      <Select
                        options={roleOptions}
                        placeholder="Sélectionnez un rôle"
                        defaultValue={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Sécurité */}
            <div className="mb-6">
              <h5 className="text-md font-medium text-gray-700 dark:text-white/80 mb-4">
                Sécurité
              </h5>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nouveau mot de passe (optionnel)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <InputField
                          placeholder="Laissez vide pour conserver le mot de passe actuel"
                          type={showPassword ? "text" : "password"}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeClosedIcon className="w-4 h-4" />
                          ) : (
                            <EyeIcon className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center justify-end w-full gap-3 mt-6">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleClose}
                disabled={isPending}
              >
                Annuler
              </Button>
              <Button 
                size="sm" 
                type="submit"
                disabled={isPending}
              >
                {isPending ? "Modification..." : "Modifier"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </Modal>
  )
}