"use client";
import { Suspense } from "react";
import ResetPassword from "./ResetPassword";

function ResetPasswordFallback() {
  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="animate-pulse">
          <div className="mb-5 sm:mb-8">
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
          <div className="space-y-6">
            <div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-1/3"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-1/3"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordWrapper() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPassword />
    </Suspense>
  );
}