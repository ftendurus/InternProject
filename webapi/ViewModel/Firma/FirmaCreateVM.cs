using System.ComponentModel.DataAnnotations;


namespace webapi.ViewModel.Firma
{
    public class FirmaCreateVM
    {
        public int Id { get; set; }
        [Required]
        public string Adi { get; set; }
        [Required]
        public string TelefonNumarasi { get; set; }
        [Required]
        public string Email { get; set; }
    }
}
