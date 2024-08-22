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
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const styleModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1000,
  maxHeight: "90vh",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const ModalEditMenu = ({ setDataForm, dataItem, handleOnSubmit }) => {
  // for open modal add
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(dataItem);

  const [filename, setFilename] = useState({});
  const [toppingFields, setToppingFields] = useState([{ namaToping: '', hargaToping: '' }]);

  const handleOnChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFilename(files[0]);
    }
    setData({
      ...data,
      [name]:
        type === "number" ? Number(value) : type === "file" ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    handleOnSubmit(e, data.id);
    setOpen(false);
  };

  useEffect(() => {
    setDataForm(data);
  }, [data]);

  //TOPING
  // Fungsi untuk menangani perubahan input
  const handleToppingChange = (index, event) => {
    const { name, value, type } = event.target;
    const updatedFields = toppingFields.map((field, i) => 
      i === index ? { ...field, [name]: type === "number" ? Number(value) : value } : field
    );

    setData({
      ...data,
      topings: updatedFields
    });
    setToppingFields(updatedFields);
  };

  // Fungsi untuk menambah field topping
  const handleAddToppingField = () => {
    if (toppingFields.length < 7) {
      setToppingFields([...toppingFields, { namaToping: '', hargaToping: '' }]);
    }
  };

  // Fungsi untuk menghapus field topping
  const handleRemoveToppingField = (index) => {
    setToppingFields(toppingFields.filter((_, i) => i !== index));
  };

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
          <Typography id="modal-modal-title" variant="h3" component="h2" marginBottom="1rem">Edit Data Menu</Typography>
          <Box component="form" sx={{"& .MuiTextField-root": { mt: 3, width: "100%" },}} autoComplete="off" onSubmit={handleSubmit}>
            <div className="">
              <Button component="label" role={undefined} variant="contained" tabIndex={-1} startIcon={<CloudUploadIcon />} color="secondary">
                Upload file
                <VisuallyHiddenInput type="file" onChange={handleOnChange} name="gambarMenu"/>
              </Button>
              <p>{filename.name ?? data.gambarMenu}</p>
              <div className="w-full grid grid-cols-2 gap-5">
                <TextField required id="outlined-required" label="Nama Menu" color="secondary" name="namaMenu" value={data.namaMenu} onChange={handleOnChange}/>
                <TextField required id="outlined-required" label="Stok" type="number" color="secondary" name="stokMenu" value={data.stokMenu} onChange={handleOnChange}/>
                <FormControl color="secondary" fullWidth sx={{ mt: 3 }}>
                  <InputLabel>Kategori</InputLabel>
                  <Select label="Kategori" name="kategoriMenu" value={data.kategoriMenu} onChange={handleOnChange}>
                    <MenuItem value="Makanan">Makanan</MenuItem>
                    <MenuItem value="Minuman">Minuman</MenuItem>
                  </Select>
                </FormControl>
                <TextField required id="outlined-required" label="Harga" type="number" color="secondary" name="hargaMenu" value={data.hargaMenu} onChange={handleOnChange}
              />
              </div>
              <Button
              type="submit"
              variant="contained"
              color="secondary"
              sx={{ mt: 2 }}
              fullWidth
            >
              simpan
            </Button>
            </div>
          </Box>
          
          {/* <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit Data Menu
          </Typography>
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { mt: 3, width: "100%" },
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
              <VisuallyHiddenInput
                type="file"
                onChange={handleOnChange}
                name="gambarMenu"
              />
            </Button>
            <p>{filename.name ?? data.gambarMenu}</p>
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
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              sx={{ mt: 2 }}
              fullWidth
            >
              simpan
            </Button>
          </Box> */}
        </Box>
      </Modal>
    </>
  );
};

export default ModalEditMenu;
