import React from "react";

const CircleSkeleton: React.FC = () => {
  return (
    <div className="space-y-2 animate-pulse">
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 bg-deepPlum rounded-full" />
      </div>
    </div>
  );
};
export default CircleSkeleton;