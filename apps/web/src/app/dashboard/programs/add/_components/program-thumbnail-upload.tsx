"use client";

import React, { useState } from "react";
import { UploadCloudIcon, XIcon, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = "image/jpeg,image/jpg,image/png,image/webp";

interface ProgramThumbnailUploadProps {
  id: string;
  className?: string;
  disabled?: boolean;
  onImageChange?: (file: File | null) => void;
}

export function ProgramThumbnailUpload({ 
  className, 
  disabled = false, 
  onImageChange 
}: ProgramThumbnailUploadProps) {
  const [fileEnter, setFileEnter] = useState(false);
  const [inputKey, setInputKey] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const tThumbnail = useTranslations('entities.program.thumbnail');

  const handleFileChange = async (selectedFiles: FileList | null) => {    
    if (selectedFiles && selectedFiles.length > 0) {
      const file = selectedFiles[0];

      const fileExtension = file.name.toLowerCase().split('.').pop();
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
      
      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        toast.error(tThumbnail("fileFormatError", { extensions: "JPG, PNG, WebP" }));
        setFileEnter(false);
        setInputKey(prev => prev + 1);
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error(tThumbnail("fileTooLarge", { maxSize: MAX_FILE_SIZE / (1024 * 1024) }));
        setFileEnter(false);
        setInputKey(prev => prev + 1);
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error(tThumbnail("fileFormatError", { extensions: "JPG, PNG, WebP" }));
        setFileEnter(false);
        setInputKey(prev => prev + 1);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      onImageChange?.(file);
      setInputKey(prev => prev + 1);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    onImageChange?.(null);
    setInputKey(prev => prev + 1);
  };

  const getIcon = () => {
    if (previewImage) {
      return <ImageIcon className="size-10 text-accent" />;
    }
    return (
      <UploadCloudIcon
        className={cn(
          "size-10 transition-all duration-200",
          fileEnter ? "text-accent" : "text-muted-foreground"
        )}
      />
    );
  };

  const getMessage = () => {
    return (
      <div className="flex flex-col items-center gap-2 text-center">
        <p>
          <span className="font-medium text-foreground">
            {tThumbnail("clickToSelect")}
          </span>{" "}
          {tThumbnail("dragAndDrop")}
        </p>
        <p className="text-sm text-muted-foreground">
          {tThumbnail("supportedFormats", { formats: "JPG, PNG, WebP" })}
        </p>
        <p className="text-sm text-muted-foreground">
          {tThumbnail("maxFileSize", { maxSize: MAX_FILE_SIZE / (1024 * 1024) })}
        </p>
      </div>
    );
  };

  return (
    <div>
      <span className="block text-sm font-medium text-foreground mb-2">{tThumbnail("thumbnail")}</span> 
      <label 
        htmlFor="image-upload" 
        className={cn(
          "cursor-pointer w-full", 
          className, 
          disabled && "cursor-not-allowed"
        )}
      >
        <div
          onDragOver={(e) => {
            if (disabled) return;
            e.preventDefault();
            setFileEnter(true);
          }}
          onDragLeave={() => setFileEnter(false)}
          onDrop={(e) => {
            if (disabled) return;
            e.preventDefault();
            setFileEnter(false);
            handleFileChange(e.dataTransfer.files);
          }}
          className={cn(
            "relative p-6 border-2 border-dashed rounded-lg transition-all duration-300",
            "flex flex-col items-center justify-center gap-4 min-h-[208px]",
            disabled && "border-muted bg-muted cursor-not-allowed opacity-60",
            !disabled && fileEnter
              ? "border-accent bg-accent/5"
              : !disabled &&
                  "border-border hover:border-accent/50 bg-card"
          )}
        >
          {previewImage && (
            <div className="absolute inset-4 rounded-lg overflow-hidden">
              <img
                src={previewImage}
                alt={tThumbnail("previewAlt")}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRemoveImage();
                }}
                className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90 transition-colors"
              >
                <XIcon className="size-4" />
              </button>
            </div>
          )}

          {!previewImage && (
            <div className="flex flex-col items-center gap-2 text-center">
              {getIcon()}
              {getMessage()}
            </div>
          )}

          <input
            key={inputKey}
            id="image-upload"
            type="file"
            className="hidden"
            accept={ACCEPTED_TYPES}
            onChange={(e) => {
              handleFileChange(e.target.files);
            }}
            disabled={disabled}
          />
        </div>
      </label>
    </div>
  );
}