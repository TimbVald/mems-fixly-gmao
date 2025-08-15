"use client"

import { useState, useEffect, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Loader2, User, Upload, Camera } from "lucide-react"

import { Modal } from "@/components/ui/modal"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import InputField from "@/components/form/input/InputField"
import Button from "@/components/ui/button/Button"
import { updateUser, getUserById } from "@/server/users"

const formSchema = z.object({
  name: z.string().min(2, "Le nom complet doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  image: z.string().optional(),
})



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

  const [isPending, startTransition] = useTransition()
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      image: "",
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
          name: user.name ?? "",
          email: user.email ?? "",
          image: user.image ?? "",
        })
        setImagePreview(user.image ?? null)
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
        const updateData: any = {
          name: values.name,
          email: values.email,
          image: values.image ?? null,
        }

        const result = await updateUser(userId, updateData)
        
        if (result.success) {
          toast.success("Utilisateur modifié avec succès")
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

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setImagePreview(result)
        form.setValue("image", result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleClose = () => {
    form.reset()
    setImagePreview(null)
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-4xl mx-auto">
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
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom complet *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <InputField 
                            placeholder="Entrez le nom complet" 
                            className="pl-10"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Photo de profil */}
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Photo de profil</FormLabel>
                      <FormControl>
                        <div className="flex flex-col items-center space-y-4">
                          {/* Aperçu de l'image */}
                          <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                            {imagePreview ? (
                              <img 
                                src={imagePreview} 
                                alt="Aperçu" 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                <Camera className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                          
                          {/* Bouton d'upload */}
                          <label className="cursor-pointer">
                            <div className="flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                              <Upload className="w-4 h-4" />
                              <span className="text-sm">Choisir une image</span>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                          </label>
                        </div>
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