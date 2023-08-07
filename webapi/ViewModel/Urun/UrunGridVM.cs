
namespace webapi.ViewModel.Urun
{
    public class UrunGridVM
    {
        public int Id { get; set; }

        public string Adi { get; set; }

        public int KategoriId { get; set; }

        public string KategoriAdi { get; set; }

        public string Description { get; set; }

        public float Price { get; set; }

        public int Quantity { get; set; }

        public string ImageName { get; set; }

        public string ImageSrc { get; set; }
    }
}
