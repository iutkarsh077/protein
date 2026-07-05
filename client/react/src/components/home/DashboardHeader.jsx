import { format } from "date-fns";
import { useState } from "react";
import { LuUpload } from "react-icons/lu";
import { FaCamera } from "react-icons/fa6";

import CameraCapture from "@/components/home/CameraCapture";
import { Button } from "@/components/ui/button";

const getInitials = (name) =>
  name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "?";

const DashboardHeader = ({ userName, onFileChange, onImageCapture }) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const today = format(new Date(), "EEEE, MMMM d");

  const handleCameraOpen = () => {
    setIsCameraOpen(true);
  };

  const handleCameraClose = () => {
    if (isUploading) return;
    setIsCameraOpen(false);
  };

  const handleCameraCapture = async (file) => {
    setIsUploading(true);
    const success = await onImageCapture?.(file);
    setIsUploading(false);

    if (success) {
      setIsCameraOpen(false);
    }
  };

  return (
    <>
      {isCameraOpen ? (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={handleCameraClose}
          isUploading={isUploading}
        />
      ) : null}

      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-emerald-600">{today}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Good morning, {userName ?? "there"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Here&apos;s how your nutrition looks today.
          </p>
        </div>

        <div className="flex items-center gap-5">
          <div
            className="grid size-10 place-items-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700"
            aria-label={`${userName ?? "User"} avatar`}
          >
            {getInitials(userName)}
          </div>

          <label className="relative cursor-pointer">
            <Button variant="outline" size="lg" className="hover:cursor-pointer gap-2">
              <LuUpload className="size-4" aria-hidden="true" />
              Upload meal
            </Button>
            <input
              type="file"
              accept=".png,.jpg,.jpeg,image/png,image/jpeg"
              className="absolute inset-0 cursor-pointer opacity-0"
              onChange={onFileChange}
            />
          </label>

          <button
            type="button"
            onClick={handleCameraOpen}
            className="text-emerald-600 transition hover:text-emerald-700"
            aria-label="Take meal photo"
          >
            <FaCamera className="size-4" />
          </button>
        </div>
      </header>
    </>
  );
};

export default DashboardHeader;
