import { Typography } from "@mui/material";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ShoppingCart, CirclePlus, Plus, Minus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { get } from "../../utils/api";
import CardMenu from "../../Components/Menu/CardMenu";
import _ from "lodash";

const OrderPage = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false)

  const { noMeja } = useParams();
  const [openSidebar, setOpenSidebar] = useState(false);

  const [groupedData, setGroupedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const totalHargaRef = useRef(null);
  const [dataMenu, setDataMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [topingSelected, setTopingSelected] = useState({
    menuId: null,
    topings: [],
  });
  const [totalPriceOrder, setTotalPriceOrder] = useState(0);

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
      const res = await get("/menu")
      console.log(res)
      setDataMenu(res);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  useEffect(() => {
    const loadCartFromLocalStorage = async () => {
      if (dataMenu.length !== 0) {
        const storedData = localStorage.getItem("order");
        if (storedData != null) {
          try {
            const orderJson = JSON.parse(storedData);
            setCart(orderJson.orderan);
          } catch (e) {
            console.error("Error parsing JSON from localStorage:", e);
          }
        }
      }
    };

    loadCartFromLocalStorage();
  }, [dataMenu]);

  // Group Berdasarkan Kategori
  const groupByCategory = (dataMenu) => {
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

  useEffect(() => {
    const grouped = groupByCategory(dataMenu);
    console.log(grouped)
    setGroupedData(grouped);
    setFilteredData(grouped);
  }, [dataMenu]);

  useEffect(() => {
      if (selectedCategory === 'Semua') {
          setFilteredData(groupedData);
      } else {
          setFilteredData(groupedData.filter(group => group.kategori === selectedCategory));
      }
  }, [selectedCategory, groupedData]);

  const handleSelectedCategory = (e) => {
    const { value } = e.target;

    setSelectedCategory(value)
  }

  const handleSelectMenu = (id) => {
    const selectedMenu = dataMenu.find((menu) => menu.id === id);

    if (selectedMenu) {
      setCart((prevCart) => {
        const itemIndex = prevCart.findIndex((item) => item.menuId === id);
        if (itemIndex > -1) {
          if(cart[itemIndex].menuId === id && _.isEqual(topingSelected.topings, cart[itemIndex].topings) === false) {
            console.log("masuk 1")
            return [
              ...prevCart,
              {
                id: Math.random().toString(36),
                menuId: selectedMenu.id,
                jumlah: 1,
                harga: Number(selectedMenu.hargaMenu),
                topings: topingSelected?.topings ?? [],
              },
            ];
          } else if(topingSelected.menuId === id && _.isEqual(topingSelected.topings, cart[itemIndex].topings) === true) {
            console.log("masuk 2")
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
            console.log("masuk 3")
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
          }
        } else {
          console.log("data baru");
          return [
            ...prevCart,
            {
              id: Math.random().toString(36),
              menuId: selectedMenu.id,
              jumlah: 1,
              harga: Number(selectedMenu.hargaMenu),
              topings: topingSelected?.topings ?? [],
            },
          ];
        }
      });
      setTopingSelected({});
    }
  };

  const handleSelectToping = (menuId, topingId) => {
    setTopingSelected((prev) => {
      const updated = {...prev};

      updated.menuId = menuId;
      const uniqueTopings = new Set(updated.topings);

      if (topingSelected.menuId !== menuId) { uniqueTopings.clear() };

      if (uniqueTopings.has(topingId)) {
        // Jika toppingId sudah ada di dalam topings, maka hapus toppingId tersebut
        uniqueTopings.delete(topingId);
      } else {
        // Jika toppingId belum ada, tambahkan toppingId ke dalam topings
        uniqueTopings.add(topingId);
      }
      
      updated.topings = [...uniqueTopings];

      return updated;
    });
  }

  useEffect(() => {
    console.log(topingSelected);
    console.log(cart);
  }, [topingSelected, cart]);

  const handleIncrement = (id, menuId) => {
    console.log(id);
    const selectedMenu = dataMenu.find((menu) => menu.id === menuId);

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? {
              ...item,
              jumlah: item.jumlah + 1,
              harga: (item.jumlah + 1) * selectedMenu.hargaMenu,
            }
          : item
      )
    );
  };

  const handleDecrement = (id, menuId) => {
    const selectedMenu = dataMenu.find((menu) => menu.id === menuId);

    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id
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
    let totalHargaToping = 0

    {cart.map((item, i) => {
      console.log(item)
      if (item?.topings.length > 0) {
        const toping = item.topings.map((toping) => {
          return dataMenu.find((menu) => menu.id === item.menuId).topings.find((top) => top.namaToping === toping);
        });
        totalHargaToping += toping.reduce((total, item) => total + Number(item.hargaToping), 0) * item.jumlah;
      }
    })}

    let totalPrice = cart.reduce((total, item) => total + item.harga, 0) + totalHargaToping

    return totalPrice;
  };

  useEffect(() => {
    setTotalPriceOrder(getTotalPrice());
  }, [cart])

  const handleSubmit = (e) => {
    e.preventDefault();

    const updateStoreOrder = {
      ...storeDataOrder,
      orderan: cart,
      totalHarga: totalPriceOrder ,
    };

    console.log(updateStoreOrder);

    localStorage.setItem("order", JSON.stringify(updateStoreOrder));

    navigate("/order/pembayaran");
  };

  return (
    <main className="h-screen bg-white z-50 overflow-y-scroll">
      <div className="bg-slate-100 py-4">
        <div className="container flex justify-between items-center">
          <h3 className="text-2xl font-bold text-black">Seruni Kopi</h3>
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
      <div className="w-full h-[90vh] p-6 xl:p-10 max-md:overflow-y-scroll max-md:overflow-x-hidden max-md:relative xl:grid xl:grid-cols-[1.5fr_1fr]">
        <div className="xl:me-10">
          <ul className="flex gap-4 mb-3">
            <li className="w-max">
                <input type="checkbox" id="react-option" name="category" value="Semua" className="hidden peer" onChange={handleSelectedCategory} checked={selectedCategory === 'Semua'}/>
                <label htmlFor="react-option" className="inline-flex items-center justify-between w-full p-2 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">                           
                  Semua
                </label>
            </li>
            <li className="w-max">
                <input type="checkbox" id="flowbite-option" name="category" value="Makanan" className="hidden peer" onChange={handleSelectedCategory} checked={selectedCategory === 'Makanan'}/>
                <label htmlFor="flowbite-option" className="inline-flex items-center justify-between w-full p-2 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                  Makanan
                </label>
            </li> 
            <li className="w-max">
                <input type="checkbox" id="angular-option" name="category" value="Minuman" className="hidden peer" onChange={handleSelectedCategory} checked={selectedCategory === 'Minuman'}/>
                <label htmlFor="angular-option" className="inline-flex items-center justify-between w-full p-2 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                  Minuman
                </label>
            </li>
          </ul>
          <div className="flex flex-col gap-8">\
            {filteredData.map((categoryMenu, i) => (
              <CardMenu key={i} itemCategory={categoryMenu} handleSelectMenu={handleSelectMenu} handleSelectToping={handleSelectToping} dataTopings={topingSelected}/>
            ))}
          </div>
        </div>
        <div className={`bg-slate-100 text-black p-4 max-md:fixed max-md:z-50 max-md:top-0 max-md:left-0 max-md:w-screen max-md:h-screen max-md:overflow-y-scroll ${openSidebar ? "max-md:translate-x-0" : "max-md:translate-x-full "} max-md:transition-all max-md:duration-300 max-md:shadow-lg xl:block`}>
          <div className="w-full flex justify-between">
            <h1 className="text-2xl font-bold mb-2">Detail Orderan</h1>
            <button type="button" className="w-6 h-6 rounded bg-slate-200 flex justify-center items-center" onClick={() => setOpenSidebar(false)}>x</button>
          </div>
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
                    className="py-2 px-3 outline-none rounded bg-slate-white"
                    required
                  />
                </label>
                <div className="bg-slate-200 p-3 rounded text-center flex justify-center items-center gap-4">
                  <p className="text-base">No. Meja</p>
                  <h1 className="text-4xl font-bold">{noMeja}</h1>
                </div>
              </div>
              <div className="flex flex-col gap-2 py-8">
                {cart.map((item, i) => {
                  const menu = dataMenu.find((menu) => menu.id === item.menuId);
                  if(menu) return (
                    <div key={i} className="w-full flex flex-col gap-2 bg-slate-200 py-1 px-3 rounded" >
                      <div className="flex gap-6 justify-center items-center">
                        <img className="w-16 h-16 aspect-square object-cover" src={`${process.env.REACT_APP_BASE_URL_API}/menu/images/${menu.gambarMenu}`} alt={menu.namaMenu} />
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
                              <button type="button" className="bg-slate-600 text-white p-1 rounded" onClick={() => handleDecrement(item.id, item.menuId)} >
                                <Minus />
                              </button>
                              <span className="mx-2">{item.jumlah}</span>
                              <button
                                type="button"
                                className="bg-slate-600 text-white p-1 rounded"
                                onClick={() => handleIncrement(item.id, item.menuId)}
                              >
                                <Plus />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      {item?.topings.length > 0 && (
                        <div className="flex flex-col">
                          <p>Toping</p>
                          {item.topings.map((toping, i) => (
                            <div key={i} className="flex justify-between items-center">
                              <div className="flex gap-2">
                                <p>{toping}</p>
                                <p>x{item.jumlah}</p>
                              </div>
                              <p>
                                {Number(menu.topings.find((top) => top.namaToping === toping).hargaToping).toLocaleString("id-ID", {
                                  style: "currency",
                                  currency: "IDR",
                                })}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
                <div className="flex justify-between text-lg font-bold py-3">
                  <h3>Total Harga</h3>
                  <h3 ref={totalHargaRef}>{totalPriceOrder.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</h3>
                </div>
                <button
                  className={`w-full py-2 text-black font-bold text-lg rounded ${
                    cart < 1 ? "bg-slate-300" : "bg-lime-300"
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
