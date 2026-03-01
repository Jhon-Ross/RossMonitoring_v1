# R.P.M.S - ROSS Police Monitoring System v1

## Especificação Técnica para IDE

------------------------------------------------------------------------

## 🧠 CONTEXTO DO PROJETO

Este é um sistema profissional de monitoramento por tornozeleira
eletrônica para FiveM, desenvolvido inicialmente para **VRP
(Creative)**, mas arquitetado para futura compatibilidade com **ESX,
QBCore e outras frameworks**, utilizando uma camada de abstração
(Bridge).

O sistema deve ser modular, escalável, seguro e pronto para
comercialização.

------------------------------------------------------------------------

# 🎯 OBJETIVO

Desenvolver um sistema completo de tornozeleira eletrônica com:

-   Persistência em MariaDB
-   Sistema de bateria em tempo real (server-side)
-   Registro de violações
-   Prop visual anexado ao tornozelo do jogador
-   NUI em React (já existente)
-   NPC vendedor configurável
-   Sistema de permissões via config
-   Teleporte automático opcional para prisão
-   Arquitetura modular

------------------------------------------------------------------------

# 📁 ESTRUTURA OBRIGATÓRIA

RossMonitoring_v1/

client/ - main.lua - monitor.lua - nui.lua - prop.lua

server/ - main.lua - framework.lua - database.lua - battery.lua -
prison.lua

shared/ - config.lua - utils.lua

web/ (NUI React já existente)

fxmanifest.lua

------------------------------------------------------------------------

# 🧩 REQUISITOS DE ARQUITETURA

## 1️⃣ FRAMEWORK BRIDGE (server/framework.lua)

Deve:

-   Detectar automaticamente VRP
-   Estar preparado para ESX e QBCore
-   Nunca utilizar funções diretas da framework fora da bridge
-   Fornecer métodos de abstração:

Framework.GetPlayer(source) Framework.GetIdentifier(source)
Framework.HasPermission(source, perm) Framework.Notify(source, message,
type) Framework.GetJob(source)

Toda a lógica do sistema deve utilizar essas abstrações.

------------------------------------------------------------------------

# 🗄️ BANCO DE DADOS (MariaDB)

Criar tabelas:

## monitoring_active

-   id
-   identifier
-   start_time
-   end_time
-   zone_data (json)
-   battery_level
-   status

## monitoring_history

-   id
-   identifier
-   officer_identifier
-   applied_at
-   removed_at
-   violations_count
-   completed (boolean)

Requisitos:

Se o jogador desconectar e reconectar, deve restaurar:

-   Tornozeleira ativa
-   Tempo restante
-   Bateria restante
-   Zona ativa

------------------------------------------------------------------------

# 🔋 SISTEMA DE BATERIA

- 100% controlado pelo servidor
- Diminui em tempo real (baseado em timestamp server-side)
- Item utilizável reinicia o nível da bateria (validação no servidor)
- Notificação AMARELA = bateria fraca
- Notificação VERDE = bateria recarregada
- O client apenas exibe informações
- Toda lógica, tempo e validação devem ocorrer exclusivamente no servidor

------------------------------------------------------------------------

# 📍 SISTEMA DE ZONA

O painel React já possui um mapa.

O sistema deve:

1.  Ler e entender a implementação atual do mapa no React
2.  Tentar integrar com o mapa da base VRP, se possível
3.  Substituir o mapa atual do painel pela integração com o mapa da
    base, se viável

A zona deve ser armazenada em JSON no banco.

Se o jogador sair da zona:

-   Iniciar contador de 5 minutos (server-side)
-   Enviar notificação vermelha piscando
-   Notificar policiais no painel
-   Se não retornar:
    -   Executar ação conforme Config.AutoPrison

Se retornar: - Cancelar contador - Registrar tentativa de violação

------------------------------------------------------------------------

# 🚔 SISTEMA DE PRISÃO

No shared/config.lua:

Config.AutoPrison = true Config.PrisonCoords = vector3(...)

Se true: - Teleportar automaticamente após 5 minutos fora da zona

Se false: - Apenas notificar policiais - Apreensão manual necessária

------------------------------------------------------------------------

# 👮 PERMISSÕES

Via config:

Config.AllowedGroups = { "police", "admin" }

Validação obrigatória via framework bridge.

------------------------------------------------------------------------

# 👟 PROP DA TORNOZELEIRA

- Usar prop existente do GTA se disponível
- Caso não exista, preparar suporte para modelo customizado
- Anexar no osso do tornozelo do jogador
- A remoção da tornozeleira deve seguir regra configurável via config

No shared/config.lua:

Config.OnlyPoliceCanRemove = true

Se true:
- Apenas policiais com permissão podem remover manualmente
- Mesmo após o período terminar, a tornozeleira permanece até remoção manual

Se false:
- O sistema remove automaticamente ao finalizar o período

IMPORTANTE:
- A validação de remoção deve ocorrer exclusivamente no servidor
- Nunca permitir remoção via evento client-side

------------------------------------------------------------------------

# 🧑‍💼 NPC VENDEDOR

Configurável em config.lua:

Config.ShopNPC = { coords = vector4(...), model = "s_m\_y_cop_01",
braceletPrice = 5000, batteryPrice = 1000 }

O NPC deve:

-   Ser invencível
-   Permanecer parado
-   Abrir menu ao interagir

------------------------------------------------------------------------

# 🔒 REQUISITOS DE SEGURANÇA

-   Nunca confiar no client
-   Todas validações devem ocorrer no servidor
-   Implementar verificações anti-exploit
-   Validar existência da tornozeleira antes de ações
-   Validar permissões no servidor
-   Validar distância da zona no servidor
-   Nunca permitir evento client para remover tornozeleira

------------------------------------------------------------------------

# ⚡ REGRAS DE PERFORMANCE

-   Não usar loops while true pesados
-   Utilizar timers inteligentes
-   Monitorar apenas jogadores com tornozeleira ativa
-   Otimizar checagem de zona

------------------------------------------------------------------------

# 🧩 NUI (React)

-   Utilizar RegisterNUICallback
-   Utilizar SendNUIMessage
-   Comunicação estruturada
-   NUI apenas exibe dados vindos do servidor
-   Nenhuma lógica crítica deve ficar no React

------------------------------------------------------------------------

# 📌 COMANDO

/tornozeleira

Abrir apenas se o jogador possuir permissão.

------------------------------------------------------------------------

# 🎯 REGRA DE DESENVOLVIMENTO

Antes de implementar qualquer funcionalidade:

1.  Avaliar viabilidade técnica
2.  Se não for viável, explicar o motivo
3.  Sugerir alternativa
4.  Só então implementar

------------------------------------------------------------------------

# 🔥 PADRÃO DE CÓDIGO

-   Código limpo
-   Comentado
-   Modular
-   Escalável
-   Pronto para comercialização
-   Preparado para v2

------------------------------------------------------------------------

FIM DA ESPECIFICAÇÃO
