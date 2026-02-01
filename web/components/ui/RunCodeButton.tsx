'use client'

import React from 'react';
import styled from 'styled-components';
import { useTheme } from 'next-themes';

interface RunCodeButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isRunning?: boolean;
  className?: string;
}

export const RunCodeButton: React.FC<RunCodeButtonProps> = ({ onClick, disabled, isRunning, className }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <StyledWrapper className={className} $isDark={isDark}>
      <div className="button-wrap">
        <button 
          className="button" 
          onClick={onClick} 
          disabled={disabled || isRunning}
          type="button"
        >
          <div className="glow" />
          <div className="bg">
            <div className="shine" />
          </div>
          <div className="wave" />
          <div className="wrap">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 974 367" height={367} width={974} className="circuit">
              <g className="circuit-path circuit-path-2">
                <g className="circuit-side">
                  <path strokeWidth={2} stroke="url(#paint0_linear_73_31)" d="M0 1H185.5" style={{'--i': 1} as React.CSSProperties} />
                  <path strokeWidth={2} stroke="url(#paint1_linear_73_31)" d="M0 33H185.5" style={{'--i': 2} as React.CSSProperties} />
                  <path strokeWidth={2} stroke="url(#paint2_linear_73_31)" d="M10 84.5L50.6881 62.7689C52.8625 61.6075 55.2896 61 57.7547 61H185.5" style={{'--i': 3} as React.CSSProperties} />
                  <path strokeWidth={2} stroke="url(#paint3_linear_73_31)" d="M973.5 1H788" style={{'--i': 4} as React.CSSProperties} />
                  <path strokeWidth={2} stroke="url(#paint4_linear_73_31)" d="M973.5 33H788" style={{'--i': 5} as React.CSSProperties} />
                  <path strokeWidth={2} stroke="url(#paint5_linear_73_31)" d="M963.5 84.5L922.812 62.7689C920.638 61.6075 918.21 61 915.745 61H788" style={{'--i': 6} as React.CSSProperties} />
                </g>
                <g className="circuit-bottom">
                  <path strokeWidth={2} stroke="url(#paint6_linear_73_31)" d="M412.5 112V186.744C412.5 192.676 409.004 198.051 403.582 200.456L359.418 220.044C353.996 222.449 350.5 227.824 350.5 233.756V354" style={{'--i': 7} as React.CSSProperties} />
                  <path strokeWidth={2} stroke="url(#paint7_linear_73_31)" d="M533.5 112V209.625C533.5 213.402 534.925 217.04 537.491 219.812L560.509 244.688C563.075 247.46 564.5 251.098 564.5 254.875V355" style={{'--i': 8} as React.CSSProperties} />
                  <path strokeWidth={2} stroke="url(#paint8_linear_73_31)" d="M503.5 112V191.79C503.5 194.856 502.56 197.849 500.808 200.364L475.192 237.136C473.44 239.651 472.5 242.644 472.5 245.71V367" style={{'--i': 9} as React.CSSProperties} />
                  <path strokeWidth={2} stroke="url(#paint9_linear_73_31)" d="M443.5 112V355" style={{'--i': 10} as React.CSSProperties} />
                  <path strokeWidth={2} stroke="url(#paint10_linear_73_31)" d="M472.5 112V355" style={{'--i': 11} as React.CSSProperties} />
                  <path strokeWidth={2} stroke="url(#paint11_linear_73_31)" d="M562.5 112V166.617C562.5 174.855 569.145 181.552 577.383 181.616L611.617 181.884C619.855 181.948 626.5 188.645 626.5 196.883V305" style={{'--i': 12} as React.CSSProperties} />
                </g>
              </g>
              <g className="circuit-path circuit-path-1">
                <g className="circuit-side">
                  <path strokeWidth={2} stroke="url(#paint0_linear_73_31)" d="M0 1H185.5" style={{'--i': 1} as React.CSSProperties} />
                  <path strokeWidth={2} stroke="url(#paint1_linear_73_31)" d="M0 33H185.5" style={{'--i': 2} as React.CSSProperties} />
                  <path strokeWidth={2} stroke="url(#paint2_linear_73_31)" d="M10 84.5L50.6881 62.7689C52.8625 61.6075 55.2896 61 57.7547 61H185.5" style={{'--i': 3} as React.CSSProperties} />
                  <path strokeWidth={2} stroke="url(#paint3_linear_73_31)" d="M973.5 1H788" style={{'--i': 4} as React.CSSProperties} />
                  <path strokeWidth={2} stroke="url(#paint4_linear_73_31)" d="M973.5 33H788" style={{'--i': 5} as React.CSSProperties} />
                  <path strokeWidth={2} stroke="url(#paint5_linear_73_31)" d="M963.5 84.5L922.812 62.7689C920.638 61.6075 918.21 61 915.745 61H788" style={{'--i': 6} as React.CSSProperties} />
                </g>
                <g className="circuit-bottom">
                  <path strokeWidth={2} stroke="url(#paint6_linear_73_31)" d="M412.5 112V186.744C412.5 192.676 409.004 198.051 403.582 200.456L359.418 220.044C353.996 222.449 350.5 227.824 350.5 233.756V354" style={{'--i': 7} as React.CSSProperties} />
                  <path strokeWidth={2} stroke="url(#paint7_linear_73_31)" d="M533.5 112V209.625C533.5 213.402 534.925 217.04 537.491 219.812L560.509 244.688C563.075 247.46 564.5 251.098 564.5 254.875V355" style={{'--i': 8} as React.CSSProperties} />
                  <path strokeWidth={2} stroke="url(#paint8_linear_73_31)" d="M503.5 112V191.79C503.5 194.856 502.56 197.849 500.808 200.364L475.192 237.136C473.44 239.651 472.5 242.644 472.5 245.71V367" style={{'--i': 9} as React.CSSProperties} />
                  <path strokeWidth={2} stroke="url(#paint9_linear_73_31)" d="M443.5 112V355" style={{'--i': 10} as React.CSSProperties} />
                  <path strokeWidth={2} stroke="url(#paint10_linear_73_31)" d="M472.5 112V355" style={{'--i': 11} as React.CSSProperties} />
                  <path strokeWidth={2} stroke="url(#paint11_linear_73_31)" d="M562.5 112V166.617C562.5 174.855 569.145 181.552 577.383 181.616L611.617 181.884C619.855 181.948 626.5 188.645 626.5 196.883V305" style={{'--i': 12} as React.CSSProperties} />
                </g>
              </g>
              <g className="circuit-bg">
                <g className="circuit-side">
                  <path strokeWidth={2} stroke="url(#paint0_linear_73_31)" d="M0 1H185.5" />
                  <path strokeWidth={2} stroke="url(#paint1_linear_73_31)" d="M0 33H185.5" />
                  <path strokeWidth={2} stroke="url(#paint2_linear_73_31)" d="M10 84.5L50.6881 62.7689C52.8625 61.6075 55.2896 61 57.7547 61H185.5" />
                  <path strokeWidth={2} stroke="url(#paint3_linear_73_31)" d="M973.5 1H788" />
                  <path strokeWidth={2} stroke="url(#paint4_linear_73_31)" d="M973.5 33H788" />
                  <path strokeWidth={2} stroke="url(#paint5_linear_73_31)" d="M963.5 84.5L922.812 62.7689C920.638 61.6075 918.21 61 915.745 61H788" />
                </g>
                <g className="circuit-bottom">
                  <path strokeWidth={2} stroke="url(#paint6_linear_73_31)" d="M412.5 112V186.744C412.5 192.676 409.004 198.051 403.582 200.456L359.418 220.044C353.996 222.449 350.5 227.824 350.5 233.756V354" />
                  <path strokeWidth={2} stroke="url(#paint7_linear_73_31)" d="M533.5 112V209.625C533.5 213.402 534.925 217.04 537.491 219.812L560.509 244.688C563.075 247.46 564.5 251.098 564.5 254.875V355" />
                  <path strokeWidth={2} stroke="url(#paint8_linear_73_31)" d="M503.5 112V191.79C503.5 194.856 502.56 197.849 500.808 200.364L475.192 237.136C473.44 239.651 472.5 242.644 472.5 245.71V367" />
                  <path strokeWidth={2} stroke="url(#paint9_linear_73_31)" d="M443.5 112V355" />
                  <path strokeWidth={2} stroke="url(#paint10_linear_73_31)" d="M472.5 112V355" />
                  <path strokeWidth={2} stroke="url(#paint11_linear_73_31)" d="M562.5 112V166.617C562.5 174.855 569.145 181.552 577.383 181.616L611.617 181.884C619.855 181.948 626.5 188.645 626.5 196.883V305" />
                </g>
              </g>
              <defs>
                {/* Multicolor circuit gradients - Left side paths */}
                <linearGradient gradientUnits="userSpaceOnUse" y2="1.5" x2={265} y1="1.5" x1={0} id="paint0_linear_73_31">
                  <stop stopOpacity={0} stopColor="#ff6b6b" offset="0.155" />
                  <stop stopColor="#ff6b6b" offset={0.5} />
                  <stop stopColor="#feca57" offset={1} />
                </linearGradient>
                <linearGradient gradientUnits="userSpaceOnUse" y2="33.5" x2={265} y1="33.5" x1={0} id="paint1_linear_73_31">
                  <stop stopOpacity={0} stopColor="#48dbfb" />
                  <stop stopColor="#48dbfb" offset={0.5} />
                  <stop stopColor="#0abde3" offset={1} />
                </linearGradient>
                <linearGradient gradientUnits="userSpaceOnUse" y2="72.75" x2={265} y1="72.75" x1={10} id="paint2_linear_73_31">
                  <stop stopOpacity={0} stopColor="#a29bfe" />
                  <stop stopColor="#a29bfe" offset={0.5} />
                  <stop stopColor="#6c5ce7" offset={1} />
                </linearGradient>
                {/* Right side paths */}
                <linearGradient gradientUnits="userSpaceOnUse" y2="1.5" x2="708.5" y1="1.5" x1="973.5" id="paint3_linear_73_31">
                  <stop stopOpacity={0} stopColor="#ff9ff3" offset="0.155" />
                  <stop stopColor="#ff9ff3" offset={0.5} />
                  <stop stopColor="#f368e0" offset={1} />
                </linearGradient>
                <linearGradient gradientUnits="userSpaceOnUse" y2="33.5" x2="708.5" y1="33.5" x1="973.5" id="paint4_linear_73_31">
                  <stop stopOpacity={0} stopColor="#55efc4" />
                  <stop stopColor="#55efc4" offset={0.5} />
                  <stop stopColor="#00b894" offset={1} />
                </linearGradient>
                <linearGradient gradientUnits="userSpaceOnUse" y2="72.75" x2="708.5" y1="72.75" x1="963.5" id="paint5_linear_73_31">
                  <stop stopOpacity={0} stopColor="#ffeaa7" />
                  <stop stopColor="#ffeaa7" offset={0.5} />
                  <stop stopColor="#fdcb6e" offset={1} />
                </linearGradient>
                {/* Bottom paths - multicolor */}
                <linearGradient gradientUnits="userSpaceOnUse" y2={97} x2={390} y1={354} x1={390} id="paint6_linear_73_31">
                  <stop stopOpacity={0} stopColor="#ff6b6b" offset="0.105" />
                  <stop stopColor="#feca57" offset={0.5} />
                  <stop stopColor="#48dbfb" offset={1} />
                </linearGradient>
                <linearGradient gradientUnits="userSpaceOnUse" y2={97} x2={556} y1={355} x1={556} id="paint7_linear_73_31">
                  <stop stopOpacity={0} stopColor="#a29bfe" offset="0.105" />
                  <stop stopColor="#6c5ce7" offset={0.5} />
                  <stop stopColor="#fd79a8" offset={1} />
                </linearGradient>
                <linearGradient gradientUnits="userSpaceOnUse" y2={97} x2={526} y1={355} x1={526} id="paint8_linear_73_31">
                  <stop stopOpacity={0} stopColor="#55efc4" offset="0.105" />
                  <stop stopColor="#00b894" offset={0.5} />
                  <stop stopColor="#00cec9" offset={1} />
                </linearGradient>
                <linearGradient gradientUnits="userSpaceOnUse" y2={97} x2={466} y1={355} x1={466} id="paint9_linear_73_31">
                  <stop stopOpacity={0} stopColor="#ff9ff3" offset="0.105" />
                  <stop stopColor="#f368e0" offset={0.5} />
                  <stop stopColor="#e056fd" offset={1} />
                </linearGradient>
                <linearGradient gradientUnits="userSpaceOnUse" y2={97} x2={495} y1={355} x1={495} id="paint10_linear_73_31">
                  <stop stopOpacity={0} stopColor="#ffeaa7" offset="0.105" />
                  <stop stopColor="#fdcb6e" offset={0.5} />
                  <stop stopColor="#f9ca24" offset={1} />
                </linearGradient>
                <linearGradient gradientUnits="userSpaceOnUse" y2={97} x2={585} y1={305} x1={585} id="paint11_linear_73_31">
                  <stop stopOpacity={0} stopColor="#48dbfb" offset="0.105" />
                  <stop stopColor="#0abde3" offset={0.5} />
                  <stop stopColor="#00d2d3" offset={1} />
                </linearGradient>
              </defs>
            </svg>
            <div className="wrap-content">
              <div className="content">
                <div className="outline" />
                <div className="glyphs">
                  <span className="text">
                    <span data-label="R" style={{'--i': 1} as React.CSSProperties}>R</span>
                    <span data-label="u" style={{'--i': 2} as React.CSSProperties}>u</span>
                    <span data-label="n" style={{'--i': 3} as React.CSSProperties}>n</span>
                    <span data-label=" " style={{'--i': 4} as React.CSSProperties}>&nbsp;</span>
                    <span data-label="C" style={{'--i': 5} as React.CSSProperties}>C</span>
                    <span data-label="o" style={{'--i': 6} as React.CSSProperties}>o</span>
                    <span data-label="d" style={{'--i': 7} as React.CSSProperties}>d</span>
                    <span data-label="e" style={{'--i': 8} as React.CSSProperties}>e</span>
                  </span>
                  <div className="icon-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 63 91" height={91} width={63}>
                      <path fill="black" d="M9.3662 51.0001H21.9999V74.8271C21.9999 77.5581 25.352 78.8687 27.2043 76.862L53.3523 48.5349C55.1262 46.6132 53.7632 43.5001 51.1479 43.5001H39.9999V18.1557C39.9999 15.427 36.6525 14.1153 34.7986 16.1175L7.16492 45.9619C5.38659 47.8824 6.74874 51.0001 9.3662 51.0001Z" />
                      <g className="strokes">
                        <path strokeWidth={2} stroke="white" d="M9.3662 51.0001H21.9999V74.8271C21.9999 77.5581 25.352 78.8687 27.2043 76.862L53.3523 48.5349C55.1262 46.6132 53.7632 43.5001 51.1479 43.5001H39.9999V18.1557C39.9999 15.427 36.6525 14.1153 34.7986 16.1175L7.16492 45.9619C5.38659 47.8824 6.74874 51.0001 9.3662 51.0001Z" className="stroke" />
                        <path strokeWidth={2} stroke="white" d="M9.3662 51.0001H21.9999V74.8271C21.9999 77.5581 25.352 78.8687 27.2043 76.862L53.3523 48.5349C55.1262 46.6132 53.7632 43.5001 51.1479 43.5001H39.9999V18.1557C39.9999 15.427 36.6525 14.1153 34.7986 16.1175L7.16492 45.9619C5.38659 47.8824 6.74874 51.0001 9.3662 51.0001Z" className="stroke" />
                      </g>
                      <g className="lightnings">
                        <path strokeLinecap="round" fill="none" strokeWidth={4} stroke="currentColor" d="M16 2L4.41532 14.8856C4.30625 15.007 4.3805 15.2008 4.54271 15.2182L13.9949 16.2327C14.1573 16.2501 14.2314 16.4443 14.122 16.5655L2 30" className="lightning lightning-1" />
                        <path strokeLinecap="round" fill="none" strokeWidth={4} stroke="currentColor" d="M61 61L49.4153 73.8856C49.3062 74.007 49.3805 74.2008 49.5427 74.2182L58.9949 75.2327C59.1573 75.2501 59.2314 75.4443 59.122 75.5655L47 89" className="lightning lightning-1" />
                        <g>
                          <path strokeLinecap="round" fill="none" strokeWidth={4} stroke="currentColor" d="M16 2L4.41532 14.8856C4.30625 15.007 4.3805 15.2008 4.54271 15.2182L13.9949 16.2327C14.1573 16.2501 14.2314 16.4443 14.122 16.5655L2 30" className="lightning lightning-2" />
                          <path strokeLinecap="round" fill="none" strokeWidth={4} stroke="currentColor" d="M61 61L49.4153 73.8856C49.3062 74.007 49.3805 74.2008 49.5427 74.2182L58.9949 75.2327C59.1573 75.2501 59.2314 75.4443 59.122 75.5655L47 89" className="lightning lightning-2" />
                        </g>
                      </g>
                    </svg>
                  </div>
                  <div className="icon-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 930 211" height={211} width={930}>
                      <g>
                        <path strokeLinecap="round" strokeWidth={20} stroke="currentColor" d="M422 122.5L443.3 143.8C443.688 144.188 444.315 144.191 444.707 143.808L492.5 97" className="check" />
                        <path fill="currentColor" d="M363.631 87.9615C335.323 93.6429 314 118.644 314 148.625C314 182.797 341.702 210.5 375.875 210.5H536.75C577.757 210.5 611 177.257 611 136.25C611 97.6771 581.587 65.9741 543.966 62.3461C531.322 26.1173 496.853 0.125015 456.312 0.125015C406.723 0.125015 366.217 39.0161 363.631 87.9615ZM388.347 89.2671C387.75 100.554 379.584 110.003 368.502 112.228C351.528 115.634 338.75 130.665 338.75 148.625C338.75 169.129 355.371 185.75 375.875 185.75H536.75C564.088 185.75 586.25 163.588 586.25 136.25C586.25 110.55 566.644 89.3983 541.59 86.9814C531.976 86.0548 523.78 79.6199 520.597 70.5009C511.314 43.901 486.004 24.875 456.312 24.875C419.955 24.875 390.242 53.3951 388.347 89.2671Z" clipRule="evenodd" fillRule="evenodd" />
                      </g>
                      <g>
                        <mask height={211} width={297} y={0} x={314} maskUnits="userSpaceOnUse" style={{maskType: 'alpha'}} id="cloud-mask">
                          <path strokeLinecap="round" strokeWidth={20} stroke="red" d="M422 122.5L443.3 143.8C443.688 144.188 444.315 144.191 444.707 143.808L492.5 97" />
                          <path fill="red" d="M363.631 87.9615C335.323 93.6429 314 118.644 314 148.625C314 182.797 341.702 210.5 375.875 210.5H536.75C577.757 210.5 611 177.257 611 136.25C611 97.6771 581.587 65.9741 543.966 62.3461C531.322 26.1173 496.853 0.125015 456.312 0.125015C406.723 0.125015 366.217 39.0161 363.631 87.9615ZM388.347 89.2671C387.75 100.554 379.584 110.003 368.502 112.228C351.528 115.634 338.75 130.665 338.75 148.625C338.75 169.129 355.371 185.75 375.875 185.75H536.75C564.088 185.75 586.25 163.588 586.25 136.25C586.25 110.55 566.644 89.3983 541.59 86.9814C531.976 86.0548 523.78 79.6199 520.597 70.5009C511.314 43.901 486.004 24.875 456.312 24.875C419.955 24.875 390.242 53.3951 388.347 89.2671Z" clipRule="evenodd" fillRule="evenodd" />
                        </mask>
                      </g>
                      <g mask="url(#cloud-mask)">
                        <path fill="url(#cloud-mask-bg)" d="M15 -2H336L286 213H-35L15 -2Z" className="cloud-mask" />
                      </g>
                      <path fill="currentColor" d="M21.7241 59.4122C9.33335 61.8967 0 72.8301 0 85.9412C0 100.885 12.1256 113 27.0833 113H97.5C115.449 113 130 98.4624 130 80.5294C130 63.6609 117.126 49.7968 100.658 48.2102C95.1242 32.3668 80.0367 21 62.2917 21C40.5858 21 22.8559 38.0076 21.7241 59.4122ZM32.5423 59.9831C32.2813 64.9192 28.7066 69.0511 23.8561 70.0241C16.4265 71.514 10.8333 78.0871 10.8333 85.9412C10.8333 94.9079 18.1087 102.176 27.0833 102.176H97.5C109.466 102.176 119.167 92.4845 119.167 80.5294C119.167 69.2903 110.585 60.0405 99.6185 58.9836C95.4102 58.5783 91.8228 55.7643 90.4296 51.7764C86.3666 40.1438 75.2879 31.8235 62.2917 31.8235C46.3774 31.8235 33.3718 44.2958 32.5423 59.9831Z" clipRule="evenodd" fillRule="evenodd" className="cloud cloud-1" />
                      <path fill="currentColor" d="M821.724 98.4122C809.333 100.897 800 111.83 800 124.941C800 139.885 812.126 152 827.083 152H897.5C915.449 152 930 137.462 930 119.529C930 102.661 917.126 88.7968 900.658 87.2102C895.124 71.3668 880.037 60 862.292 60C840.586 60 822.856 77.0076 821.724 98.4122ZM832.542 98.9831C832.281 103.919 828.707 108.051 823.856 109.024C816.426 110.514 810.833 117.087 810.833 124.941C810.833 133.908 818.109 141.176 827.083 141.176H897.5C909.466 141.176 919.167 131.485 919.167 119.529C919.167 108.29 910.585 99.0405 899.618 97.9836C895.41 97.5783 891.823 94.7643 890.43 90.7764C886.367 79.1438 875.288 70.8235 862.292 70.8235C846.377 70.8235 833.372 83.2958 832.542 98.9831Z" clipRule="evenodd" fillRule="evenodd" className="cloud cloud-2" />
                      <defs>
                        <linearGradient gradientUnits="userSpaceOnUse" y2={85} x2="-6.00001" y1={150} x1={306} id="cloud-mask-bg">
                          <stop stopColor="currentColor" />
                          <stop stopOpacity={0} stopColor="currentColor" offset={1} />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </button>
      </div>
    </StyledWrapper>
  );
}

