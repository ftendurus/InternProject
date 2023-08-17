using System.ComponentModel.DataAnnotations;

namespace webapi.ViewModel.TeklifUrun
{
    public class TeklifUrunGridVM
    {
        public int Id { get; set; }
        public int TeklifId { get; set; }
        public int UrunId { get; set; }
        public float Fiyat { get; set; }

    }
}
