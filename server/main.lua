--[[ 
██████╗  ██████╗ ███████╗███████╗ 
██╔══██╗██╔═══██╗██╔════╝██╔════╝ 
██████╔╝██║   ██║███████╗███████╗ 
██╔══██╗██║   ██║╚════██║╚════██║ 
██║  ██║╚██████╔╝███████║███████║ 
╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚══════╝ 

========================================================= 
R.P.M.S - ROSS Police Monitoring System 
Secure Electronic Monitoring Solution 
Property of ROSS Development 
========================================================= 
]] 

AddEventHandler('onResourceStart', function(resourceName)
    if resourceName ~= GetCurrentResourceName() then return end
    print([[

██████╗  ██████╗ ███████╗███████╗ 
██╔══██╗██╔═══██╗██╔════╝██╔════╝ 
██████╔╝██║   ██║███████╗███████╗ 
██╔══██╗██║   ██║╚════██║╚════██║ 
██║  ██║╚██████╔╝███████║███████║ 
╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚══════╝ 

=========================================================
R.P.M.S - ROSS Police Monitoring System
Secure Electronic Monitoring Solution
Property of ROSS Development
=========================================================
]])
end)

ActiveMonitors = {} -- Global para ser acessível pelo battery.lua

local function HasAccess(source)
    for _, entry in ipairs(Config.AllowedGroups) do
        if type(entry) == "string" then
            if Framework.HasPermission(source, entry) then
                return true
            end
        elseif type(entry) == "table" then
            if Framework.HasPermission(source, entry.perm, entry.level) then
                return true
            end
        end
    end
    return false
end

-- Load active monitors from DB on resource start
CreateThread(function()
    Wait(1000) -- Wait for DB
    local monitors = Database.GetActiveMonitors()
    if monitors then
        for _, monitor in ipairs(monitors) do
            ActiveMonitors[monitor.identifier] = monitor
            monitor.zone_data = json.decode(monitor.zone_data)
        end
    end
end)

-- Command: /tornozeleira
RegisterCommand('tornozeleira', function(source, args, rawCommand)
    if HasAccess(source) then 
        TriggerClientEvent("RossMonitoring:OpenUI", source)
    else
        Framework.Notify(source, Config.Lang.no_permission, "error")
    end
end)

-- Monitor Loop (Server-side check)
CreateThread(function()
    while true do
        Wait(Config.CheckInterval)
        for identifier, monitor in pairs(ActiveMonitors) do
            -- Verificar expiração do tempo
            if monitor.end_time and os.time() >= monitor.end_time then
                Database.RemoveMonitor(identifier, true)
                ActiveMonitors[identifier] = nil
                
                local source = Battery.GetSourceFromIdentifier(identifier)
                if source then
                    TriggerClientEvent('RossMonitoring:StopMonitoring', source)
                    Framework.Notify(source, "Seu tempo de monitoramento acabou. Você está livre.", "success")
                end
            else
                local source = Battery.GetSourceFromIdentifier(identifier)
                if source then
                    local ped = GetPlayerPed(source)
                    local coords = GetEntityCoords(ped)
                    monitor.last_coords = { x = coords.x, y = coords.y, z = coords.z }
                    
                    -- Check if inside zone
                    local inside = false
                    if monitor.zone_data.type == "circle" then
                        local dist = #(coords - vector3(monitor.zone_data.x, monitor.zone_data.y, monitor.zone_data.z))
                        if dist <= monitor.zone_data.radius then
                            inside = true
                        end
                    elseif monitor.zone_data.type == "polygon" then
                        -- TODO: Implement polygon check
                        inside = true -- Placeholder
                    end

                    if not inside then
                        -- Player is outside zone
                        TriggerClientEvent('RossMonitoring:ZoneStatus', source, false)
                        
                        if not monitor.out_time then
                            monitor.out_time = os.time()
                            Framework.Notify(source, Config.Lang.out_of_zone, "error")
                        else
                            local timeOut = os.time() - monitor.out_time
                            if timeOut >= (Config.MaxOutOfZoneTime * 60) then
                                -- Prison logic
                                Prison.CheckViolation(source, identifier)
                                monitor.out_time = nil -- Reset after prison
                            end
                        end
                    else
                        TriggerClientEvent('RossMonitoring:ZoneStatus', source, true)
                        
                        if monitor.out_time then
                            monitor.out_time = nil
                            Framework.Notify(source, Config.Lang.returned_to_zone, "success")
                        end
                    end
                end
            end
        end
    end
end)