interface StyledWrapperProps {
  $isDark: boolean;
}

const StyledWrapper = styled.div<StyledWrapperProps>`
  .button-wrap {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .button {
    --radius: 10px;
    /* Pistachio green colors */
    --primary: ${props => props.$isDark ? '#93C572' : '#7AB356'};
    --primary-light: ${props => props.$isDark ? '#A8D68C' : '#93C572'};
    --primary-dark: ${props => props.$isDark ? '#7AB356' : '#5E9A3A'};
    --primary-darker: ${props => props.$isDark ? '#5E9A3A' : '#4A7D2E'};
    --bg-color: ${props => props.$isDark ? 'black' : '#1a1a1a'};
    --text-color: ${props => props.$isDark ? '#e8f5e0' : '#1a2e05'};
    --glow-color: ${props => props.$isDark ? 'rgba(147, 197, 114, 0.4)' : 'rgba(122, 179, 86, 0.5)'};
    outline: none;
    cursor: pointer;
    font-size: 13px;
    background: transparent;
    border: 0;
    position: relative;
    width: 120px;
    height: 38px;
    box-shadow: ${props => props.$isDark 
      ? '0 8px 20px -5px rgba(0, 0, 0, 0.5)' 
      : '0 8px 20px -5px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(147, 197, 114, 0.3)'};
    border-radius: var(--radius);
  }
  
  .button:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
  
  .button::before,
  .button::after {
    content: "";
    position: absolute;
    top: 40%;
    z-index: 0;
    height: 25px;
    width: 50%;
    background: var(--bg-color);
    filter: blur(6px);
    border-radius: 6px;
    opacity: ${props => props.$isDark ? '0.6' : '0.3'};
    pointer-events: none;
    touch-action: none;
  }
  .button::before {
    left: -2px;
    transform: rotate(-15deg);
  }
  .button::after {
    right: -2px;
    transform: rotate(15deg);
  }

  .glow {
    position: absolute;
    inset: 0;
    box-shadow: 0 0 80px 3px var(--glow-color);
    pointer-events: none;
    touch-action: none;
  }

  .glow::before {
    content: "";
    position: absolute;
    margin: auto;
    background: rgba(147, 197, 114, 0.03);
    border-radius: 50%;
    filter: blur(25px);
    inset: 0;
    height: 200px;
    width: 80px;
    transform: rotate(-45deg);
  }

  .wave {
    position: absolute;
    width: 100%;
    height: 100%;
    inset: 0;
    margin: auto;
    transition: all 0.3s linear;
  }
  .wave::before,
  .wave::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    border: 0.5px solid rgba(147, 197, 114, 0.4);
    inset: 0;
    filter: blur(2px);
    border-radius: 16px;
  }
  .button:focus .wave::before,
  .button:focus .wave::after {
    animation: wave 2.2s linear;
  }
  .button:focus .wave::after {
    animation-delay: 0.35s;
  }
  @keyframes wave {
    0%,
    40% {
      transform: scale(1);
      opacity: 0;
      box-shadow:
        0 0 15px 5px var(--bg-color),
        inset 0 0 15px rgba(255, 255, 255, 0.1);
    }
    60% {
      transform: scale(1.2, 1.5);
      opacity: 1;
    }
    100% {
      transform: scale(1.6, 2);
      opacity: 0;
      box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
    }
  }

  .bg {
    position: absolute;
    inset: -3px;
    border-radius: calc(var(--radius) * 1.35);
    z-index: 1;
    overflow: hidden;
    box-shadow: ${props => props.$isDark 
      ? '0 8px 20px -5px rgba(0, 0, 0, 0.5)' 
      : '0 4px 15px -3px rgba(0, 0, 0, 0.2)'};
  }
  .bg::before,
  .bg::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: calc(var(--radius) * 1.35);
  }
  .bg::after {
    background: var(--bg-color);
    box-shadow:
      inset 0 0 0 1px rgba(147, 197, 114, 0.4),
      inset -2px 0 0 -1px var(--primary),
      inset 0 -2px 0 -1px rgba(147, 197, 114, 0.1);
  }

  .bg .shine {
    transition: all 0.5s linear;
    color: rgba(168, 214, 140, 0.85);
  }
  .button:active .bg .shine {
    color: rgba(122, 179, 86, 0.85);
  }
  .bg .shine::before {
    content: "";
    position: absolute;
    z-index: 2;
    background: currentColor;
    width: 6px;
    height: 6px;
    opacity: 0.3;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    border-radius: 50%;
    filter: blur(2px);
    transform: translateY(0) scale(0);
    animation: shine 2.2s linear infinite;
  }
  @keyframes shine {
    0% {
      transform: translateY(0) scale(0);
    }
    20% {
      transform: translateY(0) scale(15);
    }
    100% {
      transform: translateY(-150px) scale(12, 10);
    }
  }

  .outline {
    position: absolute;
    overflow: hidden;
    inset: 0;
    outline: none;
    border-radius: inherit;
    transition: all 0.4s ease;
  }
  .outline::before {
    content: "";
    position: absolute;
    inset: 0;
    width: 80px;
    height: 200px;
    margin: auto;
    background: linear-gradient(
      to right,
      transparent 0%,
      var(--primary) 50%,
      transparent 100%
    );
    animation: spin 1.7s linear infinite;
  }
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .circuit {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%);
    width: 240px;
    height: auto;
    margin-top: -6px;
    pointer-events: none;
    touch-action: none;
  }
  .circuit-bg {
    opacity: ${props => props.$isDark ? '0.5' : '0.4'};
  }

  .circuit-path {
    opacity: 0;
    transition: opacity 0.4s linear;
  }

  .circuit-path .circuit-side path {
    stroke-dasharray: 200;
    stroke-dashoffset: 200;
    animation: line-1 1.7s ease-in-out infinite;
    animation-delay: calc(var(--i) * 0.2s);
  }
  @keyframes line-1 {
    0% {
      stroke-dashoffset: 200;
      filter: blur(2px) brightness(2);
    }
    70% {
      stroke-dashoffset: 0;
    }
    100% {
      opacity: 0;
    }
  }
  .circuit-path .circuit-bottom path {
    stroke-dasharray: 250;
    stroke-dashoffset: -250;
    animation: line-2 2.2s ease-in-out infinite;
    animation-delay: calc(var(--i) * 0.1s);
  }
  @keyframes line-2 {
    0% {
      stroke-dashoffset: -250;
      filter: blur(2px) brightness(2);
    }
    70% {
      stroke-dashoffset: 0;
    }
    100% {
      opacity: 0;
    }
  }
  .circuit-path-2 .circuit-side path {
    animation-duration: 0.7s;
  }
  .circuit-path-2 .circuit-bottom path {
    animation-duration: 0.9s;
  }
  .circuit-path-2 .circuit-side path,
  .circuit-path-2 .circuit-bottom path {
    filter: sepia(50%) saturate(500%) hue-rotate(90deg) brightness(100%)
      contrast(100%) drop-shadow(0 0 0 white);
  }
  .button .circuit-path-1,
  .button:hover .circuit-path-2 {
    opacity: 1;
  }
  .button:hover .circuit-path-1 {
    opacity: 0;
  }
  .button:focus .wrap:hover .circuit-path-1 {
    opacity: 1;
  }
  .button:focus .wrap:hover .circuit-path-2,
  .button:active .wrap:hover .circuit-path-1 {
    opacity: 0;
  }
  .button:active .wrap:hover .circuit-path-2 {
    opacity: 1;
  }

  .wrap-content {
    position: absolute;
    inset: 0;
    z-index: 1;
    transition: all 0.3s ease;
  }
  .button:active .wrap-content {
    transform: scale(0.97, 0.96);
  }
  .content {
    border-radius: var(--radius);
    overflow: hidden;
    height: 100%;
    padding: 2px;
    background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary) 50%, var(--primary-dark) 100%);
    box-shadow:
      inset 0 0 10px 3px var(--primary-darker),
      inset 0 -6px 6px -4px rgba(200, 230, 170, 0.8);
    position: relative;
  }
  .button:hover .content {
    animation: shake 0.5s linear infinite;
  }
  @keyframes shake {
    15% {
      transform: translate(1px, 1px);
    }
    30% {
      transform: translate(0, -1px);
    }
    45% {
      transform: translate(1px, -1px);
    }
    55% {
      transform: translate(-1px, 1px);
    }
    70% {
      transform: translate(1px, 0);
    }
    85% {
      transform: translate(-1px, -1px);
    }
  }
  .button:focus .content {
    animation: shake-out 1.9s ease forwards;
  }
  @keyframes shake-out {
    5% {
      transform: translate(2px, 2px);
    }
    10% {
      transform: translate(0, -2px);
    }
    15% {
      transform: translate(2px, -2px);
    }
    20% {
      transform: translate(-2px, 2px);
    }
    25% {
      transform: translate(2px, 0);
    }
    30% {
      transform: translate(-2px, -2px);
    }
    35% {
      transform: translate(2px, 2px);
    }
    40% {
      transform: translate(0, -2px);
    }
    45% {
      transform: translate(2px, -2px);
    }
    48% {
      transform: scale(0.9);
    }
    100% {
      transform: translate(0);
    }
  }

  .glyphs {
    pointer-events: none;
    touch-action: none;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
    position: relative;
    height: 100%;
    gap: 6px;
    border-radius: calc(var(--radius) * 0.85);
    font-weight: 600;
    background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary) 50%, var(--primary-dark) 100%);
    box-shadow:
      inset 0 0 10px 3px var(--primary-darker),
      0 0 6px 6px rgba(0, 0, 0, 0.2),
      inset 0 -6px 6px -4px rgba(200, 230, 170, 0.8);
    transition: all 0.3s ease;
  }

  .text {
    transition: all 0.3s ease;
    transform: translateY(-1px);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .text span {
    display: block;
    color: transparent;
    position: relative;
  }
  .text span:nth-child(3) {
    margin-right: 3px;
  }
  .text span {
    animation: char-in 1.2s ease backwards calc(var(--i) * 0.03s);
  }
  .text span::before,
  .text span::after {
    content: attr(data-label);
    position: absolute;
    color: #1a2e05;
    text-shadow: 0 2px 3px rgba(147, 197, 114, 0.5);
    left: 0;
  }
  .text span::before {
    opacity: 0;
    transform: translateY(-100%);
  }
  .button:hover .text span::before {
    animation: char-in 0.7s ease calc(var(--i) * 0.03s);
  }
  .button:hover .text span::after {
    opacity: 1;
    animation: char-out 0.7s ease calc(var(--i) * 0.03s) backwards;
  }
  .button:focus .text span {
    animation: char-out-2 0.7s ease forwards calc((var(--i)) * -0.02s);
  }
  @keyframes char-in {
    0% {
      opacity: 0;
      transform: translateY(60%);
      filter: blur(20px);
      color: #22c55e;
    }
    30% {
      transform: translateY(-15%);
      opacity: 1;
      filter: blur(1px);
      color: #93C572;
    }
    60% {
      transform: translateY(5%);
      opacity: 1;
      filter: blur(0);
    }
    100% {
      transform: translateY(0);
      opacity: 1;
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
  @keyframes char-out-2 {
    0%,
    50% {
      transform: translateY(0);
      opacity: 1;
    }
    100% {
      transform: translateY(-70%);
      opacity: 0;
      filter: blur(4px);
    }
  }

  .icon-1 svg,
  .icon-2 svg {
    margin-top: 2px;
  }
  .button .icon-2 {
    position: absolute;
    filter: blur(4px);
    opacity: 0;
    animation: icon-2-out 0.6s ease-in forwards;
  }
  @keyframes icon-2-out {
    0% {
      transform: translateX(0);
      filter: blur(0);
      opacity: 1;
    }
    100% {
      transform: translateX(80px);
      filter: blur(4px);
      opacity: 0;
    }
  }
  .button .icon-2 svg {
    height: 22px;
    width: auto;
    overflow: visible;
  }
  .button .icon-2 .cloud {
    animation: cloud 6s linear infinite 0.3s;
    opacity: 0;
    filter: blur(8px);
    animation-play-state: paused;
  }
  .button .icon-2 .cloud-2 {
    animation-delay: 1.5s;
  }
  .button:focus .icon-2 .cloud {
    animation-play-state: running;
  }
  @keyframes cloud {
    0%,
    20% {
      transform: translateX(-120px);
      opacity: 0;
    }
    70% {
      transform: translateX(0);
      opacity: 0.7;
    }
    100% {
      transform: translateX(120px);
      opacity: 0;
    }
  }
  .button:focus .icon-2 {
    animation: icon-2-in 1.5s cubic-bezier(0.5, -0.15, 0.3, 1) 0.8s forwards;
  }
  @keyframes icon-2-in {
    0% {
      transform: translateY(15px);
      filter: blur(4px);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      filter: blur(0);
      opacity: 1;
    }
  }
  .button:focus .icon-2 .check {
    stroke-dasharray: 110;
    stroke-dashoffset: 110;
    animation: check 1.5s cubic-bezier(0.5, -0.15, 0.3, 1) forwards 1.2s;
  }
  @keyframes check {
    0% {
      stroke-dashoffset: 110;
      stroke-width: 5px;
    }
    100% {
      stroke-dashoffset: 0;
    }
  }
  .button .cloud-mask {
    animation: cloud-mask 2.2s ease infinite;
  }
  @keyframes cloud-mask {
    0%,
    5% {
      transform: translateX(0);
      opacity: 0.5;
    }
    65%,
    100% {
      transform: translateX(500px);
      opacity: 1;
    }
  }
  #cloud-mask-bg {
    color: #d9f99d;
  }
  .button:active #cloud-mask-bg {
    color: #86efac;
  }

  .icon-1 {
    margin-right: -6px;
    animation: icon-1-in 1s cubic-bezier(0.5, -0.15, 0.3, 1.4) forwards;
  }
  @keyframes icon-1-in {
    0% {
      transform: translateX(-180px) scale(2) rotate(-130deg);
      filter: blur(3px);
    }
    80% {
      transform: translateX(4px);
      filter: blur(2px);
      color: #84cc16;
    }
    100% {
      transform: translate(0);
    }
  }
  .icon-1:active path:nth-child(1) {
    animation: none;
  }
  .button:focus .icon-1 {
    animation: icon-1-out 1.5s ease-in-out forwards;
  }
  @keyframes icon-1-out {
    0% {
      transform: translate(0);
    }
    40% {
      transform: translateX(-200px) scale(2) rotate(-90deg);
      filter: blur(4px);
    }
    40.0001% {
      transform: translate(-60px, -60px) scale(3);
      filter: contrast(2);
      opacity: 1;
      color: white;
      background-color: transparent;
      box-shadow: none;
    }
    70%,
    97% {
      transform: translate(-60px, 50px) scale(1);
      box-shadow: 0 0 40px 80px white;
      background-color: white;
      border-radius: 50%;
    }
    100% {
      opacity: 0;
    }
  }
  .icon-1 svg {
    height: 20px;
    width: auto;
    overflow: visible;
    fill: #1a2e05;
  }
  .icon-1 .stroke {
    stroke-dasharray: 90;
    stroke-dashoffset: -90;
    filter: blur(2px);
    animation: icon-stroke 3s linear infinite;
  }
  @keyframes icon-stroke {
    0% {
      stroke-dashoffset: -90;
    }
    100% {
      stroke-dashoffset: 90;
    }
  }
  .icon-1 .stroke:nth-child(1) {
    stroke: #7AB356;
    stroke-width: 4px;
  }
  .icon-1 .stroke:nth-child(2) {
    stroke: var(--primary);
    stroke-width: 3px;
    animation-delay: 1.5s;
  }
  .icon-1 .lightnings > g {
    transform: translate(10px, -10px);
  }
  .icon-1 .lightning {
    transform-origin: center;
    animation: lightning-1 0.9s linear infinite;
  }
  .icon-1 .lightning:last-child {
    animation: lightning-1 1.1s linear infinite 0.2s;
  }
  .icon-1 .lightning-2 {
    transform-origin: center;
    animation: lightning-2 0.9s linear infinite 0.2s;
  }
  .icon-1 .lightning-2:last-child {
    animation: lightning-2 1.1s linear infinite 0.4s;
  }
  .icon-1 g {
    opacity: 0;
    transition: 0.4s linear;
  }
  .button:hover .icon-1 g {
    opacity: 1;
  }
  @keyframes lightning-1 {
    0% {
      transform: translate(20px, -20px);
      filter: blur(6px);
      opacity: 0;
      color: white;
    }
    50% {
      transform: translate(0);
      filter: blur(0);
      opacity: 1;
      color: var(--primary-light);
    }
    100% {
      transform: translate(-20px, 20px);
      filter: blur(6px);
      opacity: 0;
      color: white;
    }
  }
  @keyframes lightning-2 {
    0% {
      transform: translate(20px, -20px);
      filter: blur(6px);
      opacity: 0;
    }
    50% {
      transform: translate(0);
      filter: blur(0);
      opacity: 1;
      color: white;
    }
    100% {
      transform: translate(-20px, 20px);
      filter: blur(6px);
      opacity: 0;
    }
  }
`;

export default RunCodeButton;
