"use client"

import * as React from "react"
import { useForm, FormProvider } from "react-hook-form"

// SafeForm is a wrapper component that provides a FormProvider with a minimal
// form configuration to prevent the "Cannot destructure property 'getFieldState' of 'useFormContext(...)'" error
export function SafeForm({ children }: { children: React.ReactNode }) {
  const methods = useForm({
    mode: "onSubmit",
    defaultValues: {}
  })

  return (
    <FormProvider {...methods}>
      {children}
    </FormProvider>
  )
}
