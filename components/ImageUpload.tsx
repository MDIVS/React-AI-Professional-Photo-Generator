
import React, { useRef, useState } from 'react';

interface ImageUploadProps {
  onImageSelected: (base64: string, mimeType: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreview(base64String);
        
        // Extract base64 content and mime type
        const parts = base64String.split(',');
        const mimeType = parts[0].match(/:(.*?);/)?.[1] || 'image/png';
        const data = parts[1];
        onImageSelected(data, mimeType);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div 
        onClick={triggerUpload}
        className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
          preview ? 'border-blue-400 bg-blue-50/30' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
        }`}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept="image/*"
        />
        
        {preview ? (
          <div className="relative group">
            <img 
              src={preview} 
              alt="Preview" 
              className="max-h-64 rounded-xl shadow-md transition-transform group-hover:scale-[1.02]" 
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-xl transition-opacity">
              <span className="text-white font-medium">Change Photo</span>
            </div>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Upload your photo</h3>
            <p className="text-slate-500 text-sm mt-1 text-center max-w-xs">
              Drag and drop or click to upload. For best results, use a clear, front-facing selfie.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
