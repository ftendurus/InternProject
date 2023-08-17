// assets
import { IconUsers, IconBuilding, IconCategory, IconCategory2, IconShoppingCart } from '@tabler/icons';

// constant
const icons = { IconUsers, IconBuilding, IconCategory, IconCategory2, IconShoppingCart };

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
            icon: icons.IconBuilding,

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
            icon: icons.IconCategory,

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
            icon: icons.IconCategory,

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
        },
        {
            id: 'urunler',
            title: 'Ürünler',
            type: 'collapse',
            icon: icons.IconShoppingCart,

            children: [
                {
                    id: 'urunler',
                    title: 'Ürün Listesi',
                    type: 'item',
                    url: '/digerIslemler/urunler'
                },
                {
                    id: 'urun-ekle',
                    title: 'Ürün Ekle',
                    type: 'item',
                    url: '/digerIslemler/urun-ekle'
                },
                {
                    id: 'urun-satis',
                    title: 'Ürün Satis Listesi',
                    type: 'item',
                    url: '/digerIslemler/urun-satis'
                }
            ]
        },
        {
            id: 'teklifler',
            title: 'Teklifler',
            type: 'collapse',
            icon: icons.IconShoppingCart,

            children: [
                {
                    id: 'teklifler',
                    title: 'Teklif Listesi',
                    type: 'item',
                    url: '/digerIslemler/teklifler'
                }
            ]
        }
    ]
};

export default digerIslemler;
