# 🎨 Sistema de Diseño: Pizarritas

> **Fase:** `/spec` (Especificación Visual)
> **Estado:** Validado
> **Última Revisión:** 2026-09-28
> **Aplica a:** Interfaz Web y Canvas WebGL (Three.js)

---

```yaml
# ────────────────────────────────────────────────
# DESIGN TOKENS — Pizarritas Rugby Tactics Board
# ────────────────────────────────────────────────
version: 1.0.0
name: "Pizarritas Tactical Design System"
description: "Estética táctica deportiva de alto rendimiento, combinando un lienzo de césped técnico con paneles HUD oscuros tipo broadcast deportivo profesional."

colors:
  # Elementos del terreno de rugby
  pitch-grass:        "#1B4332"   # Césped verde bosque profundo / técnico
  pitch-lines:        "#F8F9FA"   # Marcado del campo reglamentario (blanco puro)
  pitch-try-zone:     "#143628"   # Zona de ensayo con sutil contraste tonal
  
  # Equipos y entidades
  team-attack:        "#E63946"   # Rojo carmesí de ataque
  team-defense:       "#1D3557"   # Azul marino de defensa
  ball-leather:       "#E9C46A"   # Tono cuero / oro para el balón de rugby
  waypoint-node:      "#48CAE4"   # Cian eléctrico para nodos y vectores de edición
  
  # Interfaz / HUD (Dark Theme)
  primary:            "#0F172A"   # Azul noche muy oscuro (fondo HUD)
  secondary:          "#1E293B"   # Superficie de paneles y modales
  accent:             "#10B981"   # Verde esmeralda de acción (Play / Guardar)
  accent-hover:       "#059669"
  neutral:            "#0B0F17"   # Fondo global de la aplicación
  surface:            "#1E293B"   # Tarjetas y paneles flotantes
  on-primary:         "#FFFFFF"   # Texto sobre primario
  on-surface:         "#E2E8F0"   # Texto principal de lectura
  on-neutral:         "#94A3B8"   # Texto secundario / labels apagados
  error:              "#EF4444"   # Alertas destructivas
  success:            "#10B981"   # Confirmaciones
  warning:            "#F59E0B"   # Advertencias

dark:
  neutral:            "#0B0F17"
  surface:            "#1E293B"
  on-surface:         "#F1F5F9"
  on-neutral:         "#94A3B8"

typography:
  heading:
    fontFamily:       "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize:         1.5rem
    fontWeight:       700
    letterSpacing:    "-0.02em"
  subheading:
    fontFamily:       "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize:         1.125rem
    fontWeight:       600
  body:
    fontFamily:       "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize:         0.875rem
    fontWeight:       400
    lineHeight:       1.5
  mono:
    fontFamily:       "'JetBrains Mono', 'Fira Code', monospace"
    fontSize:         0.8125rem
    fontWeight:       500

rounded:
  sm:                 4px
  md:                 8px
  lg:                 12px
  full:               9999px

spacing:
  xs:                 4px
  sm:                 8px
  md:                 16px
  lg:                 24px
```

---

## 🏉 Identidad Visual y Filosofía

La interfaz de **Pizarritas** combina la claridad analítica de una pizarra táctica de pizarra y rotulador con la precisión de un software técnico de retransmisión deportiva (estilo *Sky Sports Tactics* o *Hudl*). 

- **El lienzo (Pitch):** El terreno de rugby utiliza una proyección ortográfica cenital con un tono verde técnico `#1B4332` que elimina la fatiga visual sin desvirtuar el marcado reglamentario blanco.
- **Las entidades:** Los jugadores se representan como fichas tácticas circulares con reborde reforzado, dorsales tipográficos de alto contraste y código cromático inequívoco para diferenciar atacantes (`#E63946`), defensores (`#1D3557`) y balón (`#E9C46A`).
- **Controles HUD Flotantes:** Barras de herramientas translúcidas con *glassmorphism* moderno (`backdrop-filter: blur(12px)`), que maximizan el área visible del campo táctico.