-- Register Items (Battery)
if Framework.Type == 'esx' then
    ESX.RegisterUsableItem('battery_pack', function(source)
        local xPlayer = ESX.GetPlayerFromId(source)
        xPlayer.removeInventoryItem('battery_pack', 1)
        TriggerEvent('RossMonitoring:UseBatteryItem', source)
    end)
elseif Framework.Type == 'qbcore' then
    QBCore.Functions.CreateUseableItem('battery_pack', function(source, item)
        local Player = QBCore.Functions.GetPlayer(source)
        Player.Functions.RemoveItem('battery_pack', 1)
        TriggerEvent('RossMonitoring:UseBatteryItem', source)
    end)
end

RegisterNetEvent('RossMonitoring:UseBatteryItem', function(source)
    local identifier = Framework.GetIdentifier(source)
    if ActiveMonitors[identifier] then
        Battery.Recharge(identifier)
    else
        Framework.Notify(source, Config.Lang.not_monitored, "error")
    end
end)

RegisterNetEvent('RossMonitoring:CheckPerson')
AddEventHandler('RossMonitoring:CheckPerson', function(targetId)
    local source = source
    if not HasAccess(source) then return end
    
    local data = Framework.GetCharacterData(targetId)
    
    if data then
        TriggerClientEvent('RossMonitoring:ReturnPersonData', source, data)
    else
        Framework.Notify(source, "Cidadão não encontrado.", "error")
    end
end)

RegisterNetEvent('RossMonitoring:RequestData')
AddEventHandler('RossMonitoring:RequestData', function()
    local source = source
    if not HasAccess(source) then return end
    
    local function buildMonitorsList()
        local monitorsList = {}
        for _, data in pairs(ActiveMonitors) do
            local identifier = data.identifier or data.id
            if identifier then
                table.insert(monitorsList, {
                    id = tostring(identifier),
                    name = "ID: " .. tostring(identifier),
                    battery = tonumber(data.battery_level) or 100,
                    location = "Active",
                    status = 'Active',
                    priority = 'Low',
                    stability = 100,
                    endTime = data.end_time, -- Envia tempo de término para o Painel da Polícia (RequestData)
                    x = 50,
                    y = 50,
                    worldX = data.last_coords and data.last_coords.x or nil,
                    worldY = data.last_coords and data.last_coords.y or nil,
                    worldZ = data.last_coords and data.last_coords.z or nil,
                    avatar = ("https://picsum.photos/seed/%s/100/100"):format(tostring(identifier))
                })
            end
        end
        return monitorsList
    end

    local function buildLogsList()
        local rows = Database.GetHistory(200) or {}
        local logsList = {}
        for _, row in ipairs(rows) do
            local identifier = tostring(row.identifier or '')
            local officerIdentifier = row.officer_identifier and tostring(row.officer_identifier) or 'UNKNOWN'
            local appliedAt = tonumber(row.applied_at) or os.time()
            local action = row.removed_at and 'REMOVED' or 'APPLIED'
            local initials = identifier:sub(1, 2):upper()

            table.insert(logsList, {
                id = row.id,
                dateTime = os.date('%Y-%m-%d %H:%M:%S', appliedAt),
                officer = 'ID: ' .. officerIdentifier,
                badge = officerIdentifier,
                action = action,
                player = 'ID: ' .. identifier,
                cid = identifier,
                initials = initials,
                reason = action == 'REMOVED' and 'Monitoring removed.' or 'Monitoring applied.'
            })
        end
        return logsList
    end

    TriggerClientEvent('RossMonitoring:UpdateUI', source, { monitors = buildMonitorsList(), logs = buildLogsList() })
end)

