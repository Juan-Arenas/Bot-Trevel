// =============================
// 🌐 IMPORTS
// =============================
import { 
  Client, 
  GatewayIntentBits, 
  Partials, 
  EmbedBuilder,
  PermissionsBitField, 
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} from "discord.js";
import dotenv from "dotenv";
dotenv.config();

// =============================
// ⚙️ CONFIGURACIÓN DE CANALES Y ROLES
// =============================
const CANAL_COMANDOS = "1425273466499760200"; 
const CANALES_TREVEL_DETECTOR = [
    "1425273466499760200", 
    "1371756835404517418", 
    "1371756848839135272", 
];
const CANAL_BIENVENIDA = "1371756835404517418"; 

// 🚨 CONFIGURACIÓN DEL SISTEMA DE TICKETS 🚨
const CANAL_PANEL_TICKETS = "1371756921698390067"; 
const CATEGORIA_TICKETS = "1371756634883489922";   
const CANAL_TICKET_LOGS = "1426883129510985729"; 

// =========================================================================
// ⚠️ IDs de Roles de Staff (¡Configuración Personalizada del Usuario!)
// =========================================================================

// 1. Roles con Acceso TOTAL (VERA TODO)
const ROL_ADMIN_FULL_ACCESS_IDS = [
    '1371756612330455130', '1371756615836897310', '1371756619263643739', 
    '1424909730635190302', '1371756634262474842', '1371756654156320778' // DUEÑO
];

// 2. Roles de Moderación BASE (Ven General, Jugador/Bug, Staff, Soporte. Excluyen Facc, Compras, Cuentas, Pérdidas IC)
const ROL_MODERACION_BASE_IDS = [
    '1371756677174399017', '1371756680706265128', '1371756684078354442', 
    '1371756697504452628', '1371756705162989579', '1371756708564832308', 
    '1371756711144063057', '1371756714118090783', '1371756718803128320', 
    '1371756723702071296', '1371756729943064646', '1371756736507023380', 
    '1371756742630703154', '1371756749887111279', '1371756776504033331', 
    '1371756786822025327', '1371756792148791316'
];

// 3. Roles con Acceso Especializado
const ROL_ENCARGADO_GENERAL_ID      = '1371756657880862821'; 
const ROL_ENCARGADO_STAFF_ID        = '1371756664943939605'; 
const ROL_ENCARGADO_FACCIONES_ID    = '1371756668630732800'; 
const ROL_FACCIONES_EXTRA_IDS = [   
    '1371756694862037072', '1371756699974631484'
];
const ROL_COMPRAS_ID                = '1371756686729150504'; 

// =========================================================================
// CONSTRUCCIÓN DE GRUPOS DE ACCESO POR TICKET
// =========================================================================

const MODERACION_ACCESS = [
    ...ROL_ADMIN_FULL_ACCESS_IDS, 
    ...ROL_MODERACION_BASE_IDS,
    ROL_ENCARGADO_GENERAL_ID,
    ROL_ENCARGADO_STAFF_ID,
    ...ROL_FACCIONES_EXTRA_IDS, 
    ROL_COMPRAS_ID             
];

const BASE_TICKET_ROLES = [ ...new Set(MODERACION_ACCESS) ];

const STAFF_REPORTE_ROLES = [ ...ROL_ADMIN_FULL_ACCESS_IDS ];

const FACCION_REPORTE_ROLES = [ 
    ...BASE_TICKET_ROLES.filter(id => id !== ROL_ENCARGADO_STAFF_ID),
    ROL_ENCARGADO_FACCIONES_ID, 
    ...ROL_FACCIONES_EXTRA_IDS
];

const PERDIDAS_IC_ROLES = [ 
    ...ROL_ADMIN_FULL_ACCESS_IDS,
    ROL_ENCARGADO_GENERAL_ID,
    ROL_ENCARGADO_STAFF_ID 
];

const COMPRAS_OCC_ROLES = [ 
    ...ROL_ADMIN_FULL_ACCESS_IDS,
    ROL_ENCARGADO_GENERAL_ID,
    ROL_COMPRAS_ID
];

const CUENTA_PROBLEMAS_ROLES = [ ...ROL_ADMIN_FULL_ACCESS_IDS ];


