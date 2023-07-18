using Microsoft.AspNetCore.Mvc;
using webapi.Base.Base;
using webapi.Base.Base.Grid;
using webapi.Entity;
using webapi.Helper.Base;
using webapi.ViewModel.General.Grid;
using webapi.ViewModel;
using webapi.ViewModel.Product;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : BaseWebApiController
    {
        public ProductController(IHttpContextAccessor httpContextAccessor) : base(httpContextAccessor)
        {
        }

        [HttpPost("CreateOrUpdate")]
        public ApiResult CreateOrUpdate([FromBody] ProductCreateVM dataVM)
        {
            if (!ModelState.IsValid)
                return new ApiResult { Result = false, Message = "Form'da doldurulmayan alanlar mevcut,lütfen doldurun." };
            Product data;
            if (dataVM.Id > 0)
            {
                data = _unitOfWork.Repository<Product>().GetById(dataVM.Id);
                data.Name = dataVM.Name;
                data.Type = dataVM.Type;
                data.Entity = dataVM.Entity;
                data.Price = dataVM.Price;
            }
            else
            {
                data = new Product()
                {
                    Name = dataVM.Name,
                    Type = dataVM.Type,
                    Entity = dataVM.Entity,
                    Price = dataVM.Price,
                };
                if (_unitOfWork.Repository<Product>().Any(x => x == data))
                {
                    return new ApiResult { Result = false, Message = "Daha önce eklenmiş" };
                }
            }

            _unitOfWork.Repository<Product>().InsertOrUpdate(data);
            _unitOfWork.SaveChanges();
            return new ApiResult { Result = true };
        }

        [HttpGet("Delete")]
        public ApiResult Delete(int id)
        {
            var data = _unitOfWork.Repository<Product>().GetById(id);
            //if (_unitOfWork.Repository<Kullanici>().Any(i => i.RolId == id))
            //{
            //    return new ApiResult { Result = false, Message = "Rol kullanıcı tarafından kullanılmaktadır." };
            //}
            
            if (data == null)
            {
                return new ApiResult { Result = false, Message = "Belirtilen müşteri bulunamadı." };
            }

            _unitOfWork.Repository<Product>().SoftDelete(data.Id);
            _unitOfWork.SaveChanges();
            return new ApiResult { Result = true };
        }

        [HttpPost("GetGrid")]
        public ApiResult<GridResultModel<ProductGridVM>> GetGrid()
        {
            var query = _unitOfWork.Repository<Product>()
            .Select(x => new ProductGridVM
            {
                Id = x.Id,
                Name = x.Name,
                Type = x.Type,
                Entity = x.Entity,
                Price = x.Price,
            });
            var rest = query.ToDataListRequest(Request.ToRequestFilter());

            return new ApiResult<GridResultModel<ProductGridVM>> { Data = rest, Result = true };
        }

        [HttpPost("Get")]
        public ApiResult<ProductGridVM> Get(int id)
        {
            var Product = _unitOfWork.Repository<Product>().GetById(id);
            ProductGridVM musteriVM = new ProductGridVM
            {
                Id = Product.Id,
                Name = Product.Name,
                Type= Product.Type,
                Entity = Product.Entity,
                Price = Product.Price
            };
            return new ApiResult<ProductGridVM> { Data = musteriVM, Result = true };
        }

    }
}
