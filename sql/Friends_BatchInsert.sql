
ALTER PROC [dbo].[Friends_InsertBatch]   
				@batchSkills dbo.SkillsTable READONLY
				,@Title nvarchar(120)
				,@Bio nvarchar(700)
				,@Summary nvarchar(255)
				,@Headline nvarchar(80)
				,@Slug nvarchar(100)
				,@StatusId int
				,@ImageTypeId int 
				,@ImageUrl nvarchar(255)
				,@UserId int
				,@Id int OUTPUT

AS

/*
	Select *
	From FriendSkills
	
	Declare @newSkills dbo.SkillsTable

			,@Title nvarchar(120) = 'Skillful JoeV2'
			,@Bio nvarchar(700) = 'Test Biography'
			,@Summary nvarchar(255) = 'Test Summary'
			,@Headline nvarchar(80) = 'Test Headline'
			,@Slug nvarchar(100) = 'Test Sluga'
			,@StatusId int = 854685
			,@ImageTypeId int = 1
			,@ImageUrl nvarchar(255) = 'https://image.shutterstock.com/image-photo/young-handsome-man-beard-wearing-260nw-1768126784.jpg'
			,@UserId int = 8525
			,@Id int

	Insert into @newSkills(Name)
			Values('Rust')
	Insert into @newSkills(Name)
			Values('Go')
	Insert into @newSkills(Name)
			Values('C++')
	Insert into @newSkills(Name)
			Values('Lua')

	Execute dbo.Friends_InsertBatch @newSkills
													,@Title
													,@Bio
													,@Summary
													,@Headline
													,@Slug
													,@StatusId
													,@ImageTypeId
													,@ImageUrl
													,@UserId
													,@Id OUTPUT




--------------------------------------------------------------------------------------------------
		Select *
		From FriendSkills

		Select *
		From Skills

		Select *
		From FriendsV2
		Where Id = @Id

		

	Select *
	From FriendsV2



	
*/
BEGIN


	



	INSERT INTO dbo.Skills
				([Name])
					

	SELECT bs.Name
			
	From @batchSkills as bs
	Where Not Exists ( Select 1
						From dbo.Skills as s
						where s.Name = bs.Name )



		
	
	

	Declare @PrimaryImageId int

	INSERT INTO dbo.Images
				([Url]
				,[TypeId])

			Values
				(@ImageUrl
				,@ImageTypeId)


			Set @PrimaryImageId = SCOPE_IDENTITY()

	INSERT INTO [dbo].[FriendsV2]
			([Title]
			   ,[Bio]
			   ,[Summary]
			   ,[Headline]
			   ,[Slug]
			   ,[StatusId]
			   ,[UserId]
			   ,[PrimaryImageId])
			   

           Values
				(@Title
				,@Bio
				,@Summary
				,@Headline
				,@Slug
				,@StatusId
				,@UserId
				,@PrimaryImageId)
           
		Set @Id = SCOPE_IDENTITY()

		Insert INTO dbo.FriendSkills 
				([FriendId]
				,[SkillId])
			
			Select @Id
					,s.Id
					
			From dbo.Skills as s Where EXISTS( SELECT 1
										FROM @batchSkills as bs 
										WHERE s.Name = bs.Name)
							


		

	

END