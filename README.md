# Rankup LoL Bot

This repo contains a discord bot that allows you to track your league of legends stats, your friends stats and your last games stats.
This is a personal project that I made to learn more about discord.js and the Riot Games API. I then upgraded it to a more complete bot with more features over the years.

You can learn more about this project on the [website](https://rankup.somi.blaisot.org). Don't hesitate to contact me if you have any questions.

If you want to clone this repo and use it for your own server, feel free to do so but i'd prefer if you contact me, maybe I can add the features you need :wink:. Otherwise, you can use the bot as provided by the license (Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)).

## 1 - Install and Run

* **Clone this repo**

```bash
git clone https://github.com/KwikKill/Kwik_bot.git
```

* **Create a database**

Follow the instructions from this [tutoriel](https://www.microfocus.com/documentation/idol/IDOL_12_0/MediaServer/Guides/html/English/Content/Getting_Started/Configure/_TRN_Set_up_PostgreSQL_Linux.htm) and setup a local database with user and password. These values need to be set as environment variables.

The database schema can be found [bellow](#25-database)

* **Install dependencies**

```bash
npm install
```

* **Configure your env file**

Setup the env file to add you personnal token, database credentials and Riot Games API token.
```yml
DISCORD_TOKEN=''
RIOT_API_KEY=''
DISCORD_CLIENT_ID=''
DISCORD_CLIENT_SECRET=''
POSTGRES_USER=''
POSTGRES_PASSWORD=''
DB_NAME=''
VERBOSE=''
```

* **Load environnement variables containing your token and key**

```bash
source .env
```

* **Launch the bot**

```bash
node index.js
```

* **Enjoy !**

## 2 - Organisation

This repository is a discord bot using slash commands, listeners, timers, components and using a local database.

### 2.1 - Slash commands

Every slash commands are in the `commands` folder. Each command is in a `command.js` file that contains the command code, the command description and usage and the command options.

Theses files are formatted as bellow :

```javascript
module.exports = {
    name: 'command_name',
    group: 'command_group',
    description: 'command_description',
    permission: 'owner || none',
    hidden: true || false,
    serverid: ['server_id',...],
    place: 'guild || dm || both',
    deploy: true || false,
    help: [
        {
            "name": "- __command__ :",
            "value": "command_help_description"
        },
        ...
    ],
    options: [
        {
            ...
        }
    ]
    async run(message, client, interaction) {
        // Command code
    },
    async autocomplete(client, interaction) {
        // Autocomplete code
    }
};
```

### 2.2 - Listeners

Every listeners are in the `listeners` folder. Each listener is in a `listener.js` file that contains the listener code and description.

Theses files are formated as bellow :

```javascript
module.exports = {
    name: 'listener_name',
    group: 'listener_group',
    description: 'listener_description',
    type: 'listener_type',
    async run(client, ...args) {
        // Listener code
    }
};
```

### 2.3 - Components

Every components are separated in two folders. the `conTEXT-menu` folder and the `buttons` folder. Each component is in a `component.js` file that contains the component code and description.

Theses files are formated as bellow (for conTEXT-menu) :

```javascript
module.exports = {
    name: 'component_name',
    description: 'component_description',
    permission: 'owner || none',
    serverid: ['server_id',...],
    type: 'component_type',
    async run(interaction, client) {
        // Component code
    }
};
```

Or as bellow (for buttons) :

```javascript
module.exports = {
    name: 'component_name',
    description: 'component_description',
    permission: 'owner || none',
    serverid: ['server_id',...],
    async run(interaction, client) {
        // Component code
    }
};
```

### 2.4 - Timers

Every timers are in the `timers` folder. Each timer is in a `timer.js` file that contains the timer code and description.

Theses files are formated as bellow :

```javascript
module.exports = {
    name: 'timer_name',
    group: 'timer_group',
    description: 'timer_description',
    on_setup: true || false,
    timer: integer,
    async run(client) {
        // Timer code
    }
};
```

### 2.5 - Database

The database is a local postgresql database. The database is used to store league of legends matchs and summoners info.

The database is formated as bellow :

```sql
CREATE TABLE summoners (
 puuid TEXT NOT NULL,
 username TEXT NOT NULL,
 accountid TEXT NOT NULL,
 id TEXT NOT NULL,
 discordid TEXT NOT NULL,

 rank_solo TEXT NOT NULL,
 tier_solo TEXT NOT NULL,
 lp_solo INT NOT NULL,

 rank_flex TEXT NOT NULL,
 tier_flex TEXT NOT NULL,
 lp_flex INT NOT NULL,

 region TEXT NOT NULL,
 priority INT NOT NULL,
 gamename TEXT NOT NULL,
 tagline TEXT NOT NULL,

 PRIMARY KEY (puuid, discordid)
);
```

```sql
CREATE TABLE matchs (
 puuid TEXT NOT NULL,
 player TEXT NOT NULL,
 gamemode TEXT NOT NULL,

 champion TEXT NOT NULL,
 gold INT NOT NULL,
 lane TEXT NOT NULL,
 kill INT NOT NULL,
 deaths INT NOT NULL,
 assists INT NOT NULL,
 result TEXT NOT NULL,
 total_damage INT NOT NULL,
 tanked_damage integer NOT NULL,
 heal integer NOT NULL,
 neutral_objectives INT NOT NULL,
 wards INT NOT NULL,
 pinks INT NOT NULL,
 vision_score INT NOT NULL,
 cs INT NOT NULL,
 length NUMERIC NOT NULL,
 total_kills INT NOT NULL,

 first_gold BOOLEAN NOT NULL,
 first_damages BOOLEAN NOT NULL,
 first_tanked BOOLEAN NOT NULL,

 double INT NOT NULL,
 tripple INT NOT NULL,
 quadra INT NOT NULL,
 penta INT NOT NULL,

 time_spent_dead INT NOT NULL,
 "timestamp" BIGINT NOT NULL,

 summoner1id INT,
 summoner2id INT,

 item0 INT,
 item1 INT,
 item2 INT,
 item3 INT,
 item4 INT,
 item5 INT,
 item6 INT,

 patch TEXT,

 rune_0_var1 INT,
 rune_0_var2 INT,
 rune_0_var3 INT,
 rune_0_perk INT,

 team_id INT,
 placement INT,

 PRIMARY KEY (puuid, player),
 FOREIGN KEY (player) REFERENCES summoners (puuid)
);
```

```sql
CREATE TABLE mastery (
 discordid TEXT NOT NULL,
 first_mastery_champ TEXT NOT NULL,
 first_mastery INT NOT NULL,
 second_mastery_champ TEXT NOT NULL,
 second_mastery INT NOT NULL,
 third_mastery_champ TEXT NOT NULL,
 third_mastery INT NOT NULL,
 total_point INT NOT NULL,
 mastery7 INT NOT NULL,
 mastery6 INT NOT NULL,
 mastery5 INT NOT NULL,

 PRIMARY KEY (discordid)
);
```

This implementation is not perfect and can/will be improved. If you have any idea to improve this database, feel free to contact me.

The LoL fetching game code's frequency was tested with a 1500 summoners DB over a long period. 
