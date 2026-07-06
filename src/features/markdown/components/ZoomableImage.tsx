import { RotateCw, X } from "lucide-react";
import type { ImgHTMLAttributes } from "react";
import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTrigger,
  Modal,
  ModalOverlay,
} from "react-aria-components";
import { cn } from "#/shared/lib/tailwind";

export function ZoomableImage({
  className,
  alt,
  ...attribs
}: ImgHTMLAttributes<HTMLImageElement>) {
  const [rotation, setRotation] = useState(0);
  const isRotated = rotation === 90;

  return (
    <DialogTrigger
      onOpenChange={(isOpen) => {
        if (!isOpen) setRotation(0);
      }}
    >
      <Button className="cursor-zoom-in outline-hidden">
        <img
          {...attribs}
          alt={alt}
          className={cn("transition-opacity hover:opacity-90", className)}
        />
      </Button>
      <ModalOverlay
        className={({ isEntering, isExiting }) =>
          cn(
            "fixed inset-0 isolate z-50 flex h-dvh w-full items-center justify-center bg-black/80 p-4 backdrop-blur-xs",
            isEntering && "fade-in animate-in duration-200 ease-out",
            isExiting && "fade-out animate-out duration-200 ease-in",
          )
        }
        isDismissable
      >
        <Modal
          className={({ isEntering, isExiting }) =>
            cn(
              "flex max-h-[90vh] max-w-[90vw] items-center justify-center outline-hidden",
              isEntering && "zoom-in-95 animate-in duration-200 ease-out",
              isExiting && "zoom-out-95 animate-out duration-200 ease-in",
            )
          }
        >
          <Dialog role="dialog" className="relative outline-hidden">
            {({ close }) => (
              <>
                <Button className="cursor-zoom-out" onPress={close}>
                  <img
                    {...attribs}
                    alt={alt}
                    className={cn(
                      "max-h-[90vh] max-w-[90vw] rounded-md object-contain transition-all duration-500",
                      isRotated && "max-h-[90vw] max-w-[90vh] rotate-90",
                    )}
                  />
                </Button>
                <div className="fixed top-4 right-4 z-1 flex gap-2 sm:absolute sm:-top-4 sm:-right-4">
                  <Button
                    onPress={close}
                    aria-label="닫기"
                    className="cursor-pointer rounded-full bg-black/80 p-2 text-white transition-colors hover:bg-black/60"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
                <Button
                  onPress={() => setRotation((prev) => (prev === 0 ? 90 : 0))}
                  aria-label="회전"
                  className="fixed bottom-4 left-1/2 z-1 -translate-x-1/2 cursor-pointer rounded-full bg-black/80 p-2 text-white transition-colors hover:bg-black/60 sm:hidden"
                >
                  <RotateCw className="size-4" />
                </Button>
              </>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}
