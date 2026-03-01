Prison = {}

function Prison.Imprison(source, reason)
    if not Config.AutoPrison then return end
    
    local ped = GetPlayerPed(source)
    if DoesEntityExist(ped) then
        SetEntityCoords(ped, Config.PrisonCoords.x, Config.PrisonCoords.y, Config.PrisonCoords.z, false, false, false, false)
        Framework.Notify(source, Config.Lang.prison_sent .. " (" .. reason .. ")", "error")
        -- Add prison logic here (e.g. set jail time via framework if needed)
        -- For now just teleport
    end
end

function Prison.CheckViolation(source, identifier)
    -- This function will be called when a player is out of zone for too long
    Prison.Imprison(source, "Violação de Perímetro")
    -- Log violation in database
    -- TODO: Add violation logging
end
