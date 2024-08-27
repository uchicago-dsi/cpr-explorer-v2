import {
  Alert,
  Box,
  Button,
  Modal,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import { useStore } from "../state/store";

export const LoadSaveSelectionModal = () => {
  const [open, setOpen] = React.useState(false);
  // const [loadSave, setLoadSave] = React.useState("save");
  const [title, setTitle] = React.useState("");
  // const [saveTitle, setSaveTitle] = React.useState("");
  // const [loadedFileData, setLoadedFileData] = React.useState({} as any);

  const saveQueries = useStore((state) => state.saveQueries);
  const loadQueries = useStore((state) => state.loadQueries);
  const saveMessage = useStore((state) => state.saveMessage);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const savedQueries = JSON.parse(
    localStorage.getItem("saved-queries") || "[]"
  );
  const titleInUse = savedQueries?.find((f: any) => f.title === title);

  return (
    <Box>
      <Button
        onClick={handleOpen}
        variant="outlined"
        sx={{
          display: "block",
          textTransform: "uppercase",
          fontWeight: "normal",
        }}
      >
        Load or Save Your Selections
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="save-load-modal"
        aria-describedby="save-load-modal-description"
      >
        <Box
          sx={{
            height: "90vh",
            backgroundColor: "white",
            width: "90vw",
            left: "5vw",
            top: "5vh",
            p: 4,
            boxSizing: "border-box",
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Box my={2} pr={4}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Load or Save Your Selections
              </Typography>
              <Typography variant="body1">
                Use the menu below to save your selected data filters
                (geography, date range, active ingredient, etc.). You can create
                a shareable URL that can be saved to your bookmarks or shared
                with others. You can save your selections to your web browser to
                return to them later on this computer. Please note that clearing
                your browser's web data or cache may delete these saved
                selections.
              </Typography>
            </Box>
            <Button
              onClick={handleClose}
              sx={{ padding: "1rem", fontWeight: "bold" }}
            >
              Close
            </Button>
          </Box>
          <hr />
          {/* <Box
            sx={{
              width: "100%",
              display: "flex",
              gap: "0.125rem",
              flexDirection: "row",
              borderBottom: "1px solid #ccc",
              mb: 2,
            }}
          >
            <Button
              onClick={() => setLoadSave("load")}
              variant="contained"
              sx={{
                textTransform: "uppercase",
                padding: "0.5rem",
                fontWeight: loadSave === "load" ? "bold" : "normal",
                backgroundColor: loadSave === "load" ? "primary.main" : "white",
                color: loadSave === "load" ? "white" : "black",
                boxShadow: "none",
              }}
            >
              Load
            </Button>
            <Button
              onClick={() => setLoadSave("save")}
              variant="contained"
              sx={{
                textTransform: "uppercase",
                padding: "0.5rem",
                fontWeight: loadSave === "save" ? "bold" : "normal",
                backgroundColor: loadSave === "save" ? "primary.main" : "white",
                color: loadSave === "save" ? "white" : "black",
                boxShadow: "none",
              }}
            >
              Save
            </Button>
          </Box> */}
          {/* {loadSave === "load" && (
            <Box sx={{ py: 2 }}>
              <Typography
                component="h4"
                fontWeight="bold"
                sx={{
                  mb: 2,
                }}
              >
                Load from file
              </Typography>
              <input
                type="file"
                accept=".json"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      const content = e.target?.result;
                      if (content) {
                        setLoadedFileData(JSON.parse(content as string));
                      }
                    };
                    reader.readAsText(file);
                  }
                }}
              />
              {!!Object.keys(loadedFileData)?.length && (
                <Button
                  variant="outlined"
                  sx={{
                    display: "block",
                    mt: 2,
                  }}
                  onClick={() => loadQueries("", "download", loadedFileData)}
                >
                  Load Selections from file
                </Button>
              )}

              <br />
              <br />
            </Box>
          )} */}
          {true && ( //loadSave === "save" && (
            <Box>
              {!!saveMessage?.length && (
                <Alert
                  severity={"info"}
                  sx={{
                    maxWidth: "100%",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    my: 2,
                  }}
                >
                  {saveMessage}
                </Alert>
              )}
              {/* <p>todo save to file</p> */}
              <Typography component="h4" fontWeight="bold" sx={{ mb: 2 }}>
                Save to shareable URL
              </Typography>
              <Button
                variant="outlined"
                onClick={() => saveQueries(title, "url")}
              >
                Copy Shareable URL to Clipboard
              </Button>
              {/* box flex setup */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 2,
                  mt: 2,
                  pt: 2,
                }}
              >
                <Box flex={1}>
                  <Typography component="h4" fontWeight="bold" sx={{mb:2}}>
                    Save to your web browser
                    <Tooltip
                      title="Your selections will be saved to your browser's local storage. You can find them again on this device only."
                      placement="right"
                    >
                      <span style={{ margin: "0 0.5rem" }}>{"\u2139"}</span>
                    </Tooltip>
                  </Typography>
                  <TextField
                    label="Name Your Selections (Data Filters)"
                    variant="outlined"
                    sx={{ width: "100%", mb: 1 }}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  {titleInUse && (
                    <Alert severity={"warning"} sx={{ mb: 1 }}>
                      This will overwrite your existing saved filters named "
                      {title}"
                    </Alert>
                  )}
                  <Button
                    variant="outlined"
                    onClick={() => saveQueries(title, "localStorage")}
                  >
                    Save to Browser
                  </Button>
                </Box>
                <Box flex={1}>
                  <Typography component="h4" fontWeight="bold">
                    Your saved selections
                  </Typography>
                  {!!savedQueries?.length ? (
                    <>
                      {savedQueries.map((query: any, i: number) => (
                        <Button
                          variant="outlined"
                          onClick={() =>
                            loadQueries(query.title, "loadStorage", {})
                          }
                          sx={{
                            mr: 2,
                          }}
                          key={i}
                        >
                          {query?.title} <i>({query?.date?.slice(0, 10)})</i>
                        </Button>
                      ))}
                    </>
                  ) : (
                    <Button
                      disabled
                      variant="outlined"
                      fullWidth
                      sx={{ width: "100%" }}
                    >
                      No saved selections
                    </Button>
                  )}
                </Box>
              </Box>
              {/* save to file give title option */}

              {/* <Typography
                component="h4"
                fontWeight="bold"
                sx={{ my: 2, mt: 4 }}
              >
                Save to file
                <Tooltip
                  title="Your selections will be saved to a file on your device. You can share this file with others."
                  placement="right"
                >
                  <span style={{ margin: "0 0.5rem" }}>{"\u2139"}</span>
                </Tooltip>
              </Typography>

              <TextField
                label="Name Your Selections (Data Filters)"
                variant="outlined"
                sx={{ width: "100%", mb: 1 }}
                value={saveTitle}
                onChange={(e) => setSaveTitle(e.target.value)}
              />
              <Button
                variant="outlined"
                onClick={() => saveQueries(saveTitle, "download")}
              >
                Save to File
              </Button> */}
            </Box>
          )}
        </Box>
      </Modal>
    </Box>
  );
};
