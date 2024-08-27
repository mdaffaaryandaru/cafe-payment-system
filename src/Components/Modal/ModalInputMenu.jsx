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
  IconButton,
  Select,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

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

const ModalInputMenu = ({ dataForm, setDataForm, handleOnSubmit }) => {
  // for open modal add
  const [open, setOpen] = React.useState(false);
  const [filename, setFilename] = useState({});

  const [toppingFields, setToppingFields] = useState([{ namaToping: '', hargaToping: '' }]);

  const handleOnChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFilename(files[0]);
    }
    setDataForm({
      ...dataForm,
      [name]:
        type === "number" ? Number(value) : type === "file" ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    handleOnSubmit(e);
    setFilename({});
    setOpen(false);
  };

  //TOPING
  // Fungsi untuk menangani perubahan input
  const handleToppingChange = (index, event) => {
    const { name, value, type } = event.target;
    const updatedFields = toppingFields.map((field, i) => 
      i === index ? { ...field, [name]: type === "number" ? Number(value) : value } : field
    );

    setDataForm({
      ...dataForm,
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
      <Button
        variant="contained"
        color="secondary"
        onClick={() => setOpen(true)}
      >
        Tambah Data Menu
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
            Tambah Data Menu
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
                required
                type="file"
                onChange={handleOnChange}
                name="gambarMenu"
              />
            </Button>
            <p>{filename.name ?? "No file uploaded"}</p>
            <div className="w-full grid grid-cols-2 gap-5">
              <div className="">
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
              </div>
              <div className="h-full overflow-y-auto">
                <div className="flex justify-between items-center">
                  <h1>Tambah Topping</h1>
                  <button type="button" className="bg-slate-700 py-1 px-2" onClick={handleAddToppingField} startIcon={<AddIcon />}>Add Topping</button>
                </div>
                <Box component="form" onSubmit={handleSubmit}>
                  {toppingFields.map((field, index) => (
                    <div key={index} className="w-full h-full grid grid-cols-[1fr_1fr_26px] gap-4 justify-center items-center">
                      <TextField required label="Nama Topping" name="namaToping" color="secondary" value={field.namaToping} onChange={(e) => handleToppingChange(index, e)} sx={{ marginRight: '1rem', width: 'calc(50% - 1rem)' }}/>
                      <TextField required label="Harga Topping" type="number" name="hargaToping" color="secondary" value={field.hargaToping} onChange={(e) => handleToppingChange(index, e)} sx={{ width: 'calc(50% - 1rem)' }}
                      />
                      {toppingFields.length > 1 && (
                        // <IconButton onClick={() => handleRemoveToppingField(index)} color="error">
                        //   <RemoveIcon />
                        // </IconButton>
                        <button type="button" onClick={() => handleRemoveToppingField(index)} className="w-6 h-6 rounded-full bg-red-300">
                          <RemoveIcon />
                        </button>
                      )}
                    </div>
                  ))}
                </Box>
              </div>
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
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default ModalInputMenu;
