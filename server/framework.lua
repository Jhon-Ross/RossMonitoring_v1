Framework = {}
Framework.Type = nil

local function ensureModule()
    if type(module) == 'function' then return end
    local utils = LoadResourceFile('vrp', 'lib/Utils.lua') or LoadResourceFile('vrp', 'lib/utils.lua')
    if utils then
        local chunk = load(utils, '@vrp/lib/Utils.lua')
        if chunk then chunk() end
    end
end

-- Detect Framework
if GetResourceState('vrp') == 'started' then
    Framework.Type = 'vrp'
    ensureModule()
    local Proxy = module("vrp", "lib/Proxy")
    vRP = Proxy.getInterface("vRP")
elseif GetResourceState('es_extended') == 'started' then
    Framework.Type = 'esx'
    ESX = exports["es_extended"]:getSharedObject()
elseif GetResourceState('qb-core') == 'started' then
    Framework.Type = 'qbcore'
    QBCore = exports['qb-core']:GetCoreObject()
end

print("^2[RossMonitoring] Framework detected: " .. (Framework.Type or "NONE") .. "^0")

function Framework.GetPlayer(source)
    if Framework.Type == 'vrp' then
        return vRP.Passport(source)
    elseif Framework.Type == 'esx' then
        return ESX.GetPlayerFromId(source)
    elseif Framework.Type == 'qbcore' then
        return QBCore.Functions.GetPlayer(source)
    end
    return nil
end

function Framework.GetIdentifier(source)
    if Framework.Type == 'vrp' then
        local passport = vRP.Passport(source)
        return passport and tostring(passport) or nil
    elseif Framework.Type == 'esx' then
        local xPlayer = ESX.GetPlayerFromId(source)
        return xPlayer and xPlayer.identifier or nil
    elseif Framework.Type == 'qbcore' then
        local Player = QBCore.Functions.GetPlayer(source)
        return Player and Player.PlayerData.citizenid or nil
    end
    return nil
end

function Framework.HasPermission(source, perm, level)
    if Framework.Type == 'vrp' then
        local passport = vRP.Passport(source)
        if not passport then return false end
        if vRP.HasPermission(passport, perm, level) then
            return true
        end
        if vRP.HasGroup(passport, perm, level) then
            return true
        end
        return false
    elseif Framework.Type == 'esx' then
        local xPlayer = ESX.GetPlayerFromId(source)
        if xPlayer then
            return xPlayer.job.name == perm or xPlayer.getGroup() == perm
        end
    elseif Framework.Type == 'qbcore' then
        local Player = QBCore.Functions.GetPlayer(source)
        if Player then
            return Player.PlayerData.job.name == perm or QBCore.Functions.HasPermission(source, perm)
        end
    end
    return false
end

function Framework.GetCharacterData(target_id)
    if Framework.Type == 'vrp' then
        local passport = parseInt(target_id)
        
        -- Tentativa 1: Via vRP.Identity (funciona se estiver cacheado/online)
        if vRP and vRP.Identity then
            local identity = vRP.Identity(passport)
            if identity then
                return {
                    name = identity.name .. " " .. identity.name2,
                    age = identity.age
                }
            end
        end

        -- Tentativa 2: Query direta (caso offline ou vRP.Identity falhe)
        -- Tabela 'characters' (padrão Creative/Summerz)
        local p = promise.new()
        -- NOTA: No SQL fornecido, as colunas são: id, name, name2, age. 
        exports.oxmysql:execute('SELECT name, name2, age FROM characters WHERE id = ?', { passport }, function(result)
            p:resolve(result)
        end)
        local result = Citizen.Await(p)
        
        if result and result[1] then
            return {
                name = result[1].name .. " " .. result[1].name2,
                age = result[1].age
            }
        end

    elseif Framework.Type == 'esx' then
        local xPlayer = ESX.GetPlayerFromId(parseInt(target_id))
        if xPlayer then
            return {
                name = xPlayer.getName(),
                age = xPlayer.get('dateofbirth')
            }
        end
    elseif Framework.Type == 'qbcore' then
        local Player = QBCore.Functions.GetPlayer(parseInt(target_id))
        if Player then
            return {
                name = Player.PlayerData.charinfo.firstname .. " " .. Player.PlayerData.charinfo.lastname,
                age = Player.PlayerData.charinfo.birthdate
            }
        end
    end
    return nil
