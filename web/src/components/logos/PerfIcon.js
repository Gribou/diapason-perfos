import React from "react";
import SvgIcon from "@mui/material/SvgIcon";
import { useTheme } from "@mui/material/styles";

export default function PerfIcon({ baseColor, accentColor, ...props }) {
  const theme = useTheme();
  const baseStyle = {
    fill: baseColor || theme.palette.primary.main,
    display: "inline",
  };

  const accentStyle = {
    display: "inline",
    fill: accentColor || theme.palette.primary.main,
    stroke: "none",
  };

  return (
    <SvgIcon viewBox="0 0 189.86496 185.74362" {...props}>
      <g
        id="layer3"
        style={{ display: "inline" }}
        transform="translate(-64.510947,-2.0844952)"
      >
        <path
          style={accentStyle}
          d="m 103.21563,15.622573 c -1.95095,1.805797 -4.432198,4.822244 -6.883014,5.855589 -1.142044,0.481616 -2.408341,-0.35563 -3.577012,-0.350278 -1.737949,0.008 -3.389048,1.643591 -4.120616,3.095543 5.328591,2.503135 6.460492,5.369736 9.192144,10.193604 l 3.251488,-3.504306 0.2,-3.817696 6.69157,-6.057104 c 1.15916,4.259589 3.37161,9.982279 5.82053,13.655289 1.22604,1.838353 3.70728,1.158567 4.22141,-0.914494 1.38484,-5.581157 -4.37863,-11.959009 -3.31646,-17.519047 0.73917,-3.868345 12.21794,-8.3748748 7.76672,-12.9878023 -4.71778,-4.8894549 -9.73353,6.8963583 -13.85826,6.9840233 -5.6126,0.119265 -11.13042,-6.919705 -16.799437,-6.3587223 -2.150328,0.2127785 -3.175093,2.6672681 -1.512583,4.1485262 3.333578,2.9697481 8.822873,5.8520541 12.92352,7.5768751 m 134.07852,21.342859 c -1.21907,0.390543 -4.25406,1.587973 -4.11428,3.199199 0.22854,2.63441 3.47178,6.196119 4.66961,8.587156 3.25022,6.486955 6.14891,13.069157 8.13632,20.068662 8.57278,30.190585 0.0824,62.188311 -20.79041,85.371431 -25.33862,28.14327 -69.94811,36.82057 -103.91244,20.30502 C 98.843022,163.58497 82.115857,143.66412 74.079387,120.10702 66.82742,98.849847 68.665531,75.459033 77.955936,55.12279 79.90372,50.858996 82.07053,46.629606 84.62341,42.699335 c 1.684381,-2.592998 4.033766,-5.154142 5.27946,-7.963754 -0.961371,-0.735532 -2.466347,-2.671297 -3.775118,-2.536614 -1.016208,0.10458 -1.789615,1.480493 -2.331318,2.218064 -1.808634,2.461756 -3.42233,5.023536 -4.98753,7.645203 -6.218961,10.416908 -10.453687,21.848398 -12.741263,33.766318 -6.055086,31.546968 5.987573,64.482508 28.589786,86.640858 30.966113,30.35814 81.444303,33.17413 117.279083,9.97794 15.37751,-9.95405 27.54664,-24.95745 34.73141,-41.82818 9.182,-21.56138 10.2074,-45.592802 2.82484,-67.851177 -3.06732,-9.247192 -8.14107,-17.079065 -12.19861,-25.802561"
          id="path309"
        />
        <path
          style={baseStyle}
          d="m 159.44342,48.921725 a 46.034587,46.034587 0 0 0 -46.03458,46.034584 46.034587,46.034587 0 0 0 46.03458,46.034581 46.034587,46.034587 0 0 0 46.03459,-46.034581 46.034587,46.034587 0 0 0 -46.03459,-46.034584 m 0,9.206917 a 36.82767,36.82767 0 0 1 36.82769,36.827667 c 0,11.048301 -4.60347,20.715561 -12.42936,27.620741 -6.44483,-5.98449 -15.1914,-9.20691 -24.39833,-9.20691 -9.20692,0 -17.49314,3.22242 -24.39832,9.20691 -7.82588,-6.90518 -12.42934,-16.57244 -12.42934,-27.620741 a 36.82767,36.82767 0 0 1 36.82766,-36.827667 m 9.20693,8.700537 c -1.74932,0.04604 -3.40655,1.196899 -4.14311,2.992248 l -5.93847,14.869173 -0.46034,1.05879 c -3.26846,0.598452 -5.98451,2.762084 -7.22743,5.800365 -1.88741,4.741575 0.41431,10.081565 5.15587,11.968975 4.74155,1.88742 10.08157,-0.41431 11.96899,-5.155846 1.1969,-3.038298 0.64449,-6.536925 -1.33501,-9.114858 l 0.46036,-1.196904 5.93844,-14.777101 0.0461,-0.1381 c 0.92069,-2.347763 -0.23017,-5.017769 -2.57794,-5.984496 -0.59845,-0.230172 -1.19689,-0.322241 -1.88742,-0.322241 m -18.41384,0.50638 a 4.6034587,4.6034587 0 0 0 -4.60344,4.603457 4.6034587,4.6034587 0 0 0 4.60344,4.603456 4.6034587,4.6034587 0 0 0 4.60346,-4.603456 4.6034587,4.6034587 0 0 0 -4.60346,-4.603457 m -13.81037,13.810377 a 4.6034587,4.6034587 0 0 0 -4.60344,4.603449 4.6034587,4.6034587 0 0 0 4.60344,4.603463 4.6034587,4.6034587 0 0 0 4.60347,-4.603463 4.6034587,4.6034587 0 0 0 -4.60347,-4.603449 m 46.0346,0 a 4.6034587,4.6034587 0 0 0 -4.60346,4.603449 4.6034587,4.6034587 0 0 0 4.60346,4.603463 4.6034587,4.6034587 0 0 0 4.60344,-4.603463 4.6034587,4.6034587 0 0 0 -4.60344,-4.603449 z"
          id="path1029"
        />
      </g>
    </SvgIcon>
  );
}