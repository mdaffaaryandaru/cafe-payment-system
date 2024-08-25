import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { get } from '../../utils/api'

const OrderDetailCustomer = () => {
    const { id, namaPelanggan } = useParams()

    const [dataOrder, setDataOrder] = useState({})
    const [dataOrderan, setDataOrderan] = useState([])
    const [dataMenu, setDataMenu] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const fetchOrderById = async() => {
        try {
            const data = await get(`/order/${id}`);
            setDataOrder(data)
            setDataOrderan(data.orderan)
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    }

    const fetchMenu = async() => {
        try {
          const res = await get('/menu')
          setDataMenu(res)
        } catch (e) {
          console.log(e);
        }
    }

    useEffect(() => {
        fetchOrderById()
        fetchMenu()
    }, [])

    useEffect(() => {
        setIsLoading(dataOrderan.length === 0);
    }, [dataOrderan])

    return (
        <div className='flex justify-center'>
            <div className="max-w-lg w-full h-screen">
                <h1 className="text-2xl font-bold py-6 text-center">Resi Pesanan</h1>
                <h2 className='text-xl py-3 bg-green-500 text-center rounded font-bold'>Pesanan Berhasil</h2>
                <p className='py-2'>Terima Kasih telah order makanan maupun minuman di tempat kami, untuk pesanan Anda bisa dilihat statusnya.</p>
                <div className="border border-yellow-400 bg-yellow-300/20 p-3 rounded my-4">
                    <span>{dataOrder.statusPesanan}</span>
                </div>
                <div className="bg-slate-900 flex flex-col gap-3 rounded p-3">
                    <h4 className='text-lg'>Pesananmu</h4>

                    {isLoading ? (
                        <div className="flex justify-center items-center p-4">
                            <p>Loading...</p>
                            {/* Kamu bisa menambahkan spinner atau animasi loading di sini */}
                        </div>
                    ) : (
                        dataOrderan.map((item, i) => {
                            const menu = dataMenu.find((menu) => menu.id === item.menuId);
                            if (!menu) return null; // Menangani kasus jika menu tidak ditemukan
                            return (
                                <div key={i} className="flex gap-3 bg-slate-800 p-2">
                                    <img
                                        className='w-16 h-16 object-cover rounded aspect-square'
                                        src={`${process.env.REACT_APP_BASE_URL_API}/menu/images/${menu.gambarMenu}`}
                                        alt={menu.namaMenu}
                                    />
                                    <div className="w-full flex flex-col justify-between">
                                        <div className="">
                                            <h5 className='text-lg font-bold'>{menu.namaMenu}</h5>
                                            <p className='text-slate-400 text-xs'>{menu.kategoriMenu}</p>
                                        </div>
                                        <div className="w-full flex justify-between">
                                            <p>Jumlah: {item.jumlah}</p>
                                            <p className='font-bold'>
                                                {Number(item.harga).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div className="flex justify-between items-center text-lg font-semibold">
                        <p>Total Harga</p>
                        <p>{Number(dataOrder.totalHarga).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0, minimumFractionDigits: 0})}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderDetailCustomer