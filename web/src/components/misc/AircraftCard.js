import React from "react";
import ItemCard from "components/misc/ItemCard";
import { ROUTES } from "routes";
import { getStaticFile } from "features/utils";

export default function AircraftCard({ item, ...props }) {
  const { code, fullname, picture, pk, manufacturer } = item;
  const default_picture = getStaticFile("/img/airplane_big.svg");

  return (
    <ItemCard
      title={code}
      subheader={`${manufacturer} ${fullname}`}
      image={picture || default_picture}
      to={ROUTES.aircraftByPk.path.replace(":pk", pk)}
      {...props}
    />
  );
}
