Config = {}

-- Configurações Gerais
Config.Debug = false -- Ativa logs de debug no console
Config.CheckInterval = 5000 -- Intervalo de verificação de zona (ms)
Config.BatteryDrainInterval = 18000 -- Intervalo de drenagem da bateria (ms) - 18s para 100% em 30min
Config.BatteryDrainAmount = 1 -- Quantidade de bateria drenada por intervalo
Config.PrisonOnBatteryZero = true -- Se true, o jogador é enviado para a prisão quando a bateria acaba

-- Sistema de Prisão Automática
Config.AutoPrison = true -- Se true, teleporta automaticamente para a prisão após sair da zona
Config.PrisonCoords = vector3(1679.0, 2513.0, 45.5) -- Coordenadas da prisão (exemplo: Prisão de Bolingbroke)
Config.MaxOutOfZoneTime = 5 -- Tempo máximo fora da zona em minutos antes da prisão automática

-- Permissões
Config.AllowedGroups = {
    { perm = "Policia" },
    { perm = "Admin", level = 2 }
}

-- Regras de Remoção
Config.OnlyPoliceCanRemove = true -- Se true, apenas policiais podem remover a tornozeleira manualmente
-- Se false, a tornozeleira é removida automaticamente quando o tempo expira

-- NPC Vendedor
Config.ShopNPC = {
    enabled = true,
    coords = vector4(441.0, -981.0, 30.7, 90.0), -- Exemplo: Delegacia Mission Row
    model = "s_m_y_cop_01",
    braceletPrice = 5000,
    batteryPrice = 1000
}

-- Configurações do Prop
Config.PropModel = "p_ld_sock_01" -- Modelo do prop da tornozeleira (exemplo, ajustar conforme necessário)
Config.PropBone = 14201 -- Osso do tornozelo esquerdo (SKEL_L_Foot)
Config.PropOffset = {
    pos = vector3(0.0, 0.0, 0.0),
    rot = vector3(0.0, 0.0, 0.0)
}

-- Textos e Mensagens
Config.Lang = {
    prefix = "[MONITORAMENTO]",
    battery_low = "Bateria da tornozeleira fraca! Procure uma delegacia.",
    battery_critical = "Bateria CRÍTICA! A polícia será notificada.",
    out_of_zone = "VOCÊ SAIU DA ZONA PERMITIDA! Retorne imediatamente ou será preso.",
    returned_to_zone = "Você retornou à zona permitida.",
    prison_sent = "Você foi enviado para a prisão por violar a zona de monitoramento.",
    monitor_applied = "Tornozeleira aplicada com sucesso.",
    monitor_removed = "Tornozeleira removida com sucesso.",
    no_permission = "Você não tem permissão para isso.",
    player_not_found = "Jogador não encontrado.",
    already_monitored = "Este jogador já possui uma tornozeleira.",
    not_monitored = "Este jogador não possui uma tornozeleira.",
    battery_recharged = "Bateria recarregada com sucesso.",
    insufficient_funds = "Dinheiro insuficiente.",
    bought_item = "Você comprou %s por $%s."
}
