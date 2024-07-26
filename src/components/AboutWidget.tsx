import { Typography } from "@mui/material"
import { WidgetContainer } from "./WidgetContainer"

export const AboutWidget = () => {
  return <WidgetContainer>
    <Typography component={"h3"}
    fontSize={"1.5rem"}
    fontWeight={"bold"}
    >
      About
    </Typography>
    <Typography component={"p"}>
      Content
    </Typography>
  </WidgetContainer>
}