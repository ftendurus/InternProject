import { Button, Container, FormControl, Grid, LinearProgress, TextField } from '@mui/material';
import React from 'react';
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';
import { useState } from 'react';
import validator from 'validator';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import Select from 'react-select';

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

function AltKategoriEkle() {
    const { id } = useParams();

    const [fetchingError, setFetchingError] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [isUpdate, setIsUpdate] = useState(0);
    const [AltKategoriAdi, setAltKategoriAdi] = useState('');
    const [UstKategori, setUstKategori] = useState(0);
    const [UstKategoriAdi, setUstKategoriAdi] = useState(0);
    const [validationErrors, setValidationErrors] = React.useState({});
    const [loading, setLoading] = useState(true);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        console.log(id);
        if (typeof id !== 'undefined') {
            setIsUpdate(id);
            setIsFetching(true);
            AltKategoriGetirPromise();
        } else {
            setAltKategoriAdi('');
            setUstKategori('');
            setIsFetching(false);
        }
    }, [id]);

    useEffect(() => {
        selectUstKategori();
    }, []);

    const selectUstKategori = async () => {
        try {
            const response = await axios.post('https://localhost:7002/api/UstKategori/GetComboGrid');
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
        setUstKategori(event.value);
        setUstKategoriAdi(options.find((option) => option.id == event.value).adi);
    }

    const AltKategoriEkle = () => {
        if (typeof id !== 'undefined') {
            toast.promise(AltKategoriEklePromise, {
                pending: 'Müşteri güncelleniyor',
                success: AltKategoriAdi + ' başarıyla güncellendi 👌',
                error: AltKategoriAdi + ' güncellenirken hata oluştu 🤯'
            });
        } else {
            toast.promise(AltKategoriEklePromise, {
                pending: 'Müşteri kaydı yapılıyor',
                success: AltKategoriAdi + ' başarıyla eklendi 👌',
                error: AltKategoriAdi + ' eklenirken hata oluştu 🤯'
            });
        }
    };

    const AltKategoriEklePromise = () => {
        return new Promise(async (resolve, reject) => {
            const start = Date.now();
            setValidationErrors({});
            let data = JSON.stringify({
                id: typeof id !== 'undefined' ? id : 0,
                adi: AltKategoriAdi,
                UstKategoriId: UstKategori,
                UstKategoriAdi: UstKategoriAdi
            });

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'http://localhost:5273/api/AltKategori/CreateOrUpdate',
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

    const AltKategoriGetirPromise = () => {
        return new Promise(async (resolve, reject) => {
            const start = Date.now();
            setValidationErrors({});
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'http://localhost:5273/api/AltKategori/Get',
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
                        setAltKategoriAdi(response.data.data.adi);
                        setUstKategori(response.data.data.UstKategoriId);
                        setUstKategoriAdi(response.data.data.UstKategoriAdi);
                        setFetchingError(false);
                        resolve(response.data); // Başarılı sonuç d1urumunda Promise'ı çöz
                    } else {
                        setFetchingError(true);
                        reject(new Error('İşlem başarısız')); // Başarısız sonuç durumunda Promise'ı reddet
                    }
                })
                .catch((error) => {
                    setFetchingError(true);
                    console.log(error);
                    reject(error); // Hata durumunda Promise'ı reddet
                })
                .finally(() => {
                    setIsFetching(false);
                });
        });
    };

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            borderRadius: '12px', // Yuvarlak kenarları
            minHeight: '50px', // Daha uzun alan
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Gölge efekti
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
        <>
            <Container className="d-flex justify-content-center" maxWidth="md">
                <Grid item xs={6}>
                    <FormControl sx={{ m: 0, width: '50ch' }}>
                        {isFetching && <LinearProgress className="mt-3" color="secondary" />}
                        {(isUpdate === 0 || !isFetching) && (
                            <>
                                <TextField
                                    value={AltKategoriAdi}
                                    margin="normal"
                                    id="name"
                                    label="Alt Kategori Adı"
                                    variant="outlined"
                                    onChange={(e) => setAltKategoriAdi(e.target.value)}
                                    error={!!validationErrors.Adi} // Hatanın varlığına göre error özelliğini ayarla
                                    helperText={validationErrors.Adi} // Hata mesajını helperText olarak göster
                                />
                                <div style={{ marginTop: '16px', marginBottom: '20px' }}>
                                    <Select
                                        options={selectOptions}
                                        defaultValue={UstKategori}
                                        onChange={handleSelect}
                                        placeholder={'UstKategori seciniz...'}
                                        styles={customStyles}
                                    />
                                </div>

                                <Button onClick={AltKategoriEkle} className="mb-2" margin="normal" variant="contained">
                                    Kaydet
                                </Button>
                            </>
                        )}
                    </FormControl>
                </Grid>
            </Container>
        </>
    );
}

export default AltKategoriEkle;
