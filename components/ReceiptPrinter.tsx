
import React from 'react';

const ReceiptPrinter: React.FC = () => {
  // This component is purely a placeholder to ensure the DOM elements 
  // needed for print exist in the layout, but the content is injected via printService.
  // Updated ID to 'print-section' to match the selector used in services/printService.ts
  return (
    <div id="print-section" className="hidden print:block">
       {/* Inject print contents here if needed dynamically */}
    </div>
  );
};

export default ReceiptPrinter;
