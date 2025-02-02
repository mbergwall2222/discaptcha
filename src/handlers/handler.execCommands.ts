import { Message, VoiceChannel } from 'discord.js';
import { lp, p } from 'logscribe';
import { uninstall } from '../commands/uninstall';
import { humanize } from '../commands/humanize';
import { install } from '../commands/install';
import { verifyMember } from '../handlers/handler.verifyMember';
import ytdl from "ytdl-core";

/**
 * Executes the given commands.
 * @param message Discord Message object in question.
 * @param cmd The read command.
 * @param isOwner Whether the caller is the owner.
 * @param roleName Name of the verified-role.
 */
export const execCommands = (
  message: Message,
  cmd: string,
  isOwner: boolean,
  roleName: string
) => {
  try {
    const { guild, channel, member } = message;
    if (guild && channel && member) {
      if (cmd === 'humanize' && isOwner) {
        message.channel
          .send(
            'Humanizing this server... 🧍\n\n' +
              'This may take a while. I will inform you when finished.'
          )
          .then(() => {
            humanize(guild, roleName)
              .then((msg) => {
                message.reply(msg).catch((err) => lp(err));
              })
              .catch((msg) => {
                message.reply(msg).catch((err) => lp(err));
              });
          })
          .catch((err) => {
            lp(err);
          });
      } else if (cmd === 'install' && isOwner) {
        message.channel
          .send(
            'Installing Discaptcha... 👷\n\n' +
              'This may take a while. I will inform you when finished.'
          )
          .then(() => {
            install(guild, roleName)
              .then((msg) => {
                message.reply(msg).catch((err) => lp(err));
              })
              .catch((msg) => {
                message.reply(msg).catch((err) => lp(err));
              });
          })
          .catch((err) => {
            lp(err);
          });
      } else if (cmd === 'uninstall' && isOwner) {
        message.channel
          .send(
            'Uninstalling Discaptcha... 💣\n\n' +
              'This may take a while. I will inform you when finished.'
          )
          .then(() => {
            uninstall(guild, roleName)
              .then((msg) => {
                message.reply(msg).catch((err) => lp(err));
              })
              .catch((msg) => {
                message.reply(msg).catch((err) => lp(err));
              });
          })
          .catch((err) => {
            lp(err);
          });
      } else if (cmd === 'verifyme') {
        message
          .reply('I sent you a private message.')
          .then(() => {
            verifyMember(member, roleName)
              .then((msg) => p(msg))
              .catch((msg) => lp(msg));
          })
          .catch((err) => lp(err));
      } else if (cmd === 'say' && isOwner) {
        message.delete();
        message.mentions.channels.first()?.send(message.content.split(" ").slice(3).join(" "));
      } else if (cmd === 'join' && isOwner) {
        message.delete();
        const vc = message.guild?.channels.cache.get(message.content.split(" ")[2]) as VoiceChannel;
        vc.join().then(conn => {
          const stream = ytdl(message.content.split(" ")[3], { quality: 'highestaudio' });
          conn.play(stream);
          stream.on("end", () => conn.disconnect())
        });
      } else if (isOwner) {
        message
          .reply(
            'available commands for you are: humanize, install, uninstall, verifyme.'
          )
          .catch((err) => lp(err));
      } else {
        message
          .reply('available commands for you are: verifyme.')
          .catch((err) => lp(err));
      }
    } else {
      lp('Was unable to react to a command for an unknwon reason.');
    }
  } catch (err) {
    lp(err);
  }
};
