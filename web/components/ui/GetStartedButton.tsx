'use client'

import React from 'react';
import styled from 'styled-components';
import { useTheme } from 'next-themes';

interface GetStartedButtonProps {
  onClick: () => void;
}

export const GetStartedButton: React.FC<GetStartedButtonProps> = ({ onClick }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <StyledWrapper $isDark={isDark}>
      <div>
        <div className="area">
          <div className="bg">
            <div className="light-1" />
            <div className="light-2" />
            <div className="light-3" />
          </div>
          <label className="area-wrapper">
            <div className="wrapper">
              <input defaultChecked type="checkbox" onChange={() => {}} />
              <button className="button" onClick={onClick} type="button">
                <div className="part-1">
                  <div className="case">
                    <div className="mask" />
                    <div className="line" />
                  </div>
                  <div className="screw">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 115 126" height={126} width={115}>
                      <g style={{'--i': 1} as React.CSSProperties} className="g-1">
                        <path strokeLinejoin="round" strokeLinecap="round" strokeMiterlimit={10} strokeWidth={2} stroke="#262626" fill="url(#paint_linear_steel)" d="M91.4371 119V7C91.4371 3.686 94.1231 1 97.4371 1H107.617C110.931 1 113.617 3.686 113.617 7V119C113.617 122.314 110.931 125 107.617 125H97.4371C94.1231 125 91.4371 122.314 91.4371 119Z" />
                        <path fillOpacity="0.4" fill="#262626" d="M94 6C94 3.79086 95.7909 2 98 2H109C111.209 2 113 3.79086 113 6V88.2727C113 89.2267 112.227 90 111.273 90C101.733 90 94 82.2667 94 72.7273V6Z" />
                        <path fill="currentColor" d="M98.0101 11.589C98.0101 9.57 99.6461 7.93402 101.665 7.93402H105.027C107.046 7.93402 108.682 9.57 108.682 11.589C108.682 13.608 107.046 15.244 105.027 15.244H101.665C99.6461 15.244 98.0101 13.607 98.0101 11.589Z" style={{'--i': 1} as React.CSSProperties} className="dot" />
                      </g>
                      <g style={{'--i': 2} as React.CSSProperties} className="g-2">
                        <path strokeLinejoin="round" strokeLinecap="round" strokeMiterlimit={10} strokeWidth={2} stroke="#262626" fill="url(#paint_linear_steel)" d="M69.256 119V7C69.256 3.686 71.942 1 75.256 1H85.436C88.75 1 91.436 3.686 91.436 7V119C91.436 122.314 88.75 125 85.436 125H75.256C71.943 125 69.256 122.314 69.256 119Z" />
                        <path fillOpacity="0.4" fill="#262626" d="M72 6C72 3.79086 73.7909 2 76 2H87C89.2091 2 91 3.79086 91 6V88.2727C91 89.2267 90.2267 90 89.2727 90C79.7333 90 72 82.2667 72 72.7273V6Z" />
                        <path fill="currentColor" d="M76.011 11.589C76.011 9.57 77.647 7.93402 79.666 7.93402H83.028C85.047 7.93402 86.683 9.57 86.683 11.589C86.683 13.608 85.047 15.244 83.028 15.244H79.666C77.647 15.244 76.011 13.607 76.011 11.589Z" style={{'--i': 2} as React.CSSProperties} className="dot" />
                      </g>
                      <g style={{'--i': 3} as React.CSSProperties} className="g-3">
                        <path strokeLinejoin="round" strokeLinecap="round" strokeMiterlimit={10} strokeWidth={2} stroke="#262626" fill="url(#paint_linear_steel)" d="M47.076 119V7C47.076 3.686 49.762 1 53.076 1H63.256C66.57 1 69.256 3.686 69.256 7V119C69.256 122.314 66.57 125 63.256 125H53.076C49.762 125 47.076 122.314 47.076 119Z" />
                        <path fillOpacity="0.4" fill="#262626" d="M50 6C50 3.79086 51.7909 2 54 2H65C67.2091 2 69 3.79086 69 6V86.9664C69 88.6418 67.6418 90 65.9664 90C57.1484 90 50 82.8516 50 74.0336V6Z" />
                        <path fill="currentColor" d="M54.012 11.589C54.012 9.57 55.648 7.93396 57.667 7.93396H61.029C63.048 7.93396 64.684 9.57 64.684 11.589C64.684 13.608 63.048 15.244 61.029 15.244H57.667C55.648 15.244 54.012 13.607 54.012 11.589Z" style={{'--i': 3} as React.CSSProperties} className="dot" />
                      </g>
                      <g style={{'--i': 4} as React.CSSProperties} className="g-4">
                        <path strokeLinejoin="round" strokeLinecap="round" strokeMiterlimit={10} strokeWidth={2} stroke="#262626" fill="url(#paint_linear_steel)" d="M23.617 98.853V27.147C23.617 21.501 27.11 16.262 32.838 13.318L47.076 6V120L32.838 112.682C27.111 109.738 23.617 104.499 23.617 98.853Z" />
                        <path fillOpacity="0.4" fill="#262626" d="M29.5 18.4083C29.5 16.9267 30.319 15.5664 31.6284 14.8732L46.5 7V78.2374C46.5 80.0393 45.0393 81.5 43.2374 81.5V81.5C35.6504 81.5 29.5 75.3496 29.5 67.7626V18.4083Z" />
                      </g>
                      <g style={{'--i': 5} as React.CSSProperties} className="g-5">
                        <path strokeLinejoin="round" strokeLinecap="round" strokeMiterlimit={10} strokeWidth={2} stroke="#262626" fill="url(#paint_linear_steel)" d="M1.00006 76.162V49.838C1.00006 43.314 4.91107 37.235 11.3891 33.691L23.6171 27V99L11.3881 92.309C4.91106 88.765 1.00006 82.686 1.00006 76.162Z" />
                        <path fillOpacity="0.4" fill="#262626" d="M7.30432 51.7375C7.12191 41.7049 13.279 32.6454 22.6744 29.1221L23 29L23 73.5885C23 74.368 22.368 75 21.5884 75C13.8927 75 7.61519 68.8356 7.47529 61.1412L7.30432 51.7375Z" />
                      </g>
                      <defs>
                        <linearGradient gradientUnits="userSpaceOnUse" y2={125} x2="105.425" y1={1} x1="105.425" id="paint_linear_steel">
                          <stop stopColor="#7A7A7A" offset="0.100962" />
                          <stop stopColor="#EEEEEE" offset="0.3125" />
                          <stop stopColor="#787878" offset="0.596154" />
                          <stop stopColor="#666666" offset="0.798077" />
                          <stop stopColor="#9E9E9E" offset={1} />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
                <div className="part-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 190 76" height={76} width={190} className="path-glass">
                    <path stroke="currentColor" d="M0 0.5C0 0.5 149 0.5 156.5 0.5C164 0.5 189 8.5 189 37.5C189 66.5 164 75.5 157.5 75.5C151 75.5 1 75.5 1 75.5" />
                  </svg>
                  <div className="glass">
                    <div className="glass-reflex" />
                    <svg viewBox="0 0 700 700" xmlns="http://www.w3.org/2000/svg" className="glass-noise">
                      <defs>
                        <filter colorInterpolationFilters="linearRGB" primitiveUnits="userSpaceOnUse" filterUnits="objectBoundingBox" height="140%" width="140%" y="-20%" x="-20%" id="noise-filter">
                          <feTurbulence result="turbulence" height="100%" width="100%" y="0%" x="0%" stitchTiles="stitch" seed={15} numOctaves={4} baseFrequency="0.05" type="fractalNoise" />
                          <feSpecularLighting result="specularLighting" in="turbulence" height="100%" width="100%" y="0%" x="0%" lightingColor="#ffffff" specularExponent={20} specularConstant={3} surfaceScale={40}>
                            <feDistantLight elevation={69} azimuth={3} />
                          </feSpecularLighting>
                        </filter>
                      </defs>
                      <rect fill="transparent" height={700} width={700} />
                      <rect filter="url(#noise-filter)" fill="#ffffff" height={700} width={700} />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 49 52" height={52} width={49} className="filament">
                      <path stroke="#ffc4af" d="M32.5 26.1085C32.5 26.1085 32 5.90019 38.5 2.10852C45 -1.68315 49 5.10852 47.5 9.60852C46 14.1085 39.5 17.1085 21 18.1085C13.667 18.5049 6.49118 18.0371 0.5 17.328" />
                      <path stroke="#ffc4af" d="M32.5 26C32.5 26 32 46.2083 38.5 50C45 53.7917 49 47 47.5 42.5C46 38 39.5 35 21 34C13.667 33.6036 6.49118 34.0714 0.5 34.7805" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 49 52" height={52} width={49} className="filament filament-on">
                      <path stroke="white" d="M32.5 26.1085C32.5 26.1085 32 5.90019 38.5 2.10852C45 -1.68315 49 5.10852 47.5 9.60852C46 14.1085 39.5 17.1085 21 18.1085C13.667 18.5049 6.49118 18.0371 0.5 17.328" />
                      <path stroke="white" d="M32.5 26C32.5 26 32 46.2083 38.5 50C45 53.7917 49 47 47.5 42.5C46 38 39.5 35 21 34C13.667 33.6036 6.49118 34.0714 0.5 34.7805" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 49 52" height={52} width={49} className="filament filament-blur filament-on">
                      <path stroke="currentColor" d="M32.5 26.1085C32.5 26.1085 32 5.90019 38.5 2.10852C45 -1.68315 49 5.10852 47.5 9.60852C46 14.1085 39.5 17.1085 21 18.1085C13.667 18.5049 6.49118 18.0371 0.5 17.328" />
                      <path stroke="currentColor" d="M32.5 26C32.5 26 32 46.2083 38.5 50C45 53.7917 49 47 47.5 42.5C46 38 39.5 35 21 34C13.667 33.6036 6.49118 34.0714 0.5 34.7805" />
                    </svg>
                    <span className="content">
                      <span className="text state-1">
                        <span data-label="S" style={{'--i': 1} as React.CSSProperties}>S</span>
                        <span data-label="i" style={{'--i': 2} as React.CSSProperties}>i</span>
                        <span data-label="g" style={{'--i': 3} as React.CSSProperties}>g</span>
                        <span data-label="n" style={{'--i': 4} as React.CSSProperties}>n</span>
                        <span data-label="u" style={{'--i': 5} as React.CSSProperties}>u</span>
                        <span data-label="p" style={{'--i': 6} as React.CSSProperties}>p</span>
                        <span data-label="/" style={{'--i': 7} as React.CSSProperties}>/</span>
                        <span data-label="L" style={{'--i': 8} as React.CSSProperties}>L</span>
                        <span data-label="o" style={{'--i': 9} as React.CSSProperties}>o</span>
                        <span data-label="g" style={{'--i': 10} as React.CSSProperties}>g</span>
                        <span data-label="i" style={{'--i': 11} as React.CSSProperties}>i</span>
                        <span data-label="n" style={{'--i': 12} as React.CSSProperties}>n</span>
                      </span>
                      <span className="text state-2">
                        <span data-label="J" style={{'--i': 1} as React.CSSProperties}>J</span>
                        <span data-label="o" style={{'--i': 2} as React.CSSProperties}>o</span>
                        <span data-label="i" style={{'--i': 3} as React.CSSProperties}>i</span>
                        <span data-label="n" style={{'--i': 4} as React.CSSProperties}>n</span>
                        <span data-label="N" style={{'--i': 5} as React.CSSProperties}>N</span>
                        <span data-label="o" style={{'--i': 6} as React.CSSProperties}>o</span>
                        <span data-label="w" style={{'--i': 7} as React.CSSProperties}>w</span>
                        <span data-label="!" style={{'--i': 8} as React.CSSProperties}>!</span>
                      </span>
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </label>
        </div>
        <div className="noise">
          <svg height="100%" width="100%">
            <defs>
              <pattern height={500} width={500} patternUnits="userSpaceOnUse" id="noise-pattern">
                <filter y={0} x={0} id="noise">
                  <feTurbulence stitchTiles="stitch" numOctaves={3} baseFrequency="0.65" type="fractalNoise" />
                  <feBlend mode="screen" />
                </filter>
                <rect filter="url(#noise)" height={500} width={500} />
              </pattern>
            </defs>
            <rect fill="url(#noise-pattern)" height="100%" width="100%" />
          </svg>
        </div>
      </div>
    </StyledWrapper>
  );
}

