import React from 'react'

const hoverLabel = 'Click or drag to upload Libby activity CSV'
const dropLabel = 'Drop file here'
const accept = 'text/csv'

interface FileUploadProps {
  onFileChange: (f: File | undefined) => void
}

export const FileUpload = ({onFileChange}: FileUploadProps) => {
  const [labelText, setLabelText] = React.useState<string>(hoverLabel)
  const [isDragOver, setIsDragOver] = React.useState<boolean>(false)
  const [isMouseOver, setIsMouseOver] = React.useState<boolean>(false)

  const uploadStyle = {
    'width': '400px',
    'opacity': `${(isMouseOver || isDragOver) ? '0.7' : '1.0'}`,
  }

  const UploadInputStyle = {
    display: 'none'
  }

  const stopDefaults = (e: React.DragEvent) => {
    e.stopPropagation()
    e.preventDefault()
  }
  const uploadEvents = {
    onMouseEnter: () => {
      setIsMouseOver(true)
    },
    onMouseLeave: () => {
      setIsMouseOver(false)
    },
    onDragEnter: (e: React.DragEvent) => {
      stopDefaults(e)
      setIsDragOver(true)
      setLabelText(dropLabel)
    },
    onDragLeave: (e: React.DragEvent) => {
      stopDefaults(e)
      setIsDragOver(false)
      setLabelText(hoverLabel)
    },
    onDragOver: stopDefaults,
    onDrop: (e: React.DragEvent<HTMLElement>) => {
      stopDefaults(e)
      setLabelText(hoverLabel)
      setIsDragOver(false)
      onFileChange(e.dataTransfer.files[0])
    },
  }

  return (
    <div
        {...uploadEvents}
        style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '400px',
            height: '100px',
            opacity: `${(isMouseOver || isDragOver) ? '0.7' : '1.0'}`,
            border: '3px dashed',
            borderRadius: '10px',
        }}
    >
        {labelText}
    </div>
  )
}
