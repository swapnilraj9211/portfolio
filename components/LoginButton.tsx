"use client";

interface LoginButtonProps {
  onClick: () => void;
  role: "student" | "faculty" | "academics";
}

export default function LoginButton({ onClick, role }: LoginButtonProps) {
  const roleStyles = {
    student: "bg-white text-blue-700 hover:bg-blue-50",
    faculty: "bg-white text-emerald-700 hover:bg-emerald-50",
    academics: "bg-white text-purple-700 hover:bg-purple-50",
  };

  return (
    <button
      onClick={onClick}
      className={`mt-4 px-6 py-2 rounded-full font-semibold transition ${roleStyles[role]}`}
    >
      Login
    </button>
  );
}
