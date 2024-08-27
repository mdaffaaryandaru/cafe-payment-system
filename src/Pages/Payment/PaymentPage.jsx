import React, { useEffect, useState } from "react";
import { get, postWithFile } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const PaymentPage = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [dataMenu, setDataMenu] = useState([]);
  const [dataOrder, setDataOrder] = useState({});
  const [isCopied, setIsCopied] = useState(false);

  const [selectedValue, setSelectedValue] = useState("");
  const [filename, setFilename] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  // const status ='Pesanan diterima ke kasir'

  console.log(cart);

  const dataRekening = [
    {
      nama_bank: "BCA Transfer",
      no_rekening: "098686868746",
    },
    {
      nama_bank: "Virtual Account (VA)",
      no_rekening: "0781231239",
    },
  ];

  const fetchMenu = async () => {
    try {
      const res = await get("/menu");
      setDataMenu(res);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  useEffect(() => {
    if (dataMenu.length != 0) {
      const storedData = localStorage.getItem("order");

      if (storedData) {
        try {
          const orderJson = JSON.parse(storedData);
          setDataOrder(orderJson);
          setCart(orderJson.orderan);
        } catch (e) {
          console.error("Error parsing JSON from localStorage:", e);
        }
      }
    }
  }, [dataMenu]);

  const handleOnChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      console.log(files[0]);
      setFilename(files[0]);
    } else if (type === "radio") {
      setSelectedValue(value);
    }

    setDataOrder({
      ...dataOrder,
      statusPesanan: "Pesanan diterima oleh pelayan",
      [name]:
        type === "number" ? Number(value) : type === "file" ? files[0] : value,
    });
  };

  const handleCopyRekening = () => {
    navigator.clipboard
      .writeText(
        dataRekening.find((data) => data.nama_bank === selectedValue)
          .no_rekening
      )
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset the copied state after 2 seconds
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    Swal.fire({
      title: "Pembayaran sedang diproses",
      text: "Mohon tunggu...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    console.log(dataOrder);

    const newFormData = new FormData();
    newFormData.append("noMeja", dataOrder.noMeja);
    newFormData.append("namaPelanggan", dataOrder.namaPelanggan);
    newFormData.append("statusPesanan", "Pesanan diterima ke kasir");
    newFormData.append("jenisPembayaran", selectedValue);
    newFormData.append(
      "orderan",
      JSON.stringify(cart.map(({ id, ...rest }) => rest))
    );
    newFormData.append("totalHarga", dataOrder.totalHarga);
    newFormData.append("gambarTransaksi", filename);

    try {
      const response = await postWithFile("/order/create-order", newFormData);
      console.log(response);
      localStorage.removeItem("order");
      navigate(`/order-tracker/${response.id}/${response.namaPelanggan}`);
      setIsLoading(false);
      Swal.fire({
        icon: "success",
        title: "Pembayaran telah diterima",
        text: "Tim kami akan segera memproses pesanan Anda! harap tunggu notifikasi pesanan selesai",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Terjadi kesalahan saat memproses pembayaran!",
      });
    }
  };

  return (
    <section className="relative min-h-screen bg-white">
      <div className="absolute top-0 left-0"></div>
      <div className="container">
        <h1 className="text-2xl lg:text-4xl font-bold py-5 text-black">
          Selesaikan Pembayaran
        </h1>
        <div className="w-full flex justify-between items-center mb-8 rounded bg-slate-100 text-black p-2">
          <div className="">
            <p>Nama</p>
            <h3 className="text-2xl font-bold">{dataOrder.namaPelanggan}</h3>
          </div>
          <h3 className="text-2xl">No. Meja: {dataOrder.noMeja}</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="h-max grid grid-cols-1 lg:grid-cols-2 max-lg:px-6 gap-6">
            {cart.map((item, i) => {
              const menu = dataMenu.find((menu) => menu.id === item.menuId);
              return (
                <div
                  key={i}
                  className="flex gap-3 bg-slate-100 border border-slate-200 shadow-sm p-2"
                >
                  <img
                    className="w-20 h-20 object-cover rounded aspect-square"
                    src={`${process.env.REACT_APP_BASE_URL_API}/menu/images/${menu.gambarMenu}`}
                    alt={menu.namaMenu}
                  />
                  <div className="w-full flex flex-col justify-between">
                    <div className="">
                      <h5 className="text-lg font-bold text-black">
                        {menu.namaMenu}
                      </h5>
                      <p className="text-slate-500 text-xs">
                        {menu.kategoriMenu}
                      </p>
                    </div>
                    <h3 className='text-2xl'>No. Meja: {dataOrder.noMeja}</h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <div className="h-max grid grid-cols-1 lg:grid-cols-2 max-lg:px-6 gap-6">
                        {cart.map((item, i) => {
                            const menu = dataMenu.find((menu) => menu.id === item.menuId)
                            console.log(menu)
                            return (
                                <div key={i} className="flex flex-col">
                                    <div className="flex gap-3 bg-slate-100 border border-slate-200 shadow-sm p-2">
                                        <img className='w-20 h-20 object-cover rounded aspect-square' src={`${process.env.REACT_APP_BASE_URL_API}/menu/images/${menu.gambarMenu}`} alt={menu.namaMenu} />
                                        <div className="w-full flex flex-col justify-between">
                                            <div className="">
                                                <h5 className='text-lg font-bold text-black'>{menu.namaMenu}</h5>
                                                <p className='text-slate-500 text-xs'>{menu.kategoriMenu}</p>
                                            </div>
                                            <div className="w-full flex justify-between text-black">
                                                <p>Jumlah: {item.jumlah}</p>
                                                <p className='font-bold'>{Number(item.harga).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</p>
                                            </div>
                                        </div>
                                    </div>
                                    {item?.topings.map((toping, i) => (
                                        <div key={i} className="flex justify-between items-center bg-slate-200 p-2 text-black">
                                            <span>{toping}</span>
                                            <span>x{item.jumlah}</span>
                                            <span>{(menu.topings.find((top) => top.namaToping === toping).hargaToping * item.jumlah).toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</span>
                                        </div>
                                    ))}
                                </div>
                            )
                        })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="w-full bg-slate-100 rounded p-5 text-black">
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
              <h2 className="text-lg font-semibold mb-4">
                Pilih Opsi Pembayaran
              </h2>
              <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
                {dataRekening.map((bank, i) => (
                  <div key={i} className="p-2 rounded border border-gray-400">
                    <label className="inline-flex items-center">
                      <input
                        name="jenisPembayaran"
                        type="radio"
                        value={bank.nama_bank}
                        checked={selectedValue === bank.nama_bank}
                        onChange={handleOnChange}
                        className="form-radio text-blue-600"
                        required
                      />
                      <span className="ml-2">{bank.nama_bank}</span>
                    </label>
                  </div>
                ))}
              </div>
              {selectedValue && (
                <div className="w-full bg-slate-200 p-3 my-4 rounded flex justify-between items-center">
                  <div className="flex flex-col">
                    <h1>No. Rekening / VA</h1>
                    <h1 className="text-xl font-bold">
                      {
                        dataRekening.find(
                          (data) => data.nama_bank === selectedValue
                        ).no_rekening
                      }
                    </h1>
                  </div>
                  <button
                    type="button"
                    className="p-2 bg-lime-300 text-black w-max h-max rounded font-bold"
                    onClick={handleCopyRekening}
                  >
                    {isCopied ? "Tersalin" : "Salin"}
                  </button>
                </div>
              )}
              <div className="flex max-lg:w-max max-lg:flex-col lg:items-center gap-2 py-3">
                <input
                  id="gambarTransaksi"
                  type="file"
                  name="gambarTransaksi"
                  onChange={handleOnChange}
                  required
                />
                {/* <p>{filename.name ?? 'Bukti pembayaran belum di upload'}</p> */}
              </div>
              <button
                className="w-full py-2 text-center bg-lime-300 text-black rounded my-4 font-bold text-base"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Submit Payment"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentPage;
