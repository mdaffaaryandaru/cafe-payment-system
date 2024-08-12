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
import ModalViewOrderan from "./Modal/ModalViewOrderan";

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

const OrderanPelanggan = () => {
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
  });
  const [formDataEdit, setFormDataEdit] = React.useState({
    namaPegawai: "",
    alamatPegawai: "",
    noHpPegawai: "",
    statusPegawai: "",
  });

  const fetchItems = async () => {
    try {
      const data = await get("/order");
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

  // DELETE data menu
  const handleDelete = async (id) => {
    try {
      await del(`/pegawai/delete-pegawai/${id}`);
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
      field: "noMeja",
      headerName: "Nomor Meja",
      flex: 1,
      cellClassName: "name-collumn--cell",
    },
    {
      field: "namaPelanggan",
      headerName: "Nama Pelanggan",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "statusPesanan",
      headerName: "Status Pesanan",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "jenisPembayaran",
      headerName: "Jenis Pembayaran",
      flex: 1,
    },
    {
      field: "totalHarga",
      headerName: "Total Harga Pembayaran",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      renderCell: (params) => (
        <div>
          <ModalViewOrderan />
        </div>
      ),
    },
  ];
  return (
    <Box m="20px">
      <Header title="Orderan Pelanggan" subtitle="Manage Your Team" />
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

export default OrderanPelanggan;