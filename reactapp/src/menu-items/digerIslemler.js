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
        }
    ]
};

export default digerIslemler;
