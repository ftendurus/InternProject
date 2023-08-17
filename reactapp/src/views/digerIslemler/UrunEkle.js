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
    const [kategoriId, setKategoriId] = useState(0);
    const [kategoriAdi, setKategoriAdi] = useState('');
    const [quantityError, setQuantityError] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [options, setOptions] = useState([]);
    const [file, setFile] = useState(null);
    const [imageSrc, setImageSrc] = useState('');
    const [value, setValue] = React.useState('1');
    const [imageName, setImageName] = useState('');
    const [descriptionLength, setDescriptionLength] = useState(0);
    const [priceData, setPriceData] = useState([]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        console.log(id);
        if (typeof id !== 'undefined') {
            setIsUpdate(id);
            setIsFetching(true);
            urunGetirPromise();
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

    const urunEkle = async () => {
        if (typeof id !== 'undefined') {
            await uploadImage();
            toast.promise(urunEklePromise, {
                pending: 'Ürün güncelleniyor',
                success: adi + ' ' + kategoriAdi + ' başarıyla güncellendi 👌',
                error: adi + ' ' + kategoriAdi + ' güncellenirken hata oluştu 🤯'
            });
        } else {
            toast.promise(urunEklePromise, {
                pending: 'Ürün kaydı yapılıyor',
                success: adi + ' ' + kategoriAdi + ' başarıyla eklendi 👌',
                error: adi + ' ' + kategoriAdi + ' eklenirken hata oluştu 🤯'
            });
            await uploadImage();
        }
    };

    useEffect(() => {
        if (id) {
            fetchPriceData(id);
        }
    }, [id]);

    const fetchPriceData = async (urunId) => {
        try {
            const response = await axios.post(`https://localhost:7002/api/Fiyat/GetByUrunId?urunId=${urunId}`);
            if (response.data && response.data.result) {
                setPriceData(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching price data:', error);
        }
    };

    const getImage = async (imageName) => {
        try {
            const response = await axios.get(`https://localhost:7002/api/Urun/GetImage?imageName=${imageName}`, {
                responseType: 'blob' // Binary olarak cevap alıyoruz
            });

            // Eğer istediğiniz gibi kullanmak isterseniz, dönen blob verisini kullanabilirsiniz
            const blob = response.data;
            // Örnek olarak blob'u bir <img> etiketi içerisinde görüntülemek için aşağıdaki gibi kullanabilirsiniz
            // const imageUrl = URL.createObjectURL(blob);
            // <img src={imageUrl} alt="Resim" />

            return blob;
        } catch (error) {
            console.error('Image fetching error:', error);
            throw error;
        }
    };

    const fetchAndSetImage = async (imageName) => {
        if (imageName != '') {
            const blob = await getImage(imageName);
            const imageUrl = URL.createObjectURL(blob);
            setImageSrc(imageUrl);
        }
    };

    const uploadImage = async () => {
        if (!file) {
            toast.error('Dosya seçilmedi');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('https://localhost:7002/api/Urun/UploadImage', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.data.path) {
                toast.success('Dosya yüklendi: ' + response.data.path);
                setImageSrc(response.data.path);
            } else {
                toast.error('Dosya yükleme hatası');
            }
        } catch (error) {
            console.error('Dosya yükleme hatası:', error);
            toast.error('Dosya yükleme hatası');
        }
    };

    const urunEklePromise = () => {
        return new Promise(async (resolve, reject) => {
            const start = Date.now();
            setValidationErrors({});

            let data = {
                id: typeof id !== 'undefined' ? id : 0,
                adi: adi,
                kategoriAdi: kategoriAdi,
                price: price,
                quantity: quantity,
                kategoriId: kategoriId,
                description: description,
                imageName: file ? file.name : '', // imageName'i eklemeyi unutmayın
                imageSrc: imageSrc
            };

            let config = {
                method: 'post',
                url: 'https://localhost:7002/api/Urun/CreateOrUpdate',
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
                        resolve(response.data);
                    } else {
                        reject(new Error('İşlem başarısız'));
                    }
                })
                .catch((error) => {
                    console.log(error);
                    setValidationErrors(error.response.data.errors);
                    reject(error);
                });
        });
    };

    useEffect(() => {
        selectKategori();
        fetchAndSetImage(imageName);
    }, []);

    const selectKategori = async () => {
        try {
            const response = await axios.post('https://localhost:7002/api/AltKategori/GetComboGrid');
            if (response.data && response.data.result) {
                setOptions(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const selectOptions = options.map((option) => ({
        value: option.id,
        label: option.adi
    }));

    function handleSelect(event) {
        setKategoriId(event.value);
        setKategoriAdi(options.find((option) => option.id === event.value).adi);
    }

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
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

    const urunGetirPromise = () => {
        return new Promise(async (resolve, reject) => {
            const start = Date.now();
            setValidationErrors({});
            let config = {
                method: 'post',
                url: 'http://localhost:5273/api/Urun/Get',
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
                        setAdi(response.data.data.adi);
                        setKategoriAdi(response.data.data.kategoriAdi);
                        setKategoriId(response.data.data.kategoriId);
                        setQuantity(response.data.data.quantity);
                        setPrice(response.data.data.price);
                        setImageName(response.data.data.imageName);
                        setDescription(response.data.data.description);
                        setImageSrc(response.data.data.imageSrc);
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
                            <Tab label="Görsel Ekle" value="2" />
                            <Tab label="Ücretlendirme" value="3" />
                            <Tab label="Envanter Bilgisi" value="4" />
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
                                                <TextField
                                                    value={adi}
                                                    margin="normal"
                                                    id="name"
                                                    label="Ürün Adı"
                                                    variant="outlined"
                                                    onChange={(e) => setAdi(e.target.value)}
                                                />
                                                <TextField
                                                    value={description}
                                                    margin="normal"
                                                    id="description"
                                                    label="Açıklama"
                                                    variant="outlined"
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (value.length <= 150) {
                                                            setDescription(value);
                                                            setDescriptionLength(value.length);
                                                        }
                                                    }}
                                                    fullWidth
                                                    multiline
                                                    rows={4}
                                                />
                                                <p style={{ color: descriptionLength > 150 ? 'red' : 'inherit' }}>
                                                    {descriptionLength} / 150 characters
                                                </p>
                                                <div style={{ marginTop: '16px', marginBottom: '20px' }}>
                                                    <Select
                                                        options={selectOptions}
                                                        defaultValue={{ value: kategoriId, label: kategoriAdi }}
                                                        onChange={handleSelect}
                                                        placeholder={'Kategori Seciniz...'}
                                                        styles={customStyles}
                                                    />
                                                </div>
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
                                <Grid item xs={6}>
                                    <FormControl sx={{ m: 0, width: '50ch' }}>
                                        {isFetching && <LinearProgress className="mt-3" color="secondary" />}
                                        {(!isUpdate || !isFetching) && (
                                            <>
                                                <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                                                    {imageName && (
                                                        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                                                            <h2>Varolan Görsel:</h2>
                                                            <img
                                                                src={`https://localhost:7002/api/Urun/GetImage?imageName=${imageName}`}
                                                                alt="Varolan Resim"
                                                                style={{ maxWidth: '100%', maxHeight: '200px' }}
                                                            />
                                                        </div>
                                                    )}
                                                    <h2>Görsel Ekle:</h2>
                                                    <label
                                                        htmlFor="upload-button"
                                                        style={{
                                                            display: 'block',
                                                            marginBottom: '10px',
                                                            cursor: 'pointer',
                                                            color: '#007bff',
                                                            textDecoration: 'underline'
                                                        }}
                                                    >
                                                        {file ? (
                                                            <div>
                                                                <span>Seçili Dosya: </span>
                                                                <span style={{ fontWeight: 'bold' }}>{file.name}</span>
                                                            </div>
                                                        ) : (
                                                            <IconButton color="primary" component="span" style={{ fontWeight: 'bold' }}>
                                                                <CloudUploadIcon style={{ marginRight: '5px' }} />
                                                                Dosya Seç
                                                            </IconButton>
                                                        )}
                                                    </label>
                                                    <input
                                                        type="file"
                                                        id="upload-button"
                                                        style={{ display: 'none' }}
                                                        onChange={handleFileChange}
                                                    />
                                                    {file && (
                                                        <div style={{ marginTop: '10px' }}>
                                                            <h4>Önizleme:</h4>
                                                            <img
                                                                src={URL.createObjectURL(file)}
                                                                alt="Seçilen Resim"
                                                                style={{ maxWidth: '100%', maxHeight: '200px' }}
                                                            />
                                                        </div>
                                                    )}

                                                    {/* Display existing image */}
                                                </div>
                                            </>
                                        )}
                                    </FormControl>
                                </Grid>
                            </Container>
                        </>
                    </TabPanel>
                    <TabPanel value="3">
                        <>
                            <Container className="d-flex justify-content-center" maxWidth="md">
                                <Grid item xs={6}>
                                    <FormControl sx={{ m: 0, width: '50ch' }}>
                                        {isFetching && <LinearProgress className="mt-3" color="secondary" />}
                                        {(!isUpdate || !isFetching) && (
                                            <>
                                                <TextField
                                                    margin="normal"
                                                    value={price}
                                                    id="price"
                                                    label="Ürün Fiyatı"
                                                    variant="outlined"
                                                    onChange={(e) => setPrice(e.target.value)}
                                                />
                                            </>
                                        )}
                                    </FormControl>
                                </Grid>
                            </Container>
                            <Container className="d-flex justify-content-center" maxWidth="md">
                                <Grid item xs={12}>
                                    <FormControl sx={{ m: 0, width: '100%' }}>
                                        <h2>Fiyat Teklif Gecmisi</h2>
                                        <div style={{ height: 400, width: '100%' }}>
                                            <DataGrid
                                                columns={[
                                                    { field: 'id', headerName: 'ID', width: 100 },
                                                    {
                                                        field: 'sonFiyat',
                                                        headerName: 'Verilen Teklif(TL)',
                                                        width: 200,
                                                        valueFormatter: ({ value }) => {
                                                            return Number(value).toLocaleString('tr-TR', {
                                                                style: 'currency',
                                                                currency: 'TRY',
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2
                                                            });
                                                        }
                                                    }
                                                ]}
                                                rows={priceData}
                                                sortModel={[
                                                    {
                                                        field: 'id',
                                                        sort: 'desc' // 'desc' for descending, 'asc' for ascending
                                                    }
                                                ]}
                                            />
                                        </div>
                                    </FormControl>
                                </Grid>
                            </Container>
                        </>
                    </TabPanel>
                    <TabPanel value="4">
                        <>
                            <Container className="d-flex justify-content-center" maxWidth="md">
                                <Grid item xs={6}>
                                    <FormControl sx={{ m: 0, width: '50ch' }}>
                                        {isFetching && <LinearProgress className="mt-3" color="secondary" />}
                                        {(!isUpdate || !isFetching) && (
                                            <>
                                                <TextField
                                                    margin="normal"
                                                    id="quantity"
                                                    label="Adet"
                                                    variant="outlined"
                                                    value={quantity}
                                                    onChange={(e) => setQuantity(e.target.value)}
                                                />
                                                <Button onClick={urunEkle} className="mb-2" margin="normal" variant="contained">
                                                    Kaydet
                                                </Button>
                                            </>
                                        )}
                                    </FormControl>
                                </Grid>
                            </Container>
                        </>
                    </TabPanel>
                </TabContext>
            </Box>
        </div>
    );
}

export default UrunEkle;
