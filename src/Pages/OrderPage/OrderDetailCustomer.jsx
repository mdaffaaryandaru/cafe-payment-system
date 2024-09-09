import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { get } from "../../utils/api";
import Pusher from "pusher-js";
import ringtoneChat from "../../Assets/livechat-129007.mp3";
import Swal from "sweetalert2";

const OrderDetailCustomer = () => {
  const { id, namaPelanggan } = useParams();

  const [dataOrder, setDataOrder] = useState({});
  const [dataOrderan, setDataOrderan] = useState([]);
  const [dataMenu, setDataMenu] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [currStatus, setCurrStatus] = useState("");

  const audioRef = useRef(new Audio(ringtoneChat));

  const fetchOrderById = async () => {
    try {
      const data = await get(`/order/${id}`);
      setDataOrder(data);
      setDataOrderan(data.orderan);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const fetchMenu = async () => {
    try {
      const res = await get("/menu");
      setDataMenu(res);
    } catch (e) {
      console.log(e);
    }
  };

  const loadAudio = () => {
    return new Promise((resolve, reject) => {
      const audio = new Audio(ringtoneChat); // Path ke file audio
      audio.preload = "auto";

      audio.oncanplaythrough = () => {
        audioRef.current = audio;
        resolve();
      };

      audio.onerror = (error) => {
        reject(new Error("Failed to load audio"));
      };
    });
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Error playing ringtone:", error);
      });
    }
  };

  useEffect(() => {
    // Enable pusher logging - don't include this in production
    Pusher.logToConsole = true;

    // Initialize Pusher
    const pusher = new Pusher("eeac291f5408aa1cf514", {
      cluster: "ap1",
    });

    // Subscribe to the channel
    const channel = pusher.subscribe("my-channel-customer");

    // Bind to the event
    channel.bind("my-event-customer", (data) => {
      loadAudio();
      //refresh page the page
      if (data.message.id == id) {
        setCurrStatus(data.message);
        playAudio();
        Swal.fire({
          title: "Pesanan Selesai",
          text: "Pesanan Anda telah selesai, silahkan ambil pesanan Anda",
          icon: "success",
        }).then(() => {
          window.location.reload(); // Reload the page after the alert is closed
        });
      }
    });

    // Cleanup on component unmount
    return () => {
      pusher.unsubscribe("my-channel-customer");
    };
  }, []);

  useEffect(() => {
    Pusher.logToConsole = true;

    const pusher = new Pusher("eeac291f5408aa1cf514", {
      cluster: "ap1",
    });

    // Subscribe to the channel
    const channel = pusher.subscribe("my-channel-customer-reject");

    // Bind to the event
    channel.bind("my-event-customer-reject", (data) => {
      loadAudio();
      //refresh page the page
      if (data.message.id == id) {
        setCurrStatus(data.message);
        playAudio();
        Swal.fire({
          title: "Pesanan Ditolak",
          text: "Pesanan Anda telah Ditolak, silahkan melakukan pembaran / konfirmasi ke kasir",
          icon: "error",
        }).then(() => {
          window.location.reload(); // Reload the page after the alert is closed
        });
      }
    });

    // Cleanup on component unmount
    return () => {
      pusher.unsubscribe("my-channel-customer-reject");
    };
  });

  useEffect(() => {
    fetchOrderById();
    fetchMenu();
  }, []);

  useEffect(() => {
    setIsLoading(dataOrderan.length === 0);
  }, [dataOrderan]);

  return (
    <div className="flex justify-center">
      <div className="max-w-lg w-full h-screen">
        <h1 className="text-2xl font-bold py-6 text-center">Resi Pesanan</h1>
        <h2 className="text-xl py-3 bg-green-500 text-center rounded font-bold">
          Pesanan Berhasil
        </h2>
        <p className="py-2">
          Terima Kasih telah order makanan maupun minuman di tempat kami, untuk
          pesanan Anda bisa dilihat statusnya. Jika Sudah Selesai Silahkan Ambil
          Pesananya di Kasir
        </p>
        <div
          className={`border ${
            currStatus === "Pesanan selesai" ||
            dataOrder.statusPesanan === "Pesanan selesai"
              ? "border-green-400 bg-green-300/20"
              : currStatus === "Pesanan ditolak" ||
                dataOrder.statusPesanan === "Pesanan ditolak"
              ? "border-red-400 bg-red-300/20"
              : "border-yellow-400 bg-yellow-300/20"
          } p-3 rounded my-4`}
        >
          <span>
            {currStatus === "Pesanan selesai" ||
            currStatus === "Pesanan ditolak"
              ? currStatus
              : dataOrder.statusPesanan}
          </span>
        </div>
        <div className="bg-slate-900 flex flex-col gap-3 rounded p-3">
          <h4 className="text-lg">Pesananmu</h4>

          {isLoading ? (
            <div className="flex justify-center items-center p-4">
              <p>Loading...</p>
              {/* Kamu bisa menambahkan spinner atau animasi loading di sini */}
            </div>
          ) : (
            dataOrderan.map((item, i) => {
              const menu = dataMenu.find((menu) => menu.id === item.menuId);
              if (!menu) return null; // Menangani kasus jika menu tidak ditemukan
              console.log(item);
              return (
                <div key={i} className="flex flex-col">
                  <div className="flex gap-3 bg-slate-800 p-2">
                    <img
                      className="w-16 h-16 object-cover rounded aspect-square"
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
                  {item?.topings.map((toping, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center bg-slate-200 p-2 text-black"
                    >
                      <span>{toping}</span>
                      <span>x{item.jumlah}</span>
                      <span>
                        {(
                          menu.topings.find((top) => top.namaToping === toping)
                            .hargaToping * item.jumlah
                        ).toLocaleString("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              );
            })
          )}
          <div className="flex justify-between items-center text-lg font-semibold">
            <p>Total Harga</p>
            <p>
              {Number(dataOrder.totalHarga).toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
                minimumFractionDigits: 0,
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailCustomer;
