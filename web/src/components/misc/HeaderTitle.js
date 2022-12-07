import React from "react";
import { Stack, Typography, CircularProgress } from "@mui/material";

export default function HeaderTitle({
  Icon,
  title,
  subtitle,
  comment,
  loading,
  highlight,
  big,
  ...props
}) {
  return (
    <Stack direction="row" alignItems="baseline" {...props}>
      {Icon && (
        <Icon
          fontSize="large"
          sx={{
            mr: 2,
            alignSelf: "center",
            fontSize: big ? "48px" : undefined,
          }}
          color={highlight ? "primary" : "inherit"}
        />
      )}
      <Typography
        component="span"
        sx={{ mr: 1, typography: { xs: "h5", sm: big ? "h3" : "h4" } }}
      >
        {title}
      </Typography>
      <Typography
        component="span"
        variant={big ? "h5" : "h6"}
        sx={{ mr: 1 }}
        noWrap
      >
        {subtitle}
      </Typography>
      <Typography component="span" variant="subtitle2" noWrap>
        {comment}
      </Typography>
      {loading && <CircularProgress size="24px" sx={{ ml: 2 }} />}
    </Stack>
  );
}
