# 📄 Documento de Requerimientos
## Sistema de Agendamiento de Citas
### Plataforma Profesional – Psicóloga Johana Carolina Villabón

---

## 1. Introducción

Este documento define los **requerimientos funcionales y no funcionales** para el desarrollo de una plataforma web profesional de la Psicóloga **Johana Carolina Villabón**, cuyo objetivo principal es permitir a los pacientes **agendar, gestionar y consultar citas psicológicas** de manera sencilla, segura y accesible, así como proporcionar a la psicóloga un **panel administrativo** para la gestión integral del calendario, citas y contenido del sitio.

La plataforma estará desarrollada como una **aplicación web moderna**, enfocada en **usabilidad, confianza y escalabilidad**, utilizando tecnologías actuales del ecosistema JavaScript.

---

## 2. Alcance del Proyecto

La plataforma incluirá:
- Sitio web público informativo.
- Sistema de agendamiento de citas en línea.
- Portal del paciente.
- Panel administrativo para la psicóloga.

Quedan fuera del alcance (en esta fase):
- Almacenamiento de información clínica detallada.
- Historias psicológicas o diagnósticos.

---

## 3. Tipos de Usuarios

### 3.1 Visitante
Usuario que accede al sitio sin autenticación.

### 3.2 Paciente
Usuario que agenda citas y puede registrarse para gestionar sus citas.

### 3.3 Administrador (Psicóloga)
Usuario con acceso completo al sistema para gestión de agenda, citas y contenido.

---

## 4. Requerimientos Funcionales

### 4.1 Sitio Web Público
- Página de inicio con información profesional.
- Sección de servicios psicológicos.
- Información de contacto.
- Aviso de privacidad y tratamiento de datos.
- Botón visible de **Agendar Cita**.

---

### 4.2 Sistema de Agendamiento de Citas

#### 4.2.1 Agendamiento sin registro obligatorio
- Selección de fecha disponible.
- Visualización de horarios disponibles.
- Formulario de agendamiento con los siguientes campos:
  - Nombre completo
  - Correo electrónico
  - Teléfono
  - Tipo de sesión
- Confirmación visual de la cita.
- Envío de correo electrónico de confirmación al paciente y a la psicóloga.

#### 4.2.2 Reglas de Agendamiento
- No permitir doble reserva en un mismo horario.
- Respetar horarios laborales configurados.
- Bloqueo automático de horarios ocupados.

---

### 4.3 Portal del Paciente

Ruta protegida: `/portal`

Funciones:
- Visualizar próximas citas.
- Ver historial de citas.
- Cancelar citas según políticas establecidas.
- Reagendar citas disponibles.
- Editar información básica del perfil.

---

### 4.4 Panel Administrativo (Psicóloga)

Ruta protegida: `/admin`

#### 4.4.1 Gestión de Calendario
- Configurar días laborales.
- Definir horarios por día.
- Establecer duración de las sesiones.
- Bloquear fechas específicas (vacaciones, festivos, etc.).

#### 4.4.2 Gestión de Citas
- Visualizar agenda diaria y semanal.
- Ver detalles básicos de los pacientes.
- Confirmar, cancelar o reprogramar citas.
- Estados de citas: Pendiente, Confirmada, Cancelada.

#### 4.4.3 Gestión de Contenido
- Editar textos informativos del sitio web.
- Actualizar servicios ofrecidos.
- Modificar información de contacto.

---

## 5. Requerimientos No Funcionales

### 5.1 Usabilidad
- Interfaz clara y amigable.
- Flujo de agendamiento en máximo 3–4 pasos.
- Diseño **mobile-first**.

### 5.2 Seguridad
- Autenticación segura para pacientes y administrador.
- Protección de rutas privadas.
- Manejo responsable de datos personales.
- No almacenamiento de información clínica sensible.

### 5.3 Rendimiento
- Carga rápida de páginas.
- Optimización para SEO.

### 5.4 Escalabilidad
- Arquitectura preparada para agregar pagos en línea.
- Integración futura con Google Calendar o videollamadas.

---

## 6. Requerimientos Técnicos

### 6.1 Tecnologías
- Framework: **Next.js**
- Estilos: Tailwind CSS
- Backend: API Routes (Next.js)
- Base de datos: PostgreSQL (Supabase)
- Autenticación: Supabase Auth
- Hosting: Vercel
- Dominio personalizado

---

## 7. Consideraciones Legales y de Confianza

- Aviso de privacidad visible.
- Consentimiento para tratamiento de datos.
- Comunicación clara y empática.

---

## 8. Fases de Desarrollo

### Fase 1 – MVP
- Sitio público
- Agendamiento de citas
- Panel administrativo básico

### Fase 2
- Portal del paciente
- Reagendamiento
- Roles de usuario

### Fase 3
- Pagos en línea
- Integraciones externas

---

## 9. Aprobación

Este documento sirve como base para el desarrollo del sistema de agendamiento de citas de la plataforma profesional de la Psicóloga **Johana Carolina Villabón**.

