import { Button, Container, FormControl, Grid, LinearProgress, TextField } from '@mui/material';
import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

function ProductAdd() {
    const { id } = useParams();

    const [fetchingError, setFetchingError] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [isUpdate, setIsUpdate] = useState(0);
    const [price, setPrice] = React.useState('');
    const [priceError, setPriceError] = React.useState(false);
    const [productName, setProductName] = useState('');
    const [productType, setProductType] = useState('');
    const [entity, setEntity] = useState('');
    const [entityError, setEntityError] = useState(false);
    const [validationErrors, setValidationErrors] = React.useState({});

    useEffect(() => {
        console.log(id);
        if (typeof id !== 'undefined') {
            setIsUpdate(id);
            setIsFetching(true);
            productGetirPromise();
        } else {
            setEntity('');
            setPrice('');
            setProductName('');
            setProductType('');
            setIsFetching(false);
        }
    }, [id]);
    const handleEntity = (entity) => {
        setEntity(entity.target.value);
        if (validator.isEntity(entity.target.value) || entity.target.value === '') {
            setEntityError(false);
        } else {
            setEntityError(true);
        }
    };

    const productEkle = () => {
        if (typeof id !== 'undefined') {
            toast.promise(productEklePromise, {
                pending: 'Ürün güncelleniyor',
                success: productName + ' ' + productType + ' başarıyla güncellendi 👌',
                error: productName + ' ' + productType + ' güncellenirken hata oluştu 🤯'
            });
        } else {
            toast.promise(productEklePromise, {
                pending: 'Ürün kaydı yapılıyor',
                success: productName + ' ' + productType + ' başarıyla eklendi 👌',
                error: productName + ' ' + productType + ' eklenirken hata oluştu 🤯'
            });
        }
    };

    const productEklePromise = () => {
        return new Promise(async (resolve, reject) => {
            const start = Date.now();
            setValidationErrors({});
            let data = JSON.stringify({
                id: typeof id !== 'undefined' ? id : 0,
                adi: productName,
                soyadi: productType,
                telefonNumarasi: price,
                entity: entity
            });

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'http://localhost:5273/api/Product/CreateOrUpdate',
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

    const productGetirPromise = () => {
        return new Promise(async (resolve, reject) => {
            const start = Date.now();
            setValidationErrors({});
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'http://localhost:5273/api/Product/Get',
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
                        setProductName(response.data.data.adi);
                        setProductType(response.data.data.soyadi);
                        setEntity(response.data.data.entity);
                        setPrice(response.data.data.price);
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

    return (
        <>
            <Container className="d-flex justify-content-center" maxWidth="md">
                <Grid item xs={6}>
                    <FormControl sx={{ m: 0, width: '50ch' }}>
                        {isFetching && <LinearProgress className="mt-3" color="secondary" />}
                        {(isUpdate === 0 || !isFetching) && (
                            <>
                                <TextField
                                    value={productName}
                                    margin="normal"
                                    id="name"
                                    label="Ürün Adı"
                                    variant="outlined"
                                    onChange={(e) => setProductName(e.target.value)}
                                    error={!!validationErrors.Name} // Hatanın varlığına göre error özelliğini ayarla
                                    helperText={validationErrors.Name} // Hata mesajını helperText olarak göster
                                />
                                <TextField
                                    margin="normal"
                                    value={productType}
                                    id="type"
                                    label="Ürün Cinsi"
                                    variant="outlined"
                                    onChange={(e) => setProductType(e.target.value)}
                                    error={!!validationErrors.Type}
                                    helperText={validationErrors.Type}
                                />
                                <TextField
                                    error={entityError || !!validationErrors.Entity}
                                    helperText={entityError ? 'Ürün adetini kontrol edin' : validationErrors.Entity} // entityError true ise kendi mesajını göster, aksi halde validationErrors'tan gelen mesajı göster
                                    type="entity"
                                    margin="normal"
                                    id="entity"
                                    label="Adet"
                                    variant="outlined"
                                    value={entity}
                                    onChange={(e) => handleEntity(e)}
                                />
                                <TextField
                                    margin="normal"
                                    value={price}
                                    id="price"
                                    label="Ürün Fiyatı"
                                    variant="outlined"
                                    onChange={(e) => setPrice(e.target.value)}
                                    error={!!validationErrors.Price}
                                    helperText={validationErrors.Price}
                                />
                                <Button onClick={productEkle} className="mb-2" margin="normal" variant="contained">
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

export default ProductAdd;