// =========================================================================
// DEFINICIÓN FINAL DE TICKETS
// =========================================================================
const TICKET_OPTIONS = [
    {
        id: "TICKET_GENERAL",
        label: "🎫 Ticket General",
        style: ButtonStyle.Primary,
        emoji: "🎫",
        color: "#3498DB", 
        title: "🎫 Ticket General",
        description: "Preguntas generales, dudas de sistemas, o asuntos que no son un reporte ni soporte técnico.",
        staffRoleIds: BASE_TICKET_ROLES, 
        staffMentions: [`<@&${ROL_ADMIN_FULL_ACCESS_IDS[0]}>`, `<@&${ROL_MODERACION_BASE_IDS[0]}>`],
    },
    {
        id: "TICKET_REPORTE_JUGADOR", 
        label: "🚨 Reportar Jugador",
        style: ButtonStyle.Danger,
        emoji: "🚨",
        color: "#E74C3C", 
        title: "🚨 Reporte de Usuario",
        description: "Usa este ticket para reportar a un jugador que incumple normas del servidor.",
        staffRoleIds: BASE_TICKET_ROLES,
        staffMentions: [`<@&${ROL_ADMIN_FULL_ACCESS_IDS[0]}>`, `<@&${ROL_MODERACION_BASE_IDS[0]}>`],
    },
    {
        id: "TICKET_REPORTE_FACCION", 
        label: "🔫 Reportar Facción",
        style: ButtonStyle.Danger,
        emoji: "🔫",
        color: "#95A5A6", 
        title: "🔫 Reporte de Facción (Legal/Ilegal)",
        description: "Incumplimiento de normas por parte de una facción oficial (legal o ilegal). Asunto de moderación.",
        staffRoleIds: FACCION_REPORTE_ROLES,
        staffMentions: [`<@&${ROL_ENCARGADO_FACCIONES_ID}>`],
    },
    {
        id: "TICKET_REPORTE_STAFF", 
        label: "🛑 Reportar Staff",
        style: ButtonStyle.Danger,
        emoji: "🛑",
        color: "#C0392B", 
        title: "🛑 Reporte contra un Miembro del Staff",
        description: "Quejas o pruebas contra un Staff. **Solo lo verá el equipo de Administración.**",
        staffRoleIds: STAFF_REPORTE_ROLES, 
        staffMentions: [`<@&${ROL_ADMIN_FULL_ACCESS_IDS[0]}>`],
    },
    {
        id: "TICKET_PERDIDAS_IC", 
        label: "💵 Pérdidas IC (In-Character)",
        style: ButtonStyle.Success,
        emoji: "💵",
        color: "#2ECC71", 
        title: "💵 Reclamación de Pérdidas In-Character (IC)",
        description: "Perdiste dinero, ítems o un vehículo debido a un fallo del servidor o bug. Adjunta pruebas.",
        staffRoleIds: PERDIDAS_IC_ROLES,
        staffMentions: [`<@&${ROL_ENCARGADO_STAFF_ID}>`],
    },
    {
        id: "TICKET_PROBLEMAS_CUENTA", 
        label: "🔑 Problemas con mi Cuenta",
        style: ButtonStyle.Secondary,
        emoji: "🔑",
        color: "#E67E22", 
        title: "🔑 Recuperación/Problemas con mi Cuenta",
        description: "No puedo entrar a mi cuenta, cambio de contraseña, o problemas con el registro.",
        staffRoleIds: CUENTA_PROBLEMAS_ROLES,
        staffMentions: [`<@&${ROL_ADMIN_FULL_ACCESS_IDS[0]}>`],
    },
    {
        id: "TICKET_COMPRAS_OCC", 
        label: "💳 Compras OCC (Out-of-Character)",
        style: ButtonStyle.Primary,
        emoji: "💳",
        color: "#F1C40F", 
        title: "💳 Soporte de Compras Fuera de Juego (OCC)",
        description: "Problemas, dudas o confirmación sobre donaciones, membresías o paquetes de ítems comprados con dinero real.",
        staffRoleIds: COMPRAS_OCC_ROLES,
        staffMentions: [`<@&${ROL_COMPRAS_ID}>`],
    },
    {
        id: "TICKET_SOPORTE_TECNICO", 
        label: "🛠️ Soporte Técnico General",
        style: ButtonStyle.Secondary,
        emoji: "🛠️",
        color: "#7F8C8D", 
        title: "🛠️ Soporte Técnico",
        description: "Problemas con el Launcher, fallos de conexión, o ayuda con configuración.",
        staffRoleIds: BASE_TICKET_ROLES,
        staffMentions: [`<@&${ROL_ADMIN_FULL_ACCESS_IDS[0]}>`],
    }
];

// =========================================================================
// 📄 FORMATOS DE TICKETS (¡NUEVO!)
// =========================================================================
const TICKET_FORMATS = {
    "TICKET_REPORTE_FACCION": `
**🔫 FORMATO DE REPORTE A FACCIONES**

**¡Atención!** Copia el formato a continuación y llénalo en un nuevo mensaje. La claridad y las pruebas son clave para que tu reporte sea válido.

\`\`\`
[1] Mi Nombre IC: 
[2] Nombre de la Facción Reportada: 
[3] Razón/Motivo del Reporte: 
[4] Pruebas (URL de vídeo/captura): 
\`\`\`
`,
    "TICKET_REPORTE_STAFF": `
**🛑 FORMATO DE REPORTE A STAFF (ADMINISTRACIÓN)**

Este reporte es de carácter **confidencial** y solo será visto por la Administración Superior. Llena el formato con total honestidad.

\`\`\`
[1] Mi Nombre IC: 
[2] Nombre IC del Staff Reportado: 
[3] Razón/Motivo del Reporte: 
[4] Pruebas (URL de vídeo/captura): 
\`\`\`
`,
    "TICKET_REPORTE_JUGADOR": `
**🚨 FORMATO DE REPORTE A JUGADOR**

Usa este formato para reportar a un usuario por incumplir normas (MG, PG, Chetos, etc.). Un Staff te atenderá en breve.

\`\`\`
[1] Mi Nombre IC: 
[2] Nombre IC del Jugador Reportado: 
[3] Razón/Motivo del Reporte: 
[4] Pruebas (URL de vídeo/captura): 
\`\`\`
`,
    "TICKET_PROBLEMAS_CUENTA": `
**🔑 SOLICITUD DE ASISTENCIA DE CUENTA**

Por favor, proporciona la siguiente información para que la Administración pueda verificar y asistirte con tu cuenta.

\`\`\`
[1] Mi Nombre IC: 
[2] Tipo de Problema: (Ej: Contraseña olvidada, Ban injusto, Robo de cuenta)
[3] Razón o Contexto: (Explica brevemente qué estabas haciendo o qué causó el problema)
\`\`\`
`,
    "TICKET_PERDIDAS_IC": `
**💵 FORMATO DE RECLAMO POR PÉRDIDAS IC**

Solo se validan pérdidas comprobables por fallos del servidor o bugs, NO por errores personales en rol.

\`\`\`
[1] Mi Nombre IC: 
[2] Tipo de Pérdida y Cantidad: (Ej: $500.000, 30g de Cocaína, Coche Buffalo ID 45)
[3] Razón/Motivo de la Pérdida: (Explica cómo se perdió, ej: Bug de inventario, Server crash, Desconexión)
[4] Pruebas (URL de vídeo/captura): 
\`\`\`
`,
    // El TICKET_GENERAL y TICKET_COMPRAS_OCC no requieren formato estricto, 
    // pero puedes añadir uno aquí si lo deseas.
};


const openTickets = new Map();


// =============================
// 🤖 CLIENTE DEL BOT Y FUNCIONES BÁSICAS
// =============================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildModeration, 
    GatewayIntentBits.GuildPresences, 
  ],
  partials: [Partials.Channel, Partials.User, Partials.GuildMember],
});

// =============================
// 🧮 FUNCIÓN DE CÁLCULO DE SIMILITUD (MANTENIDA)
// =============================
function getSimilarity(s1, s2) {
    const s1Lower = s1.toLowerCase();
    const s2Lower = s2.toLowerCase();
    const m = s1Lower.length;
    const n = s2Lower.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            const cost = s1Lower[i - 1] === s2Lower[j - 1] ? 0 : 1;
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1,        
                dp[i][j - 1] + 1,        
                dp[i - 1][j - 1] + cost  
            );
        }
    }
    return dp[m][n];
}


// =============================
// 🟣 PRESENCIA ROTATIVA (MANTENIDA)
// =============================
client.once("ready", async () => {
  console.log(`🤖 Bot iniciado como ${client.user.tag}`);

  const presencias = [
    { name: "Trevel Roleplay 💜", type: 0 },
    { name: "🚗 Servidor colombiano con estilo", type: 3 },
    { name: "💜 Creado por Juan Arenas", type: 0 },
    { name: "🟣 Rol, diversión y comunidad", type: 0 },
  ];

  let i = 0;
  setInterval(() => {
    const estado = presencias[i % presencias.length];
    client.user.setPresence({
      activities: [{ name: estado.name, type: estado.type }],
      status: "online",
    });
    i++;
  }, 8000);
});

