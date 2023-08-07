import { useMemo, useState, useEffect } from 'react';
import MaterialReactTable from 'material-react-table';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Edit as EditIcon, Delete as DeleteIcon, Email as EmailIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Example = () => {
    const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
    const navigate = useNavigate();

    const [altKategoriElements, setAltKategoriElements] = useState({});
    const [altKategoriData, setAltKategoriData] = useState([]);
    const [altKategoriAdlari, setAltKategoriAdlari] = useState([]);
    const [altKategoriId, setAltKategoriId] = useState([]);
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
                url: 'http://localhost:5273/api/UstKategori/GetGrid',
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

    const altKategoriCek = async (id) => {
        try {
            const response = await axios.post(`https://localhost:7002/api/AltKategori/GetByUstKategoriId?ustKategoriId=${id}`);
            const altKategori = response.data.data; // AltKategoriAdlari verilerini içeren dizi
            return altKategori; // Alt kategorileri döndür
        } catch (error) {
            console.error('Error fetching data:', error);
            return []; // Hata durumunda boş dizi döndür
        }
    };

    const renderAltKategoriler = async (row) => {
        try {
            if (!altKategoriElements[row.original.id]) {
                const altKategori = await altKategoriCek(row.original.id);
                setAltKategoriElements((prevState) => ({
                    ...prevState,
                    [row.original.id]: altKategori
                }));
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'id',
                header: 'ID'
            },
            {
                accessorKey: 'adi',
                header: 'Kategori Adı'
            }
        ],
        []
    );

    const deleteById = (id) => {
        toast.promise(deletePromise(id), {
            pending: 'UstKategori siliniyor.',
            success: 'UstKategori başarıyla silindi 👌',
            error: 'UstKategori silinirken hata oluştu 🤯'
        });
    };

    const deletePromise = (id) => {
        return new Promise(async (resolve, reject) => {
            const start = Date.now();

            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: 'http://localhost:5273/api/UstKategori/Delete',
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
                                navigate(`/digerIslemler/UstKategori-duzenle/${row.original.id}`);
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
                renderDetailPanel={({ row }) => {
                    renderAltKategoriler(row); // renderAltKategoriler fonksiyonunu çağırın
                    const altKategoriler = altKategoriElements[row.original.id] || [];

                    return (
                        <Box
                            sx={{
                                display: 'grid',
                                margin: 'auto',
                                gridTemplateColumns: '1fr 1fr',
                                width: '100%',
                                gap: '16px'
                            }}
                        >
                            <Typography variant="subtitle1">Üst Kategori Adı: {row.original.adi}</Typography>
                            <Box>
                                <Typography variant="h6">Alt Kategoriler</Typography>
                                <ul>
                                    {altKategoriler.length > 0 ? (
                                        altKategoriler.map((altKategori) => (
                                            <li key={altKategori.id}>
                                                (ID: {altKategori.id}) {altKategori.adi}
                                            </li>
                                        ))
                                    ) : (
                                        <Typography variant="body2">Alt Kategori Bulunamadı.</Typography>
                                    )}
                                </ul>
                            </Box>
                        </Box>
                    );
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
