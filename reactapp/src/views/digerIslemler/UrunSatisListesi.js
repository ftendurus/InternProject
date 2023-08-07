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

const Example = () => {
    const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
    const navigate = useNavigate();
    const icons = { IconPictureInPicture };

    const [id, setId] = useState([]);

    const [productAddedMap, setProductAddedMap] = useState({});
    const [quantityMap, setQuantityMap] = useState({});
    const [value, setValue] = React.useState('1');
    const [cartList, setCartList] = useState([]);
    const [products, setProducts] = useState([]);
    const [altKategoriData, setAltKategoriData] = useState([]);
    const [description, setDescription] = useState();
    const [price, setPrice] = useState();
    const [kategoriAdi, setKategoriAdi] = useState();
    const [quantity, setQuantity] = useState();
    const [adet, setAdet] = useState();
    const [imageName, setImageName] = useState();
    const [imageSrc, setImageSrc] = useState();
    const [columnFilters, setColumnFilters] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10
    });

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
            return responseData;
        },
        enabled: false,
        keepPreviousData: true
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

    const calculateTotalPrice = () => {
        return cartList.reduce((total, product) => total + product.price * quantityMap[product.id], 0);
    };

    useEffect(() => {
        altKategoriCek();
        if (!data) {
            refetch();
        }
    }, []);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        if (!data) {
            refetch();
        }
        fetchAndSetImagesForProducts();
    }, [data]);

    const altKategoriCek = async () => {
        try {
            const response = await axios.post('https://localhost:7002/api/AltKategori/GetComboGrid/');
            const altKategoriler = response.data.data; // Firma verilerini içeren dizi
            // Firma adlarını içeren bir dizi oluşturmak için map fonksiyonu kullanılıyor
            const altKategoriAdlari = altKategoriler.map((firma) => firma.adi);
            setAltKategoriData(altKategoriAdlari); // Firma adlarını içeren diziyi state'e kaydediyoruz
            console.log(altKategoriAdlari);
        } catch (error) {
            console.error('Error fetching data:', error);
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

    const fetchAndSetImagesForProducts = async () => {
        const updatedProducts = await Promise.all(
            products.map(async (product) => {
                const blob = await getImage(product.imageName);
                const imageUrl = URL.createObjectURL(blob);
                console.log('Fetched image for', product.imageName, 'Image blob:', blob);
                return { ...product, imageUrl };
            })
        );
        setProducts(updatedProducts);
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
    };

    const exportCartToPDF = () => {
        const pdf = new jsPDF();

        const headers = [['ID', 'Ürün Adi', 'Kategori', 'Adet', 'Birim Fiyat', 'Toplam Fiyat']];
        const data = cartList.map((product) => {
            return [
                product.id,
                product.adi,
                product.kategoriAdi,
                quantityMap[product.id] || 1,
                `${product.price.toFixed(2)} TL`,
                `${(product.price * (quantityMap[product.id] || 1)).toFixed(2)} TL`
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

        const total = calculateTotalPrice().toFixed(2);
        const totalText = `Toplam Fiyat: ${total} TL`;
        const textWidth = (pdf.getStringUnitWidth(totalText) * pdf.internal.getFontSize()) / pdf.internal.scaleFactor;
        pdf.setTextColor(0);
        pdf.setFontSize(12);
        pdf.text(totalText, textWidth, pdf.autoTable.previous.finalY + 15);

        pdf.save('cart.pdf');
    };

    const Productlist = () => {
        <Grid container spacing={2}>
            {' '}
            {/* Use Grid container with spacing */}
            {products.map((product) => (
                <Grid item xs={6} sm={3} md={2} key={product.id}>
                    {' '}
                    {/* Set column widths for different screen sizes */}
                    <Card
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            maxWidth: '400px', // Set a maximum width for the card
                            marginBottom: '1rem',
                            border: '1px solid #e0e0e0'
                        }}
                    >
                        <CardMedia
                            component="img"
                            alt={product.adi}
                            sx={{
                                width: '100%',
                                maxHeight: '200px',
                                objectFit: 'cover',
                                border: '1px solid #e0e0e0'
                            }}
                            image={product.imageUrl}
                            loading="lazy"
                        />
                        <CardContent sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h2">Ürün Adı: {product.adi}</Typography>
                                <Typography variant="body1" sx={{ overflow: 'auto', maxHeight: '100px' }}>
                                    Ürün Açıklaması: {product.description}
                                </Typography>
                                <Typography variant="body1">Fiyat: {product.price}₺</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <TextField
                                    label="Quantity"
                                    type="number"
                                    InputProps={{ inputProps: { min: 1 } }}
                                    variant="outlined"
                                    size="small"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                />
                                <IconButton color="primary" onClick={() => addToCart(product)}>
                                    <AddToCartIcon />
                                </IconButton>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>;
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
                                <Grid item xs={6} sm={3} md={2} key={product.id}>
                                    <Card
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            height: '100%',
                                            maxWidth: '400px',
                                            marginBottom: '1rem',
                                            border: '1px solid #e0e0e0'
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            alt={product.adi}
                                            sx={{
                                                width: '100%',
                                                maxHeight: '200px',
                                                objectFit: 'cover',
                                                border: '1px solid #e0e0e0'
                                            }}
                                            image={product.imageUrl}
                                            loading="lazy"
                                        />
                                        <CardContent sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                                <Typography variant="h2">{product.adi}</Typography>
                                                <Typography variant="body1">Kategori: {product.kategoriAdi}</Typography>
                                                <Typography variant="body1">Fiyat: {product.price}₺</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => addToCart(product)}
                                                    disabled={productAddedMap[product.id]} // Disable the button if already added
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
                                <div>
                                    {cartList.map((product, index) => (
                                        <Card
                                            key={index}
                                            sx={{ marginBottom: '1rem', padding: '1rem', display: 'flex', alignItems: 'center' }}
                                        >
                                            <CardMedia
                                                component="img"
                                                alt={product.adi}
                                                sx={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '1rem' }}
                                                image={product.imageUrl}
                                            />
                                            <div>
                                                <Typography variant="h5">{product.adi}</Typography>
                                                <Typography variant="body1">Kategori: {product.kategoriAdi}</Typography>
                                                <Typography variant="body1">Price: {product.price * quantityMap[product.id]}₺</Typography>
                                                <FormControl variant="outlined" size="small" sx={{ marginTop: '0.5rem' }}>
                                                    <TextField
                                                        label="Adet"
                                                        type="number"
                                                        InputProps={{ inputProps: { min: 1 } }}
                                                        value={quantityMap[product.id] || 1}
                                                        onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                                                    />
                                                </FormControl>
                                                <IconButton
                                                    color="secondary"
                                                    onClick={() => removeFromCart(product.id)}
                                                    sx={{ marginTop: '0.5rem' }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </div>
                                        </Card>
                                    ))}
                                    <div>
                                        <Typography variant="h6">Toplam Fiyat: {calculateTotalPrice()}₺</Typography>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={exportCartToPDF}
                                            sx={{ marginTop: '1rem', marginRight: '1rem' }}
                                        >
                                            PDF İndir
                                        </Button>
                                        <Button variant="contained" color="primary" sx={{ marginTop: '1rem' }}>
                                            Checkout
                                        </Button>
                                    </div>
                                </div>
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
