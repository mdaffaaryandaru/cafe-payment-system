import React, { useEffect, useState } from 'react'
import { get, postWithFile } from '../../utils/api'

const PaymentPage = () => {
    const [cart, setCart] = useState([])
    const [dataMenu, setDataMenu] = useState([])
    const [dataOrder, setDataOrder] = useState({})
    const [isCopied, setIsCopied] = useState(false)

    const [selectedValue, setSelectedValue] = useState('')
    const [filename, setFilename] = useState({})

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
            console.log(e);
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

    const handleChange = (e) => {
        const {type, name, value, files} = e.target

        if(type === 'file') {
            setFilename(files[0])
        } else {
            setSelectedValue(value)
        }

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

    const handlePayment = async() => {
        // setDataOrder({
        //     ...dataOrder,
        //     statusPesanan: 'Pending',
        //     jenisPembayaran: selectedValue,
        //     gambarTransaksi: filename
        // })

        const formData = new FormData()
        formData.append('noMeja', dataOrder.noMeja)
        formData.append('namaPelanggan', dataOrder.namaPelanggan)
        formData.append('statusPesanan', 'Pesanan diterima ke kasir')
        formData.append('jenisPembayaran', selectedValue)
        formData.append('orderan', JSON.stringify(cart))
        formData.append('totalHarga', dataOrder.totalHarga)
        formData.append('gambarTransaksi', filename)

        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
          }

        try {
            const response = await postWithFile('/order/create-order', formData)
            console.log(response)
            localStorage.removeItem('order')
        } catch (error) {
            console.error(error)
        }
        
    }

    useEffect(() => {
        console.log(dataOrder)
    }, [dataOrder])
    

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
                        const menu = dataMenu.find((menu) => menu.id === item.id_menu)
                        console.log(menu.namaMenu)
                        return (
                            <div key={i} className="flex gap-3 bg-slate-800 p-2">
                                <img className='w-20 h-20 object-cover rounded aspect-square' src={`http://localhost:3000/menu/images/${menu.gambarMenu}`} alt={menu.namaMenu} />
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
                                    type="radio"
                                    value={bank.nama_bank}
                                    checked={selectedValue === bank.nama_bank}
                                    onChange={handleChange}
                                    className="form-radio text-blue-600"
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
                        <label
                            htmlFor="file-input"
                            className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
                        >
                            Upload Image
                        </label>
                        <input
                            id="file-input"
                            type="file"
                            accept="image/*"
                            onChange={handleChange}
                            className="hidden"
                        />
                        <p>{filename.name ?? 'Bukti pembayaran belum di upload'}</p>
                    </div>
                    <button className='w-full py-2 text-center bg-lime-300 text-black rounded my-4 font-bold text-base' type='button' onClick={handlePayment}>Bayar Pesanan</button>
                </div>
            </div>
        </section>
    )
}

export default PaymentPage