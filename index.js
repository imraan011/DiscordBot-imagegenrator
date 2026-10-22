import { AttachmentBuilder, Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import { generateImage } from "./ai.service.js";

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const PREFIX = "!imagine";

client.on("ready", () => {
    console.log(`Bot is ready! Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;

    const prompt = message.content.slice(PREFIX.length).trim();
    if (!prompt) {
        return message.reply(
            "Prompt toh do! Example: `!imagine a cat astronaut`",
        );
    }

    const waitingMsg = await message.reply(
        "🎨 Image bana raha hoon, wait karo...",
    );

    try {
        const buffer = await generateImage(prompt);

        if (!buffer) {
            return waitingMsg.edit(
                "Image generate nahi hui, dusra prompt try karo.",
            );
        }

        const file = new AttachmentBuilder(buffer, { name: "image.png" });
        await waitingMsg.edit({
            content: `Ye lo: **${prompt}**`,
            files: [file],
        });
    } catch (err) {
        console.error(err);
        await waitingMsg.edit("Kuch gadbad ho gayi, thodi der baad try karo.");
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);
