import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

export default function ResponsiveDialog(props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [newRole, setNewRole] = React.useState("user");

  const handleChange = (e) => {
    setNewRole(e.target.value);
  };

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={props.open}
        onClose={props.close}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{"Modify Role"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Choose which role you want to assign to this user:
          </DialogContentText>
          <select
            className="form-select mt-2"
            aria-label="Default select example"
            onChange={handleChange}
          >
            <option value="user">User</option>
            <option value="provider">Provider</option>
          </select>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={props.close}>
            Cancel
          </Button>
          <Button onClick={() => props.editRole(newRole)} autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
