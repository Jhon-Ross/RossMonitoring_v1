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
