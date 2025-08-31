import React from 'react';

const LoadingSpinner = ({ size = 'medium', color = 'blue' }) => {
  let dimensions;
  let borderWidth;
  
  // Set size based on prop
  switch (size) {
    case 'small':
      dimensions = 'h-6 w-6';
      borderWidth = 'border-2';
      break;
    case 'large':
      dimensions = 'h-12 w-12';
      borderWidth = 'border-4';
      break;
    case 'medium':
    default:
      dimensions = 'h-8 w-8';
      borderWidth = 'border-3';
  }
  
  // Set color based on prop
  let borderColor;
  switch (color) {
    case 'red':
      borderColor = 'border-red-500';
      break;
    case 'green':
      borderColor = 'border-green-500';
      break;
    case 'yellow':
      borderColor = 'border-yellow-500';
      break;
    case 'blue':
    default:
      borderColor = 'border-blue-500';
  }
  
  return (
    <div className="flex justify-center items-center">
      <div className={`${dimensions} ${borderWidth} ${borderColor} border-t-transparent border-solid rounded-full animate-spin`}> </div>
    </div>
  );
};

export default LoadingSpinner;