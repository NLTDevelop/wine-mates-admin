import { useDownloadFileMutation } from '@/modules/download-file/presenters/useDownloadFileMutation'
import { useState } from 'react'

export const downloadFile = (file: File, name?: string) => {
  const downloadUrl = window.URL.createObjectURL(file)
  const link = document.createElement('a')
  link.href = downloadUrl
  if (name) link.download = name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const convertBytesToMB = (bytes: number) => {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} mb`;
};


export const useFileDownloadLogic = () => {
    const { mutateAsync } = useDownloadFileMutation();

    const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

    const handleDownloadFile = async (idOrFile: string | File, name: string) => {
        const fileId = typeof idOrFile === 'string' ? idOrFile : idOrFile.name;
        
        if (loadingMap[fileId]) return;

        setLoadingMap(prev => ({ ...prev, [fileId]: true }));
        
        try {
            if (typeof idOrFile === 'string') {
                await mutateAsync({ id: idOrFile, name }); 
            } else if (idOrFile instanceof File) {
                downloadFile(idOrFile, name);
            }
        } catch (error) {
        } finally {
            setLoadingMap(prev => {
                const updated = { ...prev };
                delete updated[fileId];
                return updated;
            });
        }
    };

    return { 
        handleDownloadFile, 
        loadingFiles: loadingMap 
    };
};

