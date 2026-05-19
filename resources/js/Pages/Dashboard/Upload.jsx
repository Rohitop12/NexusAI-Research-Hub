import React, { useState, useCallback, useEffect } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { UploadCloud, FileText, CheckCircle, AlertCircle, Loader2, X, BrainCircuit, Activity, FileSearch, Fingerprint } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { router } from '@inertiajs/react';
import { addActivity } from '@/utils/activity';

export default function Upload() {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        status: 'uploading', // uploading, processing, success, error
        progress: 0
      }));
      
      setFiles(prev => [...prev, ...newFiles]);
      simulateUpload(newFiles);
    }
  }, []);

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        status: 'uploading',
        progress: 0
      }));
      
      setFiles(prev => [...prev, ...newFiles]);
      simulateUpload(newFiles);
    }
  };

  const aiProcessingSteps = [
    { id: 'extract', label: 'Extracting text and structure...', icon: FileText },
    { id: 'read', label: 'Reading research content...', icon: FileSearch },
    { id: 'tech', label: 'Detecting technologies & entities...', icon: Fingerprint },
    { id: 'embed', label: 'Generating vector embeddings...', icon: Activity },
    { id: 'summary', label: 'Creating AI summary & knowledge graph...', icon: BrainCircuit }
  ];

  const simulateUpload = (newFiles) => {
    newFiles.forEach(fileObj => {
      const formData = new FormData();
      formData.append('files[]', fileObj.file);

      axios.post('/api/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setFiles(prev => prev.map(f => {
            if (f.id === fileObj.id) {
              return { 
                ...f, 
                progress: percentCompleted, 
                status: percentCompleted < 100 ? 'uploading' : 'processing',
                currentStep: 0
              };
            }
            return f;
          }));
        }
      }).then((response) => {
        // Start multi-step AI animation locally since API returned
        const documentId = response.data.documents[0].id;
        let step = 0;
        
        const stepInterval = setInterval(() => {
          step++;
          if (step >= aiProcessingSteps.length) {
            clearInterval(stepInterval);
            setFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, status: 'success', currentStep: step } : f));
            // Log to recent activity
            addActivity({
              title: fileObj.file.name,
              type: 'Upload',
              meta: `${(fileObj.file.size / 1024).toFixed(1)} KB`,
              href: `/dashboard/document/${documentId}`,
            });
            // Redirect to Document Insight Dashboard
            setTimeout(() => {
              router.visit(`/dashboard/document/${documentId}`);
            }, 1000);
          } else {
            setFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, currentStep: step } : f));
          }
        }, 1200); // 1.2s per step for visual effect

      }).catch((error) => {
        setFiles(prev => prev.map(f => {
          if (f.id === fileObj.id) {
            return { ...f, status: 'error' };
          }
          return f;
        }));
      });
    });
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto w-full pb-20">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-4 text-ui-heading">Smart <span className="text-black/20">Document</span> Upload</h1>
          <p className="text-ui-muted">Upload your R&D data. Our AI automatically extracts text, generates vector embeddings, and builds knowledge graphs.</p>
        </div>

        {/* Drag & Drop Zone */}
        <div 
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`relative overflow-hidden border-2 border-dashed rounded-3xl p-16 transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer ${
            isDragging 
              ? 'border-ui-black bg-ui-black/5 scale-[1.02]' 
              : 'border-ui-divider bg-white hover:bg-bg-main hover:border-ui-muted'
          }`}
        >
          {isDragging && <div className="absolute inset-0 bg-ui-black/3 backdrop-blur-sm pointer-events-none"></div>}
          
          <div className="w-20 h-20 rounded-full bg-bg-main border border-ui-border flex items-center justify-center mb-6 shadow-sm text-black relative z-10">
            <UploadCloud className="w-8 h-8" />
          </div>
          
          <h3 className="text-2xl font-bold mb-2 relative z-10 text-ui-heading">Drag & drop files here</h3>
          <p className="text-ui-muted mb-8 relative z-10">Support for PDF, DOCX, PPTX, CSV, and Images (OCR)</p>
          
          <label className="relative z-10 px-8 py-3 bg-ui-black text-white font-semibold rounded-xl hover:bg-gray-900 transition-colors cursor-pointer shadow-lg mr-4">
            Browse Files
            <input type="file" multiple className="hidden" onChange={handleFileInput} />
          </label>

        </div>

        {/* Upload Queue */}
        {files.length > 0 && (
          <div className="mt-12">
            <h3 className="text-lg font-bold mb-6 text-ui-heading border-b border-ui-divider pb-4">Processing Queue</h3>
            <div className="space-y-4">
              <AnimatePresence>
                {files.map((fileObj) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={fileObj.id} 
                    className="bg-white border border-ui-border rounded-2xl p-5 flex items-center gap-5 relative overflow-hidden shadow-sm"
                  >
                    {/* Progress Bar Background */}
                    {fileObj.status === 'uploading' && (
                      <div 
                        className="absolute left-0 top-0 bottom-0 bg-ui-black/5 transition-all duration-300"
                        style={{ width: `${fileObj.progress}%` }}
                      ></div>
                    )}
                    
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border relative z-10 ${
                      fileObj.status === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-600' :
                      fileObj.status === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-600' :
                      'bg-bg-main border-ui-border text-ui-black'
                    }`}>
                      {fileObj.status === 'success' ? <CheckCircle className="w-5 h-5" /> :
                       fileObj.status === 'error' ? <AlertCircle className="w-5 h-5" /> :
                       <FileText className="w-5 h-5" />}
                    </div>
                    
                    <div className="flex-1 min-w-0 relative z-10">
                      <div className="flex justify-between items-end mb-1">
                        <p className="text-sm font-bold text-ui-heading truncate pr-4">{fileObj.file.name}</p>
                        <span className="text-xs text-ui-muted shrink-0">{(fileObj.file.size / (1024 * 1024)).toFixed(2)} MB</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {fileObj.status === 'uploading' && (
                          <>
                            <div className="h-1.5 flex-1 bg-ui-border rounded-full overflow-hidden">
                              <div className="h-full bg-ui-black rounded-full transition-all duration-300" style={{ width: `${fileObj.progress}%` }}></div>
                            </div>
                            <span className="text-[10px] font-bold text-ui-black">{fileObj.progress}%</span>
                          </>
                        )}
                        {fileObj.status === 'processing' && fileObj.currentStep !== undefined && (
                          <div className="flex flex-col gap-1 w-full mt-2">
                            <span className="text-xs text-black flex items-center gap-1.5 font-medium">
                              <Loader2 className="w-3 h-3 animate-spin" /> {aiProcessingSteps[fileObj.currentStep]?.label || 'Processing...'}
                            </span>
                            <div className="h-1 w-full bg-ui-border rounded-full overflow-hidden">
                              <div className="h-full bg-black transition-all duration-300" style={{ width: `${((fileObj.currentStep + 1) / aiProcessingSteps.length) * 100}%` }}></div>
                            </div>
                          </div>
                        )}
                        {fileObj.status === 'success' && (
                          <span className="text-xs text-green-500 font-medium">Successfully processed and indexed! Opening Dashboard...</span>
                        )}
                        {fileObj.status === 'error' && (
                          <span className="text-xs text-red-500 font-medium">Failed to process document.</span>
                        )}
                      </div>
                    </div>

                    <button 
                      onClick={() => removeFile(fileObj.id)}
                      className="p-2 hover:bg-bg-main rounded-lg text-ui-muted hover:text-ui-black transition-colors relative z-10 shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
