import React from "react";
import GenericCard from "./GenericCard";
import { getIconFromEngineType } from "../utils";

export default function EngineCard({ engine_type, number_of_engines }) {
  return (
    <GenericCard
      Icon={getIconFromEngineType(engine_type)}
      textList={[
        "Motorisation :",
        `${number_of_engines} ${engine_type}${
          number_of_engines > 1 ? "s" : ""
        }`,
      ]}
      color="warning.light"
    />
  );
}
