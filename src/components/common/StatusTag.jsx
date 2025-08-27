import React from "react";

export const StatusTag = ({ status, className }) => {
  function getColorAndBgColor() {
    switch (status) {
      case "Enabled":
        return { color: "#095512", backgroundColor: "#EFFBE7" };
      case "Disabled":
        return { color: "#905900", backgroundColor: "#FDF8E4" };
      case "pending":
        return { color: "#45C1B6", backgroundColor: "#45c1b71c" };
      case "rejected":
        return { color: "red", backgroundColor: "rgba(189, 22, 22, 0.12)" };
      case "approved":
        return { color: "green", backgroundColor: "rgba(0, 128, 0, 0.133)" };
      case "upcoming":
        return { color: "#905900", backgroundColor: "#FDF8E4" };
      case "cancelled":
        return { color: "#D00416", backgroundColor: "#FB37481A" };
      case "Active":
        return { color: "#095512", backgroundColor: "#EFFBE7" };
         case "Completed":
        return { color: "#095512", backgroundColor: "#EFFBE7" };
         case "user cancel":
        return { color: "red", backgroundColor: "rgba(235, 0, 0, 0.12)" };
        case "professional cancel":
        return { color: "red", backgroundColor: "rgba(235, 0, 0, 0.12)" };
      default:
        return { color: "#095512", backgroundColor: "#EFFBE7" };
    }
  }

  return (
    <div
      className={`status_tag_con ${className}`}
      style={getColorAndBgColor(status)}
    >
      <div
        className={`status_tag_dot
       
       `}
        style={{ backgroundColor: getColorAndBgColor(status).color }}
      ></div>
      {status}
    </div>
  );
};
