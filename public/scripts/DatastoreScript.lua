-- Simple template datastore script, I often use this as a basis to build off

--// Services
local plrs = game:GetService('Players')
local dss = game:GetService('DataStoreService')
local rs = game:GetService('ReplicatedStorage')
local ts = game:GetService('TeleportService')
local ss = game:GetService('ServerStorage')
local mps = game:GetService('MarketplaceService')

--// Modules
local Logger = require(rs.Imports.LogService)

--// Variables
local PlayerDS = dss:GetDataStore('PlayerData', 0)

local TypeConverts = {
	table = 'Folder',
	number = 'NumberValue',
	string = 'StringValue',
	boolean = 'BoolValue',
	instance = 'InstanceValue'
}

--// Functions

-- Checks whether a generated folder originated from an array.
local function FolderIsArray(Folder:Folder)
	local BoolCounter = 0
	local Required = #Folder:GetChildren()

	for i,v in Folder:GetChildren() do
		if not v:IsA('BoolValue') then continue end
		BoolCounter += 1
	end

	return BoolCounter >= Required
end

-- Converts a table to InstanceValues
local function TableToInstances(Table, Name, Parent)
	local Value = Instance.new(TypeConverts[typeof(Table)])
	Value.Name = Name

	if type(Table) == 'table' and #Table == 0 then
		for i,v in Table do
			TableToInstances(v, i, Value)
		end
	elseif type(Table) == 'table' and #Table > 0 then
		for i,v in ipairs(Table) do
			TableToInstances(false, v, Value)
		end
	else
		Value.Value = Table
	end

	Value.Parent = Parent
	return Value
end

-- Reverses TableToInstances
local function InstancesToTable(Value)
	local NewTable = {}

	if Value:IsA('Folder') and not FolderIsArray(Value) then
		for i,v in Value:GetChildren() do
			NewTable[v.Name] = InstancesToTable(v)
		end
	elseif Value:IsA('Folder') and FolderIsArray(Value) then
		for i,v in Value:GetChildren() do
			table.insert(NewTable, v.Name)
		end
	else
		return Value.Value
	end

	return NewTable
end

local function LoadPlayerStats(Plr:Player)
	local Data
	local Succ,Err = pcall(function()
		Data = PlayerDS:GetAsync(Plr.UserId)
	end)

	if not Succ then
		Logger:Fatal(`pcall GetAsync for player {Plr.Name}(ID: {Plr.UserId}) failed. reason: {Err}.`)
		Plr:Kick('An error occured while loading data. Contact the developers if this continues.')
	end

	if Data then
		for i,v in require(script.DefaultStats) do
			if not Data[i] then
				Data[i] = v
			end
		end

		Logger:Info(`Data was successfully loaded for player {Plr.Name}(ID: {Plr.UserId}). Data: `, Data)
	else
		Data = require(script.DefaultStats)

		Logger:Info(`No data was loaded for player {Plr.Name}(ID: {Plr.UserId}).`)
	end

	TableToInstances(Data, 'Stats', Plr)
	TableToInstances(require(script.TempValues), 'Temp', Plr)
end

local function SavePlayerStats(Plr:Player)
	local Data = InstancesToTable(Plr.Stats)

	local Succ,Err = pcall(function()
		PlayerDS:SetAsync(Plr.UserId, Data)
	end)

	if Succ then
		Logger:Info(`Data was successfully saved for player {Plr.Name}(ID: {Plr.UserId}). Data: `, Data)
	else
		Logger:Fatal(`Failed to save data for player {Plr.Name}(ID: {Plr.UserId}). reason: {Err}`)
	end
end

local function OnGameClose()
	for i,plr in plrs:GetPlayers() do
		SavePlayerStats(plr)
	end
end

task.spawn(function()
	while task.wait(120) do
		for i,v in plrs:GetPlayers() do
			if not v then continue end

			SavePlayerStats(v)
			task.wait(1)
		end
	end
end)

--// Event Connections
plrs.PlayerAdded:Connect(LoadPlayerStats)
plrs.PlayerRemoving:Connect(SavePlayerStats)

game:BindToClose(OnGameClose)
