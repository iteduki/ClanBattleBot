"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.data = void 0;
const discord_js_1 = require("discord.js");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('setup')
    .setDescription('botを使い始める準備をします')
    .addRoleOption((option) => option.setName('ロール')
    .setDescription('作成するクランのロールを入力')
    .setRequired(true));
function execute(interaction) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        var roleName;
        if (interaction.options.data[0].role != null && interaction.options.data[0].role.managed) {
            roleName = interaction.options.data[0].role.name;
        }
        else {
            yield interaction.reply({ content: '指定されたロールは作成したロールではありません', ephemeral: true });
            return;
        }
        var guild;
        if (interaction.guild != null) {
            guild = interaction.guild;
        }
        else {
            return;
        }
        const categoryName = 'クランバトル管理(' + roleName + ')';
        if (guild.channels.cache.find((channel) => channel.name === categoryName) != null) {
            yield interaction.reply({ content: '既にチャンネルのセットアップが完了しています', ephemeral: true });
            return;
        }
        // カテゴリ作成
        yield guild.channels.create({ name: categoryName, type: discord_js_1.ChannelType.GuildCategory });
        const categoryId = (_b = (_a = guild.channels.cache.find((channel) => channel.name === categoryName)) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : '';
        // 作成したカテゴリ内にチャンネル作成
        yield createManagementChannel(guild, '凸管理', categoryId);
        yield createBossChannel(guild, '1ボス', categoryId);
        // await createBossChannel(guild, '2ボス', categoryId)
        // await createBossChannel(guild, '3ボス', categoryId)
        // await createBossChannel(guild, '4ボス', categoryId)
        // await createBossChannel(guild, '5ボス', categoryId)
        yield interaction.reply({ content: 'チャンネルを作成しました', ephemeral: true });
    });
}
exports.execute = execute;
exports.default = {
    data: exports.data,
    execute
};
// 凸管理用チャンネル作成
function createManagementChannel(guild, channelName, categoryId) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        yield guild.channels.create({ name: channelName, parent: categoryId });
        const button = new discord_js_1.ButtonBuilder().setCustomId('hoge').setStyle(discord_js_1.ButtonStyle.Primary).setLabel("にゃーん").setEmoji("🐈");
        const row = new discord_js_1.ActionRowBuilder().addComponents(button).toJSON();
        const channelId = (_a = guild.channels.cache.find((channel) => channel.name === channelName && channel.parentId === categoryId)) === null || _a === void 0 ? void 0 : _a.id;
        const channel = guild.channels.cache.get(channelId !== null && channelId !== void 0 ? channelId : '');
        if (channel === null || channel === void 0 ? void 0 : channel.isTextBased()) {
            yield channel.send({
                content: "猫になりたい",
                components: [
                    row
                ]
            });
        }
    });
}
// 各ボス用チャンネル作成
function createBossChannel(guild, channelName, categoryId) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        yield (guild === null || guild === void 0 ? void 0 : guild.channels.create({ name: channelName, parent: categoryId }));
        // コンポーネント定義
        const buttonDeclaration = new discord_js_1.ButtonBuilder().setCustomId('declaration').setStyle(discord_js_1.ButtonStyle.Primary).setLabel("凸宣言");
        const buttonRemainingHP = new discord_js_1.ButtonBuilder().setCustomId('remainingHP').setStyle(discord_js_1.ButtonStyle.Danger).setLabel("残HP");
        const channel = (_a = guild === null || guild === void 0 ? void 0 : guild.channels) === null || _a === void 0 ? void 0 : _a.cache.get((_c = (_b = guild === null || guild === void 0 ? void 0 : guild.channels.cache.find((channel) => channel.name === channelName && channel.parentId === categoryId)) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : '');
        if (channel === null || channel === void 0 ? void 0 : channel.isTextBased()) {
            yield channel.send({
                components: [
                    new discord_js_1.ActionRowBuilder().addComponents(buttonDeclaration, buttonRemainingHP).toJSON(),
                ]
            });
        }
    });
}
