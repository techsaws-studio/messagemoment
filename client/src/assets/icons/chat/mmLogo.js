import * as React from "react"
const MMLogo = ({onClick}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={49}
    height={40}
    onClick={onClick}
  >
    <g fill="#fff" clipPath="url(#a)">
      <path d="m28.337 14.57 3.212 7.572 3.212-7.572h2.83v10.937h-2.18v-7.19l-3.097 7.229h-1.492l-3.097-7.228v7.227h-2.18V14.57h2.791ZM37.592 40h10.937V0H37.592v3.365h7.533v33.27h-7.533V40ZM22.983 14.57v10.937h-2.18v-7.19l-3.097 7.229h-1.491l-3.098-7.228v7.227h-2.18V14.57h2.83l3.213 7.572 3.212-7.572h2.791ZM10.937 40H0V0h10.937v3.365H3.365v33.27h7.572V40Z" />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h48.528v40H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default MMLogo
