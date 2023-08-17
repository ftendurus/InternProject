using System.ComponentModel.DataAnnotations;

namespace webapi.ViewModel.Teklif
{
    public class TeklifGridVM
    {
        public int Id { get; set; }
        public int MusteriId { get; set; }
        public string MusteriAdi { get; set; }
        public int FirmaId { get; set; }
        public string FirmaAdi { get; set; }
        public string Tarih { get; set; }
        public int GecerlilikSuresi { get; set; }
        public string TeklifDurumu { get; set; }
    }
}
