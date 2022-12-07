import React from "react";
import { Stack, Typography, Link, Divider, Alert } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { HelpCircleOutline } from "mdi-material-ui";

import HeaderTitle from "components/misc/HeaderTitle";
import { ROUTES } from "routes";

function Subtitle({ children }) {
  return (
    <Typography
      color="textSecondary"
      variant="button"
      sx={{ mt: 2, mb: 1 }}
      gutterBottom
    >
      {children}
    </Typography>
  );
}

function Content({ children }) {
  return (
    <Typography paragraph align="justify">
      {children}
    </Typography>
  );
}

function Definition({ name, definition }) {
  return (
    <Typography paragraph>
      <strong>{name}</strong>
      {` : ${definition}`}
    </Typography>
  );
}

export default function HelpPage() {
  return (
    <Stack sx={{ flexGrow: 1, maxWidth: "md", mx: "auto" }}>
      <HeaderTitle title="FAQ" Icon={HelpCircleOutline} sx={{ mt: 2, mb: 4 }} />

      <Alert
        component={RouterLink}
        to={ROUTES.contact.path}
        severity="info"
        variant="filled"
        sx={{ mb: 2 }}
      >
        Signaler ici un manque ou une erreur
      </Alert>

      <Alert severity="warning" variant="outlined">
        Toutes les valeurs de vitesse, taux et plafond sont données à titre
        indicatif et ne présagent pas des procédures compagnies, des conditions
        météorologiques du jour ou des choix du commandant de bord.
      </Alert>

      <Subtitle>Source de données</Subtitle>

      <Content>
        Les données fournies sont issues de la base de données BADA fournies par{" "}
        <Link href="https://www.eurocontrol.int/model/bada" target="_blank">
          EuroControl
        </Link>
        . Elle est élaborée conjointement avec les constructeurs et les
        compagnies aériennes. Les données fournies sont donc sensées représenter
        la façon dont les aéronefs sont réellement opérés. Ce sont les mêmes
        données que celles utilisées par 4-Flight ou par 4ME pour modélisé les
        performances des aéronefs.
      </Content>
      <Content>
        Les vitesses sont fournies directement par la BADA selon les hypothèses
        ci-dessous. Les ordres de grandeur de taux sont calculés sur la base
        d&apos;autres paramètres fournis par la BADA.
      </Content>

      <Divider sx={{ my: 1 }} />

      <Subtitle>Hypothèses de calcul</Subtitle>

      <Content>
        L&apos;aéronef est opéré à CAS constante entre le FL100 et
        l&apos;altitude de conjonction et à Mach constant au dessus. Pour chaque
        phase de vol, les vitesses sont évaluées à DOW + 20%, à masse de
        référence et à MTOW. Les valeurs extrêmes sont présentées sur les fiches
        avions.
      </Content>

      <Subtitle>Montée</Subtitle>
      <Content>
        La montée se fait en poussée moteur &quot;CLIMB&quot; jusqu&apos;à 80%
        du plafond moteur puis en poussée &quot;MAX&quot;.
      </Content>
      <Content>
        Les fourchettes de taux de montée fournies sont évaluées pour 20%, 50%
        et 80% de la masse max de l&apos;aéronef. Ces hypothèses de masse ont
        une influence <em>très importante</em> sur le calcul d&apos;où les
        écarts très étendus entre les valeurs mini et maxi. Les valeurs extrêmes
        sont présentées sur les fiches avions.
      </Content>

      {/* <Subtitle>Descente</Subtitle>

      <Content>
        On considère que la descente se fait en poussée moteur réduite. Les
        fourchettes de taux de descente fournies sont évaluées pour 20%, 50% et
        80% de la masse max de l&apos;aéronef.
      </Content> */}

      <Divider sx={{ my: 2 }} />

      <Subtitle>Définitions</Subtitle>

      <Definition
        name="Altitude de conjonction"
        definition="Altitude à laquelle la consigne en CAS est égale à celle en Mach et où on change de mode de gestion de la vitesse."
      />
      <Definition
        name="CAS"
        definition="Calibrated Air Speed/vitesse corrigée. Vitesse indiquée corrigée des erreurs d'instrumentation ou de positionnement."
      />
      <Definition
        name="DOW"
        definition="Dry Operating Weight ou masse de base. Masse de l'avion sans carburant mais équipé des éléments fixes nécessaires à l'exécution du vol : sièges, matériel de sauvetage, équipage, ..."
      />
      {/*<Definition name="Masse de référence" definition="TODO" />*/}
      <Definition
        name="MTOW"
        definition="Maxi Take Off Weight. Masse maximale autorisée au début du roulement au décollage."
      />
      <Definition name="MMO" definition="Nombre de mach max en opération" />
      <Definition
        name="VMO"
        definition="Vitesse max en opération (CAS) en kt"
      />
    </Stack>
  );
}
