Utils = {}

function Utils.Debug(...)
    if Config.Debug then
        print("[RossMonitoring:DEBUG]", ...)
    end
end

function Utils.Dump(o)
   if type(o) == 'table' then
      local s = '{ '
      for k,v in pairs(o) do
         if type(k) ~= 'number' then k = '"'..k..'"' end
         s = s .. '['..k..'] = ' .. Utils.Dump(v) .. ','
      end
      return s .. '} '
   else
      return tostring(o)
   end
end

function Utils.FormatTime(seconds)
    local minutes = math.floor(seconds / 60)
    local remainingSeconds = seconds % 60
    return string.format("%02d:%02d", minutes, remainingSeconds)
end
