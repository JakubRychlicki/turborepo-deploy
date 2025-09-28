import * as React from "react"
import { type SVGProps } from "react"

const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 124 124"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M94.1108 23.5284C87.5387 18.1409 80.3175 14.2544 71.6439 16.8102C67.7818 17.9462 64.5282 19.4472 61.8264 22.5872C69.3315 26.425 76.853 31.9261 84.1228 39.1311C79.7009 53.5735 61.8669 64.3728 36.1627 67.5534L13.8337 105.996L16.6573 108C21.9393 101.818 31.7001 97.9798 42.037 93.9148C52.5199 89.7931 63.3517 85.5334 70.1267 78.3771C78.9138 69.095 80.9504 57.0137 82.5812 47.3097C83.3196 42.9283 84.0498 39.1067 85.1046 36.4617C88.5124 27.8936 93.5347 27.285 94.411 27.0011L113.162 26.425C114.736 26.3439 116.245 25.784 117.503 24.8266L119.004 23.6744L94.1108 23.5365V23.5284Z"
      fill="#413142"
    />
    <path
      d="M83.3193 38.8876C46.0044 26.7657 16.5029 39.8774 8.97339 68.1294C48.9496 70.9773 78.2645 58.2307 84.1064 39.131L83.3112 38.8876H83.3193Z"
      fill="url(#paint0_linear_88_13)"
    />
    <path
      d="M84.1148 39.1311C56.0089 11.2767 24.1139 8.64787 4 30.8713C37.7693 51.2043 70.8002 54.0684 84.1148 39.1311Z"
      fill="url(#paint1_linear_88_13)"
    />
    <defs>
      <linearGradient
        id="paint0_linear_88_13"
        x1={7.3272}
        y1={56.0142}
        x2={84.9725}
        y2={45.3781}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#CDA9E2" stopOpacity={0.3} />
        <stop offset={1} stopColor="#CDA9E2" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_88_13"
        x1={8.00944}
        y1={19.3856}
        x2={82.0327}
        y2={45.1487}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFA5A5" stopOpacity={0.3} />
        <stop offset={1} stopColor="#FFA5A5" />
      </linearGradient>
    </defs>
  </svg>
)

export default Logo