// =============================
// 🛑 LÓGICA DE INTERACCIÓN DE BOTONES Y MODALS (TICKETS) 🛑
// =============================
client.on('interactionCreate', async (interaction) => {
    if (!interaction.guild) return;
    
    // --- 1. Manejo de Botones de Creación de Ticket ---
    if (interaction.isButton()) {
        const ticketOption = TICKET_OPTIONS.find(opt => opt.id === interaction.customId);

        if (ticketOption) {
            
            const ticketKey = interaction.user.id + ":" + ticketOption.id;
            const existingTicket = openTickets.get(ticketKey);
            
            if (existingTicket) {
                return interaction.reply({ 
                    content: `❌ Ya tienes un ticket **${ticketOption.label}** abierto: <#${existingTicket.id}>. Cierra el anterior para abrir uno nuevo.`, 
                    ephemeral: true 
                });
            }

            await interaction.deferReply({ ephemeral: true }); 

            try {
                const guildTickets = interaction.guild.channels.cache.filter(c => c.parentId === CATEGORIA_TICKETS);
                const ticketNumber = String(guildTickets.size + 1).padStart(4, '0'); 
                
                const channelName = `${ticketOption.emoji}-${ticketOption.id.split('_').slice(1).join('-')}-${ticketNumber}`; 

                const staffOverwrites = ticketOption.staffRoleIds.map(roleId => ({
                    id: roleId,
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                }));
                
                const ticketChannel = await interaction.guild.channels.create({
                    name: channelName,
                    type: ChannelType.GuildText,
                    parent: CATEGORIA_TICKETS,
                    topic: `Creador:${interaction.user.id}|Tipo:${ticketOption.id}`, 
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id, // @everyone
                            deny: [PermissionsBitField.Flags.ViewChannel],
                        },
                        {
                            id: interaction.user.id, // Creador
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                        },
                        ...staffOverwrites,
                    ],
                });
                
                openTickets.set(ticketKey, ticketChannel);

                const closeButtonRow = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('TICKET_CLOSE')
                            .setLabel('🔒 Cerrar y Archivar Ticket')
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji('🔒'),
                    );

                const welcomeEmbed = new EmbedBuilder()
                    .setColor(ticketOption.color)
                    .setTitle(ticketOption.title)
                    .setDescription(`**¡Bienvenido <@${interaction.user.id}>!**\n\n${ticketOption.description}\n\n**Por favor, describe tu problema a continuación y espera al Staff.**`)
                    .addFields(
                        { name: "👤 Creador", value: `<@${interaction.user.id}>`, inline: true },
                        { name: "✨ Tipo", value: ticketOption.label, inline: true }
                    )
                    .setFooter({ text: `Ticket #${ticketNumber} | Trevel RP` })
                    .setTimestamp();
                
                const staffMentions = ticketOption.staffMentions.join(' ');

                await ticketChannel.send({ 
                    content: `${staffMentions} ¡Nuevo ticket! ${interaction.user} te espera.`,
                    embeds: [welcomeEmbed],
                    components: [closeButtonRow]
                });
                
                // 💥 NUEVO: Enviar formato de ticket si existe
                if (TICKET_FORMATS[ticketOption.id]) {
                    // Usamos un pequeño delay para que el mensaje del formato no se mezcle con el embed de bienvenida
                    setTimeout(async () => {
                         await ticketChannel.send(TICKET_FORMATS[ticketOption.id]);
                    }, 1000);
                }


                await interaction.editReply({ 
                    content: `✅ Tu ticket **${ticketOption.label}** ha sido creado: ${ticketChannel}`,
                    ephemeral: true 
                });

            } catch (error) {
                console.error("Error al crear el ticket:", error);
                await interaction.editReply({ 
                    content: "❌ Hubo un error al crear tu ticket. Verifica que la categoría y los IDs de Staff sean válidos (solo números), o que el bot tenga el permiso 'Gestionar Canales'.",
                    ephemeral: true 
                });
            }
            return;
        }

        // --- 2. Manejo de Botón de Cierre de Ticket (Abrir Modal) ---
        if (interaction.customId === 'TICKET_CLOSE') {
            const ticketChannel = interaction.channel;

            if (ticketChannel.parentId !== CATEGORIA_TICKETS) {
                return interaction.reply({ content: "❌ Esto no parece ser un canal de ticket.", ephemeral: true });
            }

            const isAdmin = interaction.member.permissions.has(PermissionsBitField.Flags.Administrator); 
            const creatorIdMatch = ticketChannel.topic?.match(/Creador:(\d+)/);
            const channelCreatorId = creatorIdMatch ? creatorIdMatch[1] : null;

            if (!isAdmin && interaction.user.id !== channelCreatorId) {
                return interaction.reply({ content: "❌ Solo el creador del ticket o un **Administrador** puede cerrarlo.", ephemeral: true });
            }

            // Crear el Modal para pedir el motivo
            const modal = new ModalBuilder()
                .setCustomId('TICKET_CLOSE_MODAL')
                .setTitle('🔒 Motivo de Cierre de Ticket');

            const reasonInput = new TextInputBuilder()
                .setCustomId('closeReason')
                .setLabel("Motivo del Cierre")
                .setStyle(TextInputStyle.Paragraph)
                .setPlaceholder('Ej: Solucionado por Soporte Técnico. | Jugador no responde. | Reporte inválido.')
                .setRequired(true)
                .setMinLength(10)
                .setMaxLength(500);

            const firstActionRow = new ActionRowBuilder().addComponents(reasonInput);

            modal.addComponents(firstActionRow);

            await interaction.showModal(modal);
            return;
        }
    }
    
    // --- 3. Manejo de Envío de Modal de Cierre y Acciones Finales ---
    if (interaction.isModalSubmit()) {
        if (interaction.customId !== 'TICKET_CLOSE_MODAL') return;

        await interaction.deferReply({ ephemeral: true }); 

        const ticketChannel = interaction.channel;
        const closer = interaction.user;
        const reason = interaction.fields.getTextInputValue('closeReason');
        
        // 1. Obtener datos del ticket
        const creatorIdMatch = ticketChannel.topic?.match(/Creador:(\d+)/);
        const channelCreatorId = creatorIdMatch ? creatorIdMatch[1] : null;
        const ticketNumber = ticketChannel.name.split('-').pop(); 

        if (!channelCreatorId) {
            return interaction.editReply({ content: "❌ Error interno: No se pudo encontrar el creador del ticket. El canal será eliminado en 5s.", ephemeral: true });
        }

        let ticketCreator;
        try {
            ticketCreator = await client.users.fetch(channelCreatorId);
        } catch (e) {
            console.error("No se pudo obtener el usuario creador:", e);
        }
        
        // 2. Enviar Mensaje Privado al Creador
        if (ticketCreator) {
            const dmEmbed = new EmbedBuilder()
                .setColor("#9B59B6")
                .setTitle("🔒 Tu Ticket ha sido Cerrado")
                .setDescription(`Tu ticket **#${ticketNumber}** en **${interaction.guild.name}** ha sido cerrado por un miembro del Staff.`)
                .addFields(
                    { name: "👤 Cerrado por", value: `<@${closer.id}>`, inline: true },
                    { name: "📝 Motivo del Cierre", value: `*${reason}*`, inline: false }
                )
                .setFooter({ text: "By: Juan Arenas 💜" })
                .setTimestamp();

            await ticketCreator.send({ embeds: [dmEmbed] }).catch(e => {
                console.warn(`No se pudo enviar el DM a ${ticketCreator.tag}.`, e);
                interaction.channel.send(`⚠️ No se pudo notificar a <@${ticketCreator.id}> por mensaje privado (DM). Puede que los tenga desactivados.`).catch(() => {});
            });
        }

        // 3. Enviar Log al Canal de Logs
        const logChannel = interaction.guild.channels.cache.get(CANAL_TICKET_LOGS);

        if (logChannel) {
            const logEmbed = new EmbedBuilder()
                .setColor("#C0392B") 
                .setTitle("Ticket Cerrado y Registrado")
                .setDescription(`Se ha cerrado el ticket **#${ticketNumber}** (${ticketChannel.name}).`)
                .addFields(
                    { name: "👤 Creador del Ticket", value: `<@${channelCreatorId}>`, inline: true },
                    { name: "🔒 Cerrado por", value: `<@${closer.id}>`, inline: true },
                    { name: "📝 Motivo", value: `*${reason}*`, inline: false }
                )
                .setTimestamp();
            
            await logChannel.send({ embeds: [logEmbed] }).catch(e => console.error("Error al enviar log:", e));
        }

        // 4. Eliminar de la lista de tickets abiertos
        for (const [key, channel] of openTickets.entries()) {
            if (channel.id === ticketChannel.id) {
                openTickets.delete(key);
                break;
            }
        }

        // 5. Cerrar y renombrar el canal (y eliminarlo en 10s)
        const oldName = ticketChannel.name;
        await ticketChannel.edit({ name: `🔒-cerrado-${oldName.split('-').pop()}` }).catch(e => console.error("Error al renombrar ticket:", e));

        await interaction.editReply({ content: `✅ Ticket cerrado con éxito. El creador ha sido notificado por DM. Este canal se eliminará en **10 segundos**.` });

        setTimeout(() => {
            ticketChannel.delete("Ticket cerrado por Staff").catch(e => console.error("Error al eliminar el canal de ticket:", e));
        }, 10000);
        
        return;
    }
});


// =============================
// 💬 RESPUESTA AUTOMÁTICA CUANDO DICEN "TREVEL" (MANTENIDA)
// =============================
client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    if (!CANALES_TREVEL_DETECTOR.includes(message.channel.id)) return;

    const contenido = message.content.toLowerCase();
    if (contenido.includes("trevel")) {
        const frases = [
            "💜 Acabas de mencionar al servidor más sabrosón de Colombia",
            "😎 Ufff... dijiste *Trevel*, eso suena a pura calidad, parce 💜",
            "Trevel ON TOP, los demás valen monda 💜",
            "🟣 Si no es en Trevel, ¿entonces dónde? 😉",
            "Trevel RP: hecho con sabor colombiano y mucho rol 💜",
            "💬 Dicen 'Trevel' y automáticamente se siente la buena vibra 😎",
            "✨ Trevel RP — realismo, comunidad y full sabrosura 💜",
        ];

        const frase = frases[Math.floor(Math.random() * frases.length)];

        const embed = new EmbedBuilder()
            .setColor("#9B59B6")
            .setTitle(frase)
            .setFooter({ text: "Trevel RP • ON TOP MTA Colombia 💜" })
            .setTimestamp();

        try {
            await message.react("💜");
            await message.channel.send({ embeds: [embed] });
            console.log(`[Trevel Detector] ${message.author.tag} mencionó "Trevel"`);
        } catch (error) {
            console.error("Error en la respuesta automática:", error);
        }
    }
});

