"use client"

import { useState, useEffect, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Loader2, User, IdCard } from "lucide-react"

import { Modal } from "@/components/ui/modal"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import InputField from "@/components/form/input/InputField"
import Select from "@/components/form/Select"
import Button from "@/components/ui/button/Button"
import { updateUser, getUserById } from "@/server/users"

const formSchema = z.object({
  matricule: z.string().optional(),
  role: z.enum(["PERSONNEL", "TECHNICIEN", "ADMIN"]),
})

const roleOptions = [
  { value: "ADMIN", label: "Administrateur" },
  { value: "TECHNICIEN", label: "Technicien" },
  { value: "PERSONNEL", label: "Personnel" },
]

interface UserRoleMatriculeModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  userId: string
}

export default function UserRoleMatriculeModal({
  isOpen,
  onClose,
  onSuccess,
  userId,
}: UserRoleMatriculeModalProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      matricule: "",
      role: "PERSONNEL",
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
        form.reset({
          matricule: user.matricule ?? "",
          role: user.role ?? "PERSONNEL",
        })
        setUserName(user.name ?? "")
        setUserEmail(user.email ?? "")
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
        const updateData = {
          role: values.role,
          matricule: values.matricule ?? null,
        }

        const result = await updateUser(userId, updateData)
        
        if (result.success) {
          toast.success("Rôle et matricule modifiés avec succès")
          onSuccess()
        } else {
          toast.error(result.message ?? "Erreur lors de la modification")
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
      className="max-w-2xl p-5 lg:p-8"
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Modifier le rôle et matricule
            </h2>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p><strong>Utilisateur:</strong> {userName}</p>
              <p><strong>Email:</strong> {userEmail}</p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Matricule Field */}
              <FormField
                control={form.control}
                name="matricule"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <IdCard className="w-4 h-4" />
                      Matricule
                    </FormLabel>
                    <FormControl>
                      <InputField
                        {...field}
                        placeholder="Entrez le matricule"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Role Field */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Rôle
                    </FormLabel>
                    <FormControl>
                      <Select
                        defaultValue={field.value}
                        onChange={field.onChange}
                        options={roleOptions}
                        placeholder="Sélectionnez un rôle"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isPending}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="min-w-[120px]"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Modification...
                    </>
                  ) : (
                    "Modifier"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </>
      )}
    </Modal>
  )
}