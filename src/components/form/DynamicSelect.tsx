"use client"
import React, { useState, useEffect } from "react";
import { getEquipements } from "@/server/equipement";
import { getWorkRequests } from "@/server/work-requests";
import { getWorkOrders } from "@/server/work-orders";

interface Option {
  value: string;
  label: string;
}

interface DynamicSelectProps {
  dataSource: 'equipments' | 'workRequests' | 'workOrders' | 'users';
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  defaultValue?: string;
  value?: string;
}

const DynamicSelect: React.FC<DynamicSelectProps> = ({
  dataSource,
  placeholder = "Sélectionnez une option",
  onChange,
  className = "",
  defaultValue = "",
  value,
}) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedValue, setSelectedValue] = useState<string>(value || defaultValue);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let data: Option[] = [];
        
        switch (dataSource) {
          case 'equipments':
            const equipmentsResult = await getEquipements();
            if (equipmentsResult.success && equipmentsResult.data) {
              data = equipmentsResult.data.map(equipment => ({
                value: equipment.id,
                label: equipment.name
              }));
            }
            break;
            
          case 'workRequests':
            const workRequestsResult = await getWorkRequests();
            if (workRequestsResult.success && workRequestsResult.data) {
              data = workRequestsResult.data.map(request => ({
                value: request.requestNumber,
                label: `${request.requestNumber} - ${request.requesterLastName} ${request.requesterFirstName}`
              }));
            }
            break;
            
          case 'workOrders':
            const workOrdersResult = await getWorkOrders();
            if (workOrdersResult.success && workOrdersResult.data) {
              data = workOrdersResult.data.map(order => ({
                value: order.workOrderNumber,
                label: `${order.workOrderNumber} - ${order.interventionType}`
              }));
            }
            break;
            
          case 'users':
            // TODO: Implémenter la récupération des utilisateurs
            data = [];
            break;
            
          default:
            data = [];
        }
        
        setOptions(data);
      } catch (error) {
        console.error(`Erreur lors de la récupération des données ${dataSource}:`, error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dataSource]);

  useEffect(() => {
    setSelectedValue(value || defaultValue);
  }, [value, defaultValue]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setSelectedValue(newValue);
    onChange(newValue);
  };

  if (loading) {
    return (
      <select
        className={`h-11 w-full appearance-none rounded-lg border border-gray-300 px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 text-gray-400 dark:text-gray-400 ${className}`}
        disabled
      >
        <option>Chargement...</option>
      </select>
    );
  }

  return (
    <select
      className={`h-11 w-full appearance-none rounded-lg border border-gray-300 px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
        selectedValue
          ? "text-gray-800 dark:text-white/90"
          : "text-gray-400 dark:text-gray-400"
      } ${className}`}
      value={selectedValue}
      onChange={handleChange}
    >
      <option
        value=""
        disabled
        className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
      >
        {placeholder}
      </option>
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
        >
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default DynamicSelect;