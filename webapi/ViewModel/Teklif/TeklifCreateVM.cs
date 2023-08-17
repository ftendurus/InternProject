using System.ComponentModel.DataAnnotations;

namespace webapi.ViewModel.Teklif
{
    public class TeklifCreateVM
    {
        public int Id { get; set; }
        [Required]
        public int MusteriId { get; set; }
        [Required]
        public string MusteriAdi { get; set; }
        [Required]
        public int FirmaId { get; set; }
        [Required]
        public string FirmaAdi { get; set; }
        [Required]
        public string Tarih { get; set; }
        [Required]
        public int GecerlilikSuresi { get; set; }
        [Required]
        public string TeklifDurumu { get; set; }
    }
}
