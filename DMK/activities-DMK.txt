------
-- Lua script to get Task for Character Activities
----
-- Parameters:
-- 1: Task Duration
-- 2: "J" if the task is a joint-task (with two characters)
-- 3: Event Name
-- 4: don't add sortkey
-- 5: EC amount (override standard EC amount)
------

local p = {}
 
local taskData = mw.loadData( 'Module:Tasks/data' )
local EC = require ("Module:EC").getEC
local util = require ("Module:Utility")

function p.getData(frame)
    local tArgs = util.getArgs(frame)

    local joint    = 0
    local duration = tArgs[1] or "?h"
    if (tonumber(duration)) then duration = util.sec2dur(tonumber(duration)) end
    if (tArgs[2] and tArgs[2] ~= "") then
        joint = 2
    end
    local ipName   = tArgs[3] or "magic"
    local ecAmount = tArgs[5]

	-- temporary workaround to fix wrongly entered template parameter
	-- in some of the activity templates
	-- should have been entered as {{{3|}}} instead of {{{3}}}
	ipName = string.gsub(ipName, "%{%{%{%d+%|*%}%}%}", "")

	if ipName == "" then ipName = "magic" end

    ipName = string.lower(ipName)
    duration = string.lower(duration)

	-- default to standard LTE TimeSet
	-- if ipName is blank, normal magic TimeSet will get selected later
	local timeSet = 100
	-- the currency name will get selected in Module:EC
	-- just need to specify LTE key/short name
	-- name will be changed from TaskData table if different from input ipName
	local currency = ipName

	if taskData[ipName] then
		timeSet = taskData[ipName][1] or 100
		currency = taskData[ipName][2] or ipName
	end

	local ipTaskData = taskData.TimeSets[timeSet]

    if duration == "all" then
        return "|Various\n| nowrap|" .. EC({"xp"}) .. ", "
                .. EC({currency})
    else
        if not ipTaskData[duration] then
            duration = "?h"
        end

		local sorting = ""

		if not tArgs[4] then
			local durNumb, durHMS = string.match(duration, "^([%d%?]+)([hms])$")
			local durNumb = tonumber(durNumb)
			
			if durNumb then
			    if durHMS == "h" then
			        durNumb = durNumb * 3600
			    elseif durHMS == "m" then
			        durNumb = durNumb * 60
			    end
			else
			    durNumb = 99900
			end
			
			durNumb = durNumb + joint        
	
	        sorting = ' data-sort-value="'
	                .. durNumb
	                .. '"|'
		end

        return "|" .. sorting .. duration .. "\n| nowrap|" .. EC({"xp"})
                .. ipTaskData[duration][1 + joint] .. ", "
                .. EC({currency}) 
                .. (ecAmount or ipTaskData[duration][2 + joint])
    end
end
 
return p

-- </nowiki>
-- [[Category:Lua Modules]]
