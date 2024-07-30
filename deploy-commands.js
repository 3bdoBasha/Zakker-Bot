const { REST, Routes } = require('discord.js');
const { token, clientId, guildId } = require('./config.json');

// إنشاء عميل REST
const rest = new REST({ version: '10' }).setToken(token);

// قائمة الأوامر
const commands = [
    {
        name: 'embed',
        description: 'إنشاء إيمبد مخصص',
        options: [
            {
                name: 'title',
                type: 3, // STRING
                description: 'عنوان الإيمبد',
                required: true,
            },
            {
                name: 'description',
                type: 3, // STRING
                description: 'وصف الإيمبد',
                required: true,
            },
            {
                name: 'footer',
                type: 3, // STRING
                description: 'تذييل الإيمبد',
                required: false,
            },
            {
                name: 'color',
                type: 3, // STRING
                description: 'لون الإيمبد',
                required: false,
            },
            {
                name: 'image',
                type: 3, // STRING
                description: 'رابط الصورة للإيمبد',
                required: false,
            }
        ],

    },
    {
        name: "ping",
        description: "أمر البينج",
        options:[
            
        ]
    }
];

// نشر الأوامر
(async () => {
    try {
        console.log('بدأ نشر الأوامر');

        await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
            body: commands,
        });

        console.log('تم نشر الأوامر بنجاح');
    } catch (error) {
        console.error(error);
    }
})();
