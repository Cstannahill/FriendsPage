namespace Web.Api.Controllers
{
    [Route("api/v3/friends")]
    [ApiController]
    public class FriendApiControllerV3 : ControllerBase
    {
        private IFriendService _service = null;
        private IAuthenticationService<int> _authService = null;

        public FriendApiControllerV3(IFriendService service, IAuthenticationService<int> authService)
        {
            _service = service;
            _authService = authService;
        }
        [HttpGet]
        public ActionResult<ItemsResponse<FriendV3>> GetAll()
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                List<FriendV3> list = _service.GetAllV3();

                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("Friends not found");
                }
                else
                {
                    response = new ItemsResponse<FriendV3> { Items = list };
                }
            }

            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse($"General Exception Error: {ex.Message}");
            }
            return StatusCode(code, response);
        }

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<FriendV3>> GetById(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                FriendV3 friend = _service.GetV3(id);
                if (friend == null)
                {
                    code = 404;
                    response = new ErrorResponse("Friend not found.");
                }
                else
                {
                    response = new ItemResponse<FriendV3> { Item = friend };
                }
            }

            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse($"Generic Exception Error: {ex.Message}");
            }
            return StatusCode(code, response);
        }
        [HttpGet("paginate")]
        public ActionResult<ItemResponse<Paged<FriendV3>>> Pagination(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<FriendV3> paged = _service.PaginationV3(pageIndex, pageSize);
                if (paged == null)
                {
                    code = 404;
                    response = new ErrorResponse("Records not found.");
                }
                else
                {
                    ItemResponse<Paged<FriendV3>> result = new ItemResponse<Paged<FriendV3>>();
                    result.Item = paged;
                    code = 200;
                    return StatusCode(code, result);

                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse($"General Exception Error: {ex.Message}");
            }
            return StatusCode(code, response);
        }
        [HttpGet("search")]
        public ActionResult<ItemResponse<Paged<FriendV3>>> SearchPaginated(int pageIndex, int pageSize, string query)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<FriendV3> paged = _service.SearchPaginatedV3(pageIndex, pageSize, query);
                if (paged == null)
                {
                    code = 404;
                    response = new ErrorResponse("Records not found.");
                }
                else
                {
                    ItemResponse<Paged<FriendV3>> result = new ItemResponse<Paged<FriendV3>>();
                    result.Item = paged;
                    code = 200;
                    return StatusCode(code, result);

                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse($"General Exception Error: {ex.Message}");
            }
            return StatusCode(code, response);
        }
        [HttpDelete("{id:int}")]
        public ActionResult<SuccessResponse> Delete(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                _service.DeleteV3(id);
                response = new SuccessResponse();
                
            }   
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse($"General Exception Error: {ex.Message}");
            }
            return StatusCode(code, response);
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> Create(FriendAddRequestV3 request)
        {
            int userId = _authService.GetCurrentUserId();
            int code = 201;
            BaseResponse response = null;

            try
            {
                int id = _service.AddV3(request, userId);
                response = new ItemResponse<int> { Item = id };
            }
            catch (Exception ex)
            {
                code = 500;

                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }

        [HttpPut("{id:int}")]
        public ActionResult<ItemResponse<int>> Update(FriendUpdateRequestV3 request)
        {
            int userId = _authService.GetCurrentUserId();
            int code = 200;
            BaseResponse response = null;

            try
            {
                _service.UpdateV3(request, userId);
                response = new SuccessResponse();
            }

            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse($"Generic Exception Error: {ex.Message}");
            }

            return StatusCode(code, response);
        }
    }
}
