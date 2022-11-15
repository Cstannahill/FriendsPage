ALTER proc [dbo].[Friends_SelectAllV3]
			
as

/*

	
	Execute dbo.Friends_SelectAllV3

*/

BEGIN


	SELECT f.[Id]
      ,[Title]
      ,[Bio]
      ,[Summary]
      ,[Headline]
      ,[Slug]
      ,[StatusId]
	  
	 
	  ,Skills = (

			Select s.Name as Name
					,s.Id as Id
			From dbo.Skills as s inner join dbo.FriendSkills as fs
					on s.Id = fs.SkillId
			Where f.Id = fs.FriendId
			For JSON AUTO
	  )
	  ,i.Id 
	  ,i.Url
	  ,i.TypeId
	  ,[UserId]
      ,[DateModified]
      ,[DateCreated]
	  
  FROM [dbo].[FriendsV2] as f inner join dbo.Images as i
		on f.PrimaryImageId = i.Id



END