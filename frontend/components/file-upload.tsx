"use client"

import type React from "react"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { FileText, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FileUploadProps {
  onFileChange: (file: File | null) => void
  accept?: string
  className?: string
  fileName?: string
}

export default function FileUpload({ onFileChange, accept = "*", className, fileName = "" }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFileName, setSelectedFileName] = useState(fileName)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file) {
      setSelectedFileName(file.name)
      onFileChange(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0] || null
    if (file) {
      // Check file type if accept is specified
      if (accept !== "*") {
        const fileType = file.type
        const acceptTypes = accept.split(",").map((type) => type.trim())

        // For file extensions like .csv
        if (accept.startsWith(".")) {
          const fileExt = `.${file.name.split(".").pop()}`
          if (!acceptTypes.includes(fileExt)) {
            alert(`Please upload a file with the following extensions: ${accept}`)
            return
          }
        }
        // For MIME types
        else if (!acceptTypes.some((type) => fileType.match(type))) {
          alert(`Please upload a file with the following types: ${accept}`)
          return
        }
      }

      setSelectedFileName(file.name)
      onFileChange(file)
    }
  }

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "flex flex-col items-center justify-center w-full p-5 border-2 border-dashed rounded-lg cursor-pointer",
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-primary/50",
          selectedFileName && "border-primary/30 bg-primary/5",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-upload")?.click()}
      >
        <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept={accept} />

        {!selectedFileName ? (
          <div className="flex flex-col items-center justify-center py-3">
            <Upload className="w-10 h-10 mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              {accept === ".csv" ? "CSV files only" : accept === "*" ? "Any file type" : `${accept} files only`}
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-center py-3 w-full">
            <FileText className="w-6 h-6 mr-2 text-primary" />
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{selectedFileName}</p>
              <p className="text-xs text-muted-foreground/70">Click to change file</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="ml-2"
              onClick={(e) => {
                e.stopPropagation()
                setSelectedFileName("")
                onFileChange(null)
              }}
            >
              Clear
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