// =============================
// 🎉 BIENVENIDA AUTOMÁTICA (MANTENIDA)
// =============================
client.on("guildMemberAdd", async (member) => {
  try {
    const canal = member.guild.channels.cache.get(CANAL_BIENVENIDA);
    if (!canal) return console.error("❌ No se encontró el canal de bienvenida.");

    const embed = new EmbedBuilder()
      .setColor("#9b59b6")
      .setTitle("💜 ¡Bienvenid@ a Trevel Roleplay!")
      .setDescription(`Hey ${member}, nos alegra tenerte aquí.\nEsperamos que disfrutes tu estancia 💫`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: `Miembro #${member.guild.memberCount} del servidor 🎉` })
      .setTimestamp();

    const mensaje = await canal.send({ embeds: [embed] });
    await mensaje.react("💜");
  } catch (error) {
    console.error("Error al enviar bienvenida:", error);
  }
});

// =============================
// 🎁 COMANDO: PREMIOS BOOST (MANTENIDO)
// =============================
const handleBoostCommand = async (message) => {
    const embed = new EmbedBuilder()
        .setColor("#9B59B6")
        .setTitle("🎁 PREMIOS POR BOOSTEAR TREVEL ROLEPLAY 🎁")
        .setDescription(`
💜 **Gracias por apoyar nuestro servidor con tus boosts.**
Aquí están las recompensas que puedes obtener:

> 🪙 **1 Boost:** 200M  
> 💸 **2 Boosts:** 250M  
> 🚗 **3 Boosts:** Coche VIP  
> 🏠 **Más de 3 Boosts:** Coche VIP + Casa de gama alta  

⏰ **Entrega:** Las recompensas se entregan luego de 3 horas.  
⚠️ **Importante:** Si retiras el boost, **pierdes las recompensas.** 🎁 **Se reclama una única vez.**
        `)
        .setFooter({ text: "Trevel RP • Sistema de Boosts" })
        .setTimestamp();

    await message.channel.send({ embeds: [embed] });
}


