using System.ComponentModel.DataAnnotations;

namespace webapi.ViewModel.AltKategori
{
    public class AltKategoriCreateVM
    {
        public int Id { get; set; }
        [Required]
        public string Adi { get; set; }
        [Required]
        public int UstKategoriId { get; set; }
        public string UstKategoriAdi { get; set; }
    }
}