RegisterNetEvent('RossMonitoring:ApplyMonitor')
AddEventHandler('RossMonitoring:ApplyMonitor', function(data)
    local source = source
    if not HasAccess(source) then return end
    
    local targetId = data.id
    local duration = tonumber(data.duration) or 1
    local zone = data.zone or { x = 0, y = 0, z = 0, radius = 50, type = 'circle' }
    
    if zone.x == 0 and zone.y == 0 then
        local ped = GetPlayerPed(source)
        local coords = GetEntityCoords(ped)
        zone.x = coords.x
        zone.y = coords.y
        zone.z = coords.z
    end

    local endTime = os.time() + (duration * 3600)
    
    local success = Database.AddMonitor(targetId, os.time(), endTime, zone, Framework.GetIdentifier(source))
    
    if success then
        ActiveMonitors[targetId] = {
            identifier = targetId,
            start_time = os.time(),
            end_time = endTime,
            zone_data = zone,
            battery_level = 100,
            status = 'active'
        }
        
        local targetSource = Battery.GetSourceFromIdentifier(targetId)
        if targetSource then
            TriggerClientEvent('RossMonitoring:StartMonitoring', targetSource, {
                battery = 100,
                zone = zone,
                endTime = endTime, -- Envia tempo de término absoluto (para UI se precisar)
                remainingTime = endTime - os.time() -- Envia segundos restantes (para cronômetro preciso)
            })
            Framework.Notify(targetSource, Config.Lang.monitor_applied, "info")
        end
        
        Framework.Notify(source, Config.Lang.monitor_applied, "success")
        TriggerClientEvent('RossMonitoring:PlayInstallAnim', source) -- Dispara animação no policial
        TriggerClientEvent('RossMonitoring:UpdateUI', source, { monitors = (function()
            local monitorsList = {}
            for _, m in pairs(ActiveMonitors) do
                local identifier = m.identifier or m.id
                if identifier then
                    table.insert(monitorsList, {
                        id = tostring(identifier),
                        name = "ID: " .. tostring(identifier),
                        battery = tonumber(m.battery_level) or 100,
                        location = "Active",
                        status = 'Active',
                        priority = 'Low',
                        stability = 100,
                        endTime = m.end_time, -- Envia tempo de término para o Painel da Polícia
                        x = 50,
                        y = 50,
                        worldX = m.last_coords and m.last_coords.x or nil,
                        worldY = m.last_coords and m.last_coords.y or nil,
                        worldZ = m.last_coords and m.last_coords.z or nil,
                        avatar = ("https://picsum.photos/seed/%s/100/100"):format(tostring(identifier))
                    })
                end
            end
            return monitorsList
        end)(), logs = (function()
            local rows = Database.GetHistory(200) or {}
            local logsList = {}
            for _, row in ipairs(rows) do
                local identifier = tostring(row.identifier or '')
                local officerIdentifier = row.officer_identifier and tostring(row.officer_identifier) or 'UNKNOWN'
                local appliedAt = tonumber(row.applied_at) or os.time()
                local action = row.removed_at and 'REMOVED' or 'APPLIED'
                local initials = identifier:sub(1, 2):upper()
                table.insert(logsList, {
                    id = row.id,
                    dateTime = os.date('%Y-%m-%d %H:%M:%S', appliedAt),
                    officer = 'ID: ' .. officerIdentifier,
                    badge = officerIdentifier,
                    action = action,
                    player = 'ID: ' .. identifier,
                    cid = identifier,
                    initials = initials,
                    reason = action == 'REMOVED' and 'Monitoring removed.' or 'Monitoring applied.'
                })
            end
            return logsList
        end)() })
    else
        Framework.Notify(source, "Erro ao aplicar tornozeleira (Já existe?).", "error")
    end
end)

