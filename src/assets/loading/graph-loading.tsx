import React, { useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components';

const pathLength = 146;
const intervalMS = 1300;

const StyledSvg = styled.svg`
  path {
    transition: all ${intervalMS}ms ease-in-out;
  }
`;

export const GraphLoading = () => {
  const [offset, setOffset] = useState(pathLength);

  const changeOffset = () => {
    setOffset(offset => offset - pathLength);
  };

  useEffect(() => {
    changeOffset();
    const interval = setInterval(() => {
      changeOffset();
    }, intervalMS);

    return () => {
      clearInterval(interval);
    };
  }, []);
  const { colors } = useTheme();
  return (
    <StyledSvg
      width="122"
      height="27"
      viewBox="0 0 122 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.5 26L14.481 14.7498C15.7032 13.6905 17.443 13.4715 18.8896 14.1948L28.4564 18.9782C30.211 19.8555 32.3428 19.331 33.49 17.7397L43.984 3.18346C45.5121 1.06392 48.6288 0.95462 50.3016 2.96193L60.0316 14.6379C61.1922 16.0306 63.1445 16.4686 64.7889 15.7052L73.9643 11.4452C75.2287 10.8581 76.7076 10.9717 77.8675 11.745L89.1282 19.2521C90.2905 20.027 91.7727 20.1394 93.0386 19.5487L104.619 14.1445C105.508 13.7294 106.52 13.6559 107.46 13.9379L121 18"
        stroke={colors.background.tertiary}
        strokeMiterlimit="10.4714"
        strokeLinejoin="round"
        strokeWidth={2}
      />
      <path
        d="M1.5 26L14.481 14.7498C15.7032 13.6905 17.443 13.4715 18.8896 14.1948L28.4564 18.9782C30.211 19.8555 32.3428 19.331 33.49 17.7397L43.984 3.18346C45.5121 1.06392 48.6288 0.95462 50.3016 2.96193L60.0316 14.6379C61.1922 16.0306 63.1445 16.4686 64.7889 15.7052L73.9643 11.4452C75.2287 10.8581 76.7076 10.9717 77.8675 11.745L89.1282 19.2521C90.2905 20.027 91.7727 20.1394 93.0386 19.5487L104.619 14.1445C105.508 13.7294 106.52 13.6559 107.46 13.9379L121 18"
        stroke="url(#paint0_linear_341_15057)"
        strokeMiterlimit="10.4714"
        strokeLinejoin="round"
        strokeDasharray={pathLength}
        strokeDashoffset={offset}
        strokeWidth={2}
      />
      <defs>
        <linearGradient
          id="paint0_linear_341_15057"
          x1="60.25"
          y1="-9.47692"
          x2="60.25"
          y2="35.2808"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#EE410A" />
          <stop offset="0.362739" stopColor="#E93D5C" />
          <stop offset="0.690332" stopColor="#8B18DA" />
          <stop offset="1" stopColor="#2718CB" />
        </linearGradient>
      </defs>
    </StyledSvg>
  );
};
