import React from "react";
import {
  Card,
  CardMedia,
  CardActionArea,
  CardHeader,
  Typography,
  Link,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function ItemCard({
  title,
  subheader,
  href,
  to,
  image,
  small,
  sx = [],
  ...props
}) {
  const linkProps = to
    ? { component: RouterLink, to }
    : {
        component: Link,
        href,
        rel: "noopener noreferrer",
        target: "_blank",
        underline: "none",
      };

  return (
    <Card
      sx={[
        { display: "flex", alignItems: "stretch" },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    >
      <CardActionArea
        {...linkProps}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        <CardMedia
          component="img"
          image={image}
          height={small ? "80" : "140"}
          sx={{ border: "1px solid #1e1e1e" }}
        />
        <CardHeader
          sx={{
            textDecoration: "none",
            color: "text.primary",
            flexGrow: 1,
          }}
          title={
            <Typography
              component="h4"
              sx={{ typography: { xs: "body1", sm: small ? "body1" : "h6" } }}
            >
              {title}
            </Typography>
          }
          subheader={!small && subheader}
        />
      </CardActionArea>
    </Card>
  );
  // return (
  //   <Card
  //     sx={[
  //       { display: "flex", alignItems: "center" },
  //       ...(Array.isArray(sx) ? sx : [sx]),
  //     ]}
  //     {...props}
  //   >
  //     <CardHeader
  //       sx={{
  //         textDecoration: "none",
  //         color: "text.primary",
  //         "& .MuiCardHeader-content": { flex: "1 1 auto", width: "80%" },
  //       }}
  //       title={
  //         <Typography
  //           component="h4"
  //           sx={{ typography: { xs: "body1", sm: "h6" } }}
  //         >
  //           {title}
  //         </Typography>
  //       }
  //       subheader={subheader}
  //       avatar={avatar}
  //       {...linkProps}
  //     />
  //   </Card>
  // );
}
