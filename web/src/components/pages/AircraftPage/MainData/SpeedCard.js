import React from "react";
import { Speedometer } from "mdi-material-ui";
import GenericCard from "./GenericCard";

export default function SpeedCard({ vmo, mmo }) {
  return (
    <GenericCard
      Icon={Speedometer}
      textList={[`VMO : ${vmo} kt`, `MMO : ${mmo}`]}
      color="primary.light"
    />
  );
}
