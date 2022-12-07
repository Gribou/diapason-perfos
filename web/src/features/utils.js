import { useState, useEffect, useCallback } from "react";
import { PUBLIC_URL, DEBUG } from "constants";

export const cleanSearchParam = (text) =>
  text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toUpperCase();

export function getStaticFile(path) {
  return `${PUBLIC_URL}${DEBUG ? "" : "/static"}${path}`;
}

export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useForm(initialValues = {}, onSubmit) {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});

  const handleUserInput = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
    if (!touched[name]) {
      setTouched({ ...touched, [name]: true });
    }
  };

  const handleSubmit = (e) => {
    onSubmit(values);
    setTouched({});
    e.preventDefault();
  };

  const reset = useCallback((values) => {
    setValues(values);
    setTouched({});
  }, []);

  return { values, touched, handleUserInput, handleSubmit, reset };
}
