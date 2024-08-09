import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Modal,
  Button,
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  IconButton,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const styleModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ModalEditPegawai = ({ setDataForm, dataItem, handleOnSubmit }) => {
  // for open modal add
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(dataItem);

  const handleOnChange = (e) => {
    const { name, value, type } = e.target;
    setData({
      ...data,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  const handleSubmit = (e) => {
    handleOnSubmit(e, data.id);
    setOpen(false);
  };

  useEffect(() => {
    setDataForm(data);
  }, [data]);

  return (
    <>
      <IconButton onClick={() => setOpen(true)}>
        <EditIcon />
      </IconButton>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleModal}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit Data Pegawai
          </Typography>
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { mt: 3, width: "100%" },
            }}
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            <TextField
              required
              id="outlined-required"
              label="Nama Pegawai"
              color="secondary"
              name="namaPegawai"
              value={data.namaPegawai}
              onChange={handleOnChange}
            />
            <TextField
              required
              id="outlined-required"
              label="Alamat Pegawai"
              color="secondary"
              name="alamatPegawai"
              value={data.alamatPegawai}
              onChange={handleOnChange}
            />
            <TextField
              required
              id="outlined-required"
              label="No Hp Pegawai"
              color="secondary"
              type="number"
              name="noHpPegawai"
              value={data.noHpPegawai}
              onChange={handleOnChange}
            />
            <FormControl color="secondary" fullWidth sx={{ mt: 3 }}>
              <InputLabel>Status Pegawai</InputLabel>
              <Select
                label="Status Pegawai"
                name="statusPegawai"
                value={data.statusPegawai}
                onChange={handleOnChange}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Tidak Active">Tidak Active</MenuItem>
              </Select>
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              sx={{ mt: 2 }}
              fullWidth
            >
              Simpan
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default ModalEditPegawai;
