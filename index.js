import { Client, GatewayIntentBits, Partials, EmbedBuilder } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel],
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
  }, 30000);
});

// =============================
// 💌 COMANDO: ENVIAR MENSAJE PRIVADO
// =============================
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith("!enviar-msg")) return;

  const members = await message.guild.members.fetch();
  members.forEach(async (member) => {
    if (!member.user.bot) {
      const mensaje = `💜 ¡Hola ${member.user.username}!\nQueremos saludarte de parte del servidor **Trevel Roleplay**.\nEstamos comenzando una nueva etapa llena de actualizaciones, mejoras y mucho más rol.\n✨ Más realismo, más diversión y la misma esencia que nos une como comunidad.\n🚗 Nuevos sistemas, historias frescas y oportunidades para que tu personaje brille de nuevo.\n💜 Te esperamos en **Trevel Roleplay**, donde tu historia continúa.`;

      try {
        await member.send(mensaje);
        console.log(`✅ Mensaje enviado a ${member.user.tag}`);
      } catch {
        console.log(`❌ No se pudo enviar mensaje a ${member.user.tag}`);
      }
    }
  });

  message.reply("📨 Mensajes enviados con éxito.");
});

// =============================
// 💬 RESPUESTA AUTOMÁTICA CUANDO DICEN "TREVEL"
// =============================
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const contenido = message.content.toLowerCase();
  if (contenido.includes("trevel")) {
    const frases = [
      "💜 Acabas de mencionar al servidor más sabrosón de Colombia 🇨🇴",
      "😎 Ufff... dijiste *Trevel*, eso suena a pura calidad, parce 💜",
      "Trevel ON TOP, los demas valen monda 💜",
    ];

    const frase = frases[Math.floor(Math.random() * frases.length)];

    const embed = new EmbedBuilder()
      .setColor("#9B59B6")
      .setTitle(frase)
      .setFooter({ text: "Trevel RP • ON TOP MTA Colombia 💜" })
      .setTimestamp();

    // Reaccionar con 💜 y enviar el embed
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
// 🔑 LOGIN DEL BOT
// =============================
client.login(process.env.TOKEN);

import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("💜 TrevelBot activo y on fire 💜");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Webserver escuchando en puerto ${PORT}`);
});
