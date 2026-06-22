import { Client, Events, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, TextChannel } from "discord.js";
import express from "express";
import { prisma } from "@nova-studio/database";
import { TICKET_STATUS_LABELS } from "@nova-studio/shared";

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || "";
const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID || "";
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || "";
const PORT = process.env.BOT_HTTP_PORT ? parseInt(process.env.BOT_HTTP_PORT) : 4000;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

// ============================================================
// EXPRESS SERVER (receives notifications from web)
// ============================================================
const app = express();
app.use(express.json());

function verifyApiKey(req: express.Request, res: express.Response, next: express.NextFunction) {
  const key = req.headers["x-api-key"];
  if (key !== INTERNAL_API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

app.post("/api/notify", verifyApiKey, async (req, res) => {
  try {
    const { type, ticketType, ticketId, ticketCode, data, discussionCode } = req.body;
    const guild = client.guilds.cache.get(DISCORD_GUILD_ID);
    if (!guild) return res.status(503).json({ error: "Guild not available" });

    if (type === "TICKET_CREATED") {
      const channelId = ticketType === "JOIN"
        ? process.env.DISCORD_CHANNEL_CANDIDATURES
        : process.env.DISCORD_CHANNEL_DEMANDES;
      const channel = guild.channels.cache.get(channelId || "") as TextChannel;
      if (!channel) return res.status(404).json({ error: "Channel not found" });

      const embed = new EmbedBuilder()
        .setColor(ticketType === "JOIN" ? 0x7c3aed : 0x3b82f6)
        .setTitle(`Nouveau ticket ${ticketType === "JOIN" ? "Candidature" : "Service"}: ${ticketCode}`)
        .addFields(
          { name: "Nom", value: data.name || "—", inline: true },
          { name: "Email", value: data.email || "—", inline: true },
          ...(data.services ? [{ name: "Services", value: data.services.join(", "), inline: true }] : []),
          ...(data.skills ? [{ name: "Compétences", value: data.skills.join(", "), inline: true }] : []),
          ...(data.experience ? [{ name: "Expérience", value: data.experience, inline: true }] : []),
          ...(data.estimate ? [{ name: "Estimation", value: data.estimate, inline: true }] : []),
        )
        .setTimestamp()
        .setFooter({ text: "Nova Studio Bot" });

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId(`ticket_view_${ticketId}`).setLabel("Voir détails").setStyle(ButtonStyle.Primary),
        ...(ticketType === "SERVICE" ? [
          new ButtonBuilder().setCustomId(`ticket_accept_${ticketId}`).setLabel("Prendre en charge").setStyle(ButtonStyle.Success),
        ] : []),
        ...(ticketType === "JOIN" ? [
          new ButtonBuilder().setCustomId(`ticket_accept_candidate_${ticketId}`).setLabel("Accepter").setStyle(ButtonStyle.Success),
          new ButtonBuilder().setCustomId(`ticket_reject_candidate_${ticketId}`).setLabel("Refuser").setStyle(ButtonStyle.Danger),
        ] : []),
      );

      const message = await channel.send({ embeds: [embed], components: [row] });

      // Store Discord message ID in ticket
      await prisma.ticket.update({
        where: { id: ticketId },
        data: { discordMessageId: message.id },
      });

      // Create a thread for this ticket
      if (channel.type === ChannelType.GuildText) {
        await message.startThread({ name: `Discussion ${ticketCode}`, autoArchiveDuration: 1440 });
      }
    }

    if (type === "TICKET_VERIFIED") {
      const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
      if (ticket && ticket.discordMessageId) {
        const channelId = ticket.type === "JOIN"
          ? process.env.DISCORD_CHANNEL_CANDIDATURES
          : process.env.DISCORD_CHANNEL_DEMANDES;
        const channel = guild.channels.cache.get(channelId || "") as TextChannel;
        if (channel) {
          const message = await channel.messages.fetch(ticket.discordMessageId).catch(() => null);
          if (message) {
            await message.reply(`\u2705 Email vérifié ! Code de discussion: \`\`${discussionCode}\`\``);
          }
        }
      }
    }

    if (type === "CHAT_MESSAGE") {
      const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
      const msg = req.body.message;
      if (ticket && ticket.discordChannelId && msg) {
        const thread = guild.channels.cache.get(ticket.discordChannelId) as TextChannel;
        if (thread) {
          await thread.send(`\u{1F4AC} **${msg.senderName}**: ${msg.content}`);
        }
      }
    }

    return res.json({ success: true });
  } catch (error) {
    console.error("Error in notify handler:", error);
    return res.status(500).json({ error: "Internal error" });
  }
});

app.listen(PORT, () => {
  console.log(`\u{1F680} Bot HTTP server running on port ${PORT}`);
});

// ============================================================
// DISCORD BOT
// ============================================================

client.once(Events.ClientReady, async () => {
  console.log(`\u{1F916} Bot connected as ${client.user?.tag}`);

  const guild = client.guilds.cache.get(DISCORD_GUILD_ID);
  if (!guild) { console.warn("Guild not found!"); return; }

  // Ensure ticket categories exist
  const categories = [
    { name: "\u{1F4CB} Candidatures", id: "candidatures" },
    { name: "\u{1F4E6} Demandes", id: "demandes" },
    { name: "\u{1F4AC} Discussions", id: "discussions" },
    { name: "\u{1F4DD} Projets", id: "projets" },
  ];

  for (const cat of categories) {
    const exists = guild.channels.cache.find((c) => c.name === cat.name && c.type === ChannelType.GuildCategory);
    if (!exists) {
      console.log(`Creating category: ${cat.name}`);
      await guild.channels.create({ name: cat.name, type: ChannelType.GuildCategory });
    }
  }
});

// Button interactions
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;

  try {
    const [action, type, ticketId] = interaction.customId.split("_");

    if (interaction.customId.startsWith("ticket_accept_") && !interaction.customId.includes("candidate")) {
      // Assign creator to service ticket
      const member = interaction.member;
      const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
      if (!ticket) return await interaction.reply({ content: "Ticket introuvable.", ephemeral: true });

      await prisma.ticket.update({
        where: { id: ticketId },
        data: { status: "ASSIGNED" },
      });

      const userTag = member?.user.username + (member?.user.discriminator !== "0" ? `#${member?.user.discriminator}` : "");
      await prisma.ticketStatusLog.create({
        data: { ticketId, fromStatus: ticket.status, toStatus: "ASSIGNED", changedBy: member?.user.id, note: `Assigné par ${userTag} via Discord` },
      });

      await interaction.reply({ content: `\u2705 Ticket ${ticket.code} accepté !`, ephemeral: true });

      // Reply in thread
      if (ticket.discordChannelId) {
        const thread = (await client.channels.fetch(ticket.discordChannelId).catch(() => null)) as TextChannel;
        if (thread) await thread.send(`\u{1F3AF} **${userTag}** a pris en charge ce ticket.`);
      }
    }

    if (interaction.customId.startsWith("ticket_accept_candidate_")) {
      const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
      if (!ticket) return await interaction.reply({ content: "Ticket introuvable.", ephemeral: true });

      await prisma.ticket.update({ where: { id: ticketId }, data: { status: "ACCEPTED" } });
      await prisma.ticketStatusLog.create({
        data: { ticketId, fromStatus: ticket.status, toStatus: "ACCEPTED", changedBy: interaction.user.id, note: "Candidature acceptée via Discord" },
      });

      await interaction.reply({ content: `\u2705 Candidature ${ticket.code} acceptée !`, ephemeral: true });
    }

    if (interaction.customId.startsWith("ticket_reject_candidate_")) {
      const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
      if (!ticket) return await interaction.reply({ content: "Ticket introuvable.", ephemeral: true });

      await prisma.ticket.update({ where: { id: ticketId }, data: { status: "REJECTED" } });
      await prisma.ticketStatusLog.create({
        data: { ticketId, fromStatus: ticket.status, toStatus: "REJECTED", changedBy: interaction.user.id, note: "Candidature refusée via Discord" },
      });

      await interaction.reply({ content: `\u274C Candidature ${ticket.code} refusée.`, ephemeral: true });
    }

    if (interaction.customId.startsWith("ticket_view_")) {
      const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
      if (!ticket) return await interaction.reply({ content: "Ticket introuvable.", ephemeral: true });

      const embed = new EmbedBuilder()
        .setColor(0x7c3aed)
        .setTitle(`Détails du ticket ${ticket.code}`)
        .addFields(
          { name: "Type", value: ticket.type, inline: true },
          { name: "Statut", value: TICKET_STATUS_LABELS[ticket.status] || ticket.status, inline: true },
          { name: "Nom", value: ticket.submitterName, inline: true },
          { name: "Email", value: ticket.submitterEmail, inline: true },
          { name: "Discord", value: ticket.submitterDiscord || "—", inline: true },
          ...(ticket.discussionCode ? [{ name: "Code discussion", value: ticket.discussionCode, inline: true }] : []),
          ...(ticket.estimatedPriceMin ? [{ name: "Estimation", value: `${ticket.estimatedPriceMin}€ - ${ticket.estimatedPriceMax}€`, inline: true }] : []),
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  } catch (error) {
    console.error("Error handling button interaction:", error);
    await interaction.reply({ content: "Erreur lors du traitement.", ephemeral: true }).catch(() => {});
  }
});

client.login(DISCORD_BOT_TOKEN).catch((err) => {
  console.error("Failed to login:", err);
  process.exit(1);
});
