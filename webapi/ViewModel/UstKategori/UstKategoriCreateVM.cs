using System.ComponentModel.DataAnnotations;

namespace webapi.ViewModel.UstKategori
{
    public class UstKategoriCreateVM
    {
        public int Id { get; set; }
        [Required]
        public string Adi { get; set; }

    }
}
