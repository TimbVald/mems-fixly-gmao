"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"

import UserRoleMatriculeModal from "@/components/forms/UserRoleMatriculeModal"

export default function EditUserPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    if (params?.id) {
      setUserId(params.id as string)
      setIsModalOpen(true)
    }
  }, [params])

  const handleClose = () => {
    setIsModalOpen(false)
    router.push("/personnel")
  }

  const handleSuccess = () => {
    setIsModalOpen(false)
    router.push("/personnel")
  }

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
      </div>
    )
  }

  return (
    <UserRoleMatriculeModal
      isOpen={isModalOpen}
      onClose={handleClose}
      onSuccess={handleSuccess}
      userId={userId}
    />
  )
}