import {
  Fan,
  Engine,
  LightningBolt,
  Help,
  AlphaLCircle,
  AlphaHCircle,
  AlphaMCircleOutline,
  AlphaSCircle,
} from "mdi-material-ui";
import Turbine from "components/logos/Turbine";

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.toLowerCase().slice(1);
}

export function getIconFromEngineType(engine_type) {
  switch (engine_type) {
    case "Réacteur":
      return Turbine;
    case "Turboprop":
      return Fan;
    case "Piston":
      return Engine;
    case "Electrique":
      return LightningBolt;
  }
  return Help;
}

export function getIconFromWakeCat(wake_cat) {
  switch (wake_cat) {
    case "Light":
      return AlphaLCircle;
    case "Medium":
      return AlphaMCircleOutline;
    case "Heavy":
      return AlphaHCircle;
    case "Super":
      return AlphaSCircle;
  }
  return Help;
}

//   const pretty_mass = (mass) => {
//     const value = parseInt(mass, 10);
//     return value % 100 === 0 ? `${value / 1000} t` : `${value} kg`;
//   };

export const pretty_altitude = (altitude) => {
  // show FL with 10 FL precision
  const value = parseInt(altitude, 10);
  return value > 7000 ? `FL ${Math.floor(value / 500) * 5}` : `${value} ft`;
};

export const pretty_rate = (rate) => `${Math.round(rate, 1)} ft/min`;
