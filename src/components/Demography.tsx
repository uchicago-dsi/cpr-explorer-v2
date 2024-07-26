// import React from "react"
import Box from "@mui/material/Box"

export const Demography = () => {
  return (
    <Box
      component="main"
      sx={{
        display: "flex",
        flexDirection: "row",
        background: "white",
        margin: "1rem",
        borderRadius: "0.25rem",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        padding:"1rem"
      }}
    >
      <iframe 
        style={{
          width:'100%',
          minHeight: "200vh",
          border: 'none',
          outline: 'none'
        }}
      src="/legacy-demography.html"></iframe>
      </Box>
)}