import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// digerIslemler routing
const Musteriler = Loadable(lazy(() => import('views/digerIslemler/MusteriListesi')));
const MusteriEkle = Loadable(lazy(() => import('views/digerIslemler/MusteriEkle')));
const Products = Loadable(lazy(() => import('views/digerIslemler/product-list')));
const ProductAdd = Loadable(lazy(() => import('views/digerIslemler/product-add')));
const Firmalar = Loadable(lazy(() => import('views/digerIslemler/FirmaListesi')));
const FirmaEkle = Loadable(lazy(() => import('views/digerIslemler/FirmaEkle')));
const UstKategoriler = Loadable(lazy(() => import('views/digerIslemler/UstKategoriListesi')));
const UstKategoriEkle = Loadable(lazy(() => import('views/digerIslemler/UstKategoriEkle')));
const AltKategoriler = Loadable(lazy(() => import('views/digerIslemler/AltKategoriListesi')));
const AltKategoriEkle = Loadable(lazy(() => import('views/digerIslemler/AltKategoriEkle')));
const UrunEkle = Loadable(lazy(() => import('views/digerIslemler/UrunEkle')));
const Urunler = Loadable(lazy(() => import('views/digerIslemler/UrunListesi')));
const UrunSatis = Loadable(lazy(() => import('views/digerIslemler/UrunSatisListesi')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
const UtilsMaterialIcons = Loadable(lazy(() => import('views/utilities/MaterialIcons')));
const UtilsTablerIcons = Loadable(lazy(() => import('views/utilities/TablerIcons')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));
const SamplePage2 = Loadable(lazy(() => import('views/sample-page-2')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/',
            element: <DashboardDefault />
        },
        {
            path: 'dashboard',
            children: [
                {
                    path: 'default',
                    element: <DashboardDefault />
                }
            ]
        },
        {
            path: 'utils',
            children: [
                {
                    path: 'util-typography',
                    element: <UtilsTypography />
                }
            ]
        },
        {
            path: 'utils',
            children: [
                {
                    path: 'util-color',
                    element: <UtilsColor />
                }
            ]
        },
        {
            path: 'utils',
            children: [
                {
                    path: 'util-shadow',
                    element: <UtilsShadow />
                }
            ]
        },
        {
            path: 'icons',
            children: [
                {
                    path: 'tabler-icons',
                    element: <UtilsTablerIcons />
                }
            ]
        },
        {
            path: 'icons',
            children: [
                {
                    path: 'material-icons',
                    element: <UtilsMaterialIcons />
                }
            ]
        },
        {
            path: 'sample-page',
            element: <SamplePage />
        },
        {
            path: 'sample-page-2',
            element: <SamplePage2 />
        },
        {
            path: 'digerIslemler',
            children: [
                {
                    path: 'musteriler',
                    element: <Musteriler />
                },
                {
                    path: 'musteri-ekle',
                    element: <MusteriEkle />
                },
                {
                    path: 'musteri-duzenle/:id',
                    element: <MusteriEkle />
                },
                {
                    path: 'firmalar',
                    element: <Firmalar />
                },
                {
                    path: 'firma-ekle',
                    element: <FirmaEkle />
                },
                {
                    path: 'firma-duzenle/:id',
                    element: <FirmaEkle />
                },
                {
                    path: 'ustKategoriler',
                    element: <UstKategoriler />
                },
                {
                    path: 'ustKategori-ekle',
                    element: <UstKategoriEkle />
                },
                {
                    path: 'ustKategori-duzenle/:id',
                    element: <UstKategoriEkle />
                },
                {
                    path: 'altKategoriler',
                    element: <AltKategoriler />
                },
                {
                    path: 'altKategori-ekle',
                    element: <AltKategoriEkle />
                },
                {
                    path: 'altKategori-duzenle/:id',
                    element: <AltKategoriEkle />
                },
                {
                    path: 'urunler',
                    element: <Urunler />
                },
                {
                    path: 'urun-ekle',
                    element: <UrunEkle />
                },
                {
                    path: 'urun-duzenle/:id',
                    element: <UrunEkle />
                },
                {
                    path: 'urun-satis',
                    element: <UrunSatis />
                }
            ]
        }
    ]
};

export default MainRoutes;
