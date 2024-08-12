import { Typography } from "@mui/material";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ShoppingCart, CirclePlus, Plus, Minus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { get } from "../../utils/api";

const OrderPage = () => {
  const navigate = useNavigate();

  const { noMeja } = useParams();
  const [openSidebar, setOpenSidebar] = useState(false);

  const totalHargaRef = useRef(null);

  const [dataMenu, setDataMenu] = useState([]);
  const [cart, setCart] = useState([]);

  const [storeDataOrder, setStoreDataOrder] = useState({
    noMeja: Number(noMeja),
    namaPelanggan: "",
    statusPesanan: "",
    jenisPembayaran: "",
    orderan: [],
    totalHarga: "",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setStoreDataOrder({
      ...storeDataOrder,
      [name]: value,
    });
  };

  const fetchMenu = async () => {
    try {
      const res = await get("/menu");
      setDataMenu(res);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  useEffect(() => {
    if (dataMenu.length != 0) {
      // Pastikan dataMenu tidak null
      console.log("test");
      console.log(dataMenu);

      const storedData = localStorage.getItem("order");
      if (storedData) {
        try {
          const orderJson = JSON.parse(storedData);
          setCart(orderJson.orderan);
        } catch (e) {
          console.error("Error parsing JSON from localStorage:", e);
        }
      }
    }
  }, [dataMenu]);

  const groupByCategory = () => {
    const grouped = dataMenu.reduce((acc, menu) => {
      const category = menu.kategoriMenu.trim(); // Menghapus spasi di awal/akhir kategori
      if (!acc[category]) {
        acc[category] = {
          kategori: category,
          menu: [],
        };
      }
      acc[category].menu.push(menu);
      return acc;
    }, {});

    // Mengubah hasil menjadi array
    return Object.values(grouped);
  };

  const handleSelectMenu = (id) => {
    const selectedMenu = dataMenu.find((menu) => menu.id === id);

    if (selectedMenu) {
      setCart((prevCart) => {
        const itemIndex = prevCart.findIndex((item) => item.menuId === id);
        if (itemIndex > -1) {
          const updatedCart = prevCart.map((item, index) =>
            index === itemIndex
              ? {
                  ...item,
                  jumlah: item.jumlah + 1,
                  harga: (item.jumlah + 1) * selectedMenu.hargaMenu,
                }
              : item
          );
          return updatedCart;
        } else {
          console.log("bawah");
          return [
            ...prevCart,
            {
              menuId: selectedMenu.id,
              jumlah: 1,
              harga: Number(selectedMenu.hargaMenu),
            },
          ];
        }
      });
    }
  };

  const handleIncrement = (id) => {
    const selectedMenu = dataMenu.find((menu) => menu.id === id);

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.menuId === id
          ? {
              ...item,
              jumlah: item.jumlah + 1,
              harga: (item.jumlah + 1) * selectedMenu.hargaMenu,
            }
          : item
      )
    );
  };

  const handleDecrement = (id) => {
    const selectedMenu = dataMenu.find((menu) => menu.id === id);

    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.menuId === id
            ? {
                ...item,
                jumlah: item.jumlah - 1,
                harga: (item.jumlah - 1) * selectedMenu.hargaMenu,
              }
            : item
        )
        .filter((item) => item.jumlah > 0)
    );
  };

  const getTotalPrice = () => {
    return cart
      .reduce((total, item) => total + item.harga, 0)
      .toLocaleString("id-ID", { style: "currency", currency: "IDR" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updateStoreOrder = {
      ...storeDataOrder,
      orderan: cart,
      totalHarga: cart.reduce((total, item) => total + item.harga, 0),
    };

    localStorage.setItem("order", JSON.stringify(updateStoreOrder));

    navigate("/order/pembayaran");
  };

  useEffect(() => {
    console.log(storeDataOrder);
  }, [storeDataOrder]);

  return (
    <main className="">
      <div className="bg-slate-800 py-4">
        <div className="container flex justify-between items-center">
          <h3 className="text-2xl font-bold">Seruni Kopi</h3>
          <div className="xl:hidden flex justify-center items-center gap-2">
            <h2 className="bg-red-500 font-bold w-5 h-5 text-center rounded-full">
              {cart.length}
            </h2>
            <button
              className=""
              onClick={() => setOpenSidebar((curr) => !curr)}
            >
              <ShoppingCart />
            </button>
          </div>
        </div>
      </div>
      <div className="w-full h-screen p-6 xl:p-10 max-md:overflow-hidden relative xl:grid xl:grid-cols-[1.5fr_1fr]">
        <div className="xl:me-10">
          <div className="flex flex-col gap-8">
            {groupByCategory().map((categoryMenu, i) => (
              <div key={i} className="w-full">
                <h1 className="text-2xl font-bold mb-3">
                  {categoryMenu.kategori}
                </h1>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 xl:gap-5 justify-center">
                  {categoryMenu.menu.map((menu, x) => (
                    <div
                      key={x}
                      className="flex gap-2 bg-slate-800 p-3 rounded"
                    >
                      <img
                        className=" aspect-square object-cover w-20 h-20 rounded"
                        src={`http://192.168.18.217:3000/menu/images/${menu.gambarMenu}`}
                        alt={menu.namaMenu}
                      />
                      <div className="w-full flex justify-between items-center">
                        <div className="flex flex-col">
                          <h4 className="text-xl font-bold">{menu.namaMenu}</h4>
                          <span className=" text-gray-500">
                            {menu.kategoriMenu}
                          </span>
                          <p className="text-base">
                            {Number(menu.hargaMenu).toLocaleString("id-ID", {
                              style: "currency",
                              currency: "IDR",
                            })}
                          </p>
                        </div>
                        <button
                          className="bg-slate-600 text-white p-1 rounded"
                          onClick={() => handleSelectMenu(menu.id)}
                        >
                          <CirclePlus />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          className={`bg-slate-900 p-4 max-md:absolute max-md:z-50 max-md:top-0 max-md:left-0 max-md:w-screen max-md:h-screen max-md:bg-slate-900 ${
            openSidebar ? "max-md:translate-x-0" : "max-md:translate-x-full"
          } max-md:transition-all max-md:duration-300 max-md:shadow-lg xl:block`}
        >
          <h1 className="text-2xl font-bold mb-2">Detail Orderan</h1>
          <div className="rounded">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-[1.5fr_1fr] gap-5">
                <label className="w-full flex flex-col gap-2">
                  <span>Nama</span>
                  <input
                    onChange={handleOnChange}
                    type="text"
                    name="namaPelanggan"
                    id="namaPelanggan"
                    className="py-2 px-3 outline-none rounded bg-slate-800"
                    required
                  />
                </label>
                <div className="bg-slate-800 p-3 rounded text-center flex justify-center items-center gap-4">
                  <p className="text-base">No. Meja</p>
                  <h1 className="text-4xl font-bold">{noMeja}</h1>
                </div>
              </div>
              <div className="flex flex-col gap-2 py-8">
                {cart.map((item, i) => {
                  console.log(item);
                  console.log(dataMenu);
                  const menu = dataMenu.find((menu) => menu.id === item.menuId);
                  console.log(menu);
                  console.log(Number(item.harga));
                  return (
                    <div
                      key={i}
                      className="w-full flex gap-6 justify-center items-center bg-slate-800 py-1 px-3 rounded"
                    >
                      <img
                        className="w-16 h-16 aspect-square object-cover"
                        src={`http://192.168.18.217:3000/menu/images/${menu.gambarMenu}`}
                        alt={menu.namaMenu}
                      />
                      <div className="flex flex-col w-full h-full">
                        <div className="h-full flex justify-between items-center">
                          <div>
                            <p className="text-base">{menu.namaMenu}</p>
                            <p className="text-slate-500">
                              {menu.kategoriMenu}
                            </p>
                            <span className="text-base">
                              {item.harga.toLocaleString("id-ID", {
                                style: "currency",
                                currency: "IDR",
                              })}
                            </span>
                          </div>
                          <div className="flex justify-center items-center h-full">
                            <button
                              type="button"
                              className="bg-slate-600 text-white p-1 rounded"
                              onClick={() => handleDecrement(item.menuId)}
                            >
                              <Minus />
                            </button>
                            <span className="mx-2">{item.jumlah}</span>
                            <button
                              type="button"
                              className="bg-slate-600 text-white p-1 rounded"
                              onClick={() => handleIncrement(item.menuId)}
                            >
                              <Plus />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="flex justify-between text-lg font-bold py-3">
                  <h3>Total Harga</h3>
                  <h3 ref={totalHargaRef}>{getTotalPrice()}</h3>
                </div>
                {/* <div>
                    <h3>Pilih Satu:</h3>
                    <div>
                        <input
                            type="radio"
                            id="transferBCA"
                            name="jenisPembayaran"
                            value="Transfer BCA"
                            onChange={handleOnChange}
                        />
                        <label htmlFor="option1">Transfer BCA</label>
                    </div>
                    <div>
                        <input
                            type="radio"
                            id="VA"
                            name="jenisPembayaran"
                            value="VA Account"
                            onChange={handleOnChange}
                        />
                        <label htmlFor="option2">VA Account</label>
                    </div>
                </div> */}
                <button
                  className={`w-full py-2 text-black font-bold text-lg rounded ${
                    cart < 1 ? "bg-slate-100" : "bg-lime-300"
                  }`}
                  disabled={cart < 1}
                >
                  Pesan Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};
export default OrderPage;
