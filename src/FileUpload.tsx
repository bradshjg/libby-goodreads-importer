import React from 'react'
import logo from './logo.svg';

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
      setIsDragOver(false)
      if (!e.dataTransfer.files) return
      const file = e.dataTransfer.files[0]
      onFileChange(file)
    },
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const file = e.target.files[0]
    onFileChange(file)
  }

  return (
    <>
      <header style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center'}}>
        <img src={logo} alt="logo" style={{width: '200px', height: '200px'}} />
        <a href="https://github.com/bradshjg/libby-goodreads-importer">Source/Docs</a>
      </header>
      <h1 style={{marginBottom: '0'}}>Instructions</h1>
      <ol>
        <li><a href="https://help.libbyapp.com/en-us/6207.htm">Download Libby activity CSV</a></li>
        <li>Convert to goodreads format (below)</li>
        <li><a href="https://help.goodreads.com/s/article/How-do-I-import-or-export-my-books-1553870934590">Import into goodreads</a></li>
      </ol>
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
