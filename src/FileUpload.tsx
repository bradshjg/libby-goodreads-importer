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
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const stopDefaults = (e: React.DragEvent) => {
    e.stopPropagation()
    e.preventDefault()
  }
  const uploadEvents = {
    onClick: () => {
      fileInputRef.current && fileInputRef.current.click()
    },
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

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const file = e.target.files[0]
    if (!file) return
    setLabelText(file.name)
    onFileChange(file)
  }

  return (
    <>
      <div
        {...uploadEvents}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '350px',
          height: '75px',
          opacity: `${(isMouseOver || isDragOver) ? '0.7' : '1.0'}`,
          border: '3px dashed',
          borderRadius: '10px',
        }}
      >
        {labelText}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={onChange}
        style={{display: 'none'}}
      />
    </>
  )
}
