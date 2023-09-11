import { ButtonBuilder, ButtonStyle, ButtonInteraction, TextBasedChannel, EmbedBuilder, ActionRowBuilder } from 'discord.js';
import dayjs from 'dayjs';

import ManagementMessage from '../../messages/ManagementChannelMessage';
import DataSource from '../../datasource';
import User from '../../entity/User';
import Clan from '../../entity/Clan';
import Event from '../../entity/Event';

export const customId = 'reload_attack_status'
export const data = new ButtonBuilder()
  .setCustomId('reload_attack_status')
  .setStyle(ButtonStyle.Secondary)
  .setLabel("凸状況更新")

export async function execute(interaction: ButtonInteraction) {
  const guild = interaction.guild
  if (guild == null) {
    return
  }
  const channel = guild.channels.cache.find((channel) => channel.id === interaction.channel!.id)
  const today = dayjs().format()
  const event = await DataSource.getRepository(Event)
    .createQueryBuilder('event')
    .where('event.fromDate <= :today', { today })
    .andWhere('event.toDate >= :today', { today })
    .getOne();
  const clan = await DataSource.getRepository(Clan).findOneBy({ discordCategoryId: channel!.parentId! })
  const users = await DataSource.getRepository(User).find({
    where: { clanId: clan?.id! },
    relations: {
      reports: {
        event: true
      }
    }
  })
  // await interaction.message.delete()
  await ManagementMessage.sendMessage(interaction.channel!, users, event, false)
  const reply = await interaction.reply({ content: '更新しました', ephemeral: true })
  await setTimeout(() =>{},10000);
  await reply.delete()
}

export default {
  customId,
  data,
  execute,
}
