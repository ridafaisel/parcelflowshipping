export function redirectByRole(role: string) {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "STAFF":
      return "/operations";
    case "CUSTOMER":
      return "/customer";
    default:
      return "/login";
  }
}
