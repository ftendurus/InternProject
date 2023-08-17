using Microsoft.AspNetCore.Mvc;
using webapi.Base.Base;
using webapi.Base.Base.Grid;
using webapi.Entity;
using webapi.Helper.Base;
using webapi.ViewModel.General.Grid;
using webapi.ViewModel;
using webapi.ViewModel.Fiyat;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FiyatController : BaseWebApiController
    {
        public FiyatController(IHttpContextAccessor httpContextAccessor) : base(httpContextAccessor)
        {
        }

        [HttpPost("CreateOrUpdate")]
        public ApiResult CreateOrUpdate([FromBody] FiyatCreateVM dataVM)
        {
            if (!ModelState.IsValid)
                return new ApiResult { Result = false, Message = "Form'da doldurulmayan alanlar mevcut,lütfen doldurun." };
            Fiyat data;
            if (dataVM.Id > 0)
            {
                data = _unitOfWork.Repository<Fiyat>().GetById(dataVM.Id);
                data.UrunId = dataVM.UrunId;
                data.SonFiyat = dataVM.SonFiyat;
            }
            else
            {
                data = new Fiyat()
                {
                    UrunId = dataVM.UrunId,
                    SonFiyat = dataVM.SonFiyat,
                };
                if (_unitOfWork.Repository<Fiyat>().Any(x => x == data))
                {
                    return new ApiResult { Result = false, Message = "Daha önce eklenmiş" };
                }
            }

            _unitOfWork.Repository<Fiyat>().InsertOrUpdate(data);
            _unitOfWork.SaveChanges();
            return new ApiResult { Result = true };
        }

        [HttpGet("Delete")]
        public ApiResult Delete(int id)
        {
            var data = _unitOfWork.Repository<Fiyat>().GetById(id);
            //if (_unitOfWork.Repository<Kullanici>().Any(i => i.RolId == id))
            //{
            //    return new ApiResult { Result = false, Message = "Rol kullanıcı tarafından kullanılmaktadır." };
            //}

            if (data == null)
            {
                return new ApiResult { Result = false, Message = "Belirtilen müşteri bulunamadı." };
            }

            _unitOfWork.Repository<Fiyat>().SoftDelete(data.Id);
            _unitOfWork.SaveChanges();
            return new ApiResult { Result = true };
        }

        [HttpPost("GetGrid")]
        public ApiResult<GridResultModel<FiyatGridVM>> GetGrid()
        {
            var query = _unitOfWork.Repository<Fiyat>()
            .Select(x => new FiyatGridVM
            {
                Id = x.Id,
                UrunId = x.UrunId,
                SonFiyat = x.SonFiyat
            });
            var rest = query.ToDataListRequest(Request.ToRequestFilter());

            return new ApiResult<GridResultModel<FiyatGridVM>> { Data = rest, Result = true };
        }

        [HttpPost("Get")]
        public ApiResult<FiyatGridVM> Get(int id)
        {
            var Fiyat = _unitOfWork.Repository<Fiyat>().GetById(id);
            FiyatGridVM FiyatVM = new FiyatGridVM
            {
                Id = Fiyat.Id,
                UrunId = Fiyat.UrunId,
                SonFiyat = Fiyat.SonFiyat
            };
            return new ApiResult<FiyatGridVM> { Data = FiyatVM, Result = true };
        }

        [HttpPost("GetByUrunId")]
        public ApiResult<List<FiyatGridVM>> GetByUrunId(int urunId)
        {
            var query = _unitOfWork.Repository<Fiyat>()
                .Where(x => x.UrunId == urunId)
                .Select(x => new FiyatGridVM
                {
                    Id = x.Id,
                    UrunId = x.UrunId,
                    SonFiyat = x.SonFiyat
                });

            var result = query.ToList();

            return new ApiResult<List<FiyatGridVM>> { Data = result, Result = true };
        }

    }
}
