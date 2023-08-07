using System.ComponentModel.DataAnnotations.Schema;

namespace webapi.Entity
{
    public class Urun : BaseEntity
    {
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
