ALTER PROC [dbo].[Friends_Pagination]   
				@PageIndex int 
				,@PageSize int

AS

/*
	Declare @PageIndex int = 0
			,@PageSize int = 3

	Execute dbo.Friends_Pagination
									@PageIndex
									,@PageSize

	
	
*/
BEGIN
	
	Declare @offset int = @PageIndex * @PageSize
	SELECT [f].[Id]
			,[f].[Title]
			,[f].[Bio]
			,[f].[Summary]
			,[f].[Headline]
			,[f].[Slug]
			,[f].[StatusId]
			,Skills = (
			Select s.Name as Name
				  ,s.Id as Id
			From dbo.Skills as s inner join dbo.FriendSkills as fs
					on s.Id = fs.SkillId
			Where f.Id = fs.FriendId
			For JSON AUTO)
			,i.Id 
			,i.Url
			,i.TypeId
			,[f].[UserId]
			,[f].[DateModified]
			,[f].[DateCreated]
			,[TotalCount] = COUNT(1) OVER()
			

	  
  FROM [dbo].[FriendsV2] as f inner join dbo.Images as i
		on f.PrimaryImageId = i.Id
        ORDER BY f.Id
        
		OFFSET @offSet Rows
	Fetch Next @PageSize Rows ONLY

END