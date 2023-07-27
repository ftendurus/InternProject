using Microsoft.AspNetCore.Mvc;
using webapi.Base.Base;
using webapi.Base.Base.Grid;
using webapi.Entity;
using webapi.Helper.Base;
using webapi.ViewModel.General.Grid;
using webapi.ViewModel;
using webapi.ViewModel.Musteri;
using webapi.ViewModel.Firma;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FirmaController : BaseWebApiController
    {
        public FirmaController(IHttpContextAccessor httpContextAccessor) : base(httpContextAccessor)
        {
        }

        [HttpPost("CreateOrUpdate")]
        public ApiResult CreateOrUpdate([FromBody] FirmaCreateVM dataVM)
        {
            if (!ModelState.IsValid)
                return new ApiResult { Result = false, Message = "Form'da doldurulmayan alanlar mevcut,lütfen doldurun." };
            Firma data;
            if (dataVM.Id > 0)
            {
                data = _unitOfWork.Repository<Firma>().GetById(dataVM.Id);
                data.Adi = dataVM.Adi;
                data.Email = dataVM.Email;
                data.TelefonNumarasi = dataVM.TelefonNumarasi;
            }
            else
            {
                data = new Firma()
                {
                    Adi = dataVM.Adi,

                    Email = dataVM.Email,
                    TelefonNumarasi = dataVM.TelefonNumarasi,
                };
                if (_unitOfWork.Repository<Firma>().Any(x => x == data))
                {
                    return new ApiResult { Result = false, Message = "Daha önce eklenmiş" };
                }
            }

            _unitOfWork.Repository<Firma>().InsertOrUpdate(data);
            _unitOfWork.SaveChanges();
            return new ApiResult { Result = true };
        }

        [HttpGet("Delete")]
        public ApiResult Delete(int id)
        {
            var data = _unitOfWork.Repository<Firma>().GetById(id);
            //if (_unitOfWork.Repository<Kullanici>().Any(i => i.RolId == id))
            //{
            //    return new ApiResult { Result = false, Message = "Rol kullanıcı tarafından kullanılmaktadır." };
            //}

            if (data == null)
            {
                return new ApiResult { Result = false, Message = "Belirtilen müşteri bulunamadı." };
            }

            _unitOfWork.Repository<Firma>().Delete(data.Id);
            _unitOfWork.SaveChanges();
            return new ApiResult { Result = true };
        }

        [HttpPost("GetGrid")]
        public ApiResult<GridResultModel<FirmaGridVM>> GetGrid()
        {
            var query = _unitOfWork.Repository<Firma>()
            .Select(x => new FirmaGridVM
            {
                Id = x.Id,
                Adi = x.Adi,
                Email = x.Email,
                TelefonNumarasi = x.TelefonNumarasi,
            });
            var rest = query.ToDataListRequest(Request.ToRequestFilter());

            return new ApiResult<GridResultModel<FirmaGridVM>> { Data = rest, Result = true };
        }

        [HttpPost("Get")]
        public ApiResult<FirmaGridVM> Get(int id)
        {
            var Firma = _unitOfWork.Repository<Firma>().GetById(id);
            FirmaGridVM FirmaVM = new FirmaGridVM
            {
                Id = Firma.Id,
                Adi = Firma.Adi,
                Email = Firma.Email,
                TelefonNumarasi = Firma.TelefonNumarasi
            };
            return new ApiResult<FirmaGridVM> { Data = FirmaVM, Result = true };
        }

        [HttpPost("GetComboGrid")]
        public ApiResult<List<FirmaGridVM>> GetComboGrid()
        {
            var query = _unitOfWork.Repository<Firma>()
                .Select(x => new FirmaGridVM
                {
                    Id = x.Id,
                    Adi = x.Adi,
                    Email = x.Email,
                    TelefonNumarasi = x.TelefonNumarasi
                });

            var result = query.ToList(); // Convert the IQueryable to a List

            return new ApiResult<List<FirmaGridVM>> { Data = result, Result = true };
        }

        [HttpPost("GetComboGrid/{id}")]
        public ApiResult<List<FirmaGridVM>> GetName(int id)
        {
            var query = _unitOfWork.Repository<Firma>()
                .Where(x => x.Id == id) // Filter the records based on the provided ID
                .Select(x => new FirmaGridVM
                {
                    Id = x.Id,
                    Adi = x.Adi,
                    Email = x.Email,
                    TelefonNumarasi = x.TelefonNumarasi
                });

            var result = query.ToList(); // Convert the IQueryable to a List

            return new ApiResult<List<FirmaGridVM>> { Data = result, Result = true };
        }


    }
}
