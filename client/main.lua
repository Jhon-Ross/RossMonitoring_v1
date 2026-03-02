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

CreateThread(function()
    while not NetworkIsSessionStarted() do
        Wait(100)
    end
    Wait(2000) -- Delay para garantir que o framework carregou
    TriggerServerEvent('RossMonitoring:PlayerLoaded')
end)

RegisterNetEvent('QBCore:Client:OnPlayerLoaded')
AddEventHandler('QBCore:Client:OnPlayerLoaded', function()
    Wait(2000)
    TriggerServerEvent('RossMonitoring:PlayerLoaded')
end)

RegisterNetEvent('esx:playerLoaded')
AddEventHandler('esx:playerLoaded', function(xPlayer)
    Wait(2000)
    TriggerServerEvent('RossMonitoring:PlayerLoaded')
end)

RegisterNetEvent('vrp:playerSpawned')
AddEventHandler('vrp:playerSpawned', function()
    Wait(2000)
    TriggerServerEvent('RossMonitoring:PlayerLoaded')
end)

AddEventHandler('onResourceStart', function(resourceName)
    if (GetCurrentResourceName() ~= resourceName) then
      return
    end
    -- Pequeno delay para garantir que o server carregou
    Wait(1000)
    TriggerServerEvent('RossMonitoring:PlayerLoaded')
end)

-- Loop de verificação periódica (Fallback)
-- Garante que se o HUD sumir, ele tenta recuperar a cada 10 segundos
CreateThread(function()
    while true do
        Wait(10000)
        TriggerServerEvent('RossMonitoring:PlayerLoaded')
    end
end)

RegisterNetEvent('RossMonitoring:PlayInstallAnim')
AddEventHandler('RossMonitoring:PlayInstallAnim', function()
    local ped = PlayerPedId()
    local animDict = "anim@amb@clubhouse@tutorial@bkr_tut_ig3@"
    local animName = "machinic_loop_mechandplayer"

    RequestAnimDict(animDict)
    while not HasAnimDictLoaded(animDict) do
        Wait(10)
    end

    -- Duração de 30 segundos
    local duration = 30000 
    local startTime = GetGameTimer()

    TaskPlayAnim(ped, animDict, animName, 8.0, -8.0, duration, 1, 0, false, false, false)

    -- Loop para bloquear controles e permitir cancelamento com F6
    CreateThread(function()
        while (GetGameTimer() - startTime) < duration do
            -- Bloquear ESC (200, 322) e outros movimentos
            DisableControlAction(0, 200, true) -- ESC
            DisableControlAction(0, 322, true) -- ESC
            DisableControlAction(0, 30, true) -- Move L/R
            DisableControlAction(0, 31, true) -- Move U/D
            
            -- Permitir cancelar com F6 (167)
            if IsControlJustPressed(0, 167) then
                ClearPedTasks(ped)
                break
            end
            
            -- Manter a animação rodando se for interrompida por colisão, etc.
            if not IsEntityPlayingAnim(ped, animDict, animName, 3) then
                TaskPlayAnim(ped, animDict, animName, 8.0, -8.0, (duration - (GetGameTimer() - startTime)), 1, 0, false, false, false)
            end

            Wait(0)
        end
    end)
end)

-- Comando manual para forçar recarregamento (Debug)
RegisterCommand('checkmonitor', function()
    TriggerServerEvent('RossMonitoring:PlayerLoaded')
    TriggerEvent('RossMonitoring:Notify', 'info', 'Sincronizando monitoramento...')
end)

RegisterNetEvent('RossMonitoring:Notify')
AddEventHandler('RossMonitoring:Notify', function(type, message)
    -- Framework agnostic notification logic can go here if needed,
    -- but server usually sends direct framework events.
    -- This is a fallback or custom UI notify.
    SetNotificationTextEntry("STRING")
    AddTextComponentString(message)
    DrawNotification(false, false)
end)

-- NPC Logic
if Config.ShopNPC.enabled then
    CreateThread(function()
        local model = GetHashKey(Config.ShopNPC.model)
        RequestModel(model)
        while not HasModelLoaded(model) do
            Wait(10)
        end

        local ped = CreatePed(4, model, Config.ShopNPC.coords.x, Config.ShopNPC.coords.y, Config.ShopNPC.coords.z, Config.ShopNPC.coords.w, false, true)
        SetEntityInvincible(ped, true)
        SetBlockingOfNonTemporaryEvents(ped, true)
        FreezeEntityPosition(ped, true)
        
        -- Interaction loop (simple distance check)
        while true do
            local sleep = 1000
            local playerPed = PlayerPedId()
            local coords = GetEntityCoords(playerPed)
            local dist = #(coords - vector3(Config.ShopNPC.coords.x, Config.ShopNPC.coords.y, Config.ShopNPC.coords.z))

            if dist < 2.0 then
                sleep = 5
                SetTextComponentFormat("STRING")
                AddTextComponentString("Pressione ~INPUT_CONTEXT~ para comprar bateria ($" .. Config.ShopNPC.batteryPrice .. ")")
                DisplayHelpTextFromStringLabel(0, 0, 1, -1)

                if IsControlJustPressed(0, 38) then
                    TriggerServerEvent('RossMonitoring:BuyBattery')
                end
            end
            Wait(sleep)
        end
    end)
end
