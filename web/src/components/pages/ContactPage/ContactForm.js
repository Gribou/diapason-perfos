import React from "react";
import { Stack, Button, CircularProgress } from "@mui/material";

import { useForm } from "features/utils";
import ErrorBox from "components/misc/ErrorBox";
import FormTextField from "./FormTextField";

export default function ContactForm({ onSubmit, error, isLoading }) {
  const { values, touched, handleUserInput, handleSubmit } = useForm(
    {
      message: "",
      related_type: "",
      redactor: "",
    },
    () => onSubmit(values)
  );

  const form_props = () => ({
    values,
    touched,
    errors: error || {},
    onChange: handleUserInput,
  });

  return (
    <Stack spacing={2}>
      <ErrorBox
        errorList={error ? [error.non_field_errors] : []}
        sx={{ my: 1, width: "100%" }}
      />
      <FormTextField
        fullWidth
        id="related_type"
        label="Type d'aéronef concerné"
        {...form_props()}
      />
      <FormTextField
        fullWidth
        id="redactor"
        label="Adresse e-mail de réponse (facultatif)"
        {...form_props()}
      />
      <FormTextField
        fullWidth
        required
        multiline
        rows={6}
        id="message"
        label="Problème rencontré"
        {...form_props()}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        sx={{ mt: 3, mb: 2 }}
        disabled={isLoading}
        onClick={handleSubmit}
      >
        Envoyer
        {isLoading && (
          <CircularProgress size={16} sx={{ ml: 2, color: "inherit" }} />
        )}
      </Button>
    </Stack>
  );
}
