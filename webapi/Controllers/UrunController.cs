using Microsoft.AspNetCore.Mvc;
using webapi.Base.Base;
using webapi.Base.Base.Grid;
using webapi.Entity;
using webapi.Helper.Base;
using webapi.ViewModel.General.Grid;
using webapi.ViewModel;
using webapi.ViewModel.Urun;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UrunController : BaseWebApiController
    {

        public UrunController(IHttpContextAccessor httpContextAccessor) : base(httpContextAccessor)
        {
        }

        [HttpPost("CreateOrUpdate")]
        public async Task<ApiResult> CreateOrUpdateAsync([FromBody] UrunCreateVM dataVM)
        {
            if (!ModelState.IsValid)
                return new ApiResult { Result = false, Message = "Form'da doldurulmayan alanlar mevcut, lütfen doldurun." };

            Urun data;
            if (dataVM.Id > 0)
            {
                data = _unitOfWork.Repository<Urun>().GetById(dataVM.Id);
                data.Adi = dataVM.Adi;
                data.KategoriAdi = dataVM.KategoriAdi;
                data.KategoriId = dataVM.KategoriId;
                data.Description = dataVM.Description;
                data.Price = dataVM.Price;
                data.Quantity = dataVM.Quantity;
                data.ImageName = dataVM.ImageName;
                data.ImageSrc = $"{Request.Scheme}://{Request.Host}{Request.PathBase}/Images/{dataVM.ImageName}";
            }
            else
            {
                data = new Urun()
                {
                    Adi = dataVM.Adi,
                    KategoriAdi = dataVM.KategoriAdi,
                    KategoriId = dataVM.KategoriId,
                    Description = dataVM.Description,
                    Price = dataVM.Price,
                    Quantity = dataVM.Quantity,
                    ImageName = dataVM.ImageName,
                    ImageSrc = $"{Request.Scheme}://{Request.Host}{Request.PathBase}/Images/{dataVM.ImageName}"
                };
                if (_unitOfWork.Repository<Urun>().Any(x => x.ImageName == dataVM.ImageName))
                {
                    return new ApiResult { Result = false, Message = "Daha önce eklenmiş" };
                }
            }

            _unitOfWork.Repository<Urun>().InsertOrUpdate(data);
            _unitOfWork.SaveChanges();
            return new ApiResult { Result = true };
        }





        [HttpGet("Delete")]
        public ApiResult Delete(int id)
        {
            var data = _unitOfWork.Repository<Urun>().GetById(id);
            //if (_unitOfWork.Repository<Kullanici>().Any(i => i.RolId == id))
            //{
            //    return new ApiResult { Result = false, Message = "Rol kullanıcı tarafından kullanılmaktadır." };
            //}

            if (data == null)
            {
                return new ApiResult { Result = false, Message = "Belirtilen ürün bulunamadı." };
            }

            _unitOfWork.Repository<Urun>().Delete(data.Id);
            _unitOfWork.SaveChanges();
            return new ApiResult { Result = true };
        }

        [HttpPost("GetGrid")]
        public ApiResult<GridResultModel<UrunGridVM>> GetGrid()
        {
            var query = _unitOfWork.Repository<Urun>()
            .Select(x => new UrunGridVM
            {
                Id = x.Id,
                Adi = x.Adi,
                KategoriAdi = x.KategoriAdi,
                KategoriId = x.KategoriId,
                Description = x.Description,
                Price = x.Price,
                Quantity = x.Quantity,
                ImageName = x.ImageName,
                ImageSrc = $"{Request.Scheme}://{Request.Host}{Request.PathBase}/Images/{x.ImageName}"

            });
            var rest = query.ToDataListRequest(Request.ToRequestFilter());

            return new ApiResult<GridResultModel<UrunGridVM>> { Data = rest, Result = true };
        }

        [HttpPost("Get")]
        public ApiResult<UrunGridVM> Get(int id)
        {
            var Urun = _unitOfWork.Repository<Urun>().GetById(id);
            UrunGridVM UrunVM = new UrunGridVM
            {
                Id = Urun.Id,
                Adi = Urun.Adi,
                KategoriAdi = Urun.KategoriAdi,
                KategoriId = Urun.KategoriId,
                Description = Urun.Description,
                Price = Urun.Price,
                Quantity = Urun.Quantity,
                ImageName = Urun.ImageName,
                ImageSrc = $"{Request.Scheme}://{Request.Host}{Request.PathBase}/Images/{Urun.ImageName}"
            };
            return new ApiResult<UrunGridVM> { Data = UrunVM, Result = true };
        }

        [HttpPost("UploadImage")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return Content("file not selected");

            var path = Path.Combine(
                        Directory.GetCurrentDirectory(), "Images",
                        file.FileName);

            using (var stream = new FileStream(path, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return Ok(new { path });
        }

        [HttpGet("GetImage")]
        public IActionResult GetImage(string imageName)
        {
            if (string.IsNullOrEmpty(imageName))
            {
                return BadRequest("Image name cannot be empty");
            }

            var imagePath = Path.Combine(Directory.GetCurrentDirectory(), "Images", imageName);

            if (!System.IO.File.Exists(imagePath))
            {
                return NotFound("Image not found");
            }

            string contentType = GetContentType(imageName); // Uzantıya göre MIME türünü al

            var imageStream = System.IO.File.OpenRead(imagePath);
            return File(imageStream, contentType);
        }

        private string GetContentType(string fileName)
        {
            // Özel bir yöntemle dosya uzantısına göre MIME türünü alın.
            // Örneğin:
            if (fileName.EndsWith(".jpg", StringComparison.OrdinalIgnoreCase))
            {
                return "image/jpeg";
            }
            else if (fileName.EndsWith(".png", StringComparison.OrdinalIgnoreCase))
            {
                return "image/png";
            }
            // Diğer uzantılar için gerekli kontrolleri ekleyin...

            // Eğer desteklenmeyen bir uzantı varsa veya uzantı yoksa varsayılan türü belirtin.
            return "application/octet-stream"; // Genel tür, daha spesifik bir tür yoksa kullanılabilir.
        }

        [HttpPost("GetByKategoriId")]
        public ApiResult<List<UrunGridVM>> GetByKategoriId(int kategoriId)
        {
            var query = _unitOfWork.Repository<Urun>()
                .Where(x => x.KategoriId == kategoriId)
                .Select(x => new UrunGridVM
                {
                    Id = x.Id,
                    Adi = x.Adi,
                    KategoriAdi = x.KategoriAdi,
                    KategoriId = x.KategoriId,
                    Description = x.Description,
                    Price = x.Price,
                    Quantity = x.Quantity,
                    ImageName = x.ImageName,
                    ImageSrc = $"{Request.Scheme}://{Request.Host}{Request.PathBase}/Images/{x.ImageName}"
                });

            var urunler = query.ToList();

            return new ApiResult<List<UrunGridVM>> { Data = urunler, Result = true };
        }
    }
}
