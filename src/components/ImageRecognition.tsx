
import React, { useState } from 'react';
import { processImage, getImageUrl } from '@/utils/imageProcessor';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

type ImageRecognitionProps = {
  onImageProcessed: (imageUrl: string, analysis: string) => void;
  onError: (error: string) => void;
};

const ImageRecognition: React.FC<ImageRecognitionProps> = ({ onImageProcessed, onError }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      onError("Please upload an image file");
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 15;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 200);
      
      // Get image URL for display
      const imageUrl = await getImageUrl(file);
      
      // Process the image
      const result = await processImage(file);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      // Build analysis text
      let analysisText = "";
      
      if (result.text) {
        analysisText = `📝 Extracted text: "${result.text}"`;
      }
      
      if (result.description) {
        if (analysisText) analysisText += "\n\n";
        analysisText += `🖼️ ${result.description}`;
      }
      
      // Pass results back to parent component
      onImageProcessed(imageUrl, analysisText);
      
      // Reset after a short delay
      setTimeout(() => {
        setIsProcessing(false);
        setProgress(0);
      }, 500);
      
    } catch (error) {
      onError(`Error processing image: ${error}`);
      setIsProcessing(false);
      setProgress(0);
    }
  };
  
  return (
    <TooltipProvider>
      <div className="relative">
        <Tooltip>
          <TooltipTrigger asChild>
            <label className="flex items-center justify-center w-10 h-10 rounded-full bg-muted hover:bg-muted/80 cursor-pointer transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload}
                disabled={isProcessing}
              />
            </label>
          </TooltipTrigger>
          <TooltipContent>
            <p>Upload image</p>
          </TooltipContent>
        </Tooltip>
        
        {isProcessing && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 min-w-[120px]">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-center mt-1 text-muted-foreground">Analyzing image...</p>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default ImageRecognition;
