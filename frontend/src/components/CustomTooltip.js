import React from "react";
import { Tooltip, Box } from "@mui/material";

const CustomTooltip = ({ children, title }) => {
  return (
    <Tooltip
      title={
        <Box
          component="span"
          sx={{
            color: "#F3F2EC",
            p: 0.5,
            borderRadius: 1,
            fontSize: 12,
            boxShadow: 3,
          }}
        >
          {title}
        </Box>
      }
      placement="top-start"
      arrow
    >
      <div>{children}</div>
    </Tooltip>
  );
};

export default CustomTooltip;