// =============================
// 🟣 COMANDOS DE RECLUTAMIENTO E INFORMACIÓN (MANTENIDO)
// =============================
const departamentos = {
  "!serpd": {
    titulo: "👮‍♂️ POLICÍA NACIONAL",
    desc: "¡Hola {user}! Aquí encontrarás el discord de la **Policía Nacional de Trevel Roleplay**, donde podrás postularte para servir y proteger.",
    link: "https://discord.gg/j8kdDzUkMb",
  },
  "!sercopes": {
    titulo: "🕵️‍♂️ COOPERATIVA DE SEGURIDAD (COPES)",
    desc: "¡Hola {user}! Este es el discord de la **COPES**, una unidad especial dedicada a investigación y operaciones tácticas.",
    link: "https://discord.gg/eNMyfcyPsc",
  },
  "!sersura": {
    titulo: "🚑 SERVICIO DE URGENCIAS (SURA)",
    desc: "¡Hola {user}! Aquí podrás postularte a **SURA**, el equipo médico de Trevel RP encargado de salvar vidas.",
    link: "https://discord.gg/JvZHbgWfxF",
  },
  "!serejc": {
    titulo: "⚖️ EJÉRCITO NACIONAL (EJC)",
    desc: "¡Hola {user}! Este es el discord del **Ejército Nacional de Trevel RP**, donde puedes enlistarte para servir con honor.",
    link: "https://discord.gg/4s9cKp8q5m",
  },
  "!sermeca": {
    titulo: "🔧 MECÁNICOS",
    desc: "¡Hola {user}! Aquí podrás postularte para unirte al **taller mecánico**, encargados de reparar y tunear los autos.",
    link: "https://discord.gg/HRS3fdDDEc",
  },
  "!sertst": {
    titulo: "🚦 TRÁNSITO Y SEGURIDAD VIAL (TST)",
    desc: "¡Hola {user}! Únete al **departamento de Tránsito y Seguridad Vial**, encargados del orden en las vías.",
    link: "https://discord.gg/KMZR94deWu",
  },
"!ip": { titulo: "🌐 CONÉCTATE A TREVEL ROLEPLAY",
     desc: "¡Hola {user}! Aquí tienes la IP para unirte al mejor servidor de rol colombiano.\n\n> **IP del Servidor:** mtasa://154.223.16.5:22056\n\n💜 ¡Entra ahora y vive la experiencia Trevel RP!", 
     imagen: "https://media.discordapp.net/attachments/1371756848839135272/1425277551667970058/Trevel_Verde.png",
     },
};

const handleRecruitmentCommand = async (message) => {
    const cmd = message.content.toLowerCase();
    const dep = departamentos[cmd];
    
    const embed = new EmbedBuilder()
      .setColor("#9B59B6")
      .setTitle(dep.titulo)
      .setDescription(dep.desc.replace("{user}", `<@${message.author.id}>`))
      .setThumbnail(dep.thumbnail)
      .setFooter({ text: "Trevel Roleplay • Información Oficial 💜" })
      .setTimestamp();

    if (dep.link) embed.addFields({ name: "📎 Discord Oficial", value: `[Haz clic aquí para unirte](${dep.link})` });
    if (dep.imagen) embed.setImage(dep.imagen);

    if (cmd !== "!ip") await message.delete().catch(() => {});
    const msg = await message.channel.send({ embeds: [embed] });
    await msg.react("💜");
}


// =============================
// 🧭 COMANDO: PANEL DE COMANDOS (MANTENIDO)
// =============================
const handleComandosCommand = async (message) => {
    const embed = new EmbedBuilder()
        .setColor("#9B59B6")
        .setTitle("💜 Trevel Roleplay - Panel de Comandos")
        .setDescription(
            "Aquí tienes todos los comandos disponibles del bot de Trevel RP.\n\n"
        )
        .addFields(
            {
                name: "🚨 Reclutamientos",
                value:
                    "`!serpd` → Policía Nacional\n" +
                    "`!serejc` → Ejército Nacional\n" +
                    "`!sercopes` → COPES\n" +
                    "`!sersura` → SURA\n" +
                    "`!sermeca` → Mecánicos\n" +
                    "`!sertst` → Tránsito y Seguridad Vial",
            },
            {
                name: "🌐 Información General",
                value: "`!ip` → IP del servidor\n`!boost` → Premios por boostear\n`!ticketpanel` → Envía el panel de tickets (Solo Admin)",
            },
            {
                name: "🎉 Extras",
                value:
                    "💬 **Detector Trevel** → Reacciona cuando se menciona 'Trevel'\n" +
                    "👋 **Bienvenida automática** → Mensaje personalizado al unirse\n" +
                    "**Próximamente:** Sistema de ModLog y advertencias.",
            }
        )
        .setFooter({ text: "Trevel Roleplay • Colombia 💜" })
        .setTimestamp();

    await message.channel.send({ embeds: [embed] });
}


