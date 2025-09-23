// components/ui/Progress.jsx
"use client";
import React from "react";

const Progress = ({ value }) => {
  return (
    <div className="w-full h-4 bg-gray-300 rounded-full overflow-hidden">
      <div
        className={`h-full ${
          value >= 100 ? "bg-green-500" : "bg-blue-500"
        } transition-all duration-300`}
        style={{ width: `${Math.min(value, 100)}%` }}
      ></div>
    </div>
  );
};

export default Progress;
