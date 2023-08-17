using System.ComponentModel.DataAnnotations;

namespace webapi.ViewModel.TeklifUrun
{
    public class TeklifUrunCreateVM
    {
        public int Id { get; set; }
        [Required]
        public int TeklifId { get; set; }
        [Required]
        public int UrunId { get; set; }
        [Required]
        public float Fiyat { get; set; }

    }
}
