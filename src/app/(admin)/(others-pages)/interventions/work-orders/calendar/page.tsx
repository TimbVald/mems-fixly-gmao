import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import WorkOrderCalendar from "@/components/calendar/WorkOrderCalendar";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Calendrier des Ordres de Travail",
  description: "Planification et visualisation des ordres de travail sur calendrier",
};

const breadcrumbItems = [
  { label: "Accueil", href: "/" },
  { label: "Interventions", href: "/interventions" },
  { label: "Ordres de travail", href: "/interventions/work-orders" },
  { label: "Calendrier", href: "/interventions/work-orders/calendar" },
];

export default function WorkOrderCalendarPage() {
  return (
    <>
      <PageBreadcrumb pageTitle="Calendrier" />
      
      {/* Navigation vers la liste */}
      <div className="mb-6 flex justify-end">
        <Link
          href="/interventions/work-orders"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
               strokeLinecap="round"
               strokeLinejoin="round"
               strokeWidth={2}
               d="M15 19l-7-7 7-7"
             />
          </svg>
          Retour à la liste
        </Link>
      </div>
      
      <ComponentCard title="Calendrier des Ordres de Travail">
        <div className="w-full">
          <WorkOrderCalendar />
        </div>
      </ComponentCard>
    </>
  );
}