local attachedProp = nil

function AttachProp()
    if attachedProp then return end

    local ped = PlayerPedId()
    local model = GetHashKey(Config.PropModel)

    RequestModel(model)
    while not HasModelLoaded(model) do
        Wait(10)
    end

    local bone = GetPedBoneIndex(ped, Config.PropBone)
    attachedProp = CreateObject(model, 0.0, 0.0, 0.0, true, true, true)
    
    AttachEntityToEntity(attachedProp, ped, bone, 
        Config.PropOffset.pos.x, Config.PropOffset.pos.y, Config.PropOffset.pos.z, 
        Config.PropOffset.rot.x, Config.PropOffset.rot.y, Config.PropOffset.rot.z, 
        true, true, false, true, 1, true)
    
    SetModelAsNoLongerNeeded(model)
end

function RemoveProp()
    if attachedProp then
        DeleteEntity(attachedProp)
        attachedProp = nil
    end
end

RegisterNetEvent('RossMonitoring:SetProp')
AddEventHandler('RossMonitoring:SetProp', function(enable)
    if enable then
        AttachProp()
    else
        RemoveProp()
    end
end)
