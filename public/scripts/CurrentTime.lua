-- Module used to get accurate timestamps across servers
-- If you're wondering why this is needed, it's because tick() and similar functions may deviate by up to 10 minutes

local http = game:GetService('HttpService')
local rs = game:GetService('ReplicatedStorage')

local MonthNums = {
	Jan = 1,
	Feb = 2,
	Mar = 3,
	Apr = 4,
	May = 5,
	Jun = 6,
	Jul = 7,
	Aug = 8,
	Sep = 9,
	Oct = 10,
	Nov = 11,
	Dec = 12
}

local IsInitialized = false
local CurrentTime
local ResponseDelay
local RequestEnd

local function DateStringToUnixTimestamp(DateString)
	local Day,Month,Year,Hour,Min,Sec = DateString:match('.*, (.*) (.*) (.*) (.*):(.*):(.*) .*')
	
	local Date = {
		Day = Day,
		Month = MonthNums[Month],
		Year = Year,
		Hour = Hour,
		Min = Min,
		Sec = Sec
	}

	return os.time(Date)
end

local module = {}

local function Init()
	if IsInitialized then return end
	
	local Suc,Err = pcall(function()
		local RequestStart = os.clock()
		
		local Response = http:RequestAsync({ Url = 'http://google.com' })
		local DateStr = Response.Headers.date
		
		CurrentTime = DateStringToUnixTimestamp(DateStr)
		
		RequestEnd = os.clock()
		ResponseDelay = (RequestStart - RequestEnd) / 2
	end)
	
	if not Suc then
		warn(`Unable to receive date from http://google.com due to error: {Err}`)
		CurrentTime = os.time()
		RequestEnd = tick()
		ResponseDelay = 0
	end
	
	IsInitialized = true
end

local function Time()
	if not IsInitialized then
		Init()
	end
	
	return CurrentTime + tick() - RequestEnd - ResponseDelay
end

module.Init = Init
module.Time = Time

return module
