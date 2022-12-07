import React from "react";
import { Stack, Typography } from "@mui/material";
import { useContactMutation } from "features/contact/hooks";
import HeaderTitle from "components/misc/HeaderTitle";
import ContactForm from "./ContactForm";

export default function ContactPage() {
  const [sendContact, status] = useContactMutation();
  const { isLoading } = status;
  return (
    <Stack sx={{ flexGrow: 1, maxWidth: "sm", mx: "auto" }}>
      <HeaderTitle
        loading={isLoading}
        title="Formulaire de signalement"
        sx={{ mt: 2, mb: 4 }}
      />
      <Typography variant="body2" gutterBottom>
        Ce formulaire vous permet de prévenir l&apos;administrateur de tout
        manque ou erreur repéré dans l&apos;application.
      </Typography>
      <ContactForm {...status} onSubmit={sendContact} />
    </Stack>
  );
}
