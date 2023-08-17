using System.ComponentModel.DataAnnotations;

namespace webapi.Entity
{
    public class Fiyat : BaseEntity
    {
        public int UrunId { get; set; }
        public float SonFiyat { get; set; }
    }
}
