import {
  MdOutlineArrowBackIosNew,
  MdOutlineArrowForwardIos,
} from "react-icons/md";
import React, {
  DetailedHTMLProps,
  FC,
  HTMLAttributes,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

const defaultBreakpoints: ICarouselProps["breakpoints"] = [
  [480, 2],
  [768, 3],
  [1024, 4],
  [1201, 5],
];

const getNumberToDisplay = (
  breakpoints: [number, number][],
  detectedWidth: number
): number => {
  let result = 1;
  for (const [width, num] of breakpoints) {
    if (detectedWidth >= width) result = num;
  }
  return result;
};

export interface ICarouselProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children: ReactNode[];
  breakpoints?: [number, number][];
  navigator?: ReactNode;
  navigatorActive?: ReactNode;
}

export const Carousel: FC<ICarouselProps> = ({
  children,
  style,
  breakpoints = defaultBreakpoints,
  navigator,
  navigatorActive,
  ...props
}) => {
  // const { children, style, breakpoints } = props;

  const [trackWidth, setTrackWidth] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselRef = useRef(null);

  useLayoutEffect(() => {
    if (carouselRef.current) {
      const detectedWidth = parseInt(
        window.getComputedStyle(carouselRef.current).width,
        10
      );
      setTrackWidth(detectedWidth);
    }
  }, []);

  useEffect(() => {
    const callback = () => {
      if (carouselRef.current) {
        const detectedWidth = parseInt(
          window.getComputedStyle(carouselRef.current).width,
          10
        );
        setTrackWidth(detectedWidth);
      }
    };
    window.addEventListener("resize", callback);
    return () => window.removeEventListener("resize", callback);
  }, [carouselRef, breakpoints]);

  if (!children) return null;

  const numberToDisplay = getNumberToDisplay(breakpoints, trackWidth);

  const getNavigatorElement = (
    idx: number,
    numberToDisplay: number
  ): ReactNode => {
    let active = false;
    if (
      idx * numberToDisplay > carouselIndex - numberToDisplay &&
      idx * numberToDisplay < carouselIndex + numberToDisplay
    )
      active = true;

    if (!navigator)
      return (
        <div
          style={{
            height: "12px",
            width: "12px",
            borderRadius: "100%",
            backgroundColor: "black",
            opacity: active ? 0.6 : 0.3,
          }}
        ></div>
      );

    if (navigatorActive && active) return navigatorActive;
    return navigator;
  };

  return (
    <div style={style} {...props} ref={carouselRef}>
      <div
        className="controller"
        style={{ display: "flex", width: "100%", position: "relative" }}
      >
        <div
          className="arrowContainer"
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: "1.5rem",
            padding: "1rem",
          }}
        >
          <MdOutlineArrowBackIosNew
            cursor="pointer"
            onClick={() =>
              setCarouselIndex((prev) => {
                return prev <= 0
                  ? children.length - numberToDisplay
                  : prev - numberToDisplay;
              })
            }
          />
        </div>
        <div className="track" style={{ display: "flex", overflow: "hidden" }}>
          {children.map((child: ReactNode, idx: number) => {
            return (
              <div
                key={idx}
                className="carouselItem"
                style={{
                  transition: "0.5s ease-in-out",
                  display: "flex",
                  translate:
                    -1 *
                      (carouselIndex / numberToDisplay) *
                      (numberToDisplay * 100) +
                    "%",
                  minWidth: 100 / numberToDisplay + "%",
                  maxWidth: 100 / numberToDisplay + "%",
                }}
              >
                {child}
              </div>
            );
          })}
        </div>
        <div
          className="arrowContainer"
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: "1.5rem",
            padding: "1rem",
          }}
        >
          <MdOutlineArrowForwardIos
            cursor="pointer"
            onClick={() => {
              setCarouselIndex((prev) =>
                prev + numberToDisplay >= children.length
                  ? 0
                  : prev + numberToDisplay
              );
            }}
          />
        </div>
      </div>
      <div
        className="navigation"
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "0.6rem",
          padding: "1.6rem 0",
        }}
      >
        {new Array(Math.ceil(children.length / numberToDisplay))
          .fill(null)
          .map((x, idx) => {
            return (
              <div
                key={idx}
                style={{ cursor: "pointer" }}
                onClick={() => setCarouselIndex(idx * numberToDisplay)}
              >
                {getNavigatorElement(idx, numberToDisplay)}
              </div>
            );
          })}
      </div>
    </div>
  );
};
