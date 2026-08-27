import React, { useState, useRef, useEffect } from 'react';
import { Camera, RotateCw, Sparkles, Sliders, Check, RefreshCw, X, Upload, SunMedium, Eye } from 'lucide-react';
import { fileToDataUrl, processImageTransformations } from '../utils/imageProcessing';

interface CameraScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmPhoto: (dataUrl: string) => void;
}

export const CameraScanModal: React.FC<CameraScanModalProps> = ({
  isOpen,
  onClose,
  onConfirmPhoto,
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [processedPreview, setProcessedPreview] = useState<string | null>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [filterMode, setFilterMode] = useState<'none' | 'enhanced' | 'grayscale'>('none');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Start camera when modal opens
  useEffect(() => {
    if (isOpen && !capturedImage) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, capturedImage]);

  // Update processed preview on rotation/filter changes
  useEffect(() => {
    if (!capturedImage) {
      setProcessedPreview(null);
      return;
    }
    let isCurrent = true;
    setIsProcessing(true);
    processImageTransformations(capturedImage, rotation, filterMode)
      .then((url) => {
        if (isCurrent) {
          setProcessedPreview(url);
          setIsProcessing(false);
        }
      })
      .catch(() => {
        if (isCurrent) setIsProcessing(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [capturedImage, rotation, filterMode]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const s = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: false,
        });
        setStream(s);
        setCameraActive(true);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      } else {
        setCameraError('الكاميرا غير مدعومة مباشرة في هذا المتصفح. يمكنك اختيار صورة من الهاتف.');
      }
    } catch (err: any) {
      console.warn('Camera access issue:', err);
      setCameraError('لم نتمكن من تشغيل الكاميرا تلقائياً، يمكنك رفع صورة المستند مباشرة من جهازك.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  const handleCapture = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
        stopCamera();
        setCapturedImage(dataUrl);
        setRotation(0);
        setFilterMode('none');
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const dataUrl = await fileToDataUrl(file);
      stopCamera();
      setCapturedImage(dataUrl);
      setRotation(0);
      setFilterMode('none');
    }
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleConfirm = async () => {
    if (!capturedImage) return;
    const finalUrl = await processImageTransformations(capturedImage, rotation, filterMode);
    onConfirmPhoto(finalUrl);
    handleClose();
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setProcessedPreview(null);
    setRotation(0);
    setFilterMode('none');
    startCamera();
  };

  const handleClose = () => {
    stopCamera();
    setCapturedImage(null);
    setProcessedPreview(null);
    setRotation(0);
    setFilterMode('none');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-md flex flex-col justify-between">
      {/* Top Bar */}
      <div className="px-4 py-3.5 flex items-center justify-between border-b border-stone-800 text-white z-10 bg-stone-950/70">
        <div className="flex items-center gap-2">
          <span className="text-xl">📷</span>
          <h2 className="text-base font-bold">
            {capturedImage ? 'معاينة وضبط المستند' : 'تصوير مستند جديد'}
          </h2>
        </div>
        <button
          onClick={handleClose}
          className="p-2 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main View Area */}
      <div className="flex-1 relative flex items-center justify-center p-3 overflow-hidden">
        {!capturedImage ? (
          /* Live Camera View */
          <div className="w-full h-full max-w-md max-h-[75vh] relative rounded-3xl overflow-hidden bg-black flex items-center justify-center border-2 border-dashed border-emerald-500/40">
            {cameraActive ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {/* Guide overlay targeting document border */}
                <div className="absolute inset-6 border-2 border-emerald-400/80 rounded-2xl pointer-events-none flex flex-col justify-between p-3">
                  <div className="text-[11px] bg-black/60 text-emerald-300 font-semibold px-2 py-0.5 rounded self-start">
                    ضع أطراف المستند داخل الإطار
                  </div>
                  <div className="flex justify-between text-emerald-400 text-xs font-mono">
                    <span>┌</span>
                    <span>┐</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center p-6 text-stone-300 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-stone-800 flex items-center justify-center text-3xl">
                  📸
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">التقاط صورة المستند</h3>
                  <p className="text-xs text-stone-400 mt-1 max-w-xs leading-relaxed">
                    {cameraError || 'يمكنك التقاط صورة المستند عبر الكاميرا أو اختيار صورة جاهزة من ملفات الهاتف'}
                  </p>
                </div>
                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={startCamera}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    <span>تشغيل الكاميرا</span>
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>اختيار صورة من الهاتف</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Captured Photo Preview & Editing Tools */
          <div className="w-full h-full max-w-md max-h-[75vh] relative rounded-3xl overflow-hidden bg-stone-900 flex items-center justify-center p-2 border border-stone-700">
            {processedPreview ? (
              <img
                src={processedPreview}
                alt="المستند الملتقط"
                className="max-w-full max-h-full object-contain rounded-xl shadow-2xl transition-all duration-300"
              />
            ) : (
              <div className="text-stone-400 text-xs animate-pulse">جاري المعالجة...</div>
            )}

            {isProcessing && (
              <div className="absolute top-4 right-4 bg-black/70 text-white text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>تحديث المعاينة...</span>
              </div>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* Bottom Controls */}
      <div className="p-4 bg-stone-950 border-t border-stone-800">
        <div className="max-w-md mx-auto">
          {!capturedImage ? (
            /* Live Capture Buttons */
            <div className="flex items-center justify-around">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center gap-1 text-stone-400 hover:text-white text-xs cursor-pointer"
              >
                <div className="w-11 h-11 rounded-full bg-stone-800 flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <span>من الألبوم</span>
              </button>

              {/* Shutter Button */}
              <button
                onClick={cameraActive ? handleCapture : () => fileInputRef.current?.click()}
                className="w-18 h-18 rounded-full border-4 border-white flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 active:scale-95 transition shadow-lg cursor-pointer"
                title="التقاط"
              >
                <div className="w-14 h-14 rounded-full bg-white/30 border border-white/50"></div>
              </button>

              <button
                onClick={startCamera}
                className="flex flex-col items-center gap-1 text-stone-400 hover:text-white text-xs cursor-pointer"
              >
                <div className="w-11 h-11 rounded-full bg-stone-800 flex items-center justify-center">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <span>تحديث</span>
              </button>
            </div>
          ) : (
            /* Editing Toolstrip: Rotate, Enhance, Grayscale & Actions */
            <div className="space-y-4">
              {/* Filter / Adjustments Chips */}
              <div className="flex items-center justify-center gap-2 overflow-x-auto py-1">
                <button
                  onClick={handleRotate}
                  className="bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                >
                  <RotateCw className="w-4 h-4 text-emerald-400" />
                  <span>تدوير ({rotation}°)</span>
                </button>

                <button
                  onClick={() => setFilterMode(filterMode === 'enhanced' ? 'none' : 'enhanced')}
                  className={`text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition active:scale-95 cursor-pointer ${
                    filterMode === 'enhanced'
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-stone-800 hover:bg-stone-700 text-stone-200'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>تحسين الوضوح</span>
                </button>

                <button
                  onClick={() => setFilterMode(filterMode === 'grayscale' ? 'none' : 'grayscale')}
                  className={`text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition active:scale-95 cursor-pointer ${
                    filterMode === 'grayscale'
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-stone-800 hover:bg-stone-700 text-stone-200'
                  }`}
                >
                  <Sliders className="w-4 h-4 text-sky-400" />
                  <span>ماسح ضوئي (B&W)</span>
                </button>
              </div>

              {/* Action Buttons: Retake vs Confirm */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleRetake}
                  className="flex-1 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>إعادة الالتقاط</span>
                </button>

                <button
                  onClick={handleConfirm}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition shadow-md active:scale-95 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>تأكيد المستند</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
