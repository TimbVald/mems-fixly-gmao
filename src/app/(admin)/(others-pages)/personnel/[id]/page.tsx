"use client"
import PersonnelDetails from "@/components/personnel/PersonnelDetails"
import { use } from "react"

interface PersonnelDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function PersonnelDetailPage({ params }: PersonnelDetailPageProps) {
    const { id } = use(params)
    
    return (
        <div className="p-6">
            <PersonnelDetails userId={id} />
        </div>
    )
}