import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { get, put, post } from "../../utils/api";
import { useTheme } from "@mui/material";
import Swal from "sweetalert2";

const DetailOrderanPelanggan = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [currTheme, setCurrTheme] = useState();
  const [dataOrder, setDataOrder] = useState({});
  const [dataMenu, setDataMenu] = useState([]);
  const [selectedPegawai, setSelectedPegawai] = useState("");
  const [dataPegawai, setDataPegawai] = useState([]);
  const [orderMenu, setOrderMenu] = useState([]);
  const [password, setPassword] = useState("");

  const [openImage, setOpenImage] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setCurrTheme(theme.palette.mode);
  }, [theme]);

  useEffect(() => {
    const fetchDataOrder = async () => {
      try {
        const response = await get(`/order/${id}`);
        setDataOrder(response);
        setOrderMenu(response.orderan);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchMenu = async () => {
      try {
        const data = await get("/menu");
        setDataMenu(data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    const fetchPegawai = async () => {
      try {
        const data = await get("/pegawai");
        console.log(data);
        setDataPegawai(data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchDataOrder();
    fetchPegawai();
    fetchMenu();
  }, [id]);

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    Swal.fire({
      title: "Status Sedang Diganti",
      text: "Mohon tunggu...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      console.log("Selected Pegawai ID:", selectedPegawai);
      console.log("Entered Password:", password);

      const verifyResponse = await post("/pegawai/verify-password", {
        pegawaiId: selectedPegawai,
        password: password,
      });

      console.log("Verify Response:", verifyResponse);

      if (!verifyResponse.valid) {
        setIsLoading(false);
        Swal.fire({
          icon: "error",
          title: "Password Salah",
          text: "Password pegawai yang dimasukkan salah",
        });
        return;
      }
    } catch (error) {
      console.error("Error verifying password:", error);
      setIsLoading(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Terjadi kesalahan saat memverifikasi password",
      });
      return;
    }
    console.log("Data Pegawai:", dataPegawai);
    const selectedPegawaiObj = dataPegawai.find(
      (pegawai) => pegawai.id === Number(selectedPegawai)
    );
    console.log("Selected Pegawai Object:", selectedPegawaiObj);
    if (!selectedPegawaiObj) {
      console.error("Selected Pegawai not found in dataPegawai");
      setIsLoading(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Pegawai yang dipilih tidak ditemukan",
      });
      return;
    }
    const selectedPegawaiNama = selectedPegawaiObj.namaPegawai;
    const formDataUpdate = new FormData();
    formDataUpdate.append("statusPesanan", selectedValue);
    formDataUpdate.append("pegawai", selectedPegawaiNama);

    try {
      console.log("Form Data Update:", formDataUpdate);
      for (let pair of formDataUpdate.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }
      await put(`/order/update-order/${id}`, formDataUpdate);
      navigate("/detail-orderan-pelanggan");
      setIsLoading(false);
      Swal.fire({
        icon: "success",
        title: "Order Berhasil Diubah",
        text: "Status order berhasil diubah",
      });
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Terjadi kesalahan saat mengubah status order",
      });
    }
  };

  return (
    <section className="relative container px-8 z-20">
      <h1 className="text-2xl lg:text-4xl font-bold my-5">Detail Orderan</h1>
      <div
        className={`w-full flex justify-between items-center mb-8 rounded ${
          currTheme == "light" ? "bg-slate-100" : "bg-slate-800"
        } p-2`}
      >
        <div className="">
          <p>Nama</p>
          <h3 className="text-2xl font-bold">{dataOrder.namaPelanggan}</h3>
        </div>
        <h3 className="text-2xl">No. Meja: {dataOrder.noMeja}</h3>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="h-max grid grid-cols-1 2xl:grid-cols-2 max-lg:px-6 gap-6">
          {orderMenu.map((item, i) => {
            const menu = dataMenu.find((menu) => menu.id === item.menuId);
            if (menu)
              return (
                <div
                  key={i}
                  className={`flex rounded gap-3 ${
                    currTheme == "light" ? "bg-slate-100" : "bg-slate-800"
                  } p-2`}
                >
                  <img
                    className="w-20 h-20 object-cover rounded aspect-square"
                    src={`${process.env.REACT_APP_BASE_URL_API}/menu/images/${menu.gambarMenu}`}
                    alt={menu.namaMenu}
                  />
                  <div className="w-full flex flex-col justify-between">
                    <div className="">
                      <h5 className="text-lg font-bold">{menu.namaMenu}</h5>
                      <p className="text-slate-400 text-xs">
                        {menu.kategoriMenu}
                      </p>
                    </div>
                    <div className="w-full flex justify-between">
                      <p>Jumlah: {item.jumlah}</p>
                      <p className="font-bold">
                        {Number(item.harga).toLocaleString("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              );
          })}
        </div>
        <div
          className={`w-full rounded ${
            currTheme == "light" ? "bg-slate-100" : "bg-slate-900"
          } p-5`}
        >
          <form onSubmit={handleSubmitPayment}>
            <div className="flex justify-between items-center text-xl py-3 px-2 mb-3">
              <h1>Total Harga</h1>
              <h1 className="font-bold">
                {Number(dataOrder.totalHarga).toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </h1>
            </div>
            <div
              className={`flex justify-between items-center p-2 ${
                currTheme == "light" ? "bg-slate-200" : "bg-slate-800"
              } rounded`}
            >
              <div className="flex flex-col">
                <span className="text-xs">Tipe Pembayaran</span>
                <h4 className="text-lg">{dataOrder.jenisPembayaran}</h4>
              </div>
              <button
                type="button"
                className="bg-lime-400 p-2 rounded text-black"
                onClick={() => setOpenImage(true)}
              >
                Lihat Bukti
              </button>
              {openImage && (
                <div
                  className={`fixed z-auto top-0 left-0 flex justify-center items-center w-full h-screen ${
                    currTheme == "light" ? "bg-white" : "bg-black/60"
                  }`}
                >
                  <div className="h-[80%]">
                    <button
                      type="button"
                      className="w-full text-right font-bold"
                      onClick={() => setOpenImage(false)}
                    >
                      Close
                    </button>
                    <img
                      className="h-full"
                      src={`${process.env.REACT_APP_BASE_URL_API}/order/images/${dataOrder.gambarTransaksi}`}
                      alt={dataOrder.namaPelanggan}
                    />
                  </div>
                </div>
              )}
            </div>
            <label className="flex flex-col gap-2 my-3">
              <p className="w-max">Update Status</p>
              <select
                className={`w-full ${
                  currTheme == "light" ? "bg-slate-200" : "bg-slate-800"
                } p-3`}
                name="statusPesanan"
                id="statusPesanan"
                onChange={(e) => setSelectedValue(e.target.value)}
                disabled={dataOrder.jenisPembayaran === "Pesanan selesai"}
                required
              >
                <option value="">--- Pilih Status ---</option>
                <option
                  value="Pesanan sedang dibuat"
                  hidden={dataOrder.jenisPembayaran === "Pesanan sedang dibuat"}
                >
                  Pesanan sedang dibuat
                </option>
                <option
                  value="Pesanan selesai"
                  hidden={dataOrder.jenisPembayaran === "Pesanan selesai"}
                >
                  Pesanan selesai
                </option>
                <option
                  value="Pesanan ditolak"
                  hidden={dataOrder.jenisPembayaran === "Pesanan ditolak"}
                >
                  Pesanan ditolak
                </option>
              </select>
            </label>
            <label className="flex flex-col gap-2 my-3">
              <p className="w-max">Pegawai Penerima</p>
              <select
                className={`w-full ${
                  currTheme == "light" ? "bg-slate-200" : "bg-slate-800"
                } p-3`}
                name="pegawaiPenerima"
                id="pegawaiPenerima"
                onChange={(e) => setSelectedPegawai(e.target.value)}
                required
              >
                <option value="">--- Pilih Pegawai ---</option>
                {dataPegawai.map((pegawai) => (
                  <option key={pegawai.id} value={pegawai.id}>
                    {pegawai.namaPegawai}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 my-3">
              <p className="w-max">Password Pegawai</p>
              <input
                className={`w-full ${
                  currTheme == "light" ? "bg-slate-200" : "bg-slate-800"
                } p-3`}
                type="password"
                name="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <button
              className="w-full bg-lime-300 p-2 rounded text-black my-3 font-bold"
              type="submit"
            >
              Simpan Perubahan
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default DetailOrderanPelanggan;
