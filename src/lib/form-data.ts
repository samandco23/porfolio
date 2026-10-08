/** Support both native checkboxes and booleans serialized by React Hook Form. */
export function readFormBoolean(formData: FormData, name: string): boolean {
  const value = formData.get(name);
  return value === "on" || value === "true";
}
