local isMonitored = false
local batteryLevel = 100
local inZone = true
local zoneData = nil

RegisterNetEvent('RossMonitoring:StartMonitoring')
AddEventHandler('RossMonitoring:StartMonitoring', function(data)
    isMonitored = true
    batteryLevel = data.battery
    zoneData = data.zone
    
    -- Start prop
    TriggerEvent('RossMonitoring:SetProp', true)
    
    -- Start monitoring loop
    CreateThread(function()
        while isMonitored do
            Wait(1000)
            -- Visual feedback only
            -- Server handles logic
        end
    end)
end)

RegisterNetEvent('RossMonitoring:StopMonitoring')
AddEventHandler('RossMonitoring:StopMonitoring', function()
    isMonitored = false
    zoneData = nil
    TriggerEvent('RossMonitoring:SetProp', false)
end)

RegisterNetEvent('RossMonitoring:UpdateBattery')
AddEventHandler('RossMonitoring:UpdateBattery', function(level)
    batteryLevel = level
end)

RegisterNetEvent('RossMonitoring:ZoneStatus')
AddEventHandler('RossMonitoring:ZoneStatus', function(status)
    inZone = status
end)

-- HUD Loop
CreateThread(function()
    while true do
        local sleep = 1000
        if isMonitored then
            sleep = 5
            -- Draw Battery & Status
            local text = "Tornozeleira: " .. batteryLevel .. "%"
            if not inZone then
                text = text .. " | ~r~FORA DA ZONA!"
            else
                text = text .. " | ~g~Na Zona"
            end
            
            SetTextFont(4)
            SetTextScale(0.5, 0.5)
            SetTextColour(255, 255, 255, 255)
            SetTextOutline()
            SetTextEntry("STRING")
            AddTextComponentString(text)
            DrawText(0.85, 0.95)

            -- Draw Zone Marker if available
            if zoneData and zoneData.type == 'circle' then
                DrawMarker(1, zoneData.x, zoneData.y, zoneData.z - 1.0, 0, 0, 0, 0, 0, 0, zoneData.radius * 2.0, zoneData.radius * 2.0, 1.0, 0, 255, 0, 50, false, false, 2, false, nil, nil, false)
            end
        end
        Wait(sleep)
    end
end)
