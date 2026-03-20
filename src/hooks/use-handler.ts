"use client";

import { useCallback, useMemo, useState } from "react";

export interface UseHandlerReturn<T extends Record<string, unknown>> {
  /** Current form values */
  values: T;
  /** Update a specific field by key */
  handleChange: <K extends keyof T>(key: K, value: T[K]) => void;
  /** Update a nested field using dot notation (e.g., "address.city") */
  setFieldValue: (path: string, value: unknown) => void;
  /** Replace all values at once */
  setValues: React.Dispatch<React.SetStateAction<T>>;
  /** Reset to initial values */
  reset: () => void;
  /** Reset to specific values and update initial state */
  resetTo: (newInitial: T) => void;
  /** Whether form has been modified from initial values */
  isDirty: boolean;
  /** Get props for binding to input elements */
  getInputProps: <K extends keyof T>(
    key: K,
  ) => {
    value: T[K];
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  };
  /** Get props for binding to checkbox elements */
  getCheckboxProps: <K extends keyof T>(
    key: K,
  ) => {
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
  /** Handle native input change events */
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  /** Get a specific field value */
  getValue: <K extends keyof T>(key: K) => T[K];
  /** Check if a specific field has changed from initial value */
  isFieldDirty: <K extends keyof T>(key: K) => boolean;
  /** Get all changed fields */
  getDirtyFields: () => Partial<T>;
}

export const useHandler = <T extends Record<string, unknown>>(initialValues: T): UseHandlerReturn<T> => {
  const [values, setValues] = useState<T>(initialValues);
  const [initial, setInitial] = useState<T>(initialValues);

  const handleChange = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const setFieldValue = useCallback((path: string, value: unknown) => {
    setValues((prev) => {
      const keys = path.split(".");
      const result = { ...prev };

      if (keys.length === 1) {
        return { ...prev, [path]: value } as T;
      }

      let current: Record<string, unknown> = result;
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        current[key] = { ...(current[key] as Record<string, unknown>) };
        current = current[key] as Record<string, unknown>;
      }

      current[keys[keys.length - 1]] = value;
      return result;
    });
  }, []);

  const reset = useCallback(() => {
    setValues(initial);
  }, [initial]);

  const resetTo = useCallback((newInitial: T) => {
    setInitial(newInitial);
    setValues(newInitial);
  }, []);

  const isDirty = useMemo(() => {
    return JSON.stringify(values) !== JSON.stringify(initial);
  }, [values, initial]);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === "number" ? (value === "" ? "" : Number(value)) : value;
    setValues((prev) => ({ ...prev, [name]: finalValue as T[keyof T] }));
  }, []);

  const getInputProps = useCallback(
    <K extends keyof T>(key: K) => ({
      value: values[key],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { value, type } = e.target;
        const finalValue = type === "number" ? (value === "" ? "" : Number(value)) : value;
        handleChange(key, finalValue as T[K]);
      },
    }),
    [values, handleChange],
  );

  const getCheckboxProps = useCallback(
    <K extends keyof T>(key: K) => ({
      checked: Boolean(values[key]),
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        handleChange(key, e.target.checked as T[K]);
      },
    }),
    [values, handleChange],
  );

  const getValue = useCallback(<K extends keyof T>(key: K): T[K] => values[key], [values]);

  const isFieldDirty = useCallback(
    <K extends keyof T>(key: K): boolean => {
      return JSON.stringify(values[key]) !== JSON.stringify(initial[key]);
    },
    [values, initial],
  );

  const getDirtyFields = useCallback((): Partial<T> => {
    const dirty: Partial<T> = {};
    for (const key in values) {
      if (JSON.stringify(values[key]) !== JSON.stringify(initial[key])) {
        dirty[key] = values[key];
      }
    }
    return dirty;
  }, [values, initial]);

  return {
    values,
    handleChange,
    setFieldValue,
    setValues,
    reset,
    resetTo,
    isDirty,
    getInputProps,
    getCheckboxProps,
    onChange,
    getValue,
    isFieldDirty,
    getDirtyFields,
  };
};
