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
  Select,
  IconButton,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { get } from "../../../utils/api";

const styleModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ModalViewOrderan = ({ setDataForm, dataItem, handleOnSubmit }) => {
  // for open modal add
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(dataItem);
  const [dataMenu, setDataMenu] = useState([])

  console.log(dataItem)
  
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await get("/menu");
        setDataMenu(data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems()
  }, [])

  const handleOnChange = (e) => {
    const { name, value, type } = e.target;
    setData({
      ...data,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  const handleSubmit = (e) => {
    handleOnSubmit(e, data.id);
    setOpen(false);
  };

  return (
    <>
      <IconButton onClick={() => setOpen(true)}>
        <EditIcon />
      </IconButton>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleModal}>
          <Typography id="modal-modal-title" variant="h4" component="h2">
            Detail Orderan
          </Typography>
          <div className="grid grid-cols-2 gap-8">
            <div className="">
              <div className="grid grid-cols-2 my-4">
                <div className="w-full flex flex-col">
                  <span className="text-xs">Nama</span>
                  <h4 className="text-xl">{data.namaPelanggan}</h4>
                </div>
                <div className="w-full flex flex-col">
                  <span className="text-xs">No. Meja</span>
                  <h4 className="text-xl">{data.noMeja}</h4>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {data.orderan.map((item, i) => {
                  const menu = dataMenu.find((menu) => menu.id === item.menuId);
                  if(menu) return (
                    <div key={i} className="flex gap-3 bg-slate-800 p-2">
                        <img className='w-16 h-16 object-cover rounded aspect-square' src={`http://192.168.18.217:3000/menu/images/${menu.gambarMenu}`} alt={menu.namaMenu} />
                        <div className="w-full flex flex-col justify-between">
                            <div className="">
                                <h5 className='text-lg font-bold'>{menu.namaMenu}</h5>
                                <p className='text-slate-400 text-xs'>{menu.kategoriMenu}</p>
                            </div>
                            <div className="w-full flex justify-between">
                                <p>Jumlah: {item.jumlah}</p>
                                <p className='font-bold'>{Number(item.harga).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</p>
                            </div>
                        </div>
                    </div>
                  )
                })}
                <div className="flex justify-between">
                  <h4>Total</h4>
                  <h4>{Number(data.totalHarga).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</h4>
                </div>
              </div>
            </div>
            <div className="">
              <div className="">
                <p>Bukti Pembayaran</p>
                <img className=" aspect-square object-contain" src={`http://192.168.18.217:3000/order/images/${data.gambarTransaksi}`} alt="" />
              </div>
            </div>
          </div>
          {/* <div className="flex flex-col gap-3">
            {data.orderan.map((item, i) => {
              const menu = dataMenu.find((menu) => menu.id === item.menuId);
              if(menu) return (
                <div key={i} className="flex gap-3 bg-slate-800 p-2">
                    <img className='w-16 h-16 object-cover rounded aspect-square' src={`http://192.168.18.217:3000/menu/images/${menu.gambarMenu}`} alt={menu.namaMenu} />
                    <div className="w-full flex flex-col justify-between">
                        <div className="">
                            <h5 className='text-lg font-bold'>{menu.namaMenu}</h5>
                            <p className='text-slate-400 text-xs'>{menu.kategoriMenu}</p>
                        </div>
                        <div className="w-full flex justify-between">
                            <p>Jumlah: {item.jumlah}</p>
                            <p className='font-bold'>{Number(item.harga).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</p>
                        </div>
                    </div>
                </div>
              )
            })}
            <div className="flex justify-between">
              <h4>Total</h4>
              <h4>{Number(data.totalHarga).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</h4>
            </div>
            <div className="">
              <img className=" aspect-square object-contain" src={`http://192.168.18.217:3000/order/images/${data.gambarTransaksi}`} alt="" />
            </div>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati cum, temporibus quis officiis perferendis laudantium at reprehenderit. Eveniet ullam, perspiciatis commodi harum ratione blanditiis at! Error qui earum iusto a.</p>
          </div> */}
        </Box>
      </Modal>
    </>
  );
};

export default ModalViewOrderan;
