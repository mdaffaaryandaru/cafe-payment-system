import {
  Typography,
  Box,
  useTheme,
  Modal,
  Button,
  IconButton,
} from "@mui/material";
import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../Components/Header";
import {
  post,
  get,
  put,
  del,
  postWithFile,
  putWithImage,
} from "../../utils/api";
import ModalEditPegawai from "./Modal/ModalEditPegawai";
import ModalInputPegawai from "./Modal/ModalInputPegawai";

const styleModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // for open modal add
  const [open, setOpen] = React.useState(false);
  const [dataPegawai, setDataPegawai] = React.useState([]);
  const [formData, setFormData] = React.useState({
    namaPegawai: "",
    alamatPegawai: "",
    noHpPegawai: "",
    statusPegawai: "",
    password: "",
  });
  const [formDataEdit, setFormDataEdit] = React.useState({
    namaPegawai: "",
    alamatPegawai: "",
    noHpPegawai: "",
    statusPegawai: "",
    password: "",
  });

  const fetchItems = async () => {
    try {
      const data = await get("/pegawai");
      console.log(data);
      setDataPegawai(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };
  React.useEffect(() => {
    fetchItems();
  }, []);

  React.useEffect(() => {
    console.log(formData);
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newFormData = new FormData();

    newFormData.append("namaPegawai", formData.namaPegawai);
    newFormData.append("alamatPegawai", formData.alamatPegawai);
    newFormData.append("noHpPegawai", formData.noHpPegawai);
    newFormData.append("statusPegawai", formData.statusPegawai);
    newFormData.append("password", formData.password);

    try {
      const response = await post("/pegawai/create-pegawai", newFormData);
      console.log(response);
    } catch (error) {
      console.error("Error submiting data:", error);
    }
    fetchItems();
  };

  // DELETE data menu
  const handleDelete = async (id) => {
    try {
      await del(`/pegawai/delete-pegawai/${id}`);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
    fetchItems();
  };

  // PUT data menu
  const handleEdit = async (e, id) => {
    e.preventDefault();

    const newFormData = new FormData();

    newFormData.append("namaPegawai", formDataEdit.namaPegawai);
    newFormData.append("alamatPegawai", formDataEdit.alamatPegawai);
    newFormData.append("noHpPegawai", formDataEdit.noHpPegawai);
    newFormData.append("statusPegawai", formDataEdit.statusPegawai);
    newFormData.append("password", formDataEdit.password);

    try {
      await put(`/pegawai/update-pegawai/${id}`, newFormData);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
    fetchItems();
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
    },
    {
      field: "namaPegawai",
      headerName: "Nama Pegawai",
      flex: 1,
      cellClassName: "name-collumn--cell",
    },
    {
      field: "alamatPegawai",
      headerName: "Alamat Pegawai",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "nomorHpPegawai",
      headerName: "No Hp Pegawai",
      flex: 1,
    },
    {
      field: "statusPegawai",
      headerName: "Status Pegawai",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      renderCell: (params) => (
        <div>
          <ModalEditPegawai
            dataItem={params.row}
            setDataForm={setFormDataEdit}
            handleOnSubmit={handleEdit}
          />
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];
  return (
    <Box m="20px">
      <Header title="TEAM" subtitle="Manage Your Team" />
      <div>
        <ModalInputPegawai
          dataForm={formData}
          setDataForm={setFormData}
          handleOnSubmit={handleSubmit}
        />
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
          "& .name-collumn--cell": {
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
        }}
      >
        <DataGrid
          rows={dataPegawai}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Team;
