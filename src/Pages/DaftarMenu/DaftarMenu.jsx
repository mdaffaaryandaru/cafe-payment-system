import { Typography, Box, useTheme, Modal, Button, TextField, InputLabel, MenuItem, FormControl, Select, IconButton } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import * as React from 'react';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataContacts } from "../../data/MockData";
import Header from "../../Components/Header";
import { post, get, put, del } from "../../utils/api";
import ModalInputMenu from "../../Components/Modal/ModalInputMenu";
import ModalEditMenu from "../../Components/Modal/ModalEditMenu";

const DaftarMenu = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // state Data Dummmy
  const [dataMenu, setDataMenu] = React.useState([])
  //set data form input
  const [formData, setFormData] = React.useState({
    namaMenu: '',
    stokMenu: '',
    kategoriMenu: '',
    hargaMenu: '',
  });
  
  const [formDataEdit, setFormDataEdit] = React.useState({
    namaMenu: '',
    stokMenu: '',
    kategoriMenu: '',
    hargaMenu: '',
  });

  // GET all data
  const fetchItems = async () => {
    try {
      const data = await get('/menu');
      console.log(data)
      setDataMenu(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  React.useEffect(() => {
    fetchItems()
  }, [])

  // POST data
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await post('/menu/create-menu', formData)
      console.log(response)
    } catch (error) {
      console.log(error)
    }
    fetchItems()
  }

  // DELETE data menu
  const handleDelete = async (id) => {
    try {
      await del(`/menu/delete-menu/${id}`);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
    fetchItems()
  }

  // PUT data menu
  const handleEdit = async (e, id) => {
    e.preventDefault()
    try {
      await put(`/menu/edit-menu/${id}`, formDataEdit);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
    fetchItems()
  }

  const handleSelectionModelChange = (newSelection) => {
    console.log(newSelection)
  }

  const columns = [
    { 
      field: "id", 
      headerName: "ID",
      flex: 0.5,
    },
    { 
      field: "namaMenu", 
      headerName: "Nama Menu",
      flex: 1,
    },
    {
      field: "stokMenu",
      headerName: "Stok",
      type: "number",
      headerAlign: "left",
      align: "left",
      flex: 1,
    },
    {
      field: "kategoriMenu",
      headerName: "Kategori",
      headerAlign: "left",
      align: "left",
      flex: 1,
    },
    {
      field: "hargaMenu",
      headerName: "Harga",
      type: "number",
      headerAlign: "left",
      align: "left",
      flex: 1,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.5,
      renderCell: (params) => (
        <div>
          <ModalEditMenu dataItem={params.row} setDataForm={setFormDataEdit} handleOnSubmit={handleEdit}/>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="Daftar Menu"
        subtitle="List menu makanan dan minuman"
      />
      <div>
        <ModalInputMenu dataForm={formData} setDataForm={setFormData} handleOnSubmit={handleSubmit}/>
      </div>
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={dataMenu}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default DaftarMenu;
