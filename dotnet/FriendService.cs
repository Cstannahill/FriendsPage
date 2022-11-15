namespace Services
{
    public class FriendService : IFriendService
    {
        IDataProvider _data = null;

        public FriendService(IDataProvider data)
        {
            _data = data;
        }

        public Friend Get(int id)
        {
            string procName = "[dbo].[Friends_SelectById]";

            Friend friend = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);

            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                friend = MapSingleFriend(reader, ref startingIndex);
            }
            );

            return friend;
        }

        public void Update(FriendUpdateRequest request, int userId)
        {
            string procName = "[dbo].[Friends_Update]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(request, col);
                col.AddWithValue("@UserId", userId);
                col.AddWithValue("@Id", request.Id);
            },
            returnParameters: null);
        }

        public void Delete(int id)
        {
            string procName = "[dbo].[Friends_Delete]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", id);

            },
            returnParameters: null);
        }

        public int Add(FriendAddRequest request, int userId)
        {
            int id = 0;

            string procName = "[dbo].[Friends_Insert]";

        _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
        {
            AddCommonParams(request, col);
            col.AddWithValue("@UserId", userId);

            SqlParameter IdOut = new SqlParameter("@Id", SqlDbType.Int);
            IdOut.Direction = ParameterDirection.Output;

            col.Add(IdOut);
        },
         returnParameters: delegate (SqlParameterCollection returnCollection)
         {
             object oId = returnCollection["@Id"].Value;

             int.TryParse(oId.ToString(), out id);
         });
            return id;

        }
        public List<Friend> GetAll()
        {
            string procName = "[dbo].[Friends_SelectAll]";

            List<Friend> list = null;
            _data.ExecuteCmd(procName, inputParamMapper: null,
            singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Friend friend = MapSingleFriend(reader,ref startingIndex);

                if (list == null)
                {
                    list = new List<Friend>();
                }

                list.Add(friend);

            });

            return list;

        }

        public Paged<Friend> Pagination(int pageIndex, int pageSize)
        {
            string procName = "dbo.Friends_SelectPaginated";
            Paged<Friend> pagedList = null;
            List<Friend> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(
                procName,
                (param) =>
                {   
                    param.AddWithValue("@PageIndex", pageIndex);
                    param.AddWithValue("@PageSize", pageSize);
                },
                (reader, recordSetIndex) =>
                {
                    int startingIndex = 0;
                    Friend friend = MapSingleFriend(reader, ref startingIndex);
                    totalCount = reader.GetSafeInt32(startingIndex);

                    if (list == null)
                    {
                        list = new List<Friend>();
                    }
                    list.Add(friend);
                }
                );
            if (list != null)
            {
                pagedList = new Paged<Friend>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }
        
        public FriendV3 GetV3(int id)
        {
            string procName = "[dbo].[Friends_SelectByIdV3]";
            FriendV3 friend = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);
            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                friend = MapSingleFriendV3(reader, ref startingIndex);
            }
            );
            return friend;           
        }

        public List<FriendV3> GetAllV3()
        {
            string procName = "[dbo].[Friends_SelectAllV3]";
            List<FriendV3> list = null;
            _data.ExecuteCmd(procName, inputParamMapper: null,
             singleRecordMapper: delegate (IDataReader reader, short set)
             {
                 int startingIndex = 0;
                 FriendV3 friend = MapSingleFriendV3(reader, ref startingIndex);

                 if (list == null)
                 {
                     list = new List<FriendV3>();
                 }

                 list.Add(friend);
             });
            return list;
        }

        public Paged<FriendV3> PaginationV3(int pageIndex, int pageSize)
        {
            string procName = "dbo.Friends_PaginationV3";
            Paged<FriendV3> pagedList = null;
            List<FriendV3> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(
                procName,
                (param) =>
                {
                    param.AddWithValue("@PageIndex", pageIndex);
                    param.AddWithValue("@PageSize", pageSize);
                },
                (reader, recordSetIndex) =>
                {
                    int startingIndex = 0;
                    FriendV3 friend = MapSingleFriendV3(reader, ref startingIndex);
                    totalCount = reader.GetSafeInt32(14);

                    if (list == null)
                    {
                        list = new List<FriendV3>();
                    }
                    list.Add(friend);
                }
                );
            if (list != null)
            {
                pagedList = new Paged<FriendV3>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public void DeleteV3(int id)
        {
            string procName = "[dbo].[Friends_DeleteV3]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", id);

            },
            returnParameters: null);
        }
        public int AddV3(FriendAddRequestV3 request, int userId)
        {
            int id = 0;

            DataTable dt = new DataTable();
            dt.Columns.Add("Name", typeof(string));
            foreach (string skill in request.Skills)
            {
                

                DataRow dr = dt.NewRow();
                dr.SetField(0, skill);
                dt.Rows.Add(dr);
            }
            string procName = "[dbo].[Friends_InsertBatch]";
            
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParamsV3(request, col);
                col.AddWithValue("@batchSkills", dt);
                col.AddWithValue("@UserId", userId);

                SqlParameter IdOut = new SqlParameter("@Id", SqlDbType.Int);
                IdOut.Direction = ParameterDirection.Output;

                col.Add(IdOut);
            },
             returnParameters: delegate (SqlParameterCollection returnCollection)
             {
                 object oId = returnCollection["@Id"].Value;

                 int.TryParse(oId.ToString(), out id);
             });
            return id;

        }

        public void UpdateV3(FriendUpdateRequestV3 request, int userId)
        {
            string procName = "[dbo].[Friends_UpdateBatch]";
            DataTable dt = new DataTable();
            dt.Columns.Add("Name", typeof(string));
            if (request.Skills != null)
            {
                foreach (string skill in request.Skills)
                {
                   

                    DataRow dr = dt.NewRow();
                    dr.SetField(0, skill);
                    dt.Rows.Add(dr);
                }
            }
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParamsV3(request, col);
                col.AddWithValue("@UserId", userId);
                col.AddWithValue("@Id", request.Id);
                col.AddWithValue("@batchSkills", dt);
                col.AddWithValue("@PrimaryImageId", request.PrimaryImage.Id);
            },
            returnParameters: null);
        }


        //public List<Skill> AddSkills(SkillsAddRequest request)
        //{
        //    List<Skill> list = null;
        //    string procName = "[dbo].[Friends_InsertBatch]";

        //    DataTable myParamValue = null;
        //    if(request.Skills != null)
        //    {
        //        myParamValue = MapSkillsToTable(request.Skills);
        //    }
        //    _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection col)
        //    {
        //        col.AddWithValue("@batchSkills", myParamValue);
        //    },
        //    singleRecordMapper: delegate(IDataReader reader, short set)
        //    {
        //        Skill skill = new Skill();
        //        int startingIndex = 0;
        //        skill.Id = reader.GetSafeInt32(startingIndex++);
        //        skill.Name = reader.GetString(startingIndex++);
        //        if (skill == null)
        //        {
        //            skill = new Skill();
        //        }

        //        list.Add(skill);
        //    }
        //    );
        //    return list;
        //}

        //public void UpdateV3(FriendUpdateRequestV3 request, int userId)
        //{
        //    string procName = "[dbo].[Friends_Update]";
        //    _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
        //    {
        //        AddCommonParams(request, col);
        //        col.AddWithValue("@UserId", userId);
        //        col.AddWithValue("@Id", request.Id);
        //    },
        //    returnParameters: null);
        //}

        public Paged<FriendV3> SearchPaginatedV3(int pageIndex, int pageSize, string query)
        {
            string procName = "dbo.Friends_SearchPaginationV3";
            Paged<FriendV3> pagedList = null;
            List<FriendV3> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(
                procName,
                (param) =>
                {
                    param.AddWithValue("@PageIndex", pageIndex);
                    param.AddWithValue("@PageSize", pageSize);
                    param.AddWithValue("@Query", query);
                },
                (reader, recordSetIndex) =>
                {
                    int startingIndex = 0;
                    FriendV3 friend = MapSingleFriendV3(reader, ref startingIndex);
                    totalCount = reader.GetSafeInt32(14);

                    if (list == null)
                    {
                        list = new List<FriendV3>();
                    }
                    list.Add(friend);
                }
                );
            if (list != null)
            {
                pagedList = new Paged<FriendV3>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }
        
        //private DataTable MapSkillsToTable(List<SkillAddRequest> skillsToMap)
        //{
        //    DataTable dt = new DataTable();
        //    dt.Columns.Add("Name", typeof(string));

        //    foreach (SkillAddRequest singleSkill in skillsToMap)
        //    {
        //       DataRow dr = dt.NewRow();

        //        int startingIndex = 0;

        //        dr.SetField(startingIndex++, singleSkill.Name);

        //        dt.Rows.Add(dr);
        //    }

        //    return dt;
        //}

        private static void AddCommonParams(FriendAddRequest request, SqlParameterCollection col)
        {
            col.AddWithValue("@Title", request.Title);
            col.AddWithValue("@Bio", request.Bio);
            col.AddWithValue("@Summary", request.Summary);
            col.AddWithValue("@Headline", request.Headline);
            col.AddWithValue("@Slug", request.Slug);
            col.AddWithValue("@StatusId", request.StatusId);
            col.AddWithValue("@PrimaryImageUrl", request.PrimaryImageUrl);
            
        }

        private static Friend MapSingleFriend(IDataReader reader, ref int startingIndex)
        {
           int startingIdex = 0;
            Friend friend = new Friend();

            friend.Id = reader.GetSafeInt32(startingIdex++);
            friend.Title = reader.GetSafeString(startingIdex++);
            friend.Bio = reader.GetSafeString(startingIdex++);
            friend.Summary = reader.GetSafeString(startingIdex++);
            friend.Headline = reader.GetSafeString(startingIdex++);
            friend.Slug = reader.GetSafeString(startingIdex++);
            friend.StatusId = reader.GetSafeInt32(startingIdex++);
            friend.PrimaryImageUrl = reader.GetSafeString(startingIdex++);
            friend.UserId = reader.GetSafeInt32(startingIdex++);
            friend.DateModified = reader.GetSafeDateTime(startingIdex++);
            friend.DateCreated = reader.GetSafeDateTime(startingIdex++);
            return friend;
        }
        private static void AddCommonParamsV3(FriendAddRequestV3 request, SqlParameterCollection col)
        {
          
                       

            col.AddWithValue("@Title", request.Title);
            col.AddWithValue("@Bio", request.Bio);
            col.AddWithValue("@Summary", request.Summary);
            col.AddWithValue("@Headline", request.Headline);
            col.AddWithValue("@Slug", request.Slug);
            col.AddWithValue("@StatusId", request.StatusId);
            col.AddWithValue("@ImageUrl", request.PrimaryImage.Url);
            col.AddWithValue("@ImageTypeId", request.PrimaryImage.TypeId);
            
        }
        private static FriendV3 MapSingleFriendV3(IDataReader reader, ref int startingIndex)
        {
            int startingIdex = 0;
            FriendV3 friend = new FriendV3();
            friend.PrimaryImage = new Image();

            friend.Id = reader.GetSafeInt32(startingIdex++);
            friend.Title = reader.GetSafeString(startingIdex++);
            friend.Bio = reader.GetSafeString(startingIdex++);
            friend.Summary = reader.GetSafeString(startingIdex++);
            friend.Headline = reader.GetSafeString(startingIdex++);
            friend.Slug = reader.GetSafeString(startingIdex++);
            friend.StatusId = reader.GetSafeInt32(startingIdex++);
            friend.Skills = reader.DeserializeObject<List<Skill>>(startingIdex++);
            friend.PrimaryImage.Id = reader.GetSafeInt32(startingIdex++);
            friend.PrimaryImage.Url = reader.GetSafeString(startingIdex++);
            friend.PrimaryImage.TypeId = reader.GetSafeInt32(startingIdex++);
            friend.UserId = reader.GetSafeInt32(startingIdex++);
            friend.DateModified = reader.GetSafeDateTime(startingIdex++);
            friend.DateCreated= reader.GetSafeDateTime(startingIdex++);
            

            return friend;
        }


    }
}

