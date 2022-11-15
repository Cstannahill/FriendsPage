namespace Web.Api.Controllers
{
    [Route("api/friends")]
    [ApiController]
    public class FriendApiController : ControllerBase
    {
        private IFriendService _service = null;
        private IAuthenticationService<int> _authService = null;

        public FriendApiController(IFriendService service, IAuthenticationService<int> authService)
        {
            _service = service;
            _authService = authService;
        }
        [HttpGet]
        public ActionResult<ItemsResponse<Friend>> GetAll()
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                List<Friend> list = _service.GetAll();

                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("Friends not found.");
                }
                else
                {
                    response = new ItemsResponse<Friend> { Items = list };
                }
            }
            catch (SqlException sqlEx)
            {
                code = 500;
                response = new ErrorResponse($"SqlException Error: {sqlEx.Message}");
            }
            catch (ArgumentException argEx)
            {
                code = 500;
                response = new ErrorResponse($"ArgumentException Error: {argEx.Message}");
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse($"General Exception Error: {ex.Message}");
            }
            return StatusCode(code, response);
        }

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<Friend>> GetById(int id)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                Friend friend = _service.Get(id);
                if(friend == null)
                {
                    code = 404;
                    response = new ErrorResponse("Friend not found.");
                }
                else
                {
                    response = new ItemResponse<Friend> { Item = friend };
                }
            }
            catch(SqlException sqlEx)
            {
                code=500;
                response = new ErrorResponse($"SqlException Error: {sqlEx.Message}");
            }
            catch(ArgumentException argEx)
            {
                code = 500;
                response = new ErrorResponse($"ArgumentException Error: {argEx.Message}");
            }
            catch(Exception ex)
            {
                code = 500;
                response = new ErrorResponse($"Generic Exception Error: {ex.Message}");
            }
            return StatusCode(code, response);
        }
        [HttpPost]
        public ActionResult<ItemResponse<int>> Create(FriendAddRequest request)
        {
            int userId = _authService.GetCurrentUserId();
            int code = 200;
            BaseResponse response = null;

            try
            {
                int id = _service.Add(request, userId);

                code = 201;
                response = new ItemResponse<int> { Item = id };
            }
            catch(SqlException sqlEx)
            {
                code = 500;

                response = new ErrorResponse($"SqlException Error: {sqlEx.Message}");
            }
            catch(ArgumentException argEx)
            {
                code = 500;

                response = new ErrorResponse($"ArgumentException Error: {argEx.Message}");
            }
            catch(Exception ex)
            {
                code = 500;

                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }
        [HttpPut("{id:int}")]
        public ActionResult<ItemResponse<int>> Update(FriendUpdateRequest request)
        {
            int userId = _authService.GetCurrentUserId();
            int code = 200;
            BaseResponse response = null;

            try
            {
                _service.Update(request, userId);
                response = new SuccessResponse();
            }
            catch(SqlException sqlEx)
            {
                code = 500;
                response = new ErrorResponse($"SqlException Error: {sqlEx.Message}");
            }
            catch(ArgumentException argEx)
            {
                code = 500;
                response = new ErrorResponse($"ArgumentException Error: {argEx.Message}");
            }
            catch(Exception ex)
            {
                code = 500;
                response = new ErrorResponse($"Generic Exception Error: {ex.Message}");
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
                _service.Delete(id);
                response = new SuccessResponse();
            }
            catch (SqlException sqlEx)
            {
                code = 500;
                response = new ErrorResponse($"SqlException Error: {sqlEx.Message}");
            }
            catch (ArgumentException argEx)
            {
                code = 500;
                response = new ErrorResponse($"ArgumentException Error: {argEx.Message}");
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse($"General Exception Error: {ex.Message}");
            }
            return StatusCode(code, response);
        }

        [HttpGet("paginate")]
        public ActionResult<ItemResponse<Paged<Friend>>> Pagination(int pageIndex, int pageSize)
        {   int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<Friend> paged = _service.Pagination(pageIndex, pageSize);
                if (paged == null)
                {
                    code = 500;
                    response = new ErrorResponse("Records not found.");
                }
                else
                {
                    ItemResponse<Paged<Friend>> result = new ItemResponse<Paged<Friend>>();
                    result.Item = paged;
                    code = 200;
                    return StatusCode(code, result);

                }
            }
            catch (SqlException sqlEx)
            {
                code = 500;
                response = new ErrorResponse($"SqlException Error: {sqlEx.Message}");
            }
            catch (ArgumentException argEx)
            {
                code = 500;
                response = new ErrorResponse($"ArgumentException Error: {argEx.Message}");
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse($"General Exception Error: {ex.Message}");
            }
            return StatusCode(code, response);
        }
          
    }
}
