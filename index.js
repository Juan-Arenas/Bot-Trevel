// =============================
// 🌐 IMPORTS
// =============================
import { 
  Client, 
  GatewayIntentBits, 
  Partials, 
  EmbedBuilder,
  PermissionsBitField
} from "discord.js";
import dotenv from "dotenv";
dotenv.config();

// =============================
// 🤖 CLIENTE DEL BOT
// =============================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel, Partials.User, Partials.GuildMember],
});

// =============================
// 🟣 PRESENCIA ROTATIVA
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
// 💬 RESPUESTA AUTOMÁTICA CUANDO DICEN "TREVEL"
// =============================
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const contenido = message.content.toLowerCase();
  if (contenido.includes("trevel")) {
    const frases = [
      "💜 Acabas de mencionar al servidor más sabrosón de Colombia",
      "😎 Ufff... dijiste *Trevel*, eso suena a pura calidad, parce 💜",
      "Trevel ON TOP, los demás valen monda 💜",
      "🟣 Si no es en Trevel, ¿entonces dónde? 😉",
      "Trevel RP: hecho con sabor colombiano y mucho rol 💜",
      "💬 Dicen 'Trevel' y automáticamente se siente la buena vibra 😎",
      "💜 Trevel: más que un servidor, una familia roleando junta",
      "🎭 En Trevel cada historia brilla con estilo 💜",
      "✨ Trevel RP — realismo, comunidad y full sabrosura 💜",
      "🕶️ Donde el rol se mezcla con la rumba: eso es Trevel 💜",
      "🏙️ Trevel Roleplay, la ciudad que nunca duerme 💜",
      "🚦 En Trevel todos tenemos una historia que contar 💜",
      "💜 Trevel: el orgullo colombiano del roleplay",
      "🟣 Trevel es puro fuego, y tú lo sabes 🔥",
      "🎮 Rol, comunidad y locura sana: eso es Trevel 💜",
      "🚓 No importa el barrio, todos en Trevel somos familia 💜",
      "💜 Dicen que el que entra a Trevel… no quiere salir 😏",
      "🌆 Trevel RP: el lugar donde tu personaje se vuelve leyenda 💜",
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
// 🎉 BIENVENIDA AUTOMÁTICA
// =============================
const CANAL_BIENVENIDA = "1371756835404517418";

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
// 🎁 COMANDO: PREMIOS BOOST
// =============================
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.content.toLowerCase() === "!boost") {
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
⚠️ **Importante:** Si retiras el boost, **pierdes las recompensas.**  
🎁 **Se reclama una única vez.**
      `)
      .setFooter({ text: "Trevel RP • Sistema de Boosts" })
      .setTimestamp();

    await message.channel.send({ embeds: [embed] });
  }
});

// =============================
// 🟣 COMANDOS DE RECLUTAMIENTO E INFORMACIÓN
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

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const cmd = message.content.toLowerCase();
  const dep = departamentos[cmd];
  if (!dep) return;

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
});

// =============================
// 🧭 COMANDO: PANEL DE COMANDOS
// =============================
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.content.toLowerCase() !== "!comandos") return;

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
        value: "`!ip` → IP del servidor\n`!boost` → Premios por boostear",
      },
      {
        name: "🎉 Extras",
        value:
          "💬 **Detector Trevel** → Reacciona cuando se menciona 'Trevel'\n" +
          "👋 **Bienvenida automática** → Mensaje personalizado al unirse\n" +
          "📩 **!md** → Enviar mensaje global privado (solo admins)",
      }
    )
    .setFooter({ text: "Trevel Roleplay • Colombia 💜" })
    .setTimestamp();

  await message.channel.send({ embeds: [embed] });
});

// =============================
// 🔑 LOGIN DEL BOT
// =============================
client.login(process.env.TOKEN);
