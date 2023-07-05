import { ChannelType, SlashCommandBuilder, Guild, ButtonBuilder, ActionRowBuilder, CommandInteraction, ButtonStyle } from 'discord.js';
export const data = new SlashCommandBuilder()
  .setName('setup')
  .setDescription('botを使い始める準備をします')
  .addRoleOption(
    (option) =>
      option.setName('ロール')
      .setDescription('作成するクランのロールを入力')
      .setRequired(true)
  );

export async function execute(interaction: CommandInteraction) {
  var roleName: string
  if (interaction.options.data[0].role != null && interaction.options.data[0].role.managed) {
    roleName = interaction.options.data[0].role.name
  } else {
    await interaction.reply({ content: '指定されたロールは作成したロールではありません', ephemeral: true })
    return
  }

  var guild: Guild
  if (interaction.guild != null) {
    guild = interaction.guild
  } else {
    return
  }
  const categoryName = 'クランバトル管理(' + roleName + ')'
  if (guild.channels.cache.find((channel) => channel.name === categoryName) != null) {
    await interaction.reply({content: '既にチャンネルのセットアップが完了しています', ephemeral: true })
    return
  }
  // カテゴリ作成
  await guild.channels.create({ name: categoryName, type: ChannelType.GuildCategory })
  const categoryId = guild.channels.cache.find((channel) => channel.name === categoryName)?.id ?? ''

  // 作成したカテゴリ内にチャンネル作成
  await createManagementChannel(guild, '凸管理', categoryId)
  await createBossChannel(guild, '1ボス', categoryId)
  // await createBossChannel(guild, '2ボス', categoryId)
  // await createBossChannel(guild, '3ボス', categoryId)
  // await createBossChannel(guild, '4ボス', categoryId)
  // await createBossChannel(guild, '5ボス', categoryId)

  await interaction.reply({ content: 'チャンネルを作成しました', ephemeral: true });
}

export default {
  data,
  execute
};

// 凸管理用チャンネル作成
async function createManagementChannel(guild: Guild, channelName: string, categoryId: string) {
  await guild.channels.create({ name: channelName, parent: categoryId })

  const button = new ButtonBuilder().setCustomId('hoge').setStyle(ButtonStyle.Primary).setLabel("にゃーん").setEmoji("🐈")
  const row = new ActionRowBuilder().addComponents(button).toJSON() as any

  const channelId = guild.channels.cache.find((channel) => channel.name === channelName && channel.parentId === categoryId)?.id
  const channel = guild.channels.cache.get(channelId ?? '')
  if (channel?.isTextBased()) {
    await channel.send({
      content: "猫になりたい",
      components: [
        row
      ]
    })
  }
}

// 各ボス用チャンネル作成
async function createBossChannel(guild: Guild | null, channelName: string, categoryId: string | undefined) {
  await guild?.channels.create({ name: channelName, parent: categoryId })

  // コンポーネント定義
  const buttonDeclaration = new ButtonBuilder().setCustomId('declaration').setStyle(ButtonStyle.Primary).setLabel("凸宣言")
  const buttonRemainingHP = new ButtonBuilder().setCustomId('remainingHP').setStyle(ButtonStyle.Danger).setLabel("残HP")

  const channel = guild?.channels?.cache.get(guild?.channels.cache.find((channel) => channel.name === channelName && channel.parentId === categoryId)?.id ?? '')
  if (channel?.isTextBased()) {
    await channel.send({
      components: [
        new ActionRowBuilder().addComponents(buttonDeclaration, buttonRemainingHP).toJSON() as any,
      ]
    })
  }
}
