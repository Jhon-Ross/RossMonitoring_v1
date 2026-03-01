CreateThread(function()
    while not NetworkIsSessionStarted() do
        Wait(100)
    end
    TriggerServerEvent('RossMonitoring:PlayerLoaded')
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
