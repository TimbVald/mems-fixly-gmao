"use client"
import PersonnelDetails from "@/components/personnel/PersonnelDetails"

interface PersonnelDetailPageProps {
    params: {
        id: string;
    };
}

export default function PersonnelDetailPage({ params }: PersonnelDetailPageProps) {
    return (
        <div className="p-6">
            <PersonnelDetails userId={params.id} />
        </div>
    )
}