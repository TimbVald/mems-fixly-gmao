"use client"
import { useState, useEffect, useRef } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { EventContentArg, DateSelectArg, EventClickArg } from "@fullcalendar/core"
import {Modal} from "@/components/ui/modal"
import { getWorkOrders } from "@/server/work-orders"
import { toast } from "sonner"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

import { z } from "zod";

// Définition stricte de l'enum
const interventionTypeSchema = z.enum(["préventive", "curative"]);

interface WorkOrderEvent {
  id: string
  title: string
  start: string
  end?: string
  allDay?: boolean
  extendedProps: {
    workOrderNumber: string
    interventionType: "préventive" | "curative"
    numberOfIntervenants: number
    approximateDuration?: number
    stepsToFollow: string
    workRequestNumber: string
  }
}

interface WorkOrder {
  id: string
  workOrderNumber: string
  workRequestNumber: string
  interventionType: string
  numberOfIntervenants: number
  interventionDateTime: Date
  approximateDuration: number | null
  stepsToFollow: string
  createdAt: Date
  updatedAt: Date
  createdById: string
}

const WorkOrderCalendar = () => {
  const [events, setEvents] = useState<WorkOrderEvent[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<WorkOrderEvent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const calendarRef = useRef<FullCalendar>(null)

  // Charger les ordres de travail depuis la base de données
  const loadWorkOrders = async () => {
    try {
      setIsLoading(true)
      const { success, data } = await getWorkOrders()
      
      if (success && data) {
        const calendarEvents: WorkOrderEvent[] = data.map((workOrder: WorkOrder) => {
          const startDate = new Date(workOrder.interventionDateTime)
          const endDate = workOrder.approximateDuration 
            ? new Date(startDate.getTime() + workOrder.approximateDuration * 60000)
            : new Date(startDate.getTime() + 60 * 60000) // 1 heure par défaut

          return {
            id: workOrder.id,
            title: `${workOrder.workOrderNumber} - ${workOrder.interventionType}`,
            start: startDate.toISOString(),
            end: endDate.toISOString(),
            allDay: false,
            extendedProps: {
              workOrderNumber: workOrder.workOrderNumber,
              interventionType: workOrder.interventionType as "préventive" | "curative",
              numberOfIntervenants: workOrder.numberOfIntervenants,
              approximateDuration: workOrder.approximateDuration ?? undefined,
              stepsToFollow: workOrder.stepsToFollow,
              workRequestNumber: workOrder.workRequestNumber
            }
          }
        })
        
        setEvents(calendarEvents)
      } else {
        toast.error("Erreur lors du chargement des ordres de travail")
      }
    } catch (error) {
      console.error("Erreur:", error)
      toast.error("Erreur lors du chargement des ordres de travail")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadWorkOrders()
  }, [])

  const openModal = () => {
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    setSelectedEvent(null)
  }

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    // Pour l'instant, on ouvre juste le modal d'information
    // Plus tard, on pourrait permettre de créer un nouvel ordre de travail
    toast.info("Sélection de date: " + format(selectInfo.start, "PPP", { locale: fr }))
  }

  const handleEventClick = (clickInfo: EventClickArg) => {
    const eventData = clickInfo.event
    const workOrderEvent: WorkOrderEvent = {
      id: eventData.id,
      title: eventData.title,
      start: eventData.startStr,
      end: eventData.endStr,
      allDay: eventData.allDay,
      extendedProps: eventData.extendedProps as WorkOrderEvent['extendedProps']
    }
    
    setSelectedEvent(workOrderEvent)
    openModal()
  }

  const getInterventionTypeColor = (type: "préventive" | "curative") => {
    return type === "préventive" ? "success" : "danger"
  }

  const renderEventContent = (eventInfo: EventContentArg) => {
    const interventionType = eventInfo.event.extendedProps.interventionType as "préventive" | "curative"
    const colorClass = `fc-bg-${getInterventionTypeColor(interventionType)}`
    
    return (
      <div className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm`}>
        <div className="fc-daygrid-event-dot"></div>
        <div className="fc-event-time">{eventInfo.timeText}</div>
        <div className="fc-event-title">{eventInfo.event.title}</div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500 dark:text-gray-400">Chargement du calendrier...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="custom-calendar">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale="fr"
          headerToolbar={{
            left: "prev,next refreshButton",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          selectable={true}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          customButtons={{
            refreshButton: {
              text: "Actualiser",
              click: loadWorkOrders,
            },
          }}
          height="auto"
          eventDisplay="block"
          dayMaxEvents={3}
        />
      </div>
      
      {/* Modal de détails de l'ordre de travail */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[800px] p-6 lg:p-10"
      >
        {selectedEvent && (
          <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
            <div>
              <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                Détails de l'ordre de travail
              </h5>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Informations détaillées sur l'intervention planifiée
              </p>
            </div>
            
            <div className="mt-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                    Numéro d'ordre
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {selectedEvent.extendedProps.workOrderNumber}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                    Demande de travail
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {selectedEvent.extendedProps.workRequestNumber}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                    Type d'intervention
                  </label>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    selectedEvent.extendedProps.interventionType === "préventive" 
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}>
                    {selectedEvent.extendedProps.interventionType}
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                    Nombre d'intervenants
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {selectedEvent.extendedProps.numberOfIntervenants}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                    Date et heure
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {format(new Date(selectedEvent.start), "PPP à HH:mm", { locale: fr })}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                    Durée approximative
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {selectedEvent.extendedProps.approximateDuration 
                      ? `${selectedEvent.extendedProps.approximateDuration} minutes`
                      : "Non définie"
                    }
                  </p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                  Étapes à suivre
                </label>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                    {selectedEvent.extendedProps.stepsToFollow}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 mt-8 modal-footer sm:justify-end">
              <button
                onClick={closeModal}
                type="button"
                className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  // Rediriger vers la page d'édition de l'ordre de travail
                  window.location.href = `/interventions/work-orders/edit/${selectedEvent.id}`
                }}
                type="button"
                className="flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
              >
                Modifier
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default WorkOrderCalendar