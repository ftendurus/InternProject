namespace webapi.Entity
{
    public class TeklifUrun : BaseEntity
    {
        public int TeklifId { get; set; }
        public int UrunId { get; set; }
        public float Fiyat { get; set; }
    }
}
