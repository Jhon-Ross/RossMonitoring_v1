# R.P.M.S — ROSS Police Monitoring System (RossMonitoring_v1)

Sistema de monitoramento policial com tornozeleira eletrônica para FiveM, com zona permitida, bateria, HUD e painel NUI (tablet) para gestão e rastreio.

## Visão geral

O **R.P.M.S** permite aplicar uma tornozeleira em um jogador, definir uma **zona permitida** (ex.: círculo), acompanhar **status/bateria/tempo** no HUD e administrar tudo por um **painel NUI**. O sistema registra informações em banco de dados (MySQL/MariaDB via **oxmysql**) para persistência e auditoria.

## Principais recursos

- Tornozeleira eletrônica com **HUD** (bateria, tempo restante e status de zona).
- **Zona permitida** com marcador visual (círculo) e status “na zona / fora da zona”.
- **Bateria** com drenagem configurável e regras (ex.: ações ao zerar).
- **Prisão automática** configurável após violar a zona por tempo limite.
- **Painel NUI (tablet)** para aplicar/remover/consultar monitoramento e rastrear último local.
- **NPC vendedor** (opcional) para comprar tornozeleira e bateria (teclas configuradas no client).
- Banco de dados com tabelas para **ativos, histórico, eventos, oficiais e configurações**.
- Compatibilidade de load do player para **vRP / ESX / QBCore** (gatilhos de “player loaded” no client).

## Requisitos

- **oxmysql** (obrigatório)
- MySQL/MariaDB
- Artefatos do FiveM com suporte a **Lua 5.4**

## Instalação

1. Coloque a pasta `RossMonitoring_v1` em:
   - `resources/[scripts]/RossMonitoring_v1`
2. Importe o SQL no seu banco:
   - `sql/rossmonitoring_schema.sql`
3. Garanta que o `oxmysql` inicie antes do script no seu `server.cfg`:

```cfg
ensure oxmysql
ensure RossMonitoring_v1
```

4. Ajuste as configurações em:
   - `shared/config.lua`

## Configuração (shared/config.lua)

Arquivo: [config.lua](file:///c:/Users/Jhon%20Ross/Desktop/Base_HidenSP_v2/resources/[scripts]/RossMonitoring_v1/shared/config.lua)

| Chave | Padrão | Descrição |
|------|--------|-----------|
| `Config.Debug` | `false` | Ativa logs de debug |
| `Config.CheckInterval` | `5000` | Intervalo de verificação de zona (ms) |
| `Config.BatteryDrainInterval` | `18000` | Intervalo de drenagem de bateria (ms) |
| `Config.BatteryDrainAmount` | `1` | Quanto drena por intervalo |
| `Config.PrisonOnBatteryZero` | `true` | Envia à prisão ao zerar bateria |
| `Config.AutoPrison` | `true` | Ativa prisão automática por violar zona |
| `Config.PrisonCoords` | `vector3(...)` | Coordenadas da prisão |
| `Config.MaxOutOfZoneTime` | `5` | Minutos fora da zona até prisão |
| `Config.AllowedGroups` | Policia/Admin | Grupos com acesso ao painel/ações |
| `Config.OnlyPoliceCanRemove` | `true` | Só policiais removem manualmente |
| `Config.ShopNPC.enabled` | `true` | Ativa NPC vendedor |
| `Config.ShopNPC.coords/model` | Mission Row | Local e modelo do NPC |
| `Config.ShopNPC.braceletPrice` | `5000` | Preço da tornozeleira |
| `Config.ShopNPC.batteryPrice` | `1000` | Preço da bateria |
| `Config.PropModel/Bone/Offset` | `p_ld_sock_01` | Prop preso ao pé do player |
| `Config.Lang.*` | PT-BR | Textos/avisos do sistema |

## Uso

### Painel (NUI / tablet)

O painel NUI é aberto via evento client:

- `RossMonitoring:OpenUI`

Se você quiser integrar com seu menu/command, basta disparar o evento no player (server-side), por exemplo:

```lua
TriggerClientEvent('RossMonitoring:OpenUI', source)
```

O front-end (NUI) já está compilado em `web/` e é carregado via `ui_page` no manifest.

### NPC vendedor

Quando `Config.ShopNPC.enabled = true`, um NPC é criado no local configurado. Perto dele (distância ~2.0):

- `E` compra **bateria**
- `G` compra **tornozeleira**

Os preços vêm de `Config.ShopNPC.batteryPrice` e `Config.ShopNPC.braceletPrice`.

### HUD / marcador de zona

Quando um jogador está monitorado, o client exibe:

- Bateria (ex.: `Tornozeleira: 87%`)
- Tempo restante (quando aplicável)
- Status da zona (`Na Zona` / `FORA DA ZONA!`)
- Marcador visual (círculo) quando a zona é do tipo `circle`

### Comando útil

- `/checkmonitor` — força ressincronização do monitoramento (útil para debug/fallback).

## Banco de dados

Arquivo: [rossmonitoring_schema.sql](file:///c:/Users/Jhon%20Ross/Desktop/Base_HidenSP_v2/resources/[scripts]/RossMonitoring_v1/sql/rossmonitoring_schema.sql)

Tabelas principais:

- `monitoring_active` — monitoramentos em andamento (zona, bateria, status, último local)
- `monitoring_history` — histórico/auditoria (aplicado/removido/violações)
- `monitoring_events` — eventos detalhados por tipo (snapshot de zona/detalhes)
- `monitoring_officers` — cadastro de oficiais (opcional)
- `monitoring_settings` — chave/valor para configurações persistentes (opcional)

## Estrutura do resource

- `client/` — HUD, NUI, prop e lógica de interface
- `server/` — persistência, regras, integração com framework e punições
- `shared/` — config e utilitários
- `web/` — NUI compilada (assets)
- `sql/` — schema do banco

## Troubleshooting

- NUI não abre:
  - Verifique `ensure oxmysql` antes do resource.
  - Confirme se `web/index.html` e `web/assets/**` estão presentes.
  - Confirme permissões em `Config.AllowedGroups`.
- HUD some:
  - Use `/checkmonitor` para ressincronizar.

## Licença

Veja o arquivo [LICENSE](file:///c:/Users/Jhon%20Ross/Desktop/Base_HidenSP_v2/resources/[scripts]/RossMonitoring_v1/LICENSE).

