import { useCallback, useEffect, useRef, useState } from "react";
import { LuX } from "react-icons/lu";

import { Button } from "@/components/ui/button";

const getCameraErrorMessage = (error) => {
  if (error?.name === "NotAllowedError") {
    return "Camera access was denied. Allow camera permission in your browser settings.";
  }
  if (error?.name === "NotFoundError") {
    return "No camera was found on this device.";
  }
  if (error?.name === "NotReadableError") {
    return "Camera is already in use by another app.";
  }
  return "Unable to access the camera. Try uploading a photo instead.";
};

const CameraCapture = ({ onCapture, onClose, isUploading }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState("");
  const [isReady, setIsReady] = useState(false);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const startCamera = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError("Camera is not supported in this browser.");
        return;
      }

      const constraints = [
        {
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        },
        {
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        },
        { video: true, audio: false },
      ];

      for (const constraint of constraints) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia(constraint);
          if (cancelled) {
            stream.getTracks().forEach((track) => track.stop());
            return;
          }

          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            await videoRef.current.play();
          }
          setIsReady(true);
          setError("");
          return;
        } catch (attemptError) {
          if (constraint === constraints[constraints.length - 1]) {
            setError(getCameraErrorMessage(attemptError));
          }
        }
      }
    };

    startCamera();

    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [stopCamera]);

  const handleCapture = async () => {
    const video = videoRef.current;
    if (!video || !isReady || isUploading) return;

    const width = video.videoWidth;
    const height = video.videoHeight;
    if (!width || !height) return;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, width, height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        const file = new File([blob], `meal-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        onCapture(file);
      },
      "image/jpeg",
      0.92,
    );
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-slate-950 shadow-2xl">
        <button
          type="button"
          onClick={handleClose}
          disabled={isUploading}
          className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-full bg-black/50 text-white transition hover:bg-black/70 disabled:opacity-50"
          aria-label="Close camera"
        >
          <LuX className="size-5" />
        </button>

        <div className="relative aspect-[3/4] w-full bg-black sm:aspect-video">
          {!error ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center px-6 text-center text-sm text-slate-200">
              {error}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-white/10 px-4 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isUploading}
            className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
          >
            Cancel
          </Button>

          <button
            type="button"
            onClick={handleCapture}
            disabled={!isReady || !!error || isUploading}
            className="grid size-14 place-items-center rounded-full border-4 border-white bg-emerald-500 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Capture photo"
          >
            <span className="size-10 rounded-full bg-white/90" />
          </button>

          <div className="w-[72px] text-right text-xs text-slate-300">
            {isUploading ? "Uploading..." : "Capture"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;
