import React from "react";

function PinIcon({ outlined, ...props }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 0C7.20726 0 3.30811 3.89916 3.30811 8.69184C3.30811 14.6397 11.0865 23.3715 11.4177 23.7404C11.7287 24.0868 12.2718 24.0862 12.5823 23.7404C12.9135 23.3715 20.6919 14.6397 20.6919 8.69184C20.6918 3.89916 16.7927 0 12 0ZM12 13.065C9.58865 13.065 7.62693 11.1032 7.62693 8.69184C7.62693 6.2805 9.5887 4.31878 12 4.31878C14.4113 4.31878 16.373 6.28055 16.373 8.69189C16.373 11.1032 14.4113 13.065 12 13.065Z"
        fill={outlined ? "none" : "currentColor"}
        stroke={outlined ? "currentColor" : "none"}
      />
    </svg>
  );
}

export default PinIcon;
export { PinIcon };
