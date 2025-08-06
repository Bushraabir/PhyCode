import React from "react";

const RectangleSkeleton: React.FC = () => {
  return (
    <div className="space-y-2 animate-pulse">
      <div className="flex items-center space-x-2">
        <div className="w-12 h-6 bg-deepPlum rounded" />
      </div>
    </div>
  );
};
export default RectangleSkeleton;