end

function Framework.Notify(source, message, type)
    if Framework.Type == 'vrp' then
        TriggerClientEvent("Notify", source, type, message)
    elseif Framework.Type == 'esx' then
        TriggerClientEvent("esx:showNotification", source, message)
    elseif Framework.Type == 'qbcore' then
        TriggerClientEvent("QBCore:Notify", source, message, type)
    else
        -- Fallback notification
        TriggerClientEvent("chat:addMessage", source, { args = { "SYSTEM", message } })
    end
end

function Framework.GetJob(source)
    if Framework.Type == 'vrp' then
        return "citizen" -- Placeholder as VRP is permission based
    elseif Framework.Type == 'esx' then
        local xPlayer = ESX.GetPlayerFromId(source)
        return xPlayer and xPlayer.job.name or "unemployed"
    elseif Framework.Type == 'qbcore' then
        local Player = QBCore.Functions.GetPlayer(source)
        return Player and Player.PlayerData.job.name or "unemployed"
    end
    return "unknown"
end

function Framework.RemoveMoney(source, amount)
    if Framework.Type == 'vrp' then
        local passport = vRP.Passport(source)
        if not passport then return false end
        return vRP.PaymentMoney(passport, amount)
    elseif Framework.Type == 'esx' then
        local xPlayer = ESX.GetPlayerFromId(source)
        if xPlayer.getMoney() >= amount then
            xPlayer.removeMoney(amount)
            return true
        end
        return false
    elseif Framework.Type == 'qbcore' then
        local Player = QBCore.Functions.GetPlayer(source)
        return Player.Functions.RemoveMoney('cash', amount)
    end
    return false
end

function Framework.GiveItem(source, item, count)
    if Framework.Type == 'vrp' then
        local passport = vRP.Passport(source)
        if not passport then return false end
        vRP.GenerateItem(passport, item, count, true)
        return true
    elseif Framework.Type == 'esx' then
        local xPlayer = ESX.GetPlayerFromId(source)
        xPlayer.addInventoryItem(item, count)
        return true
    elseif Framework.Type == 'qbcore' then
        local Player = QBCore.Functions.GetPlayer(source)
        Player.Functions.AddItem(item, count)
        return true
    end
    return false
end

function Framework.HasItem(source, item, count)
    if Framework.Type == 'vrp' then
        local passport = vRP.Passport(source)
        if not passport then return false end
        return vRP.InventoryItemAmount(passport, item)[1] >= count
    elseif Framework.Type == 'esx' then
        local xPlayer = ESX.GetPlayerFromId(source)
        local itemData = xPlayer.getInventoryItem(item)
        return itemData and itemData.count >= count
    elseif Framework.Type == 'qbcore' then
        local Player = QBCore.Functions.GetPlayer(source)
        local itemData = Player.Functions.GetItemByName(item)
        return itemData and itemData.amount >= count
    end
    return false
end

function Framework.TakeItem(source, item, count)
    if Framework.Type == 'vrp' then
        local passport = vRP.Passport(source)
        if not passport then return false end
        return vRP.TakeItem(passport, item, count, true)
    elseif Framework.Type == 'esx' then
        local xPlayer = ESX.GetPlayerFromId(source)
        if xPlayer.getInventoryItem(item).count >= count then
            xPlayer.removeInventoryItem(item, count)
            return true
        end
    elseif Framework.Type == 'qbcore' then
        local Player = QBCore.Functions.GetPlayer(source)
        return Player.Functions.RemoveItem(item, count)
    end
    return false
end
