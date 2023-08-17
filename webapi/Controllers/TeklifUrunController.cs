using Microsoft.AspNetCore.Mvc;
using webapi.Base.Base;
using webapi.Base.Base.Grid;
using webapi.Entity;
using webapi.Helper.Base;
using webapi.ViewModel.General.Grid;
using webapi.ViewModel;
using webapi.ViewModel.TeklifUrun;
using Microsoft.EntityFrameworkCore;
using webapi.ViewModel.Firma;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeklifUrunController : BaseWebApiController
    {
        public TeklifUrunController(IHttpContextAccessor httpContextAccessor) : base(httpContextAccessor)
        {
        }

        [HttpPost("CreateOrUpdate")]
        public ApiResult CreateOrUpdate([FromBody] TeklifUrunCreateVM dataVM)
        {
            if (!ModelState.IsValid)
                return new ApiResult { Result = false, Message = "Form'da doldurulmayan alanlar mevcut,lütfen doldurun." };
            TeklifUrun data;
            if (dataVM.Id > 0)
            {
                data = _unitOfWork.Repository<TeklifUrun>().GetById(dataVM.Id);
                data.TeklifId = dataVM.TeklifId;
                data.UrunId = dataVM.UrunId;
                data.Fiyat = dataVM.Fiyat;
            }
            else
            {
                data = new TeklifUrun()
                {
                    TeklifId = dataVM.TeklifId,
                    UrunId = dataVM.UrunId,
                    Fiyat = dataVM.Fiyat,
                };
                if (_unitOfWork.Repository<TeklifUrun>().Any(x => x == data))
                {
                    return new ApiResult { Result = false, Message = "Daha önce eklenmiş" };
                }
            }

            _unitOfWork.Repository<TeklifUrun>().InsertOrUpdate(data);
            _unitOfWork.SaveChanges();
            return new ApiResult { Result = true };
        }

        [HttpGet("Delete")]
        public ApiResult Delete(int id)
        {
            var data = _unitOfWork.Repository<TeklifUrun>().GetById(id);
            //if (_unitOfWork.Repository<Kullanici>().Any(i => i.RolId == id))
            //{
            //    return new ApiResult { Result = false, Message = "Rol kullanıcı tarafından kullanılmaktadır." };
            //}

            if (data == null)
            {
                return new ApiResult { Result = false, Message = "Belirtilen müşteri bulunamadı." };
            }

            _unitOfWork.Repository<TeklifUrun>().Delete(data.Id);
            _unitOfWork.SaveChanges();
            return new ApiResult { Result = true };
        }

        [HttpPost("GetGrid")]
        public ApiResult<GridResultModel<TeklifUrunGridVM>> GetGrid()
        {
            var query = _unitOfWork.Repository<TeklifUrun>()
            .Select(x => new TeklifUrunGridVM
            {
                Id = x.Id,
                TeklifId = x.TeklifId,
                UrunId = x.UrunId,
                Fiyat = x.Fiyat
            });
            var rest = query.ToDataListRequest(Request.ToRequestFilter());

            return new ApiResult<GridResultModel<TeklifUrunGridVM>> { Data = rest, Result = true };
        }

        [HttpPost("Get")]
        public ApiResult<TeklifUrunGridVM> Get(int id)
        {
            var TeklifUrun = _unitOfWork.Repository<TeklifUrun>().GetById(id);
            TeklifUrunGridVM TeklifUrunVM = new TeklifUrunGridVM
            {
                Id = TeklifUrun.Id,
                TeklifId = TeklifUrun.TeklifId,
                UrunId = TeklifUrun.UrunId,
                Fiyat = TeklifUrun.Fiyat
            };
            return new ApiResult<TeklifUrunGridVM> { Data = TeklifUrunVM, Result = true };
        }

        [HttpPost("GetComboGrid")]
        public ApiResult<List<TeklifUrunGridVM>> GetComboGrid()
        {
            var query = _unitOfWork.Repository<TeklifUrun>()
                .Select(x => new TeklifUrunGridVM
                {
                    Id = x.Id,
                    TeklifId = x.TeklifId,
                    UrunId = x.UrunId,
                    Fiyat = x.Fiyat
                });

            var result = query.ToList(); // Convert the IQueryable to a List

            return new ApiResult<List<TeklifUrunGridVM>> { Data = result, Result = true };
        }

        [HttpPost("GetByTeklifId")]
        public ApiResult<List<TeklifUrunGridVM>> GetByTeklifId(int teklifId)
        {
            var query = _unitOfWork.Repository<TeklifUrun>()
                .Where(x => x.TeklifId == teklifId)
                .Select(x => new TeklifUrunGridVM
                {
                    Id = x.Id,
                    TeklifId = x.TeklifId,
                    UrunId = x.UrunId,
                    Fiyat = x.Fiyat
                });

            var result = query.ToList();

            return new ApiResult<List<TeklifUrunGridVM>> { Data = result, Result = true };
        }

    }
}
