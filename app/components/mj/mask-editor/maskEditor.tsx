/*
Github: https://github.com/la-voliere/react-mask-editor
LICENSE: MIT
 */
import * as React from "react";
import "./maskEditor.scss";
import { hexToRgb } from "./utils";

export interface MaskEditorProps {
  src: string;
  canvasRef?: React.MutableRefObject<HTMLCanvasElement>;
  cursorSize?: number;
  onCursorSizeChange?: (size: number) => void;
  maskOpacity?: number;
  maskColor?: string;
  boxSize: { x: number; y: number };
  maskBlendMode?:
    | "normal"
    | "multiply"
    | "screen"
    | "overlay"
    | "darken"
    | "lighten"
    | "color-dodge"
    | "color-burn"
    | "hard-light"
    | "soft-light"
    | "difference"
    | "exclusion"
    | "hue"
    | "saturation"
    | "color"
    | "luminosity";
}

export const MaskEditorDefaults = {
  cursorSize: 10,
  maskOpacity: 0.75,
  maskColor: "#23272d",
  maskBlendMode: "normal",
};

export const MaskEditor: React.FC<MaskEditorProps> = (
  props: MaskEditorProps,
) => {
  const src = props.src;
  const cursorSize = props.cursorSize ?? MaskEditorDefaults.cursorSize;
  const maskColor = props.maskColor ?? MaskEditorDefaults.maskColor;
  const maskBlendMode = props.maskBlendMode ?? MaskEditorDefaults.maskBlendMode;
  const maskOpacity = props.maskOpacity ?? MaskEditorDefaults.maskOpacity;

  const canvas = React.useRef<HTMLCanvasElement | null>(null);
  const maskCanvas = React.useRef<HTMLCanvasElement | null>(null);
  const cursorCanvas = React.useRef<HTMLCanvasElement | null>(null);
  const [context, setContext] = React.useState<CanvasRenderingContext2D | null>(
    null,
  );
  const [maskContext, setMaskContext] =
    React.useState<CanvasRenderingContext2D | null>(null);
  const [cursorContext, setCursorContext] =
    React.useState<CanvasRenderingContext2D | null>(null);
  const [size, setSize] = React.useState<{ x: number; y: number }>({
    x: 256,
    y: 256,
  });

  React.useLayoutEffect(() => {
    if (canvas.current && !context) {
      const ctx = (canvas.current as HTMLCanvasElement).getContext("2d");
      setContext(ctx);
    }
  }, [canvas]);

  React.useLayoutEffect(() => {
    if (maskCanvas.current && !context) {
      const ctx = (maskCanvas.current as HTMLCanvasElement).getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, props.boxSize.x, props.boxSize.y);
      }
      setMaskContext(ctx);
    }
  }, [maskCanvas]);

  React.useLayoutEffect(() => {
    if (cursorCanvas.current && !context) {
      const ctx = (cursorCanvas.current as HTMLCanvasElement).getContext("2d");
      setCursorContext(ctx);
    }
  }, [cursorCanvas]);

  const [image, setImage] = React.useState<HTMLImageElement>();
  React.useEffect(() => {
    const img = new Image();
    img.onload = (evt) => {
      const canvasWidth = props.boxSize.x;
      const canvasHeight = props.boxSize.y;

      const imgWidth = img.width;
      const imgHeight = img.height;

      // 计算比例，使图片填满canvas，而不是挤压变形。
      const ratio = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);

      // 求出图片放大后必须裁剪的起点位置（为了居中）。
      const newWidth = imgWidth * ratio;
      const newHeight = imgHeight * ratio;
      const x = (canvasWidth - newWidth) / 2;
      const y = (canvasHeight - newHeight) / 2;
      setSize({ x: img.width, y: img.height });
      context?.drawImage(img, x, y, newWidth, newHeight);
    };
    img.src = src;
    setImage(img);
  }, [src]);

  React.useEffect(() => {
    if (!image) return;
    const canvasWidth = props.boxSize.x;
    const canvasHeight = props.boxSize.y;

    const imgWidth = image.width;
    const imgHeight = image.height;

    // 计算比例，使图片填满canvas，而不是挤压变形。
    const ratio = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);

    // 新计算的图片尺寸
    const newWidth = imgWidth * ratio;
    const newHeight = imgHeight * ratio;

    // 求出图片放大后需要进行的裁剪区域
    const srcX = (newWidth - canvasWidth) / 2 / ratio;
    const srcY = (newHeight - canvasHeight) / 2 / ratio;
    const srcWidth = canvasWidth / ratio;
    const srcHeight = canvasHeight / ratio;

    // 将源图片裁剪部分绘制到Canvas
    context?.drawImage(
      image,
      srcX,
      srcY,
      srcWidth,
      srcHeight,
      0,
      0,
      canvasWidth,
      canvasHeight,
    );
  }, [size, image]);

  // Pass mask canvas up
  React.useLayoutEffect(() => {
    if (props.canvasRef && maskCanvas.current) {
      props.canvasRef.current = maskCanvas.current;
    }
  }, [maskCanvas]);

  React.useEffect(() => {
    const listener = (evt: MouseEvent) => {
      if (cursorContext) {
        cursorContext.clearRect(0, 0, size.x, size.y);

        cursorContext.beginPath();
        cursorContext.fillStyle = `${maskColor}88`;
        cursorContext.strokeStyle = maskColor;
        cursorContext.arc(evt.offsetX, evt.offsetY, cursorSize, 0, 360);
        cursorContext.fill();
        cursorContext.stroke();
      }
      if (maskContext && evt.buttons > 0) {
        maskContext.beginPath();
        maskContext.fillStyle =
          evt.buttons > 1 || evt.shiftKey ? "#ffffff" : maskColor;
        maskContext.arc(evt.offsetX, evt.offsetY, cursorSize, 0, 360);
        maskContext.fill();
      }
    };
    const scrollListener = (evt: WheelEvent) => {
      if (cursorContext) {
        props.onCursorSizeChange?.(
          Math.max(0, cursorSize + (evt.deltaY > 0 ? 1 : -1)),
        );

        cursorContext.clearRect(0, 0, size.x, size.y);

        cursorContext.beginPath();
        cursorContext.fillStyle = `${maskColor}88`;
        cursorContext.strokeStyle = maskColor;
        cursorContext.arc(evt.offsetX, evt.offsetY, cursorSize, 0, 360);
        cursorContext.fill();
        cursorContext.stroke();

        evt.stopPropagation();
        evt.preventDefault();
      }
    };

    cursorCanvas.current?.addEventListener("mousemove", listener);
    if (props.onCursorSizeChange) {
      cursorCanvas.current?.addEventListener("wheel", scrollListener);
    }
    return () => {
      cursorCanvas.current?.removeEventListener("mousemove", listener);
      if (props.onCursorSizeChange) {
        cursorCanvas.current?.removeEventListener("wheel", scrollListener);
      }
    };
  }, [cursorContext, maskContext, cursorCanvas, cursorSize, maskColor, size]);

  const replaceMaskColor = React.useCallback(
    (hexColor: string, invert: boolean) => {
      const imageData = maskContext?.getImageData(0, 0, size.x, size.y);
      const color = hexToRgb(hexColor);
      if (imageData) {
        for (var i = 0; i < imageData?.data.length; i += 4) {
          const pixelColor =
            (imageData.data[i] === 255) != invert ? [255, 255, 255] : color;
          if (pixelColor) {
            imageData.data[i] = pixelColor[0];
            imageData.data[i + 1] = pixelColor[1];
            imageData.data[i + 2] = pixelColor[2];
          }
          imageData.data[i + 3] = imageData.data[i + 3];
        }
        maskContext?.putImageData(imageData, 0, 0);
      }
    },
    [maskContext],
  );
  React.useEffect(() => replaceMaskColor(maskColor, false), [maskColor]);

  const useSize = props.boxSize ? props.boxSize : size;

  return (
    <div className="react-mask-editor-outer">
      <div
        className="react-mask-editor-inner"
        style={{
          width: useSize.x,
          height: useSize.y,
        }}
      >
        <canvas
          ref={canvas}
          style={{
            width: useSize.x,
            height: useSize.y,
          }}
          width={useSize.x}
          height={useSize.y}
          className="react-mask-editor-base-canvas"
        />
        <canvas
          ref={maskCanvas}
          width={useSize.x}
          height={useSize.y}
          style={{
            width: useSize.x,
            height: useSize.y,
            opacity: maskOpacity,
            mixBlendMode: maskBlendMode as any,
          }}
          className="react-mask-editor-mask-canvas"
        />
        <canvas
          ref={cursorCanvas}
          width={useSize.x}
          height={useSize.y}
          style={{
            width: useSize.x,
            height: useSize.y,
          }}
          className="react-mask-editor-cursor-canvas"
        />
      </div>
    </div>
  );
};
