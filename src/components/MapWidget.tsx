import Box from "@mui/material/Box";
import { MainMapView } from "./Map";
import { FilterControls } from "./FilterControls";
import { WidgetContainer } from "./WidgetContainer";

export const MapWidget = () => {
  return (
    <WidgetContainer>
      <FilterControls />
      <Box
        component="div"
        sx={{ flexDirection: "column", gap: 4, flexGrow: 1 }}
      >
        <MainMapView />
      </Box>
      </WidgetContainer>
  );
};
