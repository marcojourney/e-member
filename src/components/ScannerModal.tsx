import React, { useState, useEffect, useRef } from 'react';
import jsQR from 'jsqr';
import { POS_DEMO_PRESETS } from '../utils/posReceiptParser';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanResult: (code: string, merchantName?: string) => void;
  onOpenPosScreen?: () => void;
  title?: string;
  description?: string;
}

export const ScannerModal: React.FC<ScannerModalProps> = ({
  isOpen,
  onClose,
  onScanResult,
  onOpenPosScreen,
  title = 'Scan POS QR for Receipt',
  description = 'Point your camera at the QR code on the POS checkout screen to view & save your digital receipt.',
}) => {
  const [flashlight, setFlashlight] = useState(false);
  const [cameraState, setCameraState] = useState<
    'idle' | 'starting' | 'active' | 'denied' | 'unsupported'
  >('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const hasScannedRef = useRef<boolean>(false);

  const handleDetectedCode = (code: string, merchantHint?: string) => {
    if (hasScannedRef.current || !code.trim()) return;
    hasScannedRef.current = true;
    if (navigator.vibrate) {
      navigator.vibrate(60);
    }
    onScanResult(code.trim(), merchantHint);
  };

  // Initialize Camera Stream
  const startCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraState('unsupported');
      setErrorMessage('Camera access is not supported by this browser. Upload a QR image or test a POS terminal below.');
      return;
    }

    try {
      setCameraState('starting');
      setErrorMessage(null);

      // Stop any existing tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      // Constraints optimized for iOS Safari and mobile browsers (back/rear camera)
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.setAttribute('webkit-playsinline', 'true');
        try {
          await videoRef.current.play();
        } catch (e) {
          console.warn('Video play error:', e);
        }
      }

      setCameraState('active');
      startQrDetectionLoop();
    } catch (err: unknown) {
      console.error('Camera access failed:', err);
      setCameraState('denied');
      const error = err as Error;
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setErrorMessage(
          'Camera permission was denied. Allow camera access in browser settings, or upload a POS QR image below.'
        );
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        setErrorMessage('No camera hardware found on this device. You can still upload a POS QR image or test a POS screen below.');
      } else {
        setErrorMessage('Unable to access camera: ' + (error.message || 'Check browser permissions.'));
      }
    }
  };

  // Real-time QR & Barcode detection loop (BarcodeDetector + jsQR fallback)
  const startQrDetectionLoop = () => {
    const BarcodeDetectorClass = (
      window as unknown as {
        BarcodeDetector?: new (options?: { formats: string[] }) => {
          detect: (source: ImageBitmapSource) => Promise<Array<{ rawValue: string }>>;
        };
      }
    ).BarcodeDetector;

    let barcodeDetector: { detect: (source: ImageBitmapSource) => Promise<Array<{ rawValue: string }>> } | null = null;
    if (BarcodeDetectorClass) {
      try {
        barcodeDetector = new BarcodeDetectorClass({
          formats: ['qr_code', 'code_128', 'ean_13', 'ean_8', 'upc_a'],
        });
      } catch {
        barcodeDetector = null;
      }
    }

    let lastJsQrCheck = 0;

    const detectFrame = async (timestamp: number) => {
      if (hasScannedRef.current) return;

      const video = videoRef.current;
      if (!video || video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
        animationFrameRef.current = requestAnimationFrame(detectFrame);
        return;
      }

      // 1. Try native BarcodeDetector first if supported
      if (barcodeDetector) {
        try {
          const barcodes = await barcodeDetector.detect(video);
          if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
            handleDetectedCode(barcodes[0].rawValue, 'POS QR Terminal');
            return;
          }
        } catch {
          // Fall through to jsQR
        }
      }

      // 2. Universal jsQR canvas scan fallback (~8 checks/sec to keep UI smooth)
      if (timestamp - lastJsQrCheck > 120) {
        lastJsQrCheck = timestamp;
        const canvas = canvasRef.current;
        if (canvas) {
          const maxDim = 640;
          const scale = Math.min(1, maxDim / Math.max(video.videoWidth, video.videoHeight));
          const w = Math.floor(video.videoWidth * scale);
          const h = Math.floor(video.videoHeight * scale);
          if (w > 0 && h > 0) {
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            if (ctx) {
              ctx.drawImage(video, 0, 0, w, h);
              const imageData = ctx.getImageData(0, 0, w, h);
              const qrResult = jsQR(imageData.data, w, h, {
                inversionAttempts: 'attemptBoth',
              });
              if (qrResult?.data) {
                handleDetectedCode(qrResult.data, 'POS QR Terminal');
                return;
              }
            }
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(detectFrame);
    };

    animationFrameRef.current = requestAnimationFrame(detectFrame);
  };

  // Scan QR from an uploaded image/screenshot of a POS screen
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 1024;
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        canvas.width = Math.max(1, Math.floor(img.width * scale));
        canvas.height = Math.max(1, Math.floor(img.height * scale));
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const qrResult = jsQR(imageData.data, canvas.width, canvas.height, {
          inversionAttempts: 'attemptBoth',
        });

        if (qrResult?.data) {
          handleDetectedCode(qrResult.data, 'POS QR Image');
        } else {
          setUploadError('No QR code found in that image. Try cropping closer to the POS QR.');
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
    // Reset input so same file can be picked again
    e.target.value = '';
  };

  // Toggle Torch / Flashlight
  const toggleFlashlight = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (!track) return;

    try {
      const newFlashState = !flashlight;
      const trackWithTorch = track as MediaStreamTrack & {
        applyConstraints: (constraints: { advanced?: Array<{ torch?: boolean }> }) => Promise<void>;
      };

      if (trackWithTorch.applyConstraints) {
        await trackWithTorch.applyConstraints({
          advanced: [{ torch: newFlashState }],
        });
        setFlashlight(newFlashState);
      }
    } catch {
      setFlashlight(!flashlight);
    }
  };

  // Clean up on open/close
  useEffect(() => {
    if (isOpen) {
      hasScannedRef.current = false;
      setUploadError(null);
      startCamera();
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      setCameraState('idle');
      setFlashlight(false);
      setErrorMessage(null);
      setUploadError(null);
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between items-center text-white p-4 backdrop-blur-md animate-fadeIn overflow-y-auto no-scrollbar">
      {/* Offscreen canvas for jsQR detection */}
      <canvas ref={canvasRef} className="hidden" />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Top Bar */}
      <div className="w-full max-w-md flex items-center justify-between pt-2">
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          type="button"
          aria-label="Close scanner"
        >
          <span className="material-symbols-outlined text-[24px]">close</span>
        </button>

        <span className="text-sm font-semibold tracking-wide uppercase text-primary-fixed">
          {title}
        </span>

        <button
          onClick={toggleFlashlight}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
            flashlight ? 'bg-primary text-white' : 'bg-white/10 text-white hover:bg-white/20'
          }`}
          type="button"
          aria-label="Toggle flashlight"
        >
          <span className="material-symbols-outlined text-[20px]">
            {flashlight ? 'flashlight_on' : 'flashlight_off'}
          </span>
        </button>
      </div>

      {/* Viewfinder Area */}
      <div className="relative w-72 h-72 border-2 border-primary/60 rounded-3xl overflow-hidden flex items-center justify-center shadow-[0_0_50px_rgba(0,104,95,0.35)] bg-black/60 my-3 shrink-0">
        {/* Live Camera Video Feed */}
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            cameraState === 'active' ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        />

        {/* Reticle corner markers (Primary Accent) */}
        <div className="absolute top-3 left-3 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-lg z-10"></div>
        <div className="absolute top-3 right-3 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-lg z-10"></div>
        <div className="absolute bottom-3 left-3 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-lg z-10"></div>
        <div className="absolute bottom-3 right-3 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-lg z-10"></div>

        {/* Animated Laser Scanning Ray */}
        <div className="absolute inset-x-4 h-1 bg-gradient-to-r from-transparent via-primary-fixed to-transparent opacity-90 animate-[pulse_1.5s_infinite] z-10"></div>

        {/* Status / Fallback Overlay */}
        {cameraState === 'starting' && (
          <div className="relative z-10 text-center px-4 flex flex-col items-center">
            <span className="w-8 h-8 rounded-full border-2 border-primary-fixed border-t-transparent animate-spin mb-2"></span>
            <p className="text-xs text-slate-300">Opening camera feed...</p>
          </div>
        )}

        {(cameraState === 'denied' || cameraState === 'unsupported') && (
          <div className="relative z-10 text-center p-4 flex flex-col items-center">
            <span className="material-symbols-outlined text-[32px] text-amber-400 mb-1">
              no_photography
            </span>
            <p className="text-xs text-amber-200 font-semibold">
              {cameraState === 'unsupported' ? 'Camera Unavailable' : 'Camera Access Restricted'}
            </p>
            <div className="mt-3 flex items-center gap-2">
              {cameraState === 'denied' && (
                <button
                  onClick={startCamera}
                  className="px-3 py-1.5 rounded-lg bg-primary text-white text-[11px] font-bold shadow-md hover:bg-primary-container"
                  type="button"
                >
                  Retry Camera
                </button>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-[11px] font-bold"
                type="button"
              >
                Upload QR Image
              </button>
            </div>
          </div>
        )}

        {cameraState === 'active' && (
          <div className="absolute bottom-3 inset-x-0 text-center z-10 pointer-events-none">
            <span className="px-2.5 py-0.5 rounded-full bg-black/65 backdrop-blur-md text-[10px] text-primary-fixed font-semibold tracking-wide uppercase">
              Align POS QR Code Here
            </span>
          </div>
        )}
      </div>

      {/* Camera / Upload Notice */}
      {(errorMessage || uploadError) && (
        <div className="w-full max-w-sm bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 my-1.5 text-left">
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-[18px] text-amber-400 shrink-0 mt-0.5">
              info
            </span>
            <p className="text-[11px] text-amber-100 leading-relaxed">
              {uploadError || errorMessage}
            </p>
          </div>
        </div>
      )}

      {/* Action Controls & Quick POS Receipt Scan */}
      <div className="w-full max-w-sm flex flex-col gap-2.5 pb-6">
        <p className="text-center text-xs text-slate-400">{description}</p>

        {/* Upload QR Photo + Open Live POS Screen Display */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[17px] text-primary-fixed">
              add_photo_alternate
            </span>
            <span>Scan QR Image</span>
          </button>
          {onOpenPosScreen && (
            <button
              onClick={onOpenPosScreen}
              className="py-2.5 px-3 rounded-xl bg-primary/25 hover:bg-primary/40 border border-primary/50 text-primary-fixed font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-[17px]">point_of_sale</span>
              <span>POS Screen QR</span>
            </button>
          )}
        </div>

        <div className="bg-slate-900/85 border border-slate-800 p-3 rounded-2xl flex flex-col gap-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center">
            Quick Test: Scan POS Receipt QR
          </span>
          <div className="grid grid-cols-2 gap-2">
            {POS_DEMO_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleDetectedCode(preset.qrPayload, preset.merchantName)}
                className="py-2.5 px-3 rounded-xl bg-surface-container text-primary font-medium text-xs hover:bg-primary hover:text-white transition-all text-left flex items-center gap-2"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px] shrink-0">
                  {preset.iconName}
                </span>
                <span className="truncate">{preset.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
