using Microsoft.AspNetCore.Mvc;
using webapi.Base.Base;
using webapi.Base.Base.Grid;
using webapi.Entity;
using webapi.Helper.Base;
using webapi.ViewModel.General.Grid;
using webapi.ViewModel;
using webapi.ViewModel.Musteri;
using webapi.ViewModel.UstKategori;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UstKategoriController : BaseWebApiController
    {
        public UstKategoriController(IHttpContextAccessor httpContextAccessor) : base(httpContextAccessor)
        {
        }

        [HttpPost("CreateOrUpdate")]
        public ApiResult CreateOrUpdate([FromBody] UstKategoriCreateVM dataVM)
        {
            if (!ModelState.IsValid)
                return new ApiResult { Result = false, Message = "Form'da doldurulmayan alanlar mevcut,lütfen doldurun." };
            UstKategori data;
            if (dataVM.Id > 0)
            {
                data = _unitOfWork.Repository<UstKategori>().GetById(dataVM.Id);
                data.Adi = dataVM.Adi;
            }
            else
            {
                data = new UstKategori()
                {
                    Adi = dataVM.Adi,
                };
                if (_unitOfWork.Repository<UstKategori>().Any(x => x == data))
                {
                    return new ApiResult { Result = false, Message = "Daha önce eklenmiş" };
                }
            }

            _unitOfWork.Repository<UstKategori>().InsertOrUpdate(data);
            _unitOfWork.SaveChanges();
            return new ApiResult { Result = true };
        }

        [HttpGet("Delete")]
        public ApiResult Delete(int id)
        {
            var data = _unitOfWork.Repository<UstKategori>().GetById(id);
            //if (_unitOfWork.Repository<Kullanici>().Any(i => i.RolId == id))
            //{
            //    return new ApiResult { Result = false, Message = "Rol kullanıcı tarafından kullanılmaktadır." };
            //}

            if (data == null)
            {
                return new ApiResult { Result = false, Message = "Belirtilen müşteri bulunamadı." };
            }

            _unitOfWork.Repository<UstKategori>().Delete(data.Id);
            _unitOfWork.SaveChanges();
            return new ApiResult { Result = true };
        }

        [HttpPost("GetGrid")]
        public ApiResult<GridResultModel<UstKategoriGridVM>> GetGrid()
        {
            var query = _unitOfWork.Repository<UstKategori>()
            .Select(x => new UstKategoriGridVM
            {
                Id = x.Id,
                Adi = x.Adi,
            });
            var rest = query.ToDataListRequest(Request.ToRequestFilter());

            return new ApiResult<GridResultModel<UstKategoriGridVM>> { Data = rest, Result = true };
        }

        [HttpPost("Get")]
        public ApiResult<UstKategoriGridVM> Get(int id)
        {
            var UstKategori = _unitOfWork.Repository<UstKategori>().GetById(id);
            UstKategoriGridVM UstKategoriVM = new UstKategoriGridVM
            {
                Id = UstKategori.Id,
                Adi = UstKategori.Adi,
            };
            return new ApiResult<UstKategoriGridVM> { Data = UstKategoriVM, Result = true };
        }

        [HttpPost("GetComboGrid")]
        public ApiResult<List<UstKategoriGridVM>> GetComboGrid()
        {
            var query = _unitOfWork.Repository<UstKategori>()
                .Select(x => new UstKategoriGridVM
                {
                    Id = x.Id,
                    Adi = x.Adi,
                });

            var result = query.ToList(); // Convert the IQueryable to a List

            return new ApiResult<List<UstKategoriGridVM>> { Data = result, Result = true };
        }

        [HttpPost("GetComboGrid/{id}")]
        public ApiResult<List<UstKategoriGridVM>> GetName(int id)
        {
            var query = _unitOfWork.Repository<UstKategori>()
                .Where(x => x.Id == id) // Filter the records based on the provided ID
                .Select(x => new UstKategoriGridVM
                {
                    Id = x.Id,
                    Adi = x.Adi,
                });

            var result = query.ToList(); // Convert the IQueryable to a List

            return new ApiResult<List<UstKategoriGridVM>> { Data = result, Result = true };
        }


    }
}