RegisterNetEvent('RossMonitoring:RemoveMonitor')
AddEventHandler('RossMonitoring:RemoveMonitor', function(targetId)
    local source = source
    if not HasAccess(source) then return end
    
    local success = Database.RemoveMonitor(targetId, true)
    if success then
        ActiveMonitors[targetId] = nil
        
        local targetSource = Battery.GetSourceFromIdentifier(targetId)
        if targetSource then
            TriggerClientEvent('RossMonitoring:StopMonitoring', targetSource)
            Framework.Notify(targetSource, Config.Lang.monitor_removed, "info")
        end
        
        Framework.Notify(source, Config.Lang.monitor_removed, "success")
        TriggerClientEvent('RossMonitoring:UpdateUI', source, { monitors = (function()
            local monitorsList = {}
            for _, m in pairs(ActiveMonitors) do
                local identifier = m.identifier or m.id
                if identifier then
                    table.insert(monitorsList, {
                        id = tostring(identifier),
                        name = "ID: " .. tostring(identifier),
                        battery = tonumber(m.battery_level) or 100,
                        location = "Active",
                        status = 'Active',
                        priority = 'Low',
                        stability = 100,
                        endTime = m.end_time, -- Envia tempo de término para o Painel da Polícia (UpdateUI)
                        x = 50,
                        y = 50,
                        worldX = m.last_coords and m.last_coords.x or nil,
                        worldY = m.last_coords and m.last_coords.y or nil,
                        worldZ = m.last_coords and m.last_coords.z or nil,
                        avatar = ("https://picsum.photos/seed/%s/100/100"):format(tostring(identifier))
                    })
                end
            end
            return monitorsList
        end)(), logs = (function()
            local rows = Database.GetHistory(200) or {}
            local logsList = {}
            for _, row in ipairs(rows) do
                local identifier = tostring(row.identifier or '')
                local officerIdentifier = row.officer_identifier and tostring(row.officer_identifier) or 'UNKNOWN'
                local appliedAt = tonumber(row.applied_at) or os.time()
                local action = row.removed_at and 'REMOVED' or 'APPLIED'
                local initials = identifier:sub(1, 2):upper()
                table.insert(logsList, {
                    id = row.id,
                    dateTime = os.date('%Y-%m-%d %H:%M:%S', appliedAt),
                    officer = 'ID: ' .. officerIdentifier,
                    badge = officerIdentifier,
                    action = action,
                    player = 'ID: ' .. identifier,
                    cid = identifier,
                    initials = initials,
                    reason = action == 'REMOVED' and 'Monitoring removed.' or 'Monitoring applied.'
                })
            end
            return logsList
        end)() })
    else
        Framework.Notify(source, "Erro ao remover ou não encontrado.", "error")
    end
end)

RegisterNetEvent('RossMonitoring:PlayerLoaded')
AddEventHandler('RossMonitoring:PlayerLoaded', function()
    local source = source
    local identifier = Framework.GetIdentifier(source)
    
    if identifier and ActiveMonitors[identifier] then
        TriggerClientEvent('RossMonitoring:StartMonitoring', source, {
            battery = ActiveMonitors[identifier].battery_level,
            zone = ActiveMonitors[identifier].zone_data,
            endTime = ActiveMonitors[identifier].end_time,
            remainingTime = ActiveMonitors[identifier].end_time - os.time() -- Recalcula tempo restante na reconexão
        })
    end
end)

RegisterNetEvent('RossMonitoring:BuyBattery')
AddEventHandler('RossMonitoring:BuyBattery', function()
    local source = source
    if Framework.RemoveMoney(source, Config.ShopNPC.batteryPrice) then
        Framework.GiveItem(source, "battery_pack", 1)
        Framework.Notify(source, string.format(Config.Lang.bought_item, "Bateria", Config.ShopNPC.batteryPrice), "success")
    else
        Framework.Notify(source, Config.Lang.insufficient_funds, "error")
    end
end)
