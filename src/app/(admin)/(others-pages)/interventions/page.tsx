import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import InterventionsDashboard from "@/components/interventions/InterventionsDashboard";
import {
  getWorkRequests,
  getWorkOrders,
  getInterventionReports,
} from "@/server/interventions";

function InterventionsLoading() {
  return (
    <div className="space-y-6">
      {/* Statistiques skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Table skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

async function InterventionsContent() {
  try {
    const [workRequestsResult, workOrdersResult, interventionReportsResult] = await Promise.all([
      getWorkRequests(),
      getWorkOrders(),
      getInterventionReports(),
    ]);

    if (!workRequestsResult.success || !workOrdersResult.success || !interventionReportsResult.success) {
      throw new Error("Erreur lors du chargement des données");
    }

    const requests = workRequestsResult.data;
    const workOrders = workOrdersResult.data;
    const reports = interventionReportsResult.data;

    return (
      <InterventionsDashboard
        initialRequests={requests}
        initialWorkOrders={workOrders}
        initialReports={reports}
      />
    );
  } catch (error) {
    console.error("Error loading interventions:", error);
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Erreur lors du chargement des interventions
            </p>
            <p className="text-sm text-muted-foreground">
              Veuillez rafraîchir la page ou contacter l'administrateur
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
}

export default function InterventionsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Interventions</h1>
        <p className="text-muted-foreground">
          Gestion des interventions de maintenance
        </p>
      </div>
      
      <Suspense fallback={<InterventionsLoading />}>
        <InterventionsContent />
      </Suspense>
    </div>
  );
}

export const metadata = {
  title: "Interventions - GMAO",
  description: "Gestion des interventions de maintenance",
};