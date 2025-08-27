import { Avatar } from "@mui/material";
import { FaUser } from "react-icons/fa";
import React from "react";

// Function to generate a consistent random color based on name
const stringToColor = (string) => {
  if (!string) return "#BDBDBD"; // Default to gray if no name is provided

  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 70%, 50%)`;
};

export default function UserAvatar({ img, name, size = 35 }) {
  // Function to get initials from name or return <FaUser /> icon
  const getInitials = (fullName) => {
    if (!fullName) return <FaUser size={size * 0.6} color="#FFF" />; // Return FaUser icon if name is missing
    const nameParts = fullName.trim().split(" ");
    return nameParts.length > 1
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
      : nameParts[0][0].toUpperCase();
  };

  return (
    <Avatar
      alt={name || "User"}
      sx={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        bgcolor: img ? "transparent" : stringToColor(name),
        color: "#FFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      src={img && img !== "" ? img : undefined}
    >
      {!img ? getInitials(name) : null}
    </Avatar>
  );
}
