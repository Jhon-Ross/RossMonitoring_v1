Battery = {}

function Battery.StartLoop()
    CreateThread(function()
        while true do
            Wait(Config.BatteryDrainInterval)
            Battery.ProcessDrain()
        end
    end)
end

function Battery.ProcessDrain()
    local monitors = Database.GetActiveMonitors()
    if not monitors then return end

    for _, monitor in ipairs(monitors) do
        local newLevel = monitor.battery_level - Config.BatteryDrainAmount
        if newLevel < 0 then newLevel = 0 end

        if newLevel ~= monitor.battery_level then
            Database.UpdateBattery(monitor.identifier, newLevel)
            
            -- Find player source if online
            local source = Battery.GetSourceFromIdentifier(monitor.identifier)
            if source then
                TriggerClientEvent("RossMonitoring:UpdateBattery", source, newLevel)
                
                if newLevel <= 20 and newLevel > 0 then
                    Framework.Notify(source, Config.Lang.battery_low, "warning")
                elseif newLevel == 0 then
                    Framework.Notify(source, Config.Lang.battery_critical, "error")
                    -- Notify police here (TODO)
                end
            end
        end
    end
end

function Battery.Recharge(identifier)
    Database.UpdateBattery(identifier, 100)
    local source = Battery.GetSourceFromIdentifier(identifier)
    if source then
        TriggerClientEvent("RossMonitoring:UpdateBattery", source, 100)
        Framework.Notify(source, Config.Lang.battery_recharged, "success")
    end
end

function Battery.GetSourceFromIdentifier(identifier)
    for _, player in ipairs(GetPlayers()) do
        local playerSource = tonumber(player)
        if Framework.GetIdentifier(playerSource) == identifier then
            return playerSource
        end
    end
    return nil
end

-- Initialize Battery Loop
Battery.StartLoop()
