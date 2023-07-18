using System.ComponentModel.DataAnnotations;

namespace webapi.ViewModel.Product
{
    public class ProductCreateVM
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Type { get; set; }
        [Required]
        public string Price { get; set; }
        [Required]
        public string Entity { get; set; }
    }
}
