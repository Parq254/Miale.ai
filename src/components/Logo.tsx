import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center py-4">
      <img
        src="/lovable-uploads/Miale_AI-logo.png"
        alt="Miale AI Logo"
        className="w-16 h-16" // Increased size
      />
      <div className="ml-4">
        <h1 className="text-2xl font-bold text-primary">Miale AI</h1>
        <p className="text-sm text-muted-foreground">Intelligent Off-Grid Virtual Assistant</p>
      </div>
    </div>
  );
};

export default Logo;
