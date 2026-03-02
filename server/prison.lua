Prison = {}

function Prison.Imprison(source, reason)
    local ped = GetPlayerPed(source)
    if DoesEntityExist(ped) then
        local coords = GetEntityCoords(ped)
        local dist = #(coords - Config.PrisonCoords)
        
        -- Se já estiver na prisão (raio de 100m), não teletransporta novamente
        if dist < 100.0 then
            return
        end

        SetEntityCoords(ped, Config.PrisonCoords.x, Config.PrisonCoords.y, Config.PrisonCoords.z, false, false, false, false)
        
        -- Se não for apenas uma verificação de rotina (distância > 100m), notifica
        Framework.Notify(source, Config.Lang.prison_sent .. " (" .. reason .. ")", "error")
    end
end

function Prison.CheckViolation(source, identifier, reason)
    reason = reason or "Violação de Perímetro"
    
    -- Verifica configuração baseada no motivo
    if reason == "Violação de Perímetro" and not Config.AutoPrison then
        return
    end

    Prison.Imprison(source, reason)
    -- Log violation in database
    -- TODO: Add violation logging
end
