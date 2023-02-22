import { PrismaClient } from "@prisma/client";
import { getDiscordRoles } from "./discordApi";

const prisma = new PrismaClient();

const QueueConnection = (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) => {
  target.connectToQueue = async function (playerName: string) {
    const player = await prisma.player.findUnique({
      where: { name: playerName },
    });

    if (player) {
      await prisma.player.update({
        where: { name: playerName },
        data: { isConnected: true },
      });
    } else {
      await prisma.player.create({
        data: {
          name: playerName,
          isConnected: true,
        },
      });
    }

    const discordRoles = await getDiscordRoles(playerName);

    let position = 1;
    if (discordRoles.includes("VIP")) {
      position = 2;
    }

    await prisma.queue.create({
      data: { playerName },
    });
  };
};

class QueueManager {
  @QueueConnection
  static async connectToQueue(playerName: string) {}

  static async removeFromQueue(playerName: string) {
    await prisma.queue.delete({
      where: { playerName },
    });

    await prisma.player.update({
      where: { name: playerName },
      data: { isConnected: false },
    });
  }
}
