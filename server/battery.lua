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
    -- Usar a memória global ActiveMonitors em vez de ler do banco a cada tick
    -- Isso evita conflitos de estado entre battery.lua e main.lua
    if not ActiveMonitors then return end

    for identifier, monitor in pairs(ActiveMonitors) do
        local newLevel = monitor.battery_level - Config.BatteryDrainAmount
        if newLevel < 0 then newLevel = 0 end

        if newLevel ~= monitor.battery_level then
            -- Atualiza memória
            monitor.battery_level = newLevel
            
            -- Atualiza banco
            Database.UpdateBattery(identifier, newLevel)
            
            -- Find player source if online
            local source = Battery.GetSourceFromIdentifier(identifier)
            if source then
                TriggerClientEvent("RossMonitoring:UpdateBattery", source, newLevel)
                
                if newLevel <= 20 and newLevel > 0 then
                    Framework.Notify(source, Config.Lang.battery_low, "warning")
                elseif newLevel == 0 then
                    Framework.Notify(source, Config.Lang.battery_critical, "error")
                    
                    if Config.PrisonOnBatteryZero then
                         Prison.CheckViolation(source, identifier, "Bateria Esgotada")
                    else
                        -- Notify police here
                        local ped = GetPlayerPed(source)
                        local coords = GetEntityCoords(ped)
                        local Groups = vRP.Groups()
                        for key,Value in pairs(Groups) do
                            if Value["Type"] == "Policia" then
                                local Service = vRP.NumPermission(key)
                                for Passports,Sources in pairs(Service) do
                                    async(function()
                                        vRPC.PlaySound(Sources,"ATM_WINDOW","HUD_FRONTEND_DEFAULT_SOUNDSET")
                                        TriggerClientEvent("NotifyPush",Sources,{ code = "911", title = "Tornozeleira Descarregada", x = coords["x"], y = coords["y"], z = coords["z"], criminal = "Monitoramento", color = 16 })
                                    end)
                                end
                            end
                        end
                    end
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
