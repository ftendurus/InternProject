using System.ComponentModel.DataAnnotations;

namespace webapi.ViewModel.Fiyat
{
    public class FiyatGridVM
    {
        public int Id { get; set; }
        public int UrunId { get; set; }
        public float SonFiyat { get; set; }
    }
}
