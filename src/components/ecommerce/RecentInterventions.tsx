import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Image from "next/image";

// Define the TypeScript interface for the table rows
interface Intervention {
  id: number; // Unique identifier for each intervention
  equipment: string; // Equipment name
  type: string; // Type of intervention (e.g., "Maintenance préventive", "Réparation")
  site: string; // Site where the intervention takes place
  technician: string; // Technician assigned
  priority: "Urgent" | "Normal" | "Faible"; // Priority level
  status: "En cours" | "Terminé" | "En attente"; // Status of the intervention
  image: string; // URL or path to the equipment image
}

// Define the table data using the interface
const tableData: Intervention[] = [
  {
    id: 1,
    equipment: "Compresseur d'air Atlas Copco",
    type: "Maintenance préventive",
    site: "Atelier Production",
    technician: "Jean Dupont",
    priority: "Normal",
    status: "Terminé",
    image: "/images/product/product-01.jpg", // Replace with actual equipment image
  },
  {
    id: 2,
    equipment: "Pompe hydraulique Parker",
    type: "Réparation",
    site: "Zone Technique",
    technician: "Marie Martin",
    priority: "Urgent",
    status: "En cours",
    image: "/images/product/product-02.jpg", // Replace with actual equipment image
  },
  {
    id: 3,
    equipment: "Moteur électrique Siemens",
    type: "Maintenance préventive",
    site: "Salle des machines",
    technician: "Pierre Durand",
    priority: "Faible",
    status: "En attente",
    image: "/images/product/product-03.jpg", // Replace with actual equipment image
  },
  {
    id: 4,
    equipment: "Ventilateur industriel",
    type: "Réparation",
    site: "Zone Ventilation",
    technician: "Sophie Bernard",
    priority: "Urgent",
    status: "En cours",
    image: "/images/product/product-04.jpg", // Replace with actual equipment image
  },
  {
    id: 5,
    equipment: "Système de refroidissement",
    type: "Maintenance préventive",
    site: "Salle climatisation",
    technician: "Lucas Moreau",
    priority: "Normal",
    status: "Terminé",
    image: "/images/product/product-05.jpg", // Replace with actual equipment image
  },
];

export default function RecentInterventions() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Interventions Récentes
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            <svg
              className="stroke-current fill-white dark:fill-gray-800"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.29004 5.90393H17.7067"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.7075 14.0961H2.29085"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
              <path
                d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
            </svg>
            Filtrer
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            Voir tout
          </button>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Équipement
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Type
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Technicien
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Priorité
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Statut
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {tableData.map((intervention) => (
              <TableRow key={intervention.id} className="">
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                      <Image
                        width={50}
                        height={50}
                        src={intervention.image}
                        className="h-[50px] w-[50px]"
                        alt={intervention.equipment}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {intervention.equipment}
                      </p>
                      <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                        {intervention.site}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {intervention.type}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {intervention.technician}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      intervention.priority === "Urgent"
                        ? "error"
                        : intervention.priority === "Normal"
                        ? "warning"
                        : "success"
                    }
                  >
                    {intervention.priority}
                  </Badge>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      intervention.status === "Terminé"
                        ? "success"
                        : intervention.status === "En cours"
                        ? "warning"
                        : "error"
                    }
                  >
                    {intervention.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
