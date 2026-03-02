local isOpen = false
local tabletObject = nil
local panelFocused = false

local function loadAnimDict(dict)
    RequestAnimDict(dict)
    while not HasAnimDictLoaded(dict) do
        Wait(10)
    end
end

local function startTabletAnim()
    local ped = PlayerPedId()
    if IsPedInAnyVehicle(ped) or IsPedSwimming(ped) then return end

    loadAnimDict("amb@code_human_in_bus_passenger_idles@female@tablet@base")
    TaskPlayAnim(ped, "amb@code_human_in_bus_passenger_idles@female@tablet@base", "base", 3.0, 3.0, -1, 49, 0, false, false, false)

    local model = GetHashKey("prop_cs_tablet")
    RequestModel(model)
    while not HasModelLoaded(model) do
        Wait(10)
    end

    local coords = GetEntityCoords(ped)
    tabletObject = CreateObject(model, coords.x, coords.y, coords.z, true, true, false)
    SetEntityCollision(tabletObject, false, false)
    AttachEntityToEntity(tabletObject, ped, GetPedBoneIndex(ped, 28422), 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, false, false, false, false, 2, true)
    SetModelAsNoLongerNeeded(model)
end

local function stopTabletAnim()
    local ped = PlayerPedId()
    ClearPedTasks(ped)
    if tabletObject and DoesEntityExist(tabletObject) then
        DetachEntity(tabletObject, true, true)
        DeleteEntity(tabletObject)
        tabletObject = nil
    end
end

local function closePanel()
    if not isOpen then return end
    isOpen = false
    panelFocused = false
    SetNuiFocus(false, false)
    SendNUIMessage({
        action = 'setVisible',
        data = { visible = false }
    })
    stopTabletAnim()
end

RegisterNetEvent('RossMonitoring:OpenUI')
AddEventHandler('RossMonitoring:OpenUI', function()
    isOpen = true
    startTabletAnim()
    SetNuiFocus(true, true)
    panelFocused = true
    SendNUIMessage({
        action = 'setVisible',
        data = { visible = true }
    })
    
    -- Request initial data from server
    TriggerServerEvent('RossMonitoring:RequestData')

    CreateThread(function()
        while isOpen do
            Wait(2000)
            if isOpen then
                TriggerServerEvent('RossMonitoring:RequestData')
            end
        end
    end)
end)

RegisterNUICallback('closeUI', function(data, cb)
    closePanel()
    cb('ok')
end)

CreateThread(function()
    while true do
        if isOpen then
            DisableControlAction(0, 322, true)
            DisableControlAction(0, 200, true)
            if not IsPauseMenuActive() then
                DisableControlAction(0, 14, true)
                DisableControlAction(0, 15, true)
                DisableControlAction(0, 16, true)
                DisableControlAction(0, 17, true)
                DisableControlAction(0, 241, true)
                DisableControlAction(0, 242, true)
            end
            if panelFocused and (IsDisabledControlJustReleased(0, 322) or IsDisabledControlJustReleased(0, 200)) then
                closePanel()
            end
            Wait(0)
        else
            Wait(250)
        end
    end
end)

RegisterNUICallback('applyMonitor', function(data, cb)
    TriggerServerEvent('RossMonitoring:ApplyMonitor', data)
    cb('ok')
end)

RegisterNUICallback('removeMonitor', function(data, cb)
    TriggerServerEvent('RossMonitoring:RemoveMonitor', data.id)
    cb('ok')
end)

RegisterNUICallback('checkPerson', function(data, cb)
    TriggerServerEvent('RossMonitoring:CheckPerson', data.id)
    cb('ok')
end)

RegisterNetEvent('RossMonitoring:ReturnPersonData')
AddEventHandler('RossMonitoring:ReturnPersonData', function(data)
    SendNUIMessage({
        action = 'updatePersonInputs',
        data = data
    })
end)

local function openBaseMap()
    if GetResourceState('pause') == 'started' then
        ExecuteCommand('ActiveMap')
        return
    end
    ActivateFrontendMenu(GetHashKey('FE_MENU_VERSION_MP_PAUSE'), 0, -1)
end

RegisterNUICallback('openBaseMap', function(data, cb)
    SetNuiFocus(false, false)
    panelFocused = false
    openBaseMap()
    cb('ok')
end)

RegisterNUICallback('setWaypoint', function(data, cb)
    local x = tonumber(data.x)
    local y = tonumber(data.y)
    if x and y then
        SetNewWaypoint(x, y)
    end
    if data.openMap then
        SetNuiFocus(false, false)
        panelFocused = false
        openBaseMap()
    end
    cb('ok')
end)

RegisterNUICallback('openTrackingMap', function(data, cb)
    local x = tonumber(data.x)
    local y = tonumber(data.y)

    if x and y then
        SetNewWaypoint(x, y)
    end

    SendNUIMessage({
        action = 'setVisible',
        data = { visible = false }
    })
    SetNuiFocus(false, false)
    panelFocused = false

    openBaseMap()

    CreateThread(function()
        Wait(500)
        while IsPauseMenuActive() do
            Wait(250)
        end

        if GetResourceState('pause') == 'started' then
            ExecuteCommand('PauseBreak')
        end

        SendNUIMessage({
            action = 'setVisible',
            data = { visible = true }
        })
        SetNuiFocus(true, true)
        panelFocused = true
        SetCursorLocation(0.5, 0.5)
    end)

    cb('ok')
end)

RegisterNUICallback('selectZoneFromMap', function(data, cb)
    local radius = tonumber(data.radius) or 100

    SendNUIMessage({
        action = 'setVisible',
        data = { visible = false }
    })
    SetNuiFocus(false, false)
    panelFocused = false
    openBaseMap()

    CreateThread(function()
        local startTime = GetGameTimer()
        while GetGameTimer() - startTime < 60000 do
            local waypointBlip = GetFirstBlipInfoId(8)
            if DoesBlipExist(waypointBlip) then
                local coords = GetBlipInfoIdCoord(waypointBlip)
                if GetResourceState('pause') == 'started' then
                    ExecuteCommand('PauseBreak')
                end
                SendNUIMessage({
                    action = 'setVisible',
                    data = { visible = true }
                })
                SendNUIMessage({
                    action = 'zoneSelected',
                    data = { x = coords.x, y = coords.y, z = coords.z, radius = radius }
                })
                SetNuiFocus(true, true)
                panelFocused = true
                return
            end
            Wait(200)
        end

        if GetResourceState('pause') == 'started' then
            ExecuteCommand('PauseBreak')
        end
        SendNUIMessage({
            action = 'setVisible',
            data = { visible = true }
        })
        SetNuiFocus(true, true)
        panelFocused = true
    end)

    cb('ok')
end)

RegisterNetEvent('RossMonitoring:UpdateUI')
AddEventHandler('RossMonitoring:UpdateUI', function(data)
    SendNUIMessage({
        action = 'updateData',
        data = data
    })
end)
