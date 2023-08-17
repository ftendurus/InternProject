namespace webapi.Entity
{
    public class Teklif : BaseEntity
    {
        public int MusteriId { get; set; }
        public string MusteriAdi { get; set; }
        public int FirmaId { get; set; }
        public string FirmaAdi { get; set; }
        public string Tarih { get; set; }
        public int GecerlilikSuresi { get; set; }
        public string TeklifDurumu { get; set; }
        public virtual List<TeklifUrun> Urunler { get; set; }
    }
}
