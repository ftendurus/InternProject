import { useMemo, useState } from 'react';
import MaterialReactTable from 'material-react-table';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Edit as EditIcon, Delete as DeleteIcon, Email as EmailIcon, PictureInPicture as PictureIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { IconPictureInPicture } from '@tabler/icons';

const Example = () => {
    const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
    const navigate = useNavigate();
    const icons = { IconPictureInPicture };

    const [id, setId] = useState([]);

    const [altKategoriData, setAltKategoriData] = useState([]);
    const [description, setDescription] = useState();
    const [price, setPrice] = useState();
    const [kategoriAdi, setKategoriAdi] = useState();
    const [quantity, setQuantity] = useState();
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
                    responseData = response.data.data;
                })
                .catch((error) => {
                    console.log(error);
                });
            return responseData;
        },
        keepPreviousData: true
    });

    useEffect(() => {
        altKategoriCek();
    }, []);

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

    const fetchAndSetImage = async (imageName) => {
        try {
            const blob = await getImage(imageName);
            const imageUrl = URL.createObjectURL(blob);
            setImageSrc(imageUrl);
            openImageInNewWindow(imageUrl);
        } catch (error) {
            console.error('Error fetching image:', error);
        }
    };

    const openImageInNewWindow = (imageUrl) => {
        const newWindow = window.open('', '_blank');
        newWindow.document.write(`<img src="${imageUrl}" alt="Görüntü">`);
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'id',
                header: 'Ürün ID'
            },
            {
                accessorKey: 'adi',
                header: 'Ürün Adı'
            },
            {
                accessorKey: 'description',
                header: 'Açıklama',
                Cell: ({ row }) => (
                    <Box sx={{ maxWidth: '200px' }}>
                        {row.original.description.length > 15 ? (
                            <Tooltip title={row.original.description}>
                                <Typography variant="body2" noWrap>
                                    {row.original.description.slice(0, 15)}...
                                </Typography>
                            </Tooltip>
                        ) : (
                            <Typography variant="body2">{row.original.description}</Typography>
                        )}
                    </Box>
                )
            },
            {
                accessorKey: 'kategoriAdi',
                header: 'Kategori'
            },
            {
                accessorKey: 'price',
                header: 'Fiyat'
            },
            {
                accessorKey: 'quantity',
                header: 'Stok'
            },
            {
                accessorKey: 'imageName',
                header: 'Gorsel',
                Cell: ({ row }) => {
                    const fetchAndSetImage = async (imageName) => {
                        try {
                            const blob = await getImage(imageName);
                            const imageUrl = URL.createObjectURL(blob);
                            setImageSrc(imageUrl);
                            openImageInPopup(imageUrl);
                        } catch (error) {
                            console.error('Error fetching image:', error);
                        }
                    };

                    const openImageInPopup = (imageUrl) => {
                        const newWindow = window.open('', '_blank', 'width=800,height=600');
                        newWindow.document.write(`<img src="${imageUrl}" alt="Görüntü">`);
                    };

                    return (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem'
                            }}
                        >
                            <IconButton
                                color="secondary"
                                onClick={() => {
                                    fetchAndSetImage(row.original.imageName);
                                }}
                            >
                                <PictureIcon />
                            </IconButton>
                        </Box>
                    );
                }
            }
        ],
        []
    );

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

    return (
        <>
            <MaterialReactTable
                enableRowActions
                displayColumnDefOptions={{
                    'mrt-row-actions': {
                        header: 'İşlemler'
                    }
                }}
                renderRowActions={({ row }) => (
                    <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
                        <IconButton
                            color="secondary"
                            onClick={() => {
                                navigate(`/digerIslemler/urun-duzenle/${row.original.id}`);
                            }}
                        >
                            <EditIcon />
                        </IconButton>
                        <IconButton
                            color="error"
                            onClick={() => {
                                deleteById(row.original.id);
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                )}
                positionActionsColumn="last"
                columns={columns}
                data={data !== undefined ? data.list : []} //data is undefined on first render
                muiToolbarAlertBannerProps={
                    isError
                        ? {
                              color: 'error',
                              children: 'Error loading data'
                          }
                        : undefined
                }
                onColumnFiltersChange={setColumnFilters}
                onGlobalFilterChange={setGlobalFilter}
                onPaginationChange={setPagination}
                onSortingChange={setSorting}
                renderTopToolbarCustomActions={() => (
                    <Tooltip arrow title="Refresh Data">
                        <IconButton onClick={() => refetch()}>
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                )}
                rowCount={data?.dataCount ?? 0}
                state={{
                    columnFilters,
                    globalFilter,
                    isLoading,
                    pagination,
                    showAlertBanner: isError,
                    showProgressBars: isFetching,
                    sorting
                }}
            />
        </>
    );
};

const queryClient = new QueryClient();

const ExampleWithReactQueryProvider = () => (
    <QueryClientProvider client={queryClient}>
        <Example />
    </QueryClientProvider>
);

export default ExampleWithReactQueryProvider;
