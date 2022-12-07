import React from "react";
import { AirplaneLanding } from "mdi-material-ui";
import GenericCard from "./GenericCard";

export default function LandingDistanceCard({ landing_length }) {
  return (
    <GenericCard
      Icon={AirplaneLanding}
      textList={["Distance atterrisage :", `${landing_length} m`]}
      color="primary.light"
    />
  );
}
