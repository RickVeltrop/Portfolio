-- My standard logger module, useful for keeping clean consoles in prod. Includes discord webhook support

--[[

Example Usage:
	
local LogService = require(ReplicatedStorage.LogService)
LogService:Log(Enum.AnalyticsLogLevel.Warn, 'This is a warning message.')
LogService:Warn('This is also a warning message!')


LogLevels (Enum.AnalyticsLogLevel):
{
  [0] = Trace (TRA)
  [1] = Debug (DEB)
  [2] = Information (INF)
  [3] = Warning (WARN)
  [4] = Error (ERR)
  [5] = Fatal (FAT)
}


Settings:
{
  LogInStudio: bool - Whether logs sent using this module should be printed in studio
  MinimumLogLevel: number - The minimum log level to print
  
  StudioMaximumLogLevel: number - The maximum log level that will be logged while in studio testing
  StudioMinimumLogLevel: number - The minimum log level that will be logged while in studio testing
  
  DiscordMinimumLogLevel: number - The minimum log level that will be send through the discord webhook, cannot be less than MinimumLogLevel
}

Make sure there is a StringValue inside ServerStorage named "WebhookUrl" in order to use the WebhookLogger

--]]

local runs = game:GetService('RunService')
local ss = game:GetService('ServerStorage')
local http = game:GetService('HttpService')

local module = {}

local ShortLogLevels = {
	[0] = 'TRA',
	[1] = 'DEB',
	[2] = 'INF',
	[3] = 'WARN',
	[4] = 'ERR',
	[5] = 'FAT',
}

local EmbedColors = {
	[Enum.AnalyticsLogLevel.Trace] = 8289918,
	[Enum.AnalyticsLogLevel.Debug] = 8289918,
	[Enum.AnalyticsLogLevel.Information] = 8289918,
	[Enum.AnalyticsLogLevel.Warning] = 16749598,
	[Enum.AnalyticsLogLevel.Error] = 16711680,
	[Enum.AnalyticsLogLevel.Fatal] = 6881280,
}

local LogLevelFuncs = {
	[0] = print,
	[3] = warn,
	[4] = error
}

local Settings = {
	LogInStudio = script:GetAttribute('LogInStudio'),
	MinimumLogLevel = script:GetAttribute('MinimumLogLevel'),
	StudioMaximumLogLevel = script:GetAttribute('StudioMaximumLogLevel'),
	StudioMinimumLogLevel = script:GetAttribute('StudioMinimumLogLevel'),
	DiscordMinimumLogLevel = script:GetAttribute('DiscordMinimumLogLevel'),
}

local function SendRequest(Url:string, EncodedData:string, Attempt:number?)
	Attempt = Attempt or 1
	
	local succ,err = pcall(http.PostAsync, http, Url, EncodedData, Enum.HttpContentType.ApplicationJson)

	if not succ and Attempt <= 3 then
		task.wait(1)
		SendRequest(Url, EncodedData, Attempt+1)
	elseif not succ and Attempt > 3 then
		task.spawn(error, `Failed to send request to url ({Url}) with data: `, EncodedData, `\nError: {err}`)
	end
end

local function TableToStr(Tbl, Ind)
	if type(Tbl) ~= 'table' then return tostring(Tbl) end
	if not Ind then Ind = 1 end
	
	local Str = '{\n'

	for i,v in Tbl do
		for i=1, Ind, 1 do Str ..= '	' end
		Str ..= `["{TableToStr(i, Ind+1)}"] = {TableToStr(v, Ind+1)},\n`
	end

	for i=1, Ind-1, 1 do Str ..= '	' end
	Str ..= '}'
	
	return Str
end

local function FormatLogMessage(...)
	local Args = {...}
	
	local Str = ''
	
	for i,v in Args do
		Str ..= `{TableToStr(v)} `
	end
	
	return Str
end

local function AttemptWebhookLog(Severity:Enum.AnalyticsLogLevel, ...)
	if Severity.Value < Settings.DiscordMinimumLogLevel then return end
	
	local WebHookUrl = ss:FindFirstChild('WebhookUrl')
	if not WebHookUrl or WebHookUrl.Value == '' then return end

	local Source = debug.info(4, 's')
	local Line = debug.info(4, 'l')
	local Name = debug.info(4, 'n')
	local Origin = if #Name > 0 then `[{Source}|{Name}:{Line}]` else `[{Source}:{Line}]`
	
	local Server = if game.JobId == '' then `Local Server` else `Server #{game.JobId}`
	
	local Data = {
		['embeds'] = {{
			['description'] = FormatLogMessage(Origin, ...),
			['title'] = `{Severity.Name} ({Server})`,
			['color'] = EmbedColors[Severity]

		}}
	}
	Data = http:JSONEncode(Data)
	
	SendRequest(WebHookUrl.Value, Data)
end

local function CheckStudioShouldLog(Severity:Enum.AnalyticsLogLevel)
	if Severity.Value > Settings.StudioMaximumLogLevel then return false end
	if Severity.Value < Settings.StudioMinimumLogLevel then return false end

	return true
end

local function CheckServerShouldLog(Severity:Enum.AnalyticsLogLevel)
	if Severity.Value < Settings.MinimumLogLevel then return false end

	return true
end

local function CheckClientShouldLog(Severity:Enum.AnalyticsLogLevel)
	if Severity.Value < Settings.MinimumLogLevel then return false end

	return true
end

local function Log(Severity:Enum.AnalyticsLogLevel, ...)
	if runs:IsStudio() and not CheckStudioShouldLog(Severity) then return end
	if not runs:IsStudio() and runs:IsServer() and not CheckServerShouldLog(Severity) then return end
	if not runs:IsStudio() and runs:IsClient() and not CheckClientShouldLog(Severity) then return end

	local Source = debug.info(3, 's')
	local Line = debug.info(3, 'l')
	local Name = debug.info(3, 'n')

	local Level = `[{ShortLogLevels[Severity.Value]}]`
	local Origin = if #Name > 0 then `[{Source}|{Name}:{Line}:]` else `[{Source}:{Line}:]`
	
	local LogFunc = print
	for i,v in LogLevelFuncs do
		LogFunc = if i <= Severity.Value then v else LogFunc
	end
	
	task.spawn(LogFunc, FormatLogMessage(Level, Origin, ...))
	
	AttemptWebhookLog(Severity, ...)
end

function module:Log(Severity:Enum.AnalyticsLogLevel, ...)
	Log(Severity, ...)
end

function module:Trace(...)
	Log(Enum.AnalyticsLogLevel.Trace, ...)
end

function module:Debug(...)
	Log(Enum.AnalyticsLogLevel.Debug, ...)
end

function module:Info(...)
	Log(Enum.AnalyticsLogLevel.Information, ...)
end

function module:Warn(...)
	Log(Enum.AnalyticsLogLevel.Warning, ...)
end

function module:Error(...)
	Log(Enum.AnalyticsLogLevel.Error, ...)
end

function module:Fatal(...)
	Log(Enum.AnalyticsLogLevel.Fatal, ...)
end

return module
