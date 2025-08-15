"use client";

import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import { FileText, Upload, X } from 'lucide-react';

interface DocumentUploadProps {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  value,
  onChange,
  className = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Vérifier le type de fichier
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      toast.error('Type de fichier non supporté. Seuls les fichiers PDF et DOCX sont autorisés.');
      return;
    }

    // Vérifier la taille (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error('Le fichier est trop volumineux. Taille maximale : 10MB.');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-document', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        onChange(result.data);
        toast.success(`Document "${file.name}" uploadé avec succès !`);
      } else {
        toast.error(result.error || 'Erreur lors de l\'upload du document');
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      toast.error('Erreur lors de l\'upload du document');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.success('Document supprimé');
  };

  const getFileName = (dataUri: string): string => {
    // Extraire le nom du fichier depuis l'URI de données si possible
    // Sinon, retourner un nom générique basé sur le type
    if (dataUri.includes('application/pdf')) {
      return 'Document.pdf';
    } else if (dataUri.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      return 'Document.docx';
    }
    return 'Document';
  };

  const getFileSize = (dataUri: string): string => {
    // Estimer la taille du fichier basé sur la longueur de la chaîne base64
    const base64Length = dataUri.split(',')[1]?.length || 0;
    const sizeInBytes = (base64Length * 3) / 4;
    
    if (sizeInBytes < 1024) {
      return `${Math.round(sizeInBytes)} B`;
    } else if (sizeInBytes < 1024 * 1024) {
      return `${Math.round(sizeInBytes / 1024)} KB`;
    } else {
      return `${Math.round(sizeInBytes / (1024 * 1024))} MB`;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {!value ? (
        <div
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${dragActive 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' 
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }
            ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />
          
          <div className="flex flex-col items-center space-y-2">
            <Upload className="h-8 w-8 text-gray-400" />
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {isUploading ? (
                <span>Upload en cours...</span>
              ) : (
                <>
                  <span className="font-medium text-blue-600 dark:text-blue-400">
                    Cliquez pour sélectionner
                  </span>
                  {' ou glissez-déposez un document'}
                </>  
              )}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              PDF ou DOCX (max 10MB)
            </div>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-blue-500" />
              <div>
                <div className="font-medium text-sm">
                  {getFileName(value)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {getFileSize(value)}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              title="Supprimer le document"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;