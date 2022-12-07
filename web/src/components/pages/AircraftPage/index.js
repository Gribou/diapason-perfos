import React, { Fragment } from "react";
import { useParams, Navigate } from "react-router-dom";
import { AirplaneTakeoff } from "mdi-material-ui";
import { CircularProgress, Typography, Stack } from "@mui/material";
import {
  useAircraftByCodeQuery,
  useAircraftByPkQuery,
} from "features/aircrafts/hooks";
import HeaderTitle from "components/misc/HeaderTitle";
import ErrorBox from "components/misc/ErrorBox";
import AircraftPicture from "./AircraftPicture";
import MainData from "./MainData";
import ReferenceAircraftLink from "./ReferenceAircraftLink";
import SpeedTable from "./SpeedTable";
import { capitalize } from "./utils";
import { ROUTES } from "routes";

function AircraftPageByCode({ code }) {
  const query = useAircraftByCodeQuery(code);
  const { data: aircraft, isSuccess, isLoading, errors } = query;

  const empty_display = isSuccess && !aircraft && (
    <Typography color="textSecondary" sx={{ mt: 4 }}>
      Ce type avion n&apos;est pas dans la base de données.
    </Typography>
  ); //TODO alert admin

  return isSuccess && aircraft ? (
    <Navigate
      to={ROUTES.aircraftByPk.path.replace(":pk", aircraft?.pk)}
      replace
    />
  ) : (
    <Stack sx={{ flexGrow: 1 }}>
      <HeaderTitle title={code} Icon={AirplaneTakeoff} />
      {isLoading && <CircularProgress sx={{ mt: 8, mx: "auto" }} size={60} />}
      <ErrorBox errorDict={errors} />
      {empty_display}
    </Stack>
  );
}

function AircraftPageByPk({ pk }) {
  const query = useAircraftByPkQuery(pk);
  const { data: aircraft, isLoading, errors, isError } = query;
  const { code, fullname, reference, manufacturer } = aircraft || {};

  const content = (
    <Fragment>
      <HeaderTitle
        title={code}
        subtitle={`${
          manufacturer && `${capitalize(manufacturer)} `
        }${fullname}`}
        big
      />
      {reference?.code === code ? (
        <MainData reference={reference} />
      ) : (
        <ReferenceAircraftLink reference={reference} />
      )}
    </Fragment>
  );

  const header = (
    <Stack direction="row" spacing={2} justifyContent="space-between">
      <Stack sx={{ flex: "1 1 0%" }} spacing={2}>
        {content}
      </Stack>
      <AircraftPicture {...aircraft} />
    </Stack>
  );

  const table = reference?.code === code && <SpeedTable {...reference} />;

  return isLoading ? (
    <CircularProgress sx={{ mt: 8, mx: "auto" }} size={60} />
  ) : isError ? (
    <ErrorBox errorDict={errors} />
  ) : (
    <Stack sx={{ flexGrow: 1 }}>
      {header}
      {table}
    </Stack>
  );
}

export default function AircraftPage() {
  const { pk, code } = useParams();

  return pk ? <AircraftPageByPk pk={pk} /> : <AircraftPageByCode code={code} />;
}
