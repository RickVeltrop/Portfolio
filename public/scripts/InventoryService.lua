-- A simple ModuleScript to load a creator's on-sale UGC including some util functions

local http = game:GetService('HttpService')
local ins = game:GetService('InsertService')

local function SendRequest(URL:string)
	local Data
	local succ,err = pcall(function()
		Data = http:GetAsync(URL, false)
	end)
	
	if not succ then
		task.wait(1)
		Data = SendRequest(URL)
	end
	
	return Data
end

local function SendUserUGCInventoryRequests(UserId:Player, Cursor:string)
	local URL = `https://catalog.roproxy.com/v1/search/items/details?`
	
	local RequestParams = {
		Category = '1',
		CreatorType = 'User',
		Cursor = Cursor,
		CreatorTargetId = UserId
	}

	for i,v in RequestParams do
		URL ..= `{i}={v}&`
	end

	local Data = SendRequest(URL)
	Data = http:JSONDecode(Data)
	
	-- Send another request if more UGC is available
	if Data.nextPageCursor then
		local NextData = SendUserUGCInventoryRequests(UserId, Data.nextPageCursor)
		
		for i,v in NextData.data do
			Data.data[#Data.data+1] = v
		end
	end
	
	return Data
end


local function SendGroupUGCInventoryRequests(GroupId:number, Cursor:string)
	local URL = `https://catalog.roproxy.com/v2/search/items/details?`

	local RequestParams = {
		Category = '1',
		CreatorType = 'Group',
		Cursor = Cursor,
		CreatorTargetId = GroupId
	}

	for i,v in RequestParams do
		URL ..= `{i}={v}&`
	end

	local Data = SendRequest(URL)
	Data = http:JSONDecode(Data)

	-- Send another request if more UGC is available
	if Data.nextPageCursor then
		local NextData = SendGroupUGCInventoryRequests(GroupId, Data.nextPageCursor)

		for i,v in NextData.data do
			Data.data[#Data.data+1] = v
		end
	end
	
	warn(Data)

	return Data
end

local module = {}

-- Inserts an asset into the player's character
module.InsertAsset = function(Id:number, Plr:Player) : Accessory
	local Asset = ins:LoadAsset(Id)
	local UGC = Asset:GetChildren()[1]
	UGC.Parent = Plr.Character
	Asset:Destroy()
	
	return UGC
end

-- Gets a player's UGC items
module.GetPlayerUGCItems = function(UserId:number) : { }
	local Data = SendUserUGCInventoryRequests(UserId)
	
	return Data.data
end

-- Gets a group's UGC items
module.GetGroupUGCItems = function(GroupId:number) : { }
	local Data = SendGroupUGCInventoryRequests(GroupId)

	return Data.data
end

return module