// =============================
// 🛠️ COMANDO DE SETUP DEL PANEL DE TICKETS (USO EXCLUSIVO DEL DUEÑO DEL BOT/STAFF)
// =============================
const handleTicketPanelSetup = async (message) => {
    const hasPermissions = message.member.permissions.has(PermissionsBitField.Flags.Administrator);
    if (!hasPermissions) {
        return message.reply({ content: "❌ Solo un administrador puede usar este comando.", ephemeral: true });
    }
    
    const channel = message.guild.channels.cache.get(CANAL_PANEL_TICKETS);
    if (!channel || channel.type !== ChannelType.GuildText) {
        return message.reply("❌ Error: El canal de tickets (CANAL_PANEL_TICKETS) no está configurado correctamente.");
    }
    
    await message.delete().catch(() => {});
    
    const rows = [];
    let currentRow = new ActionRowBuilder();
    let buttonCount = 0;

    for (const opt of TICKET_OPTIONS) {
        if (buttonCount === 5) { 
            rows.push(currentRow);
            currentRow = new ActionRowBuilder();
            buttonCount = 0;
        }

        currentRow.addComponents(
            new ButtonBuilder()
                .setCustomId(opt.id)
                .setLabel(opt.label)
                .setStyle(opt.style)
                .setEmoji(opt.emoji)
        );
        buttonCount++;
    }
    if (buttonCount > 0) {
        rows.push(currentRow);
    }

    const embed = new EmbedBuilder()
        .setColor("#9B59B6")
        .setTitle("📞 Panel de Tickets de Trevel Roleplay")
        .setDescription(
            "Selecciona la opción que mejor se ajuste a tu necesidad para abrir un nuevo ticket.\n\n" +
            "**Reglas:**\n" +
            "1.  No uses el sistema para pedir dinero o ítems.\n" +
            "2.  Sé respetuoso con el Staff.\n" +
            "3.  Solo puedes tener **un ticket abierto por tipo** a la vez."
        )
        .addFields(
            { name: "🚨 Moderación", value: "General, Reportes (Jugador/Facción) y Staff.", inline: true },
            { name: "🛠️ Soporte", value: "Pérdidas, Cuenta, Soporte Técnico.", inline: true },
            { name: "💳 Compras", value: "Temas de Compras OCC/Donaciones.", inline: true }
        )
        .setImage("https://cdn.discordapp.com/attachments/1371756848839135272/1425277551667970058/Trevel_Verde.png?ex=68ec46a8&is=68eaf528&hm=079b5d5c756a6197d320ceca8ee974e82c3e5a187eb2b8294be2af4583c82ce8&") 
        .setFooter({ text: "¡Elige tu opción para empezar! 💜" });

    await channel.send({ embeds: [embed], components: rows });
    console.log("[Tickets] Panel de tickets enviado correctamente.");
}


// =============================
// 🧠 DETECTOR PRINCIPAL DE COMANDOS Y ERRORES (MANTENIDO)
// =============================
const COMMAND_MAP = {
    "!boost": handleBoostCommand,
    "!comandos": handleComandosCommand,
    "!ticketpanel": handleTicketPanelSetup, 
    ...departamentos,
};

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    const content = message.content.toLowerCase();
    const prefix = content.startsWith("!") ? "!" : null;

    if (prefix) {
        const command = content.split(/\s+/)[0];
        
        if (command === "!ticketpanel") {
            return handleTicketPanelSetup(message);
        }

        if (COMMAND_MAP[command]) {
            await COMMAND_MAP[command](message);
            return;
        }

        const MAX_DISTANCE = 2; 
        let bestMatch = null;
        let minDistance = Infinity;

        for (const validCommand in COMMAND_MAP) {
            const commandText = validCommand.substring(1);
            const userText = content.substring(1);

            const distance = getSimilarity(commandText, userText);

            if (distance < minDistance) {
                minDistance = distance;
                bestMatch = validCommand;
            }
        }

        if (minDistance > 0 && minDistance <= MAX_DISTANCE && bestMatch) {
            const typoEmbed = new EmbedBuilder()
                .setColor("#F39C12") 
                .setTitle("❓ ¿Quisiste decir...?")
                .setDescription(`El comando **${content}** no existe. \n\n¿Quizás querías usar el comando **${bestMatch}**?`)
                .setFooter({ text: "Usa !comandos para ver la lista completa." });
                
            await message.channel.send({ embeds: [typoEmbed] });
        }
    }
});


// =============================
// 🔑 LOGIN DEL BOT
// =============================
client.login(process.env.TOKEN);