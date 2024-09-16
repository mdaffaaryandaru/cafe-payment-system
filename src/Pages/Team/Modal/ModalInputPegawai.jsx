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
} from "@mui/material";
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

const ModalInputPegawai = ({ dataForm, setDataForm, handleOnSubmit }) => {
  // for open modal add
  const [open, setOpen] = React.useState(false);
  const [reEnterPassword, setReEnterPassword] = React.useState("");

  const handleOnChange = (e) => {
    const { name, value, type } = e.target;
    setDataForm({
      ...dataForm,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  const handleReEnterPasswordChange = (e) => {
    setReEnterPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (dataForm.password !== reEnterPassword) {
      alert("Passwords do not match!");
      return;
    }
    handleOnSubmit(e);
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => setOpen(true)}
      >
        Tambah Data Pegawai
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleModal}>
          <Typography
            id="modal-modal-title"
            variant="h3"
            component="h2"
            marginBottom="1rem"
          >
            Tambah Data Pegawai
          </Typography>
          <Box
            component="form"
            sx={{ "& .MuiTextField-root": { mt: 3, width: "100%" } }}
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            <TextField
              required
              id="outlined-required"
              label="Nama Pegawai"
              color="secondary"
              name="namaPegawai"
              onChange={handleOnChange}
            />
            <TextField
              required
              id="outlined-required"
              label="Alamat Pegawai"
              color="secondary"
              name="alamatPegawai"
              onChange={handleOnChange}
            />
            <TextField
              required
              id="outlined-required"
              label="No Hp Pegawai"
              color="secondary"
              type="number"
              name="noHpPegawai"
              onChange={handleOnChange}
            />
            <TextField
              required
              id="outlined-required"
              label="Password Pegawai"
              color="secondary"
              type="password"
              name="password"
              onChange={handleOnChange}
            />
            <TextField
              required
              id="outlined-required"
              label="Re-enter Password"
              color="secondary"
              type="password"
              name="reEnterPassword"
              onChange={handleReEnterPasswordChange}
            />
            <FormControl color="secondary" fullWidth sx={{ mt: 3 }}>
              <InputLabel>Status Pegawai</InputLabel>
              <Select
                label="Status Pegawai"
                name="statusPegawai"
                value={dataForm.statusPegawai}
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
              simpan
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default ModalInputPegawai;
