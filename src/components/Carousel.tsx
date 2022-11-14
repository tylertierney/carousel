import {
  MdOutlineArrowBackIosNew,
  MdOutlineArrowForwardIos,
} from "react-icons/md";
import {
  DetailedHTMLProps,
  FC,
  HTMLAttributes,
  ReactNode,
  useEffect,
  useState,
} from "react";
import React from "react";

export interface ICarouselProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children: ReactNode[];
}

export const Carousel: FC<ICarouselProps> = (props) => {
  const { children, style } = props;

  const width = document.body.getBoundingClientRect().width;
  const [screenWidth, setScreenWidth] = useState(width);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    const callback = () => {
      const width = document.body.getBoundingClientRect().width;
      setScreenWidth(width);
    };

    window.addEventListener("resize", callback);

    return () => window.removeEventListener("resize", callback);
  }, []);

  if (!children) return null;

  let numberToDisplay = 3;
  if (screenWidth < 700) numberToDisplay = 2;
  if (screenWidth < 480) numberToDisplay = 1;

  return (
    <div style={style} {...props}>
      <div className="controller" style={{ display: "flex", width: "100%" }}>
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
                className="reviewContainer"
                style={{
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
        <div className="arrowContainer">
          <MdOutlineArrowForwardIos
            cursor="pointer"
            onClick={() => {
              console.log(carouselIndex);
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
        className="dotsContainer"
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
                className={`dot ${
                  idx * numberToDisplay > carouselIndex - numberToDisplay &&
                  idx * numberToDisplay < carouselIndex + numberToDisplay &&
                  "active"
                }`}
                style={{
                  height: "12px",
                  width: "12px",
                  borderRadius: "100%",
                  backgroundColor: "black",
                  opacity:
                    idx * numberToDisplay > carouselIndex - numberToDisplay &&
                    idx * numberToDisplay < carouselIndex + numberToDisplay
                      ? 0.6
                      : 0.3,
                }}
              ></div>
            );
          })}
      </div>
    </div>
  );
};
