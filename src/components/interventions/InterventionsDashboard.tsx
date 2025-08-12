"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Wrench, FileText, ClipboardList, Plus } from "lucide-react";
import { toast } from "sonner";
import InterventionTable from "./InterventionTable";
import {
  getWorkRequests,
  getWorkOrders,
  getInterventionReports,
  type WorkRequest,
  type WorkOrder,
  type InterventionReport,
} from "@/server/interventions";

interface InterventionsDashboardProps {
  initialRequests?: WorkRequest[];
  initialWorkOrders?: WorkOrder[];
  initialReports?: InterventionReport[];
}

export default function InterventionsDashboard({
  initialRequests = [],
  initialWorkOrders = [],
  initialReports = [],
}: InterventionsDashboardProps) {
  const [requests, setRequests] = useState<WorkRequest[]>(initialRequests);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(initialWorkOrders);
  const [reports, setReports] = useState<InterventionReport[]>(initialReports);
  const [loading, setLoading] = useState(false);

  const refreshData = async () => {
    setLoading(true);
    const [requestsResult, workOrdersResult, reportsResult] = await Promise.all([
      getWorkRequests(),
      getWorkOrders(),
      getInterventionReports(),
    ]);
    
    if (requestsResult.success && requestsResult.data) {
      setRequests(requestsResult.data);
    }
    if (workOrdersResult.success && workOrdersResult.data) {
      setWorkOrders(workOrdersResult.data);
    }
    if (reportsResult.success && reportsResult.data) {
      setReports(reportsResult.data);
    }
    
    if (!requestsResult.success || !workOrdersResult.success || !reportsResult.success) {
      toast.error("Erreur lors du rafraîchissement des données");
    }
    setLoading(false);
  };

  // Statistiques
  const stats = {
    totalRequests: requests.length,
    pendingRequests: requests.filter(r => r.status === 'pending').length,
    activeWorkOrders: workOrders.length,
    completedReports: reports.length,
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Demandes</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRequests}</div>
            <p className="text-xs text-muted-foreground">Toutes les demandes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Demandes en Attente</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingRequests}</div>
            <p className="text-xs text-muted-foreground">Non assignées</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ordres de Travail</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeWorkOrders}</div>
            <p className="text-xs text-muted-foreground">En cours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rapports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedReports}</div>
            <p className="text-xs text-muted-foreground">Complétés</p>
          </CardContent>
        </Card>
      </div>

      {/* Onglets principaux */}
      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="requests">Demandes</TabsTrigger>
          <TabsTrigger value="work-orders">Ordres de Travail</TabsTrigger>
          <TabsTrigger value="reports">Rapports</TabsTrigger>
        </TabsList>

        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Demandes d'Intervention</CardTitle>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle Demande
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {requests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucune demande d'intervention trouvée
                </div>
              ) : (
                <div className="space-y-4">
                  {requests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="font-medium">
                            {request.equipment?.name || "Équipement inconnu"}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {request.failureDescription}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Créé par: {request.createdBy?.name}</span>
                            <span>Le: {formatDate(request.createdAt)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {request.interventionId ? (
                            <Badge variant="secondary">Assignée</Badge>
                          ) : (
                            <Badge variant="outline">En attente</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="work-orders">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Ordres de Travail</CardTitle>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvel Ordre
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {workOrders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun ordre de travail trouvé
                </div>
              ) : (
                <div className="space-y-4">
                  {workOrders.map((workOrder) => (
                    <div key={workOrder.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="font-medium">
                            {workOrder.interventionType}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Plan: {workOrder.plan}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Assigné à: {workOrder.assignedTo?.name || "Non assigné"}</span>
                            <span>Créé le: {formatDate(workOrder.createdAt)}</span>
                          </div>
                        </div>
                        <Badge variant="default">Actif</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Rapports d'Intervention</CardTitle>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau Rapport
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {reports.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun rapport d'intervention trouvé
                </div>
              ) : (
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div key={report.id} className="border rounded-lg p-4">
                      <div className="space-y-2">
                        <div className="font-medium">
                          {report.interventionType}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {report.failureDescription}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                          <div>
                            <span className="text-muted-foreground">Temps de réparation:</span>
                            <div className="font-medium">{report.reparationTime}h</div>
                          </div>
                          {report.sparePart && (
                            <div>
                              <span className="text-muted-foreground">Pièce de rechange:</span>
                              <div className="font-medium">{report.sparePart}</div>
                            </div>
                          )}
                          {report.partQuantity && (
                            <div>
                              <span className="text-muted-foreground">Quantité:</span>
                              <div className="font-medium">{report.partQuantity}</div>
                            </div>
                          )}
                          <div>
                            <span className="text-muted-foreground">Date:</span>
                            <div className="font-medium">{formatDate(report.createdAt)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}