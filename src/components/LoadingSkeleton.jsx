import React from "react";

const LoadingSkeleton = () => {
  const Loading_skeleton = [...Array(15)].map((_, index) => {
    return <div className="loading-skeleton" key={index}></div>;
  });

  return {Loading_Skeleton};
};

export default LoadingSkeleton;
