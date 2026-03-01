Database = {}

-- Create tables if they don't exist
CreateThread(function()
    MySQL.query.await([[
        CREATE TABLE IF NOT EXISTS monitoring_active (
            id INT AUTO_INCREMENT PRIMARY KEY,
            identifier VARCHAR(50) NOT NULL UNIQUE,
            start_time BIGINT NOT NULL,
            end_time BIGINT NOT NULL,
            zone_data LONGTEXT NOT NULL,
            battery_level INT DEFAULT 100,
            status VARCHAR(20) DEFAULT 'active'
        )
    ]])

    MySQL.query.await([[
        CREATE TABLE IF NOT EXISTS monitoring_history (
            id INT AUTO_INCREMENT PRIMARY KEY,
            identifier VARCHAR(50) NOT NULL,
            officer_identifier VARCHAR(50),
            applied_at BIGINT NOT NULL,
            removed_at BIGINT,
            violations_count INT DEFAULT 0,
            completed BOOLEAN DEFAULT FALSE
        )
    ]])
end)

function Database.AddMonitor(identifier, startTime, endTime, zoneData, officerId)
    MySQL.update.await('UPDATE monitoring_history SET removed_at = ?, completed = ? WHERE identifier = ? AND removed_at IS NULL', {
        startTime, true, identifier
    })

    local result = MySQL.query.await([[
        INSERT INTO monitoring_active (identifier, start_time, end_time, zone_data, battery_level, status)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            start_time = VALUES(start_time),
            end_time = VALUES(end_time),
            zone_data = VALUES(zone_data),
            battery_level = VALUES(battery_level),
            status = VALUES(status)
    ]], {
        identifier, startTime, endTime, json.encode(zoneData), 100, 'active'
    })

    if result then
        MySQL.insert.await('INSERT INTO monitoring_history (identifier, officer_identifier, applied_at, violations_count, completed) VALUES (?, ?, ?, ?, ?)', {
            identifier, officerId, startTime, 0, false
        })
        return true
    end

    return false
end

function Database.RemoveMonitor(identifier, completed)
    local active = MySQL.single.await('SELECT * FROM monitoring_active WHERE identifier = ?', { identifier })
    if active then
        MySQL.query.await('DELETE FROM monitoring_active WHERE identifier = ?', { identifier })
        MySQL.update.await('UPDATE monitoring_history SET removed_at = ?, completed = ? WHERE identifier = ? AND removed_at IS NULL', {
            os.time(), completed, identifier
        })
        return true
    end
    return false
end

function Database.GetActiveMonitors()
    return MySQL.query.await('SELECT * FROM monitoring_active')
end

function Database.GetHistory(limit)
    local safeLimit = tonumber(limit) or 200
    safeLimit = math.max(1, math.min(1000, safeLimit))
    return MySQL.query.await(('SELECT * FROM monitoring_history ORDER BY applied_at DESC LIMIT %d'):format(safeLimit))
end

function Database.UpdateBattery(identifier, level)
    return MySQL.update.await('UPDATE monitoring_active SET battery_level = ? WHERE identifier = ?', { level, identifier })
end

function Database.GetMonitor(identifier)
    return MySQL.single.await('SELECT * FROM monitoring_active WHERE identifier = ?', { identifier })
end

function Database.UpdateZone(identifier, zoneData)
    return MySQL.update.await('UPDATE monitoring_active SET zone_data = ? WHERE identifier = ?', { json.encode(zoneData), identifier })
end
