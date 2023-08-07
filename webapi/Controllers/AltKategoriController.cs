using Microsoft.AspNetCore.Mvc;
using webapi.Base.Base;
using webapi.Base.Base.Grid;
using webapi.Entity;
using webapi.Helper.Base;
using webapi.ViewModel.General.Grid;
using webapi.ViewModel;
using webapi.ViewModel.AltKategori;
using Microsoft.EntityFrameworkCore;
using webapi.ViewModel.Firma;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AltKategoriController : BaseWebApiController
    {
        public AltKategoriController(IHttpContextAccessor httpContextAccessor) : base(httpContextAccessor)
        {
        }

        [HttpPost("CreateOrUpdate")]
        public ApiResult CreateOrUpdate([FromBody] AltKategoriCreateVM dataVM)
        {
            if (!ModelState.IsValid)
                return new ApiResult { Result = false, Message = "Form'da doldurulmayan alanlar mevcut,lütfen doldurun." };
            AltKategori data;
            if (dataVM.Id > 0)
            {
                data = _unitOfWork.Repository<AltKategori>().GetById(dataVM.Id);
                data.Adi = dataVM.Adi;
                data.UstKategoriAdi = dataVM.UstKategoriAdi;
                data.UstKategoriId = dataVM.UstKategoriId;
            }
            else
            {
                data = new AltKategori()
                {
                    Adi = dataVM.Adi,
                    UstKategoriAdi = dataVM.UstKategoriAdi,
                    UstKategoriId = dataVM.UstKategoriId,
                };
                if (_unitOfWork.Repository<AltKategori>().Any(x => x == data))
                {
                    return new ApiResult { Result = false, Message = "Daha önce eklenmiş" };
                }
            }

            _unitOfWork.Repository<AltKategori>().InsertOrUpdate(data);
            _unitOfWork.SaveChanges();
            return new ApiResult { Result = true };
        }

        [HttpGet("Delete")]
        public ApiResult Delete(int id)
        {
            var data = _unitOfWork.Repository<AltKategori>().GetById(id);
            //if (_unitOfWork.Repository<Kullanici>().Any(i => i.RolId == id))
            //{
            //    return new ApiResult { Result = false, Message = "Rol kullanıcı tarafından kullanılmaktadır." };
            //}

            if (data == null)
            {
                return new ApiResult { Result = false, Message = "Belirtilen müşteri bulunamadı." };
            }

            _unitOfWork.Repository<AltKategori>().Delete(data.Id);
            _unitOfWork.SaveChanges();
            return new ApiResult { Result = true };
        }

        [HttpPost("GetGrid")]
        public ApiResult<GridResultModel<AltKategoriGridVM>> GetGrid()
        {
            var query = _unitOfWork.Repository<AltKategori>()
            .Select(x => new AltKategoriGridVM
            {
                Id = x.Id,
                Adi = x.Adi,
                UstKategoriAdi = x.UstKategoriAdi,
                UstKategoriId = x.UstKategoriId
            });
            var rest = query.ToDataListRequest(Request.ToRequestFilter());

            return new ApiResult<GridResultModel<AltKategoriGridVM>> { Data = rest, Result = true };
        }

        [HttpPost("Get")]
        public ApiResult<AltKategoriGridVM> Get(int id)
        {
            var AltKategori = _unitOfWork.Repository<AltKategori>().GetById(id);
            AltKategoriGridVM AltKategoriVM = new AltKategoriGridVM
            {
                Id = AltKategori.Id,
                Adi = AltKategori.Adi,
                UstKategoriAdi = AltKategori.UstKategoriAdi,
                UstKategoriId = AltKategori.UstKategoriId
            };
            return new ApiResult<AltKategoriGridVM> { Data = AltKategoriVM, Result = true };
        }

        [HttpPost("GetComboGrid")]
        public ApiResult<List<AltKategoriGridVM>> GetComboGrid()
        {
            var query = _unitOfWork.Repository<AltKategori>()
                .Select(x => new AltKategoriGridVM
                {
                    Id = x.Id,
                    Adi = x.Adi,
                    UstKategoriId = x.UstKategoriId,
                    UstKategoriAdi = x.UstKategoriAdi,
                });

            var result = query.ToList(); // Convert the IQueryable to a List

            return new ApiResult<List<AltKategoriGridVM>> { Data = result, Result = true };
        }

        [HttpPost("GetByUstKategoriId")]
        public ApiResult<List<AltKategoriGridVM>> GetByUstKategoriId(int ustKategoriId)
        {
            var query = _unitOfWork.Repository<AltKategori>()
                .Where(x => x.UstKategoriId == ustKategoriId)
                .Select(x => new AltKategoriGridVM
                {
                    Id = x.Id,
                    Adi = x.Adi,
                    UstKategoriId = x.UstKategoriId,
                    UstKategoriAdi = x.UstKategoriAdi,
                });

            var result = query.ToList();

            return new ApiResult<List<AltKategoriGridVM>> { Data = result, Result = true };
        }

    }
}
