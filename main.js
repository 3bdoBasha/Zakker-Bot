const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Events } = require('discord.js');
const { token } = require('./config.json');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const ffmpeg = require('ffmpeg-static');
const prism = require('prism-media');
const quranSound = './quran/002.mp3';
const myRules = "https://cdn.discordapp.com/attachments/1267234350253084702/1267240704606863472/-_.png?ex=66a81160&is=66a6bfe0&hm=5a0d09e34f947c60fc6e959acef25caa6a27596bcdc886feeab1cadbfd50cc8e&";
const about = "https://cdn.discordapp.com/attachments/1267234350253084702/1267240706825654464/-_.png?ex=66a81160&is=66a6bfe0&hm=2bedf85b8694a4e3eb0fcc2779f5fbf8aa8d5454157fd4230442c8489c3a2961&";
const prefix = "!";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers
    ]
});

client.once(Events.ClientReady, async readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on('messageCreate', async message => {
    if (message.content === prefix + 'quran'){
        if (message.member.voice.channel) {
            const connection = joinVoiceChannel({
                channelId: message.member.voice.channel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator
            });

            connection.on(VoiceConnectionStatus.Ready, () => {
                console.log('The bot has connected to the channel!');
                const player = createAudioPlayer();
                const resource = createAudioResource(quranSound);

                player.play(resource);
                connection.subscribe(player);

                player.on(AudioPlayerStatus.Idle, () => {
                    console.log('Finished playing!');
                    connection.destroy();
                });
            });

            connection.on(VoiceConnectionStatus.Disconnected, () => {
                console.log('Disconnected from the channel!');
                connection.destroy();
            });
        } else {
            message.reply('You need to join a voice channel first!');
        }
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    if (commandName === 'embed') {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'أيها المستخدم ، ليس لديك صلاحية لإستخدام هذا الأمر 💀', ephemeral: true });
        }

        const title = options.getString('title');
        const description = options.getString('description');
        const footer = options.getString('footer');
        const color = options.getString('color') || 'Green';
        const image = options.getString('image');

        if (!title || !description) {
            return interaction.reply({ content: 'يجب تقديم عنوان ووصف للإيمبد.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(color)
            .setFooter({ text: footer || '', iconURL: interaction.user.avatarURL() })
            .setTimestamp();

        if (image) {
            embed.setImage(image);
        }

        await interaction.reply({ embeds: [embed] });
    }
});

client.on('messageCreate', message => {
    try {
        const autoReplies = {
            ".": "**أحلى من ينقط دا ولا أيه :heart:**",
            "برب": "**🤖 تيـــت ، لا تتأخر بليز**",
            "باك": "**😉 ولكم باك يا وحش ، متتأخرش تاني**",
            "السلام عليكم ورحمة الله وبركاته": "**وعليكم السلام ورحمة الله وبركاته ✨**",
            "السلام عليكم": "وَإِذَا حُيِّيتُمْ بِتَحِيَّةٍ فَحَيُّوا بِأَحْسَنَ مِنْهَا أَوْ رُدُّوهَا😡",
            "تقديم":`**نمـوذج تقديـم الإدارة :
الإسم :
العمر :
خبرتك بالديسكورد :
عمر حسابك :
ليش تبي تقدم :
بإيه راح تفيدنا :
مدة تفاعلك :
هل ستلتزم ببنود الإنضمام للإدارة ، ولا تضر فريق الإدارة بشيء ؟**`
        };

        if (autoReplies[message.content]) {
            message.reply(autoReplies[message.content]);
            if (message.content === "برب") message.react("💤");
            if (message.content === "باك") message.react("🔙");
        }

        const badWords = ["خرا", "نصابين", "خول", "كسمك", "علق"];
        if (badWords.includes(message.content)) {
            message.delete();
            message.reply(`إحترم نفسك يا قليل الأدب ${message.author}`);
        }

        if (message.content === prefix + "قوانين") {
            const rules = new EmbedBuilder()
                .setColor("Green")
                .setTitle("قوانين مجتمع ذكّـر الديني المسلم")
                .setDescription(`**السلام عليكم ورحمة الله وبركاته،**
                  **نرحب بكم في سيرفرنا مجتمع ذكّـر المسلم. للحفاظ على بيئة نقية ومفيدة للجميع، نرجو الالتزام بالقوانين التالية:**
**1. احترام الجميع:**
  - **.يجب على الجميع احترام الآخرين وعدم الإساءة إليهم بأي شكل من الأشكال**
  - **.يمنع النقاشات السياسية والدينية المثيرة للجدل والتي قد تؤدي إلى الفتنة**
**2. المحتوى الديني:**
  - **.يجب أن يكون المحتوى المنشور مناسبًا ويتماشى مع قيم الإسلام وتعاليمه**
  - **.يمنع نشر الفتاوى بدون التأكد من مصدرها ومصداقيتها**
**3. النقاشات العامة:**
  - **.يُسمح بالنقاشات العامة الهادفة والمفيدة**
  - **.يمنع السبام والإعلانات بدون إذن مسبق من الإدارة أو النشر وما له صله بذلك**
**4. اللغة:**
  - **.يُفضل استخدام اللغة العربية الفصحى**
  - **.يمنع استخدام الألفاظ النابية أو المسيئة**
  - **.ليس من الضروري التحدث بالفصحى ولكن للحفاظ على بيئة نظيفة فقط**
**5. الأمان:**
  - **.يحظر نشر أي معلومات شخصية أو حساسة**
  - **.يمنع مشاركة الروابط الضارة أو المشبوهة**
  **الرجاء من الجميع الالتزام بهذه القوانين لضمان استمتاع الجميع ببيئة نظيفة وآمنة**
  **بارك الله فيكم، وشكرًا لتفهمكم والتزامكم**
**إدارة مجتمع ذكّـر.**`)
                .setImage(myRules)
                .setFooter({ text: "جزاكم الله خيرًا على الالتزام بالقوانين", iconURL: message.author.avatarURL() })
                .setTimestamp();

            message.channel.send({ embeds: [rules] });
        }

        if (message.content === prefix + "help") {
            const help = new EmbedBuilder()
                .setColor('AQUA')
                .setTitle("أوامـر البـوت")
                .setDescription(`**أوامر بوت ذكّر :...`)
                .setFooter({ text: "قائمة أوامر البوت", iconURL: message.author.avatarURL() })
                .setTimestamp();

            message.channel.send({ embeds: [help] });
        }

        if (message.content === prefix + "status") {
            const botStatus = new EmbedBuilder()
                .setColor('Purple')
                .setTitle("🟢 حالة البوت")
                .setDescription(`**البينج هو ${Date.now() - message.createdTimestamp}ms...**`)
                .setFooter({ text: "حالة البوت", iconURL: message.author.avatarURL() })
                .setTimestamp();

            message.channel.send({ embeds: [botStatus] });
        }
    } catch (error) {
        console.error('Error handling message:', error);
        message.reply('حدث خطأ أثناء معالجة الأمر الخاص بك. الرجاء المحاولة لاحقاً.');
    }
});

client.login(token);
