import Button from "@mui/material/Button";
import { styled } from "@mui/material";

export const TabButton = styled(Button)`
  padding: 1rem;
  border: none;
  max-height: 1rem;
  text-transform: uppercase;
  &:hover {
    background: rgb(59, 83, 103);
    color: white;
  }
`;