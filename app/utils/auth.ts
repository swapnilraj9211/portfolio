export const isAdmin = () => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("role") === "admin";
};
