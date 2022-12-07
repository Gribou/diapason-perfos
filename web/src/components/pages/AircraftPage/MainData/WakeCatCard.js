import React from "react";
import GenericCard from "./GenericCard";
import { getIconFromWakeCat } from "../utils";

export default function WakeCatCard({ wake_cat }) {
  return (
    <GenericCard
      Icon={getIconFromWakeCat(wake_cat)}
      textList={["Turbulence de sillage :", wake_cat]}
      color="error.light"
    />
  );
}
