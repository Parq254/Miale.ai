
import React from 'react';

const WelcomeHeader: React.FC = () => {
  return (
    <div className="text-center mb-8 max-w-2xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-3">
        Hello, I'm Miale Assistant here to answer your Solar Off-grid queries
      </h1>
      <p className="text-muted-foreground text-lg">
        Speak, type, or share images - I'm here to understand and respond.
      </p>
      <div className="flex flex-wrap justify-center gap-4 mt-6">
        <div className="flex items-center bg-muted/30 px-4 py-2 rounded-lg">
          <span className="text-sm md:text-base">Voice Input</span>
        </div>
        <div className="flex items-center bg-muted/30 px-4 py-2 rounded-lg">
          <span className="text-sm md:text-base">Text Input</span>
        </div>
        <div className="flex items-center bg-muted/30 px-4 py-2 rounded-lg">
          <span className="text-sm md:text-base">Image Recognition</span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;
