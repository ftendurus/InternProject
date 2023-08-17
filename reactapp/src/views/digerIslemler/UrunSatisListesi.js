import React, { useMemo, useState } from 'react';
import MaterialReactTable from 'material-react-table';
import { Box, Card, CardContent, CardMedia, IconButton, Tooltip, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Email as EmailIcon,
    PictureInPicture as PictureIcon,
    AddShoppingCart as AddToCartIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { IconPictureInPicture } from '@tabler/icons';
import { Button, Container, FormControl, Grid, LinearProgress, TextField } from '@mui/material';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Select from 'react-select';
import { InputAdornment } from '@mui/material';

const Example = () => {
    const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
    const navigate = useNavigate();
    const icons = { IconPictureInPicture };

    const [id, setId] = useState([]);

    const [firmaAdi, setFirmaAdi] = useState('');
    const [firma, setFirma] = useState(0);
    const [musteriAdi, setMusteriAdi] = useState('');
    const [musteri, setMusteri] = useState(0);
    const [musteriSoyadi, setMusteriSoyadi] = useState('');
    const [musteriTel, setMusteriTel] = useState(0);
    const [musteriMail, setMusteriMail] = useState(0);
    const [optionsFirma, setOptionsFirma] = useState([]);
    const [optionsMusteri, setOptionsMusteri] = useState([]);
    const [calistir, setCalistir] = useState(0);
    const [priceMap, setPriceMap] = useState({});
    const [productAddedMap, setProductAddedMap] = useState({});
    const [quantityMap, setQuantityMap] = useState({});
    const [value, setValue] = React.useState('1');
    const [cartList, setCartList] = useState([]);
    const [products, setProducts] = useState([]);
    const [urunFiyat, setUrunFiyat] = useState();
    const [validationErrors, setValidationErrors] = React.useState({});
    const [teklifId, setTeklifId] = useState();
    const [gecerlilik, setGecerlilik] = useState(1);
    const [tarih, setTarih] = useState('');
    const [cartIds, setCartIds] = useState([]); // Sepetteki ürün id'leri

    const { data, isError, isFetching, isLoading, refetch } = useQuery({
        queryKey: ['table-data'],
        queryFn: async () => {
            var responseData;
            const FormData = require('form-data');
            let data = new FormData();
            data.append('pageSize', 0);
            data.append('pageIndex', 0);

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'http://localhost:5273/api/Urun/GetGrid',
                data: data
            };

            await axios
                .request(config)
                .then((response) => {
                    responseData = response.data.data.list;
                })
                .catch((error) => {
                    console.log(error);
                });
            console.log(responseData);
            setProducts(responseData);
            setCalistir(calistir + 1);
            return responseData;
        },
        enabled: true,
        keepPreviousData: true,
        refetchOnWindowFocus: false
    });

    useEffect(() => {
        // Initialize quantity state for each product
        const initialQuantityMap = {};
        products.forEach((product) => {
            initialQuantityMap[product.id] = 1; // Start with a default quantity of 1
        });
        setQuantityMap(initialQuantityMap);
    }, [products]);

    const handleQuantityChange = (productId, newQuantity) => {
        setQuantityMap((prevQuantityMap) => ({
            ...prevQuantityMap,
            [productId]: newQuantity
        }));
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

    function handleSelectMusteri(event) {
        setMusteri(event.value);
        setMusteriAdi(optionsMusteri.find((option) => option.id == event.value).adi);
        setMusteriSoyadi(optionsMusteri.find((option) => option.id == event.value).soyadi);
        setMusteriTel(optionsMusteri.find((option) => option.id == event.value).telefonNumarasi);
        setMusteriMail(optionsMusteri.find((option) => option.id == event.value).email);
    }

    function handleSelectFirma(event) {
        setFirma(event.value);
        setFirmaAdi(optionsFirma.find((option) => option.id == event.value).adi);
        selectMusteri(event.value);
    }

    const handlePriceChange = (productId, newPrice) => {
        setPriceMap((prevPriceMap) => ({
            ...prevPriceMap,
            [productId]: newPrice
        }));
    };

    const calculateTotalPrice = () => {
        return cartList.reduce((total, product) => total + (priceMap[product.id] || product.price) * (quantityMap[product.id] || 1), 0);
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchAndSetImagesForProducts();
            selectFirma();
        }, 1000);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [calistir]); // products dizisine bağımlılığı ekleyin

    const getImage = async (imageName) => {
        try {
            const response = await axios.get(`https://localhost:7002/api/Urun/GetImage?imageName=${imageName}`, {
                responseType: 'blob'
            });

            const blob = response.data;
            return blob;
        } catch (error) {
            console.error('Error fetching image:', error);
            throw error; // Hata oluştuğunda hatayı yukarıya fırlat
        }
    };

    const fetchAndSetImagesForProducts = async () => {
        console.log('urunler', products);
        try {
            const updatedProducts = await Promise.all(
                products.map(async (product) => {
                    try {
                        const blob = await getImage(product.imageName);
                        const imageUrl = URL.createObjectURL(blob);
                        console.log('Fetched image for', product.imageName, 'Image blob:', blob);
                        return { ...product, imageUrl };
                    } catch (error) {
                        console.error('Error fetching image for', product.imageName, error);
                        return product;
                    }
                })
            );
            // products dizisini güncelle
            setProducts(updatedProducts);
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };

    const teklifVer = async () => {
        console.log(musteri + musteriAdi + firma + firmaAdi + gecerlilik + tarih);
        await fiyatEkle();
        await teklifEkle();
        await new Promise((resolve) => setTimeout(resolve, 4000));
        await fetchLastAddedTeklif();
        console.log('teklif' + teklifId);
    };

    const deleteById = (id) => {
        toast.promise(deletePromise(id), {
            pending: 'Ürün siliniyor.',
            success: 'Ürün başarıyla silindi 👌',
            error: 'Ürün silinirken hata oluştu 🤯'
        });
    };

    const deletePromise = (id) => {
        return new Promise(async (resolve, reject) => {
            const start = Date.now();

            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: 'http://localhost:5273/api/Urun/Delete',
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
                        if (millis < 1000) {
                            await sleep(1000 - millis);
                        }
                        refetch();
                        resolve(response.data); // Başarılı sonuç durumunda Promise'ı çöz
                    } else {
                        reject(new Error('İşlem başarısız')); // Başarısız sonuç durumunda Promise'ı reddet
                    }
                })
                .catch((error) => {
                    console.log(error);
                    reject(error); // Hata durumunda Promise'ı reddet
                });
        });
    };

    const fiyatEkle = async () => {
        if (typeof id !== 'undefined') {
            toast.promise(fiyatEklePromise, {
                pending: 'Fiyat güncelleniyor',
                success: 'Fiyat başarıyla güncellendi 👌',
                error: 'Fiyat güncellenirken hata oluştu 🤯'
            });
        } else {
            toast.promise(fiyatEklePromise, {
                pending: 'Fiyat kaydı yapılıyor',
                success: 'Fiyat başarıyla eklendi 👌',
                error: 'Fiyat eklenirken hata oluştu 🤯'
            });
        }
    };

    const fiyatEklePromise = () => {
        return new Promise(async (resolve, reject) => {
            const start = Date.now();
            console.log(cartList);
            cartList.map(async (product) => {
                setValidationErrors({});
                let data = JSON.stringify({
                    id: 0,
                    urunId: product.id,
                    sonFiyat: priceMap[product.id] || product.price
                });

                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: 'http://localhost:5273/api/Fiyat/CreateOrUpdate',
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
        });
    };

    const teklifEkle = async () => {
        if (typeof id !== 'undefined') {
            toast.promise(teklifEklePromise, {
                pending: 'Müşteri güncelleniyor',
                success: 'Teklif başarıyla güncellendi 👌',
                error: ' Teklif güncellenirken hata oluştu 🤯'
            });
        } else {
            toast.promise(teklifEklePromise, {
                pending: 'Müşteri kaydı yapılıyor',
                success: ' Teklif başarıyla eklendi 👌',
                error: ' Teklif eklenirken hata oluştu 🤯'
            });
        }
    };

    const teklifEklePromise = () => {
        return new Promise(async (resolve, reject) => {
            const start = Date.now();
            const currentDate = new Date(); // Şu anki tarihi al
            const ayar = { day: 'numeric', month: 'numeric', year: 'numeric' };
            const formattedDate = currentDate.toLocaleDateString('tr-TR', ayar); // Tarihi uygun formata çevir
            setValidationErrors({});
            let data = JSON.stringify({
                musteriId: musteri,
                musteriAdi: musteriAdi,
                firmaId: firma,
                firmaAdi: firmaAdi,
                tarih: formattedDate,
                gecerlilikSuresi: gecerlilik,
                teklifDurumu: 'Oluşturuldu'
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
                        setTeklifId(response.data.id);
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

    const fetchLastAddedTeklif = async () => {
        try {
            const response = await axios.get('http://localhost:5273/api/Teklif/GetLastAdded');
            if (response.data.result) {
                const lastAddedTeklif = response.data.data;

                // Kullanılabilir şekilde lastAddedTeklif nesnesini kullanabilirsiniz
                setTeklifId(lastAddedTeklif.id);
                console.log('deneme' + lastAddedTeklif.id);
                if (lastAddedTeklif.id !== 'undefined' || lastAddedTeklif.id !== 0) {
                    teklifUrunEkle(lastAddedTeklif.id);
                    exportCartToPDF(lastAddedTeklif.id);
                } else {
                    teklifUrunEkle(1);
                    exportCartToPDF(1);
                }

                // Diğer işlemler
            } else {
                console.log('Failed to fetch last added Teklif.');
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    const teklifUrunEkle = async (id) => {
        if (typeof id !== 'undefined') {
            toast.promise(teklifUrunEklePromise(id), {
                pending: 'Müşteri güncelleniyor',
                success: 'Teklif Urun başarıyla güncellendi 👌',
                error: 'TeklifUrun güncellenirken hata oluştu 🤯'
            });
        } else {
            toast.promise(teklifUrunEklePromise, {
                pending: 'Müşteri kaydı yapılıyor',
                success: 'TeklifUrun başarıyla eklendi 👌',
                error: 'TeklifUrun eklenirken hata oluştu 🤯'
            });
        }
    };

    const teklifUrunEklePromise = (id) => {
        return new Promise(async (resolve, reject) => {
            const start = Date.now();
            console.log(cartList);
            setTeklifId(id);
            cartList.map(async (product) => {
                setValidationErrors({});
                let data = JSON.stringify({
                    teklifId: id,
                    urunId: product.id,
                    fiyat: priceMap[product.id] || product.price
                });

                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: 'http://localhost:5273/api/TeklifUrun/CreateOrUpdate',
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
        });
    };

    useEffect(() => {
        // localStorage'dan sepete eklenen ürün id'lerini al
        const storedCartIds = localStorage.getItem('cartIds');
        if (storedCartIds) {
            setCartIds(JSON.parse(storedCartIds));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('cartIds', JSON.stringify(cartIds));
    }, [cartIds]);

    useEffect(() => {
        // Sepetteki ürünleri al ve cartList'i güncelle
        const cartProducts = products.filter((product) => cartIds.includes(product.id));
        setCartList(cartProducts);
    }, [products, cartIds]);

    const addToCart = (product) => {
        // Check if the product is already added to the cart
        if (productAddedMap[product.id]) {
            return; // Already added, do nothing
        }

        // Mark the product as added to the cart
        setProductAddedMap((prevMap) => ({
            ...prevMap,
            [product.id]: true
        }));

        setCartIds((prevCartIds) => [...prevCartIds, product.id]);
        // Add the product to the cart
        setCartList((prevCartList) => [...prevCartList, product]);
    };

    const removeFromCart = (productId) => {
        const updatedCart = cartList.filter((product) => product.id !== productId);
        setCartList(updatedCart);

        // Mark the product as not added to the cart
        setProductAddedMap((prevMap) => ({
            ...prevMap,
            [productId]: false
        }));
        setCartIds((prevCartIds) => prevCartIds.filter((id) => id !== productId));
    };

    const exportCartToPDF = (id) => {
        const pdf = new jsPDF();

        const headers = [['ID', 'Ürün Adi', 'Kategori', 'Adet', 'Teklif Birim Fiyati', 'Ürün Toplam Fiyat']];
        const data = cartList.map((product) => {
            return [
                product.id,
                product.adi,
                product.kategoriAdi,
                quantityMap[product.id] || 1,
                `${priceMap[product.id] || product.price} TL`,
                `${(priceMap[product.id] * (quantityMap[product.id] || 1) || product.price * (quantityMap[product.id] || 1)).toFixed(2)} TL`
            ];
        });

        pdf.autoTable({
            head: headers,
            body: data,
            theme: 'striped',
            margin: { top: 20 },
            didDrawCell: (data) => {
                if (data.column.index === 3 || data.column.index === 4) {
                    const cellStyles = { fontSize: 10, textColor: [51, 102, 187] };
                    pdf.setTextColor(cellStyles.textColor[0], cellStyles.textColor[1], cellStyles.textColor[2]);
                    pdf.setFontSize(cellStyles.fontSize);
                }
            }
        });

        const customerDetails = [
            `Müsteri Adi: ${musteriAdi}`,
            `Müsteri Soyadi: ${musteriSoyadi}`,
            `Telefon: ${musteriTel}`,
            `E-posta: ${musteriMail}`
        ];

        const total = calculateTotalPrice().toFixed(2);
        const totalText = `${firmaAdi} icin Ana Toplam Fiyat: ${total} TL`;
        const textWidth = (pdf.getStringUnitWidth(totalText) * pdf.internal.getFontSize()) / pdf.internal.scaleFactor;
        pdf.setTextColor(0);
        pdf.setFontSize(12);
        pdf.text(totalText, textWidth, pdf.autoTable.previous.finalY + 15);

        pdf.text(customerDetails.join('\n'), 10, pdf.autoTable.previous.finalY + 25);

        pdf.save(`${firmaAdi}-${musteriAdi}-${id}.pdf`);

        const formData = new FormData();
        formData.append('file', new Blob([pdf.output('blob')], { type: 'application/pdf' }), `${firmaAdi}-${musteriAdi}-${id}.pdf`);

        axios
            .post('http://localhost:5273/api/Teklif/SavePDF', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((response) => {
                console.log('PDF dosyası başarıyla yüklendi:', response.data.path);
            })
            .catch((error) => {
                console.error('PDF yükleme hatası:', error);
            });
    };

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            borderRadius: '12px', // Yuvarlak kenarları
            minHeight: '50px', // Daha uzun alan
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            // Gölge efekti
            borderColor: state.isFocused ? '#007bff' : '#d4d4d4', // Kenarlık rengi
            ':hover': {
                borderColor: state.isFocused ? '#007bff' : '#d4d4d4' // Seçim alanına gelindiğinde kenarlık rengi
            }
        }),
        option: (provided, state) => ({
            ...provided,
            borderRadius: '12px', // Yuvarlak kenarları
            padding: '12px', // Daha uzun alan
            color: state.isSelected ? 'white' : 'black', // Seçili seçeneklerin metnini beyaz yapar
            backgroundColor: state.isSelected ? '#007bff' : 'white', // Seçili seçeneklerin arkaplan rengini mavi yapar
            ':hover': {
                backgroundColor: state.isSelected ? '#007bff' : '#f0f0f0' // Seçili olmayan seçeneklerin üzerine gelindiğinde arkaplan rengi
            }
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            color: '#007bff', // Seçme oku rengi
            ':hover': {
                color: '#007bff' // Seçme okuna gelindiğinde rengi
            }
        }),
        indicatorSeparator: () => ({
            display: 'none' // Seçme oku ayırıcısını gizler
        })
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
                            <Tab label="Ürünler" value="1" />
                            <Tab
                                label={
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span>Sepet</span>
                                        <AddToCartIcon />
                                    </div>
                                }
                                value="2"
                            />
                        </TabList>
                    </Box>
                    <TabPanel value="1">
                        <Grid container spacing={2}>
                            {products.map((product) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                                    <Card
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            border: '1px solid #e0e0e0'
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            alt={product.adi}
                                            sx={{
                                                width: '100%',
                                                height: '150px',
                                                objectFit: 'cover',
                                                border: '1px solid #e0e0e0'
                                            }}
                                            image={product.imageUrl}
                                            loading="lazy"
                                        />
                                        <CardContent sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                                <Typography variant="h2" sx={{ paddingBottom: '15px', paddingTop: '10px' }}>
                                                    {product.adi}
                                                </Typography>
                                                <Typography variant="body1">Kategori: {product.kategoriAdi}</Typography>
                                                <Typography variant="body1">
                                                    Fiyat: {Number(product.price).toLocaleString('tr-TR')}₺
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => addToCart(product)}
                                                    disabled={cartIds.includes(product.id)}
                                                >
                                                    <AddToCartIcon /> Sepete Ekle
                                                </IconButton>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </TabPanel>
                    <TabPanel value="2">
                        <div>
                            {cartList.length === 0 ? (
                                <p>Sepette görüntülenecek ürün yok.</p>
                            ) : (
                                <Grid container spacing={2}>
                                    {cartList.map((product, index) => (
                                        <Grid item xs={12} sm={6} md={4} key={index}>
                                            <Card
                                                sx={{
                                                    marginBottom: '1rem',
                                                    border: '1px solid #e0e0e0',
                                                    display: 'flex',
                                                    flexDirection: 'column'
                                                }}
                                            >
                                                <CardMedia
                                                    component="img"
                                                    alt={product.adi}
                                                    sx={{ height: '150px', objectFit: 'cover' }}
                                                    image={product.imageUrl}
                                                />
                                                <CardContent sx={{ flexGrow: 1 }}>
                                                    <Typography variant="h5">{product.adi}</Typography>
                                                    <Typography variant="body1">Kategori: {product.kategoriAdi}</Typography>
                                                    <Typography variant="body1">
                                                        Ana Fiyat:{' '}
                                                        {new Intl.NumberFormat('tr-TR', {
                                                            style: 'currency',
                                                            currency: 'TRY',
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2
                                                        }).format(Number(product.price * (quantityMap[product.id] || 1)))}
                                                    </Typography>
                                                    <FormControl variant="outlined" size="small" sx={{ marginTop: '0.5rem', width: '13%' }}>
                                                        <TextField
                                                            label="Adet"
                                                            type="number"
                                                            InputProps={{ inputProps: { min: 1 } }}
                                                            value={quantityMap[product.id] || 1}
                                                            onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                                                        />
                                                    </FormControl>
                                                    <Box sx={{ marginTop: '0.8rem' }}>
                                                        <TextField
                                                            label="Fiyat"
                                                            type="number"
                                                            value={priceMap[product.id] || product.price}
                                                            onChange={(e) => handlePriceChange(product.id, e.target.value)}
                                                            InputProps={{
                                                                inputProps: {
                                                                    min: 0,
                                                                    step: 'any'
                                                                },
                                                                startAdornment: <InputAdornment position="start">₺</InputAdornment>,
                                                                inputMode: 'decimal'
                                                            }}
                                                            sx={{ width: '30%' }}
                                                            variant="outlined"
                                                            size="small"
                                                        />
                                                    </Box>
                                                    <Typography variant="body1">
                                                        Pazarlıklı Fiyat:{' '}
                                                        {new Intl.NumberFormat('tr-TR', {
                                                            style: 'currency',
                                                            currency: 'TRY',
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2
                                                        }).format(
                                                            Number((priceMap[product.id] || product.price) * (quantityMap[product.id] || 1))
                                                        )}
                                                    </Typography>
                                                    <IconButton
                                                        color="secondary"
                                                        onClick={() => removeFromCart(product.id)}
                                                        sx={{ marginTop: '0.5rem', alignSelf: 'flex-end' }}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                                        <Typography variant="h6">
                                            Son Fiyat:{' '}
                                            {new Intl.NumberFormat('tr-TR', {
                                                style: 'currency',
                                                currency: 'TRY',
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            }).format(calculateTotalPrice().toFixed(2))}
                                        </Typography>
                                        <div>
                                            <Box>
                                                <div style={{ marginTop: '16px', marginBottom: '20px' }}>
                                                    <TextField
                                                        label="Geçerlilik Süresi (Gün)"
                                                        type="number"
                                                        InputProps={{ inputProps: { min: 1 } }}
                                                        value={gecerlilik}
                                                        onChange={(e) => setGecerlilik(e.target.value)}
                                                    />
                                                </div>
                                                <div style={{ marginTop: '16px', marginBottom: '20px' }}>
                                                    <Select
                                                        options={selectOptionsFirma}
                                                        defaultValue={firma}
                                                        onChange={handleSelectFirma}
                                                        placeholder={'Firma seciniz...'}
                                                        styles={customStyles}
                                                    />
                                                </div>
                                                <div style={{ marginTop: '16px', marginBottom: '20px' }}>
                                                    <Select
                                                        options={selectOptionsMusteri}
                                                        defaultValue={musteri}
                                                        onChange={handleSelectMusteri}
                                                        placeholder={'Müşteri seciniz...'}
                                                        styles={customStyles}
                                                    />
                                                </div>
                                            </Box>
                                            <Button variant="contained" color="primary" onClick={teklifVer}>
                                                Teklif Ver
                                            </Button>
                                        </div>
                                    </Grid>
                                </Grid>
                            )}
                        </div>
                    </TabPanel>
                </TabContext>
            </Box>
        </div>
    );
};

const queryClient = new QueryClient();

const ExampleWithReactQueryProvider = () => (
    <QueryClientProvider client={queryClient}>
        <Example />
    </QueryClientProvider>
);

export default ExampleWithReactQueryProvider;
