import { Button, Container, FormControl, Grid, LinearProgress, TextField } from '@mui/material';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import Select from 'react-select';
import { IconUpload } from '@tabler/icons';
import { IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { DataGrid } from '@mui/x-data-grid';
import { setNestedObjectValues } from 'formik';

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
const icons = { IconUpload };

function UrunEkle() {
    const { id } = useParams();

    const [fetchingError, setFetchingError] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [isUpdate, setIsUpdate] = useState(0);
    const [price, setPrice] = useState(0);
    const [priceError, setPriceError] = useState(false);
    const [adi, setAdi] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [description, setDescription] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const [options, setOptions] = useState([]);
    const [file, setFile] = useState(null);
    const [imageSrc, setImageSrc] = useState('');
    const [value, setValue] = React.useState('1');
    const [imageName, setImageName] = useState('');
    const [descriptionLength, setDescriptionLength] = useState(0);
    const [priceData, setPriceData] = useState([]);
    const [teklifId, setTeklifId] = useState();
    const [firmaAdi, setFirmaAdi] = useState('');
    const [firma, setFirma] = useState();
    const [musteriAdi, setMusteriAdi] = useState('');
    const [musteri, setMusteri] = useState();
    const [optionsFirma, setOptionsFirma] = useState([]);
    const [optionsMusteri, setOptionsMusteri] = useState([]);
    const [tarih, setTarih] = useState('');
    const [gecerlilik, setGecerlilik] = useState();
    const [teklifDurumu, setTeklifDurumu] = useState('');
    const [returnDelayed, setReturnDelayed] = useState(false);
    const [teklifUrunler, setTeklifUrunler] = useState([]);
    const [urunler, setUrunler] = useState([]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        if (typeof id !== 'undefined') {
            setIsUpdate(id);
            setIsFetching(true);
            teklifGetirPromise();
        } else {
            setQuantity('');
            setPrice('');
            setAdi('');
            setKategoriAdi('');
            setDescription('');
            setImageSrc('');
            setImageName('');
            setIsFetching(false);
        }
    }, [id]);

    const teklifEkle = async () => {
        if (typeof id !== 'undefined') {
            toast.promise(teklifEklePromise, {
                pending: 'Ürün güncelleniyor',
                success: teklifId + ' başarıyla güncellendi 👌',
                error: teklifId + ' güncellenirken hata oluştu 🤯'
            });
        } else {
            toast.promise(teklifEklePromise, {
                pending: 'Ürün kaydı yapılıyor',
                success: teklifId + ' başarıyla eklendi 👌',
                error: teklifId + ' eklenirken hata oluştu 🤯'
            });
            await uploadImage();
        }
    };

    const selectMusteri = async (firma) => {
        try {
            const response = await axios.post(`https://localhost:7002/api/Musteri/GetByFirmaId?firmaId=${firma}`);
            if (response.data && response.data.result) {
                setOptionsMusteri(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const viewPDF = async () => {
        const pdfUrl = 'http://localhost:5273/api/Teklif/GetPDF/' + `${firmaAdi}-${musteriAdi}-${teklifId}.pdf`;

        try {
            const response = await axios.get(pdfUrl, {
                responseType: 'blob' // Important to specify the response type as 'blob'
            });

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    const selectFirma = async () => {
        try {
            const response = await axios.post('https://localhost:7002/api/Firma/GetComboGrid');
            if (response.data && response.data.result) {
                setOptionsFirma(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const selectOptionsMusteri = optionsMusteri.map((option) => ({
        value: option.id,
        label: option.adi
    }));

    const selectOptionsFirma = optionsFirma.map((option) => ({
        value: option.id,
        label: option.adi
    }));

    const teklifDurumuOptions = [
        { value: 'Oluşturuldu', label: 'Oluşturuldu' },
        { value: 'Gönderildi', label: 'Gönderildi' },
        { value: 'Kabul Edildi', label: 'Kabul Edildi' },
        { value: 'Reddedildi', label: 'Reddedildi' },
        { value: 'Süresi Doldu', label: 'Süresi Doldu' }
    ];

    const handleSelectTeklifDurumu = (selectedOption) => {
        setTeklifDurumu(selectedOption.value); // Set the selected option value to the state
    };

    function handleSelectMusteri(event) {
        setMusteri(event.value);
        setMusteriAdi(optionsMusteri.find((option) => option.id == event.value).adi);
    }

    function handleSelectFirma(event) {
        setFirma(event.value);
        setFirmaAdi(optionsFirma.find((option) => option.id == event.value).adi);
        selectMusteri(event.value);
    }

    const fetchTeklifUrun = async (teklifId) => {
        try {
            const response = await axios.post(`https://localhost:7002/api/TeklifUrun/GetByTeklifId?teklifId=${teklifId}`);
            if (response.data && response.data.result) {
                setTeklifUrunler(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchUrun = async () => {
        try {
            const fetchedUrunler = await Promise.all(
                teklifUrunler.map(async (product) => {
                    const response = await axios.post(`https://localhost:7002/api/Urun/Get?id=${product.urunId}`);
                    return response.data.result ? response.data.data : null;
                })
            );

            // Filter out null values (failed requests) and update the state
            setUrunler(fetchedUrunler.filter((urun) => urun !== null));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        const delay = 2000; // 1000ms yani 1 saniye gecikme
        const timeoutId = setTimeout(() => {
            fetchTeklifUrun(teklifId);
        }, delay);

        // Temizleme işlemi: bileşen yeniden render edildiğinde çalışacak
        return () => clearTimeout(timeoutId);
    }, [teklifId]); // teklifId değiştiğinde yeniden çalıştır

    useEffect(() => {
        fetchUrun();
    }, [teklifUrunler]); // Whenever teklifUrunler changes, fetch products

    const teklifEklePromise = () => {
        return new Promise(async (resolve, reject) => {
            const start = Date.now();
            setValidationErrors({});
            let data = JSON.stringify({
                id: typeof id !== 'undefined' ? id : 0,
                adi: musteriAdi,
                musteriId: musteri,
                musteriAdi: musteriAdi,
                firmaId: firma,
                firmaAdi: firmaAdi,
                tarih: tarih,
                gecerlilikSuresi: gecerlilik,
                teklifDurumu: teklifDurumu
            });

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'http://localhost:5273/api/Teklif/CreateOrUpdate',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'text/plain'
                },
                data: data
            };

            axios
                .request(config)
                .then(async (response) => {
                    console.log(JSON.stringify(response.data));
                    if (response.data.result) {
                        const millis = Date.now() - start;
                        if (millis < 700) {
                            await sleep(700 - millis);
                        }
                        resolve(response.data); // Başarılı sonuç durumunda Promise'ı çöz
                    } else {
                        reject(new Error('İşlem başarısız')); // Başarısız sonuç durumunda Promise'ı reddet
                    }
                })
                .catch((error) => {
                    console.log(error);
                    setValidationErrors(error.response.data.errors);
                    reject(error); // Hata durumunda Promise'ı reddet
                });
        });
    };

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            borderRadius: '12px',
            minHeight: '50px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            borderColor: state.isFocused ? '#007bff' : '#d4d4d4',
            ':hover': {
                borderColor: state.isFocused ? '#007bff' : '#d4d4d4'
            }
        }),
        option: (provided, state) => ({
            ...provided,
            borderRadius: '12px',
            padding: '12px',
            color: state.isSelected ? 'white' : 'black',
            backgroundColor: state.isSelected ? '#007bff' : 'white',
            ':hover': {
                backgroundColor: state.isSelected ? '#007bff' : '#f0f0f0'
            }
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            color: '#007bff',
            ':hover': {
                color: '#007bff'
            }
        }),
        indicatorSeparator: () => ({
            display: 'none'
        })
    };

    const teklifGetirPromise = () => {
        return new Promise(async (resolve, reject) => {
            selectFirma();
            const start = Date.now();
            setValidationErrors({});
            let config = {
                method: 'post',
                url: 'http://localhost:5273/api/Teklif/Get',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'text/plain'
                },
                params: {
                    id: id
                }
            };

            axios
                .request(config)
                .then(async (response) => {
                    console.log(JSON.stringify(response.data));
                    if (response.data.result) {
                        const millis = Date.now() - start;
                        if (millis < 500) {
                            await sleep(500 - millis);
                        }
                        console.log(response.data);
                        setTeklifId(response.data.data.id);
                        selectMusteri(response.data.data.firmaId);
                        setFirma(response.data.data.firmaId);
                        setFirmaAdi(response.data.data.firmaAdi);
                        setMusteri(response.data.data.musteriId);
                        setMusteriAdi(response.data.data.musteriAdi);
                        setTarih(response.data.data.tarih);
                        setGecerlilik(response.data.data.gecerlilikSuresi);
                        setTeklifDurumu(response.data.data.teklifDurumu);
                        setFetchingError(false);
                        resolve(response.data);
                    } else {
                        setFetchingError(true);
                        reject(new Error('İşlem başarısız'));
                    }
                })
                .catch((error) => {
                    setFetchingError(true);
                    console.log(error);
                    reject(error);
                })
                .finally(() => {
                    setIsFetching(false);
                });
        });
    };

    return (
        <div
            style={{
                margin: 'auto',
                display: 'flex',
                justifyContent: 'center'
            }}
        >
            <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={value}>
                    <Box
                        sx={{
                            borderBottom: 1,
                            borderColor: 'divider',
                            display: 'flex',
                            justifyContent: 'center' // Yatayda ortala
                        }}
                    >
                        <TabList onChange={handleChange} aria-label="lab API tabs example" textColor="secondary" indicatorColor="secondary">
                            <Tab label="Temel Bilgiler" value="1" />
                            <Tab label="Urunler" value="2" />
                        </TabList>
                    </Box>
                    <TabPanel value="1">
                        <>
                            <Container className="d-flex justify-content-center" maxWidth="md">
                                <Grid item xs={6}>
                                    <FormControl sx={{ m: 0, width: '50ch' }}>
                                        {isFetching && <LinearProgress className="mt-3" color="secondary" />}
                                        {(!isUpdate || !isFetching) && (
                                            <>
                                                <Box>
                                                    <div style={{ marginTop: '16px', marginBottom: '20px' }}>
                                                        <Select
                                                            options={selectOptionsFirma}
                                                            defaultValue={selectOptionsFirma.find((option) => option.value === firma)} // Set default value based on the firma state
                                                            onChange={handleSelectFirma}
                                                            placeholder={'Firma seçiniz...'}
                                                            styles={customStyles}
                                                        />
                                                    </div>
                                                    <div style={{ marginTop: '16px', marginBottom: '20px' }}>
                                                        <Select
                                                            options={selectOptionsMusteri}
                                                            defaultValue={selectOptionsMusteri.find((option) => option.value === musteri)} // Set default value based on the musteri state
                                                            onChange={handleSelectMusteri}
                                                            placeholder={'Müşteri seçiniz...'}
                                                            styles={customStyles}
                                                        />
                                                    </div>
                                                    <div style={{ marginTop: '16px', marginBottom: '20px' }}>
                                                        <Select
                                                            options={teklifDurumuOptions}
                                                            defaultValue={teklifDurumuOptions.find(
                                                                (option) => option.value === teklifDurumu
                                                            )} // Set default value based on the musteri state
                                                            onChange={handleSelectTeklifDurumu}
                                                            placeholder={'Teklif Durumu'}
                                                            styles={customStyles}
                                                        />
                                                    </div>
                                                    <div style={{ marginTop: '16px', marginBottom: '20px' }}>
                                                        <TextField
                                                            label="Geçerlilik Süresi (Gün)"
                                                            type="number"
                                                            InputProps={{ inputProps: { min: 1 } }}
                                                            defaultValue={gecerlilik}
                                                            onChange={(e) => setGecerlilik(e.target.value)}
                                                        />
                                                    </div>
                                                </Box>
                                                <Button variant="contained" color="primary" onClick={teklifEkle}>
                                                    Guncelle
                                                </Button>
                                            </>
                                        )}
                                    </FormControl>
                                </Grid>
                            </Container>
                        </>
                    </TabPanel>
                    <TabPanel value="2">
                        <>
                            <Container className="d-flex justify-content-center" maxWidth="md">
                                <Grid item xs={12}>
                                    <FormControl sx={{ m: 0, width: '100%' }}>
                                        <h2>Ürünler</h2>
                                        <div style={{ height: 400, width: '100%' }}>
                                            <DataGrid
                                                columns={[
                                                    { field: 'id', headerName: 'ID', width: 100 },
                                                    { field: 'adi', headerName: 'Urun Adi', width: 200 },
                                                    { field: 'kategoriAdi', headerName: 'Kategori', width: 200 },
                                                    { field: 'description', headerName: 'Aciklama', width: 200 }
                                                ]}
                                                rows={urunler}
                                            />
                                        </div>
                                    </FormControl>
                                </Grid>
                            </Container>
                            <div className="d-flex justify-content-center mt-4">
                                <Button variant="contained" color="primary" onClick={viewPDF}>
                                    PDF Dosyasını Görüntüle
                                </Button>
                            </div>
                        </>
                    </TabPanel>
                </TabContext>
            </Box>
        </div>
    );
}

export default UrunEkle;
