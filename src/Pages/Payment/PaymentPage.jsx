import React, { useContext, useEffect, useState } from 'react'
import { get, postWithFile } from '../../utils/api'
import { useNavigate } from 'react-router-dom'
import io from 'socket.io-client';
import { ContextNotification } from '../../Components/ContextNotification/ContextNotification';

const PaymentPage = () => {
    const navigate = useNavigate()
    const { addNotif } = useContext(ContextNotification)

    const [cart, setCart] = useState([])
    const [dataMenu, setDataMenu] = useState([])
    const [dataOrder, setDataOrder] = useState({})
    const [isCopied, setIsCopied] = useState(false)

    const [selectedValue, setSelectedValue] = useState('')
    const [filename, setFilename] = useState({})

    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    // const status ='Pesanan diterima ke kasir'

    const dataRekening = [
        {
            nama_bank: 'BCA Transfer',
            no_rekening: '098686868746'
        }, {
            nama_bank: 'Virtual Account (VA)',
            no_rekening: '0781231239'
        }
    ]
    
    const fetchMenu = async() => {
        try {
            const res = await get('/menu')
            setDataMenu(res)
        } catch (e) {
            console.error(e);
        }
    }
    
    useEffect(() => {
        fetchMenu()
    }, [])

    useEffect(() => {
        if (dataMenu.length != 0) {            
            const storedData = localStorage.getItem('order');

            if (storedData) {
              try {
                const orderJson = JSON.parse(storedData)
                setDataOrder(orderJson)
                setCart(orderJson.orderan)
              } catch (e) {
                console.error('Error parsing JSON from localStorage:', e);
              }
            }
        }
    }, [dataMenu])

    const handleOnChange = (e) => {
        const { name, value, type, files } = e.target;

        if(type === 'file') {
            console.log(files[0])
            setFilename(files[0])
        } else if (type === 'radio') {
            setSelectedValue(value)
        }

        setDataOrder({
            ...dataOrder,
            statusPesanan: 'Pesanan diterima oleh pelayan',
            [name]:
            type === "number" ? Number(value) : type === "file" ? files[0] : value,
        });
    }

    const handleCopyRekening = () => {
        navigator.clipboard.writeText(dataRekening.find(data => data.nama_bank === selectedValue).no_rekening)
        .then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000); // Reset the copied state after 2 seconds
        })
        .catch(err => {
            console.error('Failed to copy text: ', err);
        });
    }

    // connect websocket
    useEffect(() => {
        const newSocket = io("http://192.168.18.217:3000", {
            transports: ["websocket"],
        });
    
        newSocket.on("connect", () => {
            console.log("Connected to Socket.IO server.");
        });
    
        newSocket.on("message", (data) => {
            try {
                console.log("Message received:", data);
            } catch (error) {
                console.error("Error processing message:", error);
            }
        });
    
        newSocket.on("disconnect", () => {
            console.log("Disconnected from Socket.IO server.");
        });
    
        newSocket.on("error", (error) => {
            console.error("Socket.IO error:", error);
        });
    
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [])

    const handleSubmitPayment = async(e) => {
        e.preventDefault()

        if (socket) {
            socket.emit('order', 'Hello from client!');
            console.log('Message sent!');
        }

        const newFormData = new FormData()
        newFormData.append('noMeja', dataOrder.noMeja)
        newFormData.append('namaPelanggan', dataOrder.namaPelanggan)
        newFormData.append('statusPesanan', 'Pesanan diterima ke kasir')
        newFormData.append('jenisPembayaran', selectedValue)
        newFormData.append('orderan', JSON.stringify(cart))
        newFormData.append('totalHarga', dataOrder.totalHarga)
        newFormData.append('gambarTransaksi', filename)

        try {
            const response = await postWithFile('/order/create-order', newFormData)
            console.log(response)
            localStorage.removeItem('order')
            navigate(`/order-tracker/${response.id}/${response.namaPelanggan}`)
        } catch (error) {
            console.error(error)
        }
        
    }
    

    return (
        <section className='container'>
            <h1 className='text-2xl lg:text-4xl font-bold my-5'>Selesaikan Pembayaran</h1>
            <div className="w-full flex justify-between items-center mb-8 rounded bg-slate-800 p-2">
                <div className="">
                    <p>Nama</p>
                    <h3 className='text-2xl font-bold'>{dataOrder.namaPelanggan}</h3>
                </div>
                <h3 className='text-2xl'>No. Meja: {dataOrder.noMeja}</h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="h-max grid grid-cols-1 lg:grid-cols-2 max-lg:px-6 gap-6">
                    {cart.map((item, i) => {
                        const menu = dataMenu.find((menu) => menu.id === item.menuId)
                        return (
                            <div key={i} className="flex gap-3 bg-slate-800 p-2">
                                <img className='w-20 h-20 object-cover rounded aspect-square' src={`http://192.168.18.217:3000/menu/images/${menu.gambarMenu}`} alt={menu.namaMenu} />
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
                </div>
                <div className="w-full bg-slate-900 p-5">
                    <form onSubmit={handleSubmitPayment}>
                        <div className="flex justify-between items-center text-xl py-3 px-2 mb-3">
                            <h1>Total Harga</h1>
                            <h1 className='font-bold'>{Number(dataOrder.totalHarga).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</h1>
                        </div>
                        <h2 className="text-lg font-semibold mb-4">Pilih Opsi Pembayaran</h2>
                        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {dataRekening.map((bank, i) => (
                                <div key={i} className="p-2 rounded border border-gray-400">
                                    <label className="inline-flex items-center">
                                    <input
                                        name='jenisPembayaran'
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
                            <div className="w-full bg-slate-800 p-3 my-4 rounded flex justify-between items-center">
                                <div className="flex flex-col">
                                    <h1>No. Rekening / VA</h1>
                                    <h1 className='text-xl font-bold'>{dataRekening.find(data => data.nama_bank === selectedValue).no_rekening}</h1>
                                </div>
                                <button type='button' className='p-2 bg-lime-300 text-black w-max h-max rounded font-bold' onClick={handleCopyRekening}>{isCopied ? 'Tersalin' : 'Salin'}</button>
                            </div>
                        )}
                        <div className="flex max-lg:w-max max-lg:flex-col lg:items-center gap-2 py-3">
                            <input
                                id="gambarTransaksi"
                                type="file"
                                name='gambarTransaksi'
                                onChange={handleOnChange}
                                required
                            />
                            {/* <p>{filename.name ?? 'Bukti pembayaran belum di upload'}</p> */}
                        </div>
                        <button className='w-full py-2 text-center bg-lime-300 text-black rounded my-4 font-bold text-base' type='submit'>Bayar Pesanan</button>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default PaymentPage