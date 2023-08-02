// assets
import { IconUsers } from '@tabler/icons';

// constant
const icons = { IconUsers };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const digerIslemler = {
    id: 'digerIslemler',
    title: 'Diğer İşlemler',
    type: 'group',
    children: [
        {
            id: 'musteriler',
            title: 'Müşteriler',
            type: 'collapse',
            icon: icons.IconUsers,

            children: [
                {
                    id: 'musteriler',
                    title: 'Müşteri Listesi',
                    type: 'item',
                    url: '/digerIslemler/musteriler'
                },
                {
                    id: 'musteri-ekle',
                    title: 'Müşteri Ekle',
                    type: 'item',
                    url: '/digerIslemler/musteri-ekle'
                }
            ]
        },
        {
            id: 'firmalar',
            title: 'Firmalar',
            type: 'collapse',
            icon: icons.IconCase,

            children: [
                {
                    id: 'firmalar',
                    title: 'Firma Listesi',
                    type: 'item',
                    url: '/digerIslemler/firmalar'
                },
                {
                    id: 'firma-ekle',
                    title: 'Firma Ekle',
                    type: 'item',
                    url: '/digerIslemler/firma-ekle'
                }
            ]
        },
        {
            id: 'ustKategori',
            title: 'Üst Kategori',
            type: 'collapse',
            icon: icons.IconCase,

            children: [
                {
                    id: 'ustKategoriler',
                    title: 'Üst Kategori Listesi',
                    type: 'item',
                    url: '/digerIslemler/ustKategoriler'
                },
                {
                    id: 'ustKategori-ekle',
                    title: 'Üst Kategori Ekle',
                    type: 'item',
                    url: '/digerIslemler/ustKategori-ekle'
                }
            ]
        },
        {
            id: 'altKategori',
            title: 'Alt Kategori',
            type: 'collapse',
            icon: icons.IconCase,

            children: [
                {
                    id: 'altKategoriler',
                    title: 'Alt Kategori Listesi',
                    type: 'item',
                    url: '/digerIslemler/altKategoriler'
                },
                {
                    id: 'altKategori-ekle',
                    title: 'Alt Kategori Ekle',
                    type: 'item',
                    url: '/digerIslemler/altKategori-ekle'
                }
            ]
        }
    ]
};

export default digerIslemler;
