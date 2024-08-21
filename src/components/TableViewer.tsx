import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Modal,
  Typography,
} from "@mui/material";
import React, { useMemo } from "react";
import { staticData } from "../state/store";
import { DownloadButtons } from "./DownloadButtons";

const DataTable: React.FC<{onSelect?: (row: any) => void}> = ({
  onSelect
}) => {
  const columns = staticData?.length ? Object.keys(staticData[0]).map(f => ({
    field: f,
    headerName: f,
  })) : [];

  const data = useMemo(() => {
    return staticData.map((d: any, i: number) => {
      return {
        id: i,
        ...d,
      };
    });
  }, [])

  return (
    <div style={{ maxHeight: "80vh", overflowY: "auto", width: "100%" }}>
      <DataGrid
        rows={data}
        onRowSelectionModelChange={(params) => {
          onSelect && onSelect(params);
        }}
        getRowId={(row) => row.id}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[10, 50, 100]}
        checkboxSelection
      />
    </div>
  );
};

export const DataTableModal = () => {
  const [open, setOpen] = React.useState(false);
  const [selectedIndices, setSelectedIndices] = React.useState<number[]>([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box>
      <Button
        onClick={handleOpen}
        variant="contained"
        sx={{
          display: "block",
          textTransform: "uppercase",
          fontWeight: "normal",
        }}
      >
        View Data Table
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            height: "90vh",
            backgroundColor: "white",
            width: "90vw",
            left: "5vw",
            top: "5vh",
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            borderRadius: "0.25rem",
            background: "white",
            border: `2px solid secondary.main`,
            // shadow
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Box sx={{ flex: 0, display: "flex", p: 2, justifyContent: "space-between" }}>
            <Typography component={"h3"} variant="h5">
              Data Table
            </Typography>
            <DownloadButtons 
              compact
              selectedIndices={selectedIndices}
            />
            <Button
              onClick={handleClose}
              sx={{
                flex: 0,
                height: "2rem",
                width: "1rem",
                margin: "0 1rem",
              }}
              variant="contained"
            >
              &times;
            </Button>
          </Box>
          <DataTable 
            onSelect={setSelectedIndices}
          />
        </Box>
      </Modal>
    </Box>
  );
};
