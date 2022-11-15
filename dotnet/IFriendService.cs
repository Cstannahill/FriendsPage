namespace Services
{
    public interface IFriendService
    {
        public Friend Get(int id);
        public void Update(FriendUpdateRequest request, int userId);
        public void Delete(int id);
        public int Add(FriendAddRequest request, int userId);
        public List<Friend> GetAll();
        public Paged<Friend> Pagination(int pageIndex, int pageSize);
        public List<FriendV3> GetAllV3();
        public FriendV3 GetV3(int id);
        public Paged<FriendV3> PaginationV3(int pageIndex, int pageSize);
        public Paged<FriendV3> SearchPaginatedV3(int pageIndex, int pageSize, string query);
        public int AddV3(FriendAddRequestV3 request, int userId);
        public void DeleteV3(int id);
        public void UpdateV3(FriendUpdateRequestV3 request, int UserId);

    }
}
