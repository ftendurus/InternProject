using System.ComponentModel.DataAnnotations;

namespace webapi.ViewModel.Fiyat
{
    public class FiyatCreateVM
    {
        public int Id { get; set; }
        [Required]
        public int UrunId { get; set; }
        [Required]
        public float SonFiyat { get; set; }
    }
}
