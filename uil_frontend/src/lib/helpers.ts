export const getNameInitials = (name: string) =>
  name
    ?.split(" ")
    ?.slice(0, 2)
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();

export const getFullName = (
  first_name?: string | null,
  father_name?: string | null,
  grand_father_name?: string | null,
) => [first_name, father_name, grand_father_name].filter(Boolean).join(" ");
