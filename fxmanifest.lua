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

fx_version 'cerulean'
lua54 'yes'
game 'gta5'
author 'RossMonitoring'
description 'Sistema de Monitoramento Policial (Tornozeleira Eletrônica)'
version '1.0.0'

shared_scripts {
    '@oxmysql/lib/MySQL.lua', -- Dependência do MariaDB
    'shared/config.lua',
    'shared/utils.lua'
}

server_scripts {
    'server/framework.lua',
    'server/database.lua',
    'server/battery.lua',
    'server/prison.lua',
    'server/main.lua'
}

client_scripts {
    'client/nui.lua',
    'client/prop.lua',
    'client/monitor.lua',
    'client/main.lua'
}

ui_page 'web/index.html'

files {
    'web/index.html',
    'web/assets/**' -- Assumindo estrutura padrão de build React
}

dependencies {
    'oxmysql'
}
