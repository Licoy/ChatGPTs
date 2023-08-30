#!/bin/bash

# Get user inputs
read -p "Enter your OpenAI API Key: " openai_api_key
read -p "Enter your Discord Guild ID: " guild_id
read -p "Enter your Discord Channel ID: " channel_id
read -p "Enter your Discord User Token: " user_token

# Update docker-compose.yml file
sed -i "s/sk-xxx/$openai_api_key/g" docker-compose.yml
sed -i "s/mj_discord_guild_id: \"xxx\"/mj_discord_guild_id: \"$guild_id\"/g" docker-compose.yml
sed -i "s/mj_discord_channel_id: \"xxx\"/mj_discord_channel_id: \"$channel_id\"/g" docker-compose.yml
sed -i "s/mj_discord_user_token: \"xxx\"/mj_discord_user_token: \"$user_token\"/g" docker-compose.yml

# Deploy the services
docker-compose up -d

if [ $? -eq 0 ]; then
  echo "Services deployed successfully."
else
  echo "Failed to deploy services."
fi

