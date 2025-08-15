"use client";

import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  className = '',
  placeholder = 'Cliquez pour sélectionner une image'
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérification côté client
    if (!file.type.startsWith('image/')) {
      toast.error('Seuls les fichiers image sont autorisés');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Le fichier est trop volumineux (max 5MB)');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setPreview(result.data.dataUrl);
        onChange(result.data.dataUrl);
        toast.success('Image uploadée avec succès');
      } else {
        toast.error(result.error || 'Erreur lors de l\'upload');
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      toast.error('Erreur lors de l\'upload de l\'image');
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {preview ? (
        <div className="relative group">
          <div className="relative w-full max-w-md mx-auto">
            <img
              src={preview}
              alt="Aperçu"
              className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            >
              <X size={16} />
            </button>
          </div>
          <button
            type="button"
            onClick={handleClick}
            disabled={isUploading}
            className="mt-2 w-full px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            Changer l'image
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          disabled={isUploading}
          className="w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex flex-col items-center justify-center space-y-2 hover:border-gray-400 dark:hover:border-gray-600 transition-colors bg-gray-50 dark:bg-gray-900/50"
        >
          {isUploading ? (
            <div className="flex flex-col items-center space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Upload en cours...</span>
            </div>
          ) : (
            <>
              <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full">
                <ImageIcon className="w-6 h-6 text-gray-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {placeholder}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  PNG, JPG, GIF jusqu'à 5MB
                </p>
              </div>
              <Upload className="w-4 h-4 text-gray-400" />
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default ImageUpload;