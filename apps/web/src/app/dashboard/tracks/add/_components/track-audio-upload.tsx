"use client";

import React, { useState } from "react";
import { UploadCloudIcon, XIcon, MusicIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB dla plików audio
const ACCEPTED_TYPES = "audio/mpeg,audio/mp3";

interface TrackAudioUploadProps {
  id: string;
  className?: string;
  disabled?: boolean;
  onAudioChange?: (file: File | null) => void;
}

export function TrackAudioUpload({ 
  className, 
  disabled = false, 
  onAudioChange 
}: TrackAudioUploadProps) {
  const [fileEnter, setFileEnter] = useState(false);
  const [inputKey, setInputKey] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const tAudioTrack = useTranslations('entities.track.trackAudio');

  const handleFileChange = async (selectedFiles: FileList | null) => {    
    if (selectedFiles && selectedFiles.length > 0) {
      const file = selectedFiles[0];

      const fileExtension = file.name.toLowerCase().split('.').pop();
      const allowedExtensions = ['mp3'];
      
      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        toast.error(tAudioTrack("fileFormatError", { extensions: "MP3" }));
        setFileEnter(false);
        setInputKey(prev => prev + 1);
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error(tAudioTrack("fileTooLarge", { maxSize: MAX_FILE_SIZE / (1024 * 1024) }));
        setFileEnter(false);
        setInputKey(prev => prev + 1);
        return;
      }

      if (!file.type.startsWith('audio/')) {
        toast.error(tAudioTrack("fileFormatError", { extensions: "MP3" }));
        setFileEnter(false);
        setInputKey(prev => prev + 1);
        return;
      }

      setSelectedFile(file);
      onAudioChange?.(file);
      setInputKey(prev => prev + 1);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    onAudioChange?.(null);
    setInputKey(prev => prev + 1);
  };

  const getIcon = () => {
    if (selectedFile) {
      return <MusicIcon className="size-10 text-accent" />;
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
    if (selectedFile) {
      return (
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="font-medium text-foreground">{selectedFile.name}</p>
          <p className="text-sm text-muted-foreground">
            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
          </p>
          <p className="text-sm text-muted-foreground">
            {tAudioTrack("clickToChange")}
          </p>
        </div>
      );
    }
    
    return (
      <div className="flex flex-col items-center gap-2 text-center">
        <p>
          <span className="font-medium text-foreground">
            {tAudioTrack("clickToSelect")}
          </span>{" "}
          {tAudioTrack("dragAndDrop")}
        </p>
        <p className="text-sm text-muted-foreground">
          {tAudioTrack("supportedFormats", { formats: "MP3" })}
        </p>
        <p className="text-sm text-muted-foreground">
          {tAudioTrack("maxFileSize", { maxSize: MAX_FILE_SIZE / (1024 * 1024) })}
        </p>
      </div>
    );
  };

  return (
    <div>
      <span className="block text-sm font-medium text-foreground mb-2">{tAudioTrack("audioFile")}</span> 
      <label 
        htmlFor="audio-upload" 
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
          {selectedFile && (
            <div className="absolute top-2 right-2">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRemoveFile();
                }}
                className="bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90 transition-colors"
              >
                <XIcon className="size-4" />
              </button>
            </div>
          )}

          <div className="flex flex-col items-center gap-2 text-center">
            {getIcon()}
            {getMessage()}
          </div>

          <input
            key={inputKey}
            id="audio-upload"
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
