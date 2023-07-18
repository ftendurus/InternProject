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
            id: 'urunler',
            title: 'Ürünler',
            type: 'collapse',
            icon: icons.IconCase,

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
                }
            ]
        }
    ]
};

export default digerIslemler;
