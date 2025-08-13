"use client"

import Link from "next/link"
import { Plus } from "lucide-react"
import Button from "@/components/ui/button/Button"
import PersonnelTable from "@/components/tables/PersonnelTable"

export default function PersonnelPage() {
  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Personnel
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Gérez les utilisateurs et le personnel de votre organisation
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link href="/personnel/add">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Ajouter un utilisateur
            </Button>
          </Link>
        </div>
      </div>

      <PersonnelTable />
    </div>
  )
}