export const getNameInitials = (name?: string, backup?: string) =>
  name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase() || backup?.[0].toUpperCase();

export const getFullName = (
  first_name?: string,
  father_name?: string,
  grand_father_name?: string,
) => [first_name, father_name, grand_father_name].filter(Boolean).join(" ");
