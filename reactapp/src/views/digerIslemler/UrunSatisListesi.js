import { useMemo, useState } from 'react';
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

const Example = () => {
    const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
    const navigate = useNavigate();
    const icons = { IconPictureInPicture };

    const [id, setId] = useState([]);

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
        keepPreviousData: true
    });

    useEffect(() => {
        altKategoriCek();
    }, []);

    useEffect(() => {
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
        // Implement your cart logic here
        // This is a simplified example
        console.log('Added to cart:', product);
    };

    return (
        <div>
            <h1>Product List</h1>
            <Grid container spacing={2}>
                {' '}
                {/* Use Grid container with spacing */}
                {products.map((product) => (
                    <Grid item xs={12} sm={6} md={4} key={product.id}>
                        {' '}
                        {/* Set column widths for different screen sizes */}
                        <Card
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                                maxWidth: '400px', // Set a maximum width for the card
                                marginBottom: '1rem'
                            }}
                        >
                            <CardMedia
                                component="img"
                                alt={product.adi}
                                sx={{
                                    width: '100%',
                                    maxHeight: '200px',
                                    objectFit: 'cover'
                                }}
                                image={product.imageUrl}
                            />
                            <CardContent sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="h2">Ürün Adı: {product.adi}</Typography>
                                    <Typography variant="body1">Ürün Açıklaması: {product.description}</Typography>
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
            </Grid>
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
