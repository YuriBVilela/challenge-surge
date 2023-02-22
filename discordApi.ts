import fetch from "node-fetch";

const getDiscordRoles = async (playerName: string): Promise<string[]> => {
  const response = await fetch(`https://api.discord.com/users/${playerName}`, {
    headers: {
      Authorization: "Bot <discord-bot-token>",
      "User-Agent": "DiscordBot",
    },
  });

  const user = await response.json();
  return user.roles;
};

export { getDiscordRoles };
