using Microsoft.AspNetCore.Mvc;
using webapi.Base.Base;
using webapi.Base.Base.Grid;
using webapi.Entity;
using webapi.Helper.Base;
using webapi.ViewModel.General.Grid;
using webapi.ViewModel;
using webapi.ViewModel.Musteri;
using webapi.ViewModel.Teklif;
using Microsoft.AspNetCore.Hosting;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeklifController : BaseWebApiController
    {
        public TeklifController(IHttpContextAccessor httpContextAccessor) : base(httpContextAccessor)
        {
        }

        [HttpPost("CreateOrUpdate")]
        public ApiResult CreateOrUpdate([FromBody] TeklifCreateVM dataVM)
        {
            if (!ModelState.IsValid)
                return new ApiResult { Result = false, Message = "Form'da doldurulmayan alanlar mevcut,lütfen doldurun." };
            Teklif data;
            if (dataVM.Id > 0)
            {
                data = _unitOfWork.Repository<Teklif>().GetById(dataVM.Id);
                data.MusteriId = dataVM.MusteriId;
                data.MusteriAdi = dataVM.MusteriAdi;
                data.FirmaAdi = dataVM.FirmaAdi;
                data.FirmaId = dataVM.FirmaId;
                data.Tarih = dataVM.Tarih;
                data.GecerlilikSuresi = dataVM.GecerlilikSuresi;
                data.TeklifDurumu = dataVM.TeklifDurumu;
            }
            else
            {
                data = new Teklif()
                {
                    MusteriId = dataVM.MusteriId,
                    MusteriAdi = dataVM.MusteriAdi,
                    FirmaAdi = dataVM.FirmaAdi,
                    FirmaId = dataVM.FirmaId,
                    Tarih = dataVM.Tarih,
                    GecerlilikSuresi = dataVM.GecerlilikSuresi,
                    TeklifDurumu = dataVM.TeklifDurumu
                };
                if (_unitOfWork.Repository<Teklif>().Any(x => x == data))
                {
                    return new ApiResult { Result = false, Message = "Daha önce eklenmiş" };
                }
            }

            _unitOfWork.Repository<Teklif>().InsertOrUpdate(data);
            _unitOfWork.SaveChanges();
            return new ApiResult { Result = true };
        }

        [HttpGet("Delete")]
        public ApiResult Delete(int id)
        {
            var data = _unitOfWork.Repository<Teklif>().GetById(id);
            //if (_unitOfWork.Repository<Kullanici>().Any(i => i.RolId == id))
            //{
            //    return new ApiResult { Result = false, Message = "Rol kullanıcı tarafından kullanılmaktadır." };
            //}

            if (data == null)
            {
                return new ApiResult { Result = false, Message = "Belirtilen müşteri bulunamadı." };
            }

            _unitOfWork.Repository<Teklif>().Delete(data.Id);
            _unitOfWork.SaveChanges();
            return new ApiResult { Result = true };
        }

        [HttpPost("GetGrid")]
        public ApiResult<GridResultModel<TeklifGridVM>> GetGrid()
        {
            var query = _unitOfWork.Repository<Teklif>()
            .Select(x => new TeklifGridVM
            {
                Id = x.Id,
                MusteriId = x.MusteriId,
                FirmaId = x.FirmaId,
                MusteriAdi = x.MusteriAdi,
                FirmaAdi = x.FirmaAdi,
                Tarih = x.Tarih,
                GecerlilikSuresi = x.GecerlilikSuresi,
                TeklifDurumu = x.TeklifDurumu
            });
            var rest = query.ToDataListRequest(Request.ToRequestFilter());

            return new ApiResult<GridResultModel<TeklifGridVM>> { Data = rest, Result = true };
        }

        [HttpPost("Get")]
        public ApiResult<TeklifGridVM> Get(int id)
        {
            var Teklif = _unitOfWork.Repository<Teklif>().GetById(id);
            TeklifGridVM TeklifVM = new TeklifGridVM
            {
                Id = Teklif.Id,
                MusteriId = Teklif.MusteriId,
                FirmaId = Teklif.FirmaId,
                MusteriAdi = Teklif.MusteriAdi,
                FirmaAdi = Teklif.FirmaAdi,
                Tarih = Teklif.Tarih,
                GecerlilikSuresi = Teklif.GecerlilikSuresi,
                TeklifDurumu = Teklif.TeklifDurumu
            };
            return new ApiResult<TeklifGridVM> { Data = TeklifVM, Result = true };
        }

        [HttpPost("GetComboGrid")]
        public ApiResult<List<TeklifGridVM>> GetComboGrid()
        {
            var query = _unitOfWork.Repository<Teklif>()
                .Select(x => new TeklifGridVM
                {
                    Id = x.Id,
                    MusteriId = x.MusteriId,
                    FirmaId = x.FirmaId,
                    MusteriAdi = x.MusteriAdi,
                    FirmaAdi = x.FirmaAdi,
                    Tarih = x.Tarih,
                    GecerlilikSuresi = x.GecerlilikSuresi,
                    TeklifDurumu = x.TeklifDurumu
                });

            var result = query.ToList(); // Convert the IQueryable to a List

            return new ApiResult<List<TeklifGridVM>> { Data = result, Result = true };
        }

        [HttpPost("GetByMusteriId")]
        public ApiResult<List<TeklifGridVM>> GetByMusteriId(int musteriId)
        {
            var query = _unitOfWork.Repository<Teklif>()
                .Where(x => x.MusteriId == musteriId) // Filter the records based on the provided ID
                .Select(x => new TeklifGridVM
                {
                    Id = x.Id,
                    MusteriId = x.MusteriId,
                    FirmaId = x.FirmaId,
                    MusteriAdi = x.MusteriAdi,
                    FirmaAdi = x.FirmaAdi,
                    Tarih = x.Tarih,
                    GecerlilikSuresi = x.GecerlilikSuresi,
                    TeklifDurumu = x.TeklifDurumu
                });

            var result = query.ToList(); // Convert the IQueryable to a List

            return new ApiResult<List<TeklifGridVM>> { Data = result, Result = true };
        }

        [HttpGet("GetLastAdded")]
        public ApiResult<TeklifGridVM> GetLastAdded()
        {
            var lastAdded = _unitOfWork.Repository<Teklif>()
                .OrderByDescending(x => x.Id) // Order by ID in descending order to get the latest added
                .FirstOrDefault();

            if (lastAdded == null)
            {
                return new ApiResult<TeklifGridVM> { Result = false, Message = "No records found." };
            }

            var lastAddedVM = new TeklifGridVM
            {
                Id = lastAdded.Id,
                MusteriId = lastAdded.MusteriId,
                FirmaId = lastAdded.FirmaId,
                MusteriAdi = lastAdded.MusteriAdi,
                FirmaAdi = lastAdded.FirmaAdi,
                Tarih = lastAdded.Tarih,
                GecerlilikSuresi = lastAdded.GecerlilikSuresi,
                TeklifDurumu = lastAdded.TeklifDurumu
            };

            return new ApiResult<TeklifGridVM> { Data = lastAddedVM, Result = true };
        }

        [HttpPost("SavePDF")]
        public async Task<IActionResult> SavePDF(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return Content("file not selected");

            var path = Path.Combine(
                        Directory.GetCurrentDirectory(), "Pdf",
                        file.FileName);

            using (var stream = new FileStream(path, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return Ok(new { path });
        }

        [HttpGet("GetPDF/{fileName}")]
        public IActionResult GetPDF(string fileName)
        {
            var path = Path.Combine(
                Directory.GetCurrentDirectory(), "Pdf", fileName);

            if (!System.IO.File.Exists(path))
            {
                return NotFound();
            }

            var fileStream = new FileStream(path, FileMode.Open, FileAccess.Read);
            var contentType = "application/pdf";

            return File(fileStream, contentType);
        }

    }
}
