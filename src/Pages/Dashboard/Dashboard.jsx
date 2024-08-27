import { Box, useTheme } from "@mui/material";
import Header from "../../Components/Header";
import { CategoryScale, Chart, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from "chart.js";
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { get } from '../../utils/api'
import { parseISO, startOfWeek, endOfWeek, format } from 'date-fns';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { tokens } from "../../theme";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const columns = [
  {
    field: "id",
    headerName: "ID",
  },
  {
    field: "noMeja",
    headerName: "Nomor Meja",
    cellClassName: "name-collumn--cell",
  },
  {
    field: "namaPelanggan",
    headerName: "Nama Pelanggan",
    flex: 1,
  },
  {
    field: "statusPesanan",
    headerName: "Status Pesanan",
    flex: 1,
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
        <Link className="bg-lime-400 p-2 text-black rounded" to={`/detail-orderan-pelanggan/${params.row.id}`}>
          Lihat Pesanan
        </Link>
      </div>
    ),
  },
];

// Fungsi untuk mendapatkan tanggal Senin dari tanggal tertentu
const getStartOfWeek = (date) => {
  const start = new Date(date);
  const day = start.getDay() || 7; // getDay() returns 0 for Sunday
  if (day !== 1) {
      start.setHours(-24 * (day - 1));
  }
  return start;
};

// Fungsi untuk mendapatkan tanggal Minggu dari tanggal tertentu
const getEndOfWeek = (date) => {
  const end = new Date(date);
  const day = end.getDay() || 7; // getDay() returns 0 for Sunday
  if (day !== 7) {
      end.setHours(24 * (7 - day));
  }
  return end;
};

const processWeeklyData = (data) => {
  const weeklyTotals = {};
  
  data.forEach(item => {
      const date = parseISO(item.createdDate);
      const weekStart = startOfWeek(date, { weekStartsOn: 1 }); // Start of the week
      const weekEnd = endOfWeek(date, { weekStartsOn: 1 }); // End of the week
      const weekKey = `${format(weekStart, 'yyyy-MM-dd')} to ${format(weekEnd, 'yyyy-MM-dd')}`;
      
      if (!weeklyTotals[weekKey]) {
          weeklyTotals[weekKey] = 0;
      }
      weeklyTotals[weekKey] += item.totalHarga;
  });
  
  const labels = Object.keys(weeklyTotals).sort();
  const totals = labels.map(label => weeklyTotals[label]);
  
  return { labels, totals };
};

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [dataOrder, setDataOrder] = useState([]);
  const [filteredDataOrder, setFilteredDataOrder] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [menuLowStock, setMenuLowStock] = useState([]);

  const [currTheme, setCurrTheme] = useState('')
  useEffect(() => {
      setCurrTheme(theme.palette.mode)
  }, [theme])

  const { labels, totals} = processWeeklyData(dataOrder);

  const data = {
    labels: labels, // Label sumbu x
    datasets: [
      {
        data: totals, // Data sumbu y
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
    ],
  };

  // Opsi konfigurasi grafik
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return `${Number(tooltipItem.raw).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}`;
          },
        },
      },
    },
    scales: {
      x: {
          display: false,  // Menyembunyikan sumbu X
      },
      y: {
          display: false,  // Menyembunyikan sumbu Y
      }
    }
  };

  useEffect(() => {
    // Tentukan tanggal untuk minggu ini
    const today = new Date();
    const startOfWeek = getStartOfWeek(today);
    const endOfWeek = getEndOfWeek(today);

    const fetchDataOrder = async () => {
      try {
        const response = await get("/order");
        setDataOrder(response)
        // filter total harga
        const filteringByWeek = response.filter(item => {
          const createdDate = new Date(item.createdDate)
          return createdDate >= startOfWeek && createdDate <= endOfWeek;
        });
        setFilteredDataOrder(filteringByWeek)
        // total harga
        const totalIncome = response.reduce((sum, item) => sum + Number(item.totalHarga), 0);
        setTotalIncome(totalIncome);
      } catch (error) {
        console.error(error);
      }
    }

    const fetchMenu = async () => {
      try {
        const response = await get("/menu");
        const filterLowStock = response.filter(item => item.stokMenu <= 10).slice(0, 3);
        console.log(filterLowStock)
        setMenuLowStock(filterLowStock);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    }

    fetchDataOrder()
    fetchMenu()
  }, []);

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome To Your Dashboard" />
      </Box>
      <div className="w-full">
        <div className="w-full grid grid-cols-3 gap-5">
          <div className={`w-full ${currTheme == 'light' ? 'bg-slate-100 shadow' : 'bg-slate-800'} rounded-lg p-3`}>
            <p className="text-base">Total Pemasukan <span className="text-xs">(per minggu)</span></p>
            <h1 className="text-3xl font-bold">{Number(totalIncome).toLocaleString('id-ID', { style: "currency", currency: "IDR"})}</h1>
            <Line className="mt-2" data={data} options={options} />
          </div>
          <div className={`w-full h-full ${currTheme == 'light' ? 'bg-slate-100 shadow' : 'bg-slate-800'} rounded-lg p-3`}>
            <h1 className="text-3xl font-bold">Stok Menipis</h1>
            <p>Stok yang sedang menipis</p>
            <div className="w-full h-full justify-center items-center py-3 flex flex-col gap-2">
              {menuLowStock ? menuLowStock.map((item, i) => (
                <div key={i} className={`w-full flex justify-between items-center py-3 px-2 text-base rounded ${currTheme == 'light' ? 'bg-slate-200' : 'bg-slate-700'}`}>
                  <p>{item.namaMenu}</p>
                  <p className="font-bold">{item.stokMenu}</p>
                </div>
              )) : 
              (
                <div className="w-full h-full flex justify-center items-center">
                  <p className="text-lg font-bold">Stok</p>
                </div>
              )}
            </div>
          </div>
          <div className="w-full h-full grid grid-rows-2 gap-4">
            <div className={`${currTheme == 'light' ? 'bg-slate-100 shadow' : 'bg-slate-800'} rounded-lg p-3`}>
              <h1 className="text-base">Total Pembelian</h1>
              <br />
              <h1 className="text-5xl font-bold">{dataOrder.length}</h1>
            </div>
            <div className={`${currTheme == 'light' ? 'bg-slate-100 shadow' : 'bg-slate-800'} rounded-lg p-3`}>
              <h1 className="text-base">Pesanan Pending</h1>
              <br />
              <h1 className="text-5xl font-bold">{dataOrder.filter(item => item.statusPesanan === 'Pesanan diterima ke kasir').length}</h1>
            </div>
          </div>
        </div>
        <Box
          m="40px 0 0 0"
          height="100%"
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
            rows={dataOrder}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            autoHeight
          />
        </Box>
      </div>
    </Box>
  );
};

export default Dashboard;
