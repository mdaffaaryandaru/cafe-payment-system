import React, { useEffect, useState } from 'react'
import { Typography, Box, Modal, Button, TextField, InputLabel, MenuItem, FormControl, Select } from "@mui/material";
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const styleModal = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const ModalInputMenu = ({ dataForm, setDataForm, handleOnSubmit }) => {
  // for open modal add
  const [open, setOpen] = React.useState(false);
  const [filename, setFilename] = useState({})

  const handleOnChange = (e) => {
    const { name, value, type, files } = e.target
    if (type === 'file') {
      setFilename(files[0])
    }
    setDataForm({
      ...dataForm,
      [name]: type === 'number' ? Number(value) : type === 'file' ? files[0] : value,
    });
  }

  const handleSubmit = (e) => {
    handleOnSubmit(e)
    setOpen(false)
  } 

  return (
    <>
      <Button variant="contained" color="secondary" onClick={() => setOpen(true)}>Tambah Data Menu</Button>
      <Modal
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
      >
          <Box sx={styleModal}>
          <Typography id="modal-modal-title" variant="h3" component="h2" marginBottom='1rem'>
              Tambah Data Menu
          </Typography>
          <Box
              component="form"
              sx={{
              '& .MuiTextField-root': { mt: 3, width: '100%' },
              }}
              autoComplete="off"
              onSubmit={handleSubmit}
          >
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
                color="secondary"
              >
                Upload file
                <VisuallyHiddenInput type="file" onChange={handleOnChange} name='gambarMenu'/>
              </Button>
              <p>{filename.name ?? 'No file uploaded'}</p>
              <TextField
              required
              id="outlined-required"
              label="Nama Menu"
              color="secondary"
              name="namaMenu"
              onChange={handleOnChange}
              />
              <TextField
              required
              id="outlined-required"
              label="Stok"
              type="number"
              color="secondary"
              name="stokMenu"
              onChange={handleOnChange}
              />
              <FormControl color="secondary" fullWidth sx={{ mt: 3 }}>
              <InputLabel>Kategori</InputLabel>
              <Select
                  label="Kategori"
                  name="kategoriMenu"
                  value={dataForm.kategoriMenu}
                  onChange={handleOnChange} // Menggunakan handleChange yang sama
              >
                  <MenuItem value="Makanan">Makanan</MenuItem>
                  <MenuItem value="Minuman">Minuman</MenuItem>
              </Select>
              </FormControl>
              <TextField
              required
              id="outlined-required"
              label="Harga"
              type="number"
              color="secondary"
              name="hargaMenu"
              onChange={handleOnChange}
              />
              <Button type="submit" variant="contained" color="secondary" sx={{ mt: 2 }} fullWidth>
              simpan
              </Button>
          </Box>
          </Box>
      </Modal>
    </>
  )
}

export default ModalInputMenu