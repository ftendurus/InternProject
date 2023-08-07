using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace webapi.ViewModel.Urun
{
    public class UrunCreateVM
    {
        public int Id { get; set; }
        [Required]

        public string Adi { get; set; }
        [Required]

        public int KategoriId { get; set; }
        [Required]

        public string KategoriAdi { get; set; }
        [Required]

        public string Description { get; set; }
        [Required]

        public float Price { get; set; }
        [Required]

        public int Quantity { get; set; }

        public string ImageName { get; set; }

        public string ImageSrc { get; set; }

    }
}
