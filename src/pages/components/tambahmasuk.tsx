import React, { useEffect, useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import supplier from '../supplier';
import { Select, Space, DatePicker, message } from 'antd';
import type { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';
import moment from 'moment';

interface ModalFormProps {
  onClose: () => void;
  supplier: DataSupplier[];
}

interface DataSupplier {
  idsupplier: string;
  nama_supplier: string;
}

const ModalForm: React.FC<ModalFormProps> = ({ onClose }) => {
  const [namaBarang, setNamaBarang] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [jumlah, setJumlah] = useState(0);
  const [konfirJumlah, setKonfirJumlah] = useState(0);
  const [penerima, setPenerima] = useState('');
  const [tanggal, setTanggal] = useState<any>(null);
  const [namaSupplier, setNamaSupplier] = useState('');
  const [supplierData, setSupplierData] = useState<DataSupplier[]>([]);
  const [idSupplier, setIdSupplier] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [CloseModal, setCloseModal] = useState(false);
  const { Option } = Select;
  const { RangePicker } = DatePicker;

  const handleTambahBarang = async () => {
    try {
      const selectedSupply = supplierData.find((item) => item.idsupplier === idSupplier);
      if (!selectedSupply) {
        message.error('Supplier tidak ditemukan');
        return;
      }

      if (jumlah !== konfirJumlah) {
        message.error('Konfirmasi Jumlah tidak sesuai');
        return;
      }

      const tanggal = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
      const response = await fetch('http://localhost:3700/masuk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({
          nama_barang: namaBarang,
          jumlah: Number(jumlah),
          konfir_jumlah: Number(konfirJumlah),
          penerima: penerima,
          nama_supplier: selectedSupply.nama_supplier,
          tanggal: tanggal,
          keterangan: keterangan,
        }),
      });

      if (response.ok) {
        alert('Data berhasil ditambah');
        onClose();
        window.location.reload();
      } else {
        message.error('Data gagal ditambah');
      }
    } catch (error) {
      alert('Terjadi kesalahan saat menambah data');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3700/supplier');
        const data = await response.json();
        setSupplierData(data);
      } catch (error) {
        console.log('Terjadi kesalahan saat mengambil data supplier');
      }
    };

    setTimeout(() => {
      setShowModal(true);
      setCloseModal(true);
    }, 1);

    fetchData();
  }, []);

  const handleClose = () => {
    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 500); // Mengatur jeda sebelum memanggil onClose()
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleTambahBarang();
  };

  const handleNamaBarangChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const firstLetterUppercase = inputValue.charAt(0).toUpperCase() + inputValue.slice(1);

    if (inputValue === firstLetterUppercase) {
      setNamaBarang(inputValue);
    } else {
      alert('Gunakan huruf kapital pada huruf depan');
    }
  };



  return (
    <div
      className={`fixed z-10 inset-0 overflow-y-auto transition-opacity duration-500 ${
        showModal ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-50">
        <div className="relative bg-white w-1/2 rounded">
          <button
              onClick={handleClose}
              className={`absolute top-0 right-0 p-4 transition-opacity duration-500 ${
                showModal ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <CloseOutlined />
          </button>
          <form onSubmit={handleSubmit}>
            <div className='mt-5 ml-4 p-2 font-semibold text-xl'>
              <h1>TAMBAH BARANG</h1>
            </div>
            <div className="flex p-2 -mt-3">
              <div className="flex-1">
                <div className="p-4">
                  <div className='font-semibold mb-2'><label htmlFor="nama">Nama Barang</label></div>
                  <input className="w-full p-2 rounded bg-stone-50 border h-9" type="text" id="nama" name="nama" value={namaBarang} onChange={handleNamaBarangChange} required />
                </div>
                <div className="p-4 -mt-6">
                  <div className='font-semibold mb-2'><label htmlFor="jumlah">Jumlah</label></div>
                  <input className="w-full p-2 rounded bg-stone-50 border" type="number" id="jumlah" name="jumlah" min="1" onChange={(e) => setJumlah(Number(e.target.value))} required />
                </div>
                <div className="p-4 -mt-6">
                  <div className='font-semibold mb-2'><label htmlFor="konfirjumlah">Konfirmasi Jumlah</label></div>
                  <input className="w-full p-2 rounded bg-stone-50 border" type="number" id="konfirjumlah" name="konfirjumlah" min="1" onChange={(e) => setKonfirJumlah(Number(e.target.value))} required />
                </div>
                <div className="p-4 -mt-6">
                  <div className='font-semibold mb-2'><label htmlFor="penerima">Penerima</label></div>
                  <input className="w-full p-2 rounded bg-stone-50 border" type="text" id="penerima" name="penerima" value={penerima} onChange={(e) => setPenerima(e.target.value)} required />
                </div>
              </div>
              <div className="flex-1 -ml-4">
                {/* <div className="p-4">
                  <div className='font-semibold mb-1.5'><label htmlFor="tanggal">Tanggal</label></div>
                  <DatePicker className="w-full p-2 rounded border" showTime format="YYYY-MM-DD HH:mm:ss" onChange={(date) => setTanggal(date)} />
                </div> */}
                <div className="p-4 -mt-7">
                  <div className='font-semibold mb-3'><label htmlFor="supply">Supplier</label></div>
                  <Space wrap>
                    <Select
                      placeholder="Pilih Supplier"
                      style={{ width: 288 }}
                      onChange={(value) => setIdSupplier(value.toString())}
                      id='supply'
                      value={idSupplier}
                    >
                      {supplierData.length > 0 ? (
                        supplierData.map((item) => (
                          <Option key={item.idsupplier} value={item.idsupplier}>
                            {item.nama_supplier}
                          </Option>
                        ))
                      ) : (
                        <Option value="" disabled>
                          Data belum tersedia
                        </Option>
                      )}
                    </Select>
                  </Space>
                </div>
                <div className="p-4 -mt-5 h-3/4" style={{ height: "46%" }}>
                  <div className='font-semibold mb-2'><label htmlFor="keterangan">Keterangan (opsional)</label></div>
                  <textarea className="w-full p-3 rounded bg-stone-50 border" id="keterangan" name="keterangan" placeholder="" style={{ resize: "none", height: "100%" }} onChange={(e) => setKeterangan(e.target.value)}></textarea>
                </div>
              </div>
            </div>
            <div className="p-6 text-right -mt-9">
              <button type="submit" className="bg-blue-500 text-white p-2 px-4 rounded hover:bg-blue-600">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalForm;
