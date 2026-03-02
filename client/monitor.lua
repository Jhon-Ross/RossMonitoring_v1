local isMonitored = false
local batteryLevel = 100
local inZone = true
local zoneData = nil
local expirationGameTimer = 0 -- Timer baseado no jogo (monotonic)

RegisterNetEvent('RossMonitoring:StartMonitoring')
AddEventHandler('RossMonitoring:StartMonitoring', function(data)
    isMonitored = true
    batteryLevel = data.battery
    zoneData = data.zone
    
    if data.remainingTime and data.remainingTime > 0 then
        expirationGameTimer = GetGameTimer() + (data.remainingTime * 1000)
    else
        expirationGameTimer = 0
    end
    
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
            
            -- Calcular tempo restante
            if expirationGameTimer > 0 then
                local now = GetGameTimer()
                if expirationGameTimer > now then
                    local remainingSeconds = math.floor((expirationGameTimer - now) / 1000)
                    local hours = math.floor(remainingSeconds / 3600)
                    local minutes = math.floor((remainingSeconds % 3600) / 60)
                    local seconds = remainingSeconds % 60
                    text = text .. string.format(" | %02d:%02d:%02d", hours, minutes, seconds)
                else
                    text = text .. " | EXPIRADO"
                end
            end

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
                -- Aumentei alpha de 50 para 150 e altura (scale Z) de 1.0 para 50.0 para ficar mais visível como um cilindro de luz
                DrawMarker(1, zoneData.x, zoneData.y, zoneData.z - 30.0, 0, 0, 0, 0, 0, 0, zoneData.radius * 2.0, zoneData.radius * 2.0, 60.0, 0, 255, 0, 150, false, false, 2, false, nil, nil, false)
            end
        end
        Wait(sleep)
    end
end)