interface StyledWrapperProps {
  $isDark: boolean;
}

const StyledWrapper = styled.div<StyledWrapperProps>`
  .area {
    --ease-elastic: cubic-bezier(0.5, 2, 0.3, 0.8);
    --ease-elastic-2: cubic-bezier(0.5, -1, 0.3, 0.8);
    --primary: ${props => props.$isDark ? '#ff8800' : '#ea580c'};
    --primary-light: ${props => props.$isDark ? '#ffa500' : '#f97316'};
    --text-color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(15, 23, 42, 0.95)'};
    --text-hover-color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 1)'};
    --bg-shadow: ${props => props.$isDark ? '#111' : 'rgba(0, 0, 0, 0.15)'};
    --rounded-max: 100px;
    --rounded-min: 10px;
    --h: 40px;

    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transform: scale(0.72);
    transform-origin: center;

    .area-wrapper {
      position: relative;
      padding: 8px 4px;
      cursor: pointer;

      &:hover .wrapper {
        transform: translateY(0) scale(1);

        .case .mask {
          box-shadow:
            inset 8px -15px 15px -10px ${props => props.$isDark ? 'black' : 'rgba(0,0,0,0.3)'},
            inset 10px -17px 12px -12px white,
            0 20px 50px -5px var(--bg-shadow);
        }

        .part-2 .glass {
          box-shadow:
            inset 0 0 7px -4px white,
            inset 0 -10px 10px -8px rgba(255, 255, 255, 0.4),
            inset 8px -15px 15px -10px ${props => props.$isDark ? 'black' : 'rgba(0,0,0,0.3)'},
            inset 8px -10px 12px -12px white,
            0 20px 50px -5px var(--bg-shadow);
        }
      }
    }

    svg {
      overflow: visible;
    }
  }

  .wrapper {
    display: block;
    border-radius: 100px;
    position: relative;
    z-index: 2;
    transition: all 0.6s var(--ease-elastic);
    transform: translateY(-6px) scale(1.02);

    input {
      position: absolute;
      background: transparent;
      opacity: 0;
      width: 100%;
      height: 100%;
      inset: 0;
      z-index: 10;
      cursor: pointer;
      pointer-events: all;
      user-select: none;
      outline: none;
    }

    .button {
      background: transparent;
      display: flex;
      border: none;
      padding: 0;
      margin: 0;
      cursor: pointer;

      &::before {
        content: "";
        top: 0;
        bottom: 0;
        left: 25%;
        width: 70%;
        height: 100%;
        margin: auto;
        border-radius: 0 50% 50% 0;
        position: absolute;
        pointer-events: none;
        background: var(--primary);
        background: linear-gradient(
          to right,
          var(--primary) 0%,
          transparent 100%
        );
        z-index: 1;
        filter: blur(30px);
        mix-blend-mode: color-dodge;
        transition: all 1s ease 0.4s;
        opacity: 0;
      }

      &::after {
        content: "";
        width: 40px;
        height: 40px;
        top: 0;
        bottom: 0;
        left: 28%;
        margin: auto;
        border-radius: 50%;
        position: absolute;
        pointer-events: none;
        background: var(--primary);
        z-index: 2;
        filter: blur(12px);
        mix-blend-mode: color-dodge;
        transition: all 1s ease 0.4s;
        opacity: 0;
      }

      .part-1 {
        position: relative;
        z-index: 1;
        height: var(--h);
        width: 48px;
        border-radius: var(--rounded-max) var(--rounded-min) var(--rounded-min)
          var(--rounded-max);

        .line {
          position: absolute;
          top: 0;
          bottom: 0;
          right: -1px;
          transition: all 0.4s ease;

          &::before {
            position: absolute;
            top: 0;
            bottom: 0;
            right: 0;
            content: "";
            width: 1px;
            background: white;
            box-shadow: 1px 0 10px 3px var(--primary);
            border-radius: 50%;
            height: 0%;
            margin: auto;
            animation: 1.8s line ease infinite;
          }
        }

        .screw {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          margin: auto;
          z-index: -1;
          overflow: hidden;
          padding: 6px 0;

          svg {
            width: auto;
            height: 34px;

            g {
              transform-origin: center;
            }

            .dot {
              color: #8e8c8b;
            }
          }
        }

        .case {
          height: var(--h);
          width: 48px;
          border-radius: inherit;
          transform: translateX(-24px);
          transition: all 0.9s var(--ease-elastic);

          .mask {
            position: absolute;
            overflow: hidden;
            inset: 0;
            border-radius: inherit;
            background: ${props => props.$isDark 
              ? 'linear-gradient(to bottom, #2c2e31 0%, #31343e 20%, #212329 100%)'
              : 'linear-gradient(to bottom, #4a4c50 0%, #51545e 20%, #3a3c42 100%)'};
            box-shadow:
              inset 8px -15px 15px -10px ${props => props.$isDark ? 'black' : 'rgba(0,0,0,0.3)'},
              inset 10px -17px 12px -12px white,
              0 30px 70px -5px var(--bg-shadow);
            transition: all 0.9s var(--ease-elastic);

            &::before {
              content: "";
              position: absolute;
              border-radius: inherit;
              left: 30%;
              top: 23%;
              width: 100%;
              height: 30%;
              background: white;
              filter: blur(10px);
            }

            &::after {
              content: "";
              position: absolute;
              right: 0;
              top: 0;
              bottom: 0;
              width: 4px;
              background-color: rgba(255, 255, 255, 0.2);
              mix-blend-mode: overlay;
            }
          }
        }
      }

      .part-2 {
        position: relative;
        height: var(--h);
        width: 110px;
        border-radius: var(--rounded-min) var(--rounded-max) var(--rounded-max)
          var(--rounded-min);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.6s ease;

        .glass {
          position: relative;
          overflow: hidden;
          height: 100%;
          width: 100%;
          transition: all 0.9s var(--ease-elastic);
          border-radius: inherit;
          border-left: 1px solid ${props => props.$isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'};
          background: ${props => props.$isDark 
            ? 'linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.2) 50%, rgba(0, 0, 0, 0.5) 100%)'
            : 'linear-gradient(to bottom, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.5) 50%, rgba(200, 200, 200, 0.4) 100%)'};
          box-shadow:
            inset 0 0 7px -4px white,
            inset 0 -10px 10px -8px rgba(255, 255, 255, 0.4),
            inset 8px -15px 15px -10px ${props => props.$isDark ? 'black' : 'rgba(0,0,0,0.2)'},
            inset 8px -10px 12px -12px white,
            0 30px 70px -5px var(--bg-shadow);

          &::before {
            content: "";
            position: absolute;
            left: 0;
            top: 10%;
            right: 14%;
            height: 70%;
            border-radius: 0 25px 0 0;
            background: linear-gradient(
              to bottom,
              rgba(255, 255, 255, 0.5) 0%,
              rgba(255, 255, 255, 0) 60%
            );
          }

          &::after {
            content: "";
            position: absolute;
            left: 0;
            bottom: 15%;
            right: 5%;
            height: 75%;
            border-radius: 0 30px 30px 0;
            box-shadow: inset -2px -6px 5px -5px rgba(255, 255, 255, 0.8);
            filter: blur(3px);
          }

          .glass-reflex {
            position: absolute;
            inset: 0;
            width: 70%;
            border-radius: 0 50% 50% 0;
            background: linear-gradient(
              to right,
              rgba(255, 255, 255, 0.03) 0%,
              rgba(255, 255, 255, 0.2) 100%
            );
            transform: translateX(-115%) skewX(30deg);
          }

          .glass-noise {
            position: absolute;
            inset: 0;
            opacity: 0.2;
          }
        }

        .path-glass {
          position: absolute;
          inset: 0;
          transition: opacity 0.6s linear;
          opacity: 0;
          height: var(--h);
          width: 110px;

          path {
            stroke-dashoffset: 430;
            stroke-dasharray: 430 430;
            animation: 1.4s path-glass ease infinite;
          }
        }

        @keyframes path-glass {
          0% {
            stroke-dasharray: 430 430;
            color: greenyellow;
            opacity: 1;
            filter: blur(2px);
          }
          50% {
            stroke-dasharray: 860 430;
            opacity: 1;
            filter: blur(4px);
          }
          100% {
            stroke-dasharray: 860 430;
            color: var(--primary);
            opacity: 0;
          }
        }

        .filament {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          margin: auto;
          width: auto;
          height: 16px;
          stroke-width: 2px;
          opacity: 0.3;

          path {
            transition: all 0.6s ease-in-out;
          }
        }

        .filament-on {
          opacity: 1;
          path {
            stroke-dashoffset: 100;
            stroke-dasharray: 100 100;
          }
        }

        .filament-blur {
          opacity: 1;
          filter: blur(6px);
          color: rgb(255, 208, 0);
          stroke-width: 8px;
        }
      }
    }
  }

  .text {
    transition: all 0.3s ease;
    transform: translateY(-2px);
    display: flex;
    align-items: center;
    justify-content: center;
    letter-spacing: 0.1em;
    position: absolute;
    inset: 0;
  }
  .text span {
    display: block;
    color: transparent;
    position: relative;
  }
  .text.state-1 span:nth-child(3) {
    margin-right: 3px;
  }
  .text.state-2 span:nth-child(5) {
    margin-right: 3px;
  }

  .text span::before,
  .text span::after {
    content: attr(data-label);
    position: absolute;
    font-size: 12px;
    font-weight: 600;
    left: 0;
    color: var(--text-color);
    text-shadow: ${props => props.$isDark 
      ? '0 1px 2px rgba(0, 0, 0, 0.3)' 
      : '0 1px 2px rgba(255, 255, 255, 0.5)'};
  }
  .text span::before {
    opacity: 0;
    transform: translateY(-100%);
  }

  .area-wrapper input:checked ~ .button .filament path {
    transition-delay: 0.6s;
  }

  .area-wrapper:hover input:checked ~ .button .filament path {
    stroke-dasharray: 100 0;
  }

  .area-wrapper input:checked ~ .button .part-1 .case {
    transform: translateX(0px);
    transition: all 1.25s var(--ease-elastic-2);
  }

  .area-wrapper:hover input:checked ~ .button::before,
  .area-wrapper:hover input:checked ~ .button::after,
  .area-wrapper:hover input:checked ~ .button .path-glass {
    opacity: 1;
  }

  .area-wrapper:hover .button .part-1 .line {
    opacity: 0;
  }

  .area-wrapper input:not(:checked) ~ .button .part-1 .line::before {
    box-shadow: 1px 0 10px 3px rgba(255, 220, 145, 0.4);
    background: rgb(140, 140, 140);
  }

  .area-wrapper:hover .glass-reflex {
    animation: reflex 0.6s ease;
  }

  .area-wrapper:hover .text span::before {
    animation: char-in 1s ease calc(var(--i) * 0.03s) forwards;
  }

  .area-wrapper:hover .text span::after,
  .area-wrapper input:not(:checked) ~ .button .text.state-1 span::before,
  .area-wrapper input:not(:checked) ~ .button .text.state-1 span::after,
  .area-wrapper input:checked ~ .button .text.state-2 span::before,
  .area-wrapper input:checked ~ .button .text.state-2 span::after {
    opacity: 0;
    animation: char-out 1.3s ease calc(var(--i) * 0.04s) backwards;
  }

  .area-wrapper input:not(:checked) ~ .button .part-1 .screw g {
    animation: pulse 0.8s ease calc(var(--i) * 0.1s) backwards;
  }
  .area-wrapper input:checked ~ .button .part-1 .screw g {
    animation: pulse-out 0.8s ease calc((5 - var(--i)) * 0.2s) backwards;
  }

  .area-wrapper input:not(:checked) ~ .button .part-1 .screw .dot {
    animation: dot 0.7s ease calc(var(--i) * 0.15s) backwards;
  }

  .area-wrapper input:checked ~ .button .part-1 .screw .dot {
    animation: dot-out 0.7s ease calc((3 - var(--i)) * 0.15s) forwards;
  }

  @keyframes line {
    0% {
      height: 0%;
      opacity: 1;
    }
    50% {
      height: 100%;
      opacity: 1;
    }
    100% {
      height: 140%;
      opacity: 0;
    }
  }

  @keyframes dot {
    30% {
      color: var(--primary);
      filter: blur(2px);
    }
  }

  @keyframes dot-out {
    40% {
      color: white;
      filter: blur(2px);
    }
  }

  @keyframes pulse {
    30% {
      transform: scaleY(0.8);
    }
  }

  @keyframes pulse-out {
    40% {
      transform: scaleY(0.8);
    }
  }

  @keyframes char-in {
    0% {
      opacity: 0;
      transform: scale(10) translateX(-25%);
      filter: blur(10px);
      color: rgb(0, 251, 255);
    }
    25% {
      transform: translateY(-15%);
      opacity: 1;
      filter: blur(1px);
      color: var(--primary);
    }
    50% {
      transform: translateY(7%);
      opacity: 1;
      filter: blur(0);
    }
    100% {
      transform: translateY(0);
      opacity: 1;
      filter: blur(0);
    }
  }
  @keyframes char-out {
    0% {
      transform: translateY(0);
      opacity: 1;
    }
    100% {
      transform: translateY(-70%);
      opacity: 0;
      filter: blur(4px);
    }
  }

  @keyframes reflex {
    0% {
      transform: translateX(-115%);
    }
    100% {
      transform: translateX(140%);
    }
  }

  .noise {
    position: absolute;
    top: -20px;
    bottom: -15px;
    left: 0;
    right: 0;
    opacity: 0.07;
    mask-image: linear-gradient(
      transparent 5%,
      white 30%,
      white 70%,
      transparent 95%
    );
    filter: grayscale(1);
    pointer-events: none;
    z-index: 1;
  }

  .bg {
    position: absolute;
    inset: 0;
    pointer-events: none;

    svg {
      position: absolute;
      overflow: visible;
      inset: 0;
      z-index: 999;
    }

    &::before {
      content: "";
      border-radius: 50%;
      position: absolute;
      right: -25%;
      top: -25%;
      width: 50%;
      height: 50%;
      background-color: var(--primary);
      border-bottom: 8px solid white;
      border-left: 8px solid white;
      filter: blur(100px);
      z-index: 1;
    }

    .light-1 {
      position: absolute;
      right: 20%;
      top: -35%;
      height: 70%;
      width: 8%;
      border-radius: 0 0 50% 50%;
      background-color: white;
      transform: rotate(65deg);
      filter: blur(70px);
    }
    .light-2 {
      position: absolute;
      right: 20%;
      top: -25%;
      height: 90%;
      width: 2%;
      border-radius: 50%;
      background-color: var(--primary);
      transform: rotate(50deg);
      filter: blur(60px);
    }

    .light-3 {
      position: absolute;
      right: 0%;
      top: -20%;
      height: 80%;
      width: 3%;
      border-radius: 0 0 50% 50%;
      background-color: white;
      transform: rotate(35deg);
      filter: blur(60px);
    }
  }
`;

export default GetStartedButton;
