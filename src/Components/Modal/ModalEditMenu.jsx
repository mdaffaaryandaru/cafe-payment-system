import React, { useEffect, useState } from 'react'
import { Typography, Box, Modal, Button, TextField, InputLabel, MenuItem, FormControl, Select, IconButton } from "@mui/material";
import { Edit as EditIcon} from '@mui/icons-material';

const styleModal = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const ModalEditMenu = ({setDataForm, dataItem, handleOnSubmit }) => {
  // for open modal add
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(dataItem)

  const handleOnChange = (e) => {
    const { name, value, type } = e.target

    setData({
      ...data,
      [name]: type === 'number' ? Number(value) : value,
    });
  }

  const handleSubmit = (e) => {
    handleOnSubmit(e, data.id)
    setOpen(false)
  }

  useEffect(() => {
    setDataForm(data)
  }, [data])

  return (
    <>
      <IconButton onClick={() => setOpen(true)}>
        <EditIcon />
      </IconButton>
      {/* <Button variant="contained" color="secondary" onClick={() => setOpen(true)}>Tambah Data Menu</Button> */}
      <Modal
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
      >
          <Box sx={styleModal}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
              Edit Data Menu
          </Typography>
          <Box
              component="form"
              sx={{
              '& .MuiTextField-root': { mt: 3, width: '100%' },
              }}
              autoComplete="off"
              onSubmit={handleSubmit}
          >
              <TextField
              required
              id="outlined-required"
              label="Nama Menu"
              color="secondary"
              name="namaMenu"
              value={data.namaMenu}
              onChange={handleOnChange}
              />
              <TextField
              required
              id="outlined-required"
              label="Stok"
              type="number"
              color="secondary"
              name="stokMenu"
              value={data.stokMenu}
              onChange={handleOnChange}
              />
              <FormControl color="secondary" fullWidth sx={{ mt: 3 }}>
              <InputLabel>Kategori</InputLabel>
              <Select
                  label="Kategori"
                  name="kategoriMenu"
                  value={data.kategoriMenu}
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
              value={data.hargaMenu}
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

export default ModalEditMenu