![PlexPurchases Header](https://i.imgur.com/ZBSXcgt.png)

PlexPurchases is a plugin & website that enhances Mineplex's built in Purchase system. It allows developers to quickly
create products in a web UI, and generate an in-game UI to reflect their configuration.

It also allows for simple, command based action setup, similar to that of Tebex.

## Adding to your project

### Step 1: Install

We've designed this to be as simple to use as possible, drag and drop
the plugin using our [latest release](https://github.com/PlexPrison/PlexPurchases/releases) into a folder called
`external-plugins` within your Mineplex project.

### Step 2: Configure

![Web UI](https://i.imgur.com/o17Mb5x.png)

Then, [head to our setup UI](https://plexpurchases-setup.plexprison.com) and set-up your purchases! (follow the
on-screen instructions). You'll then need to unzip the generated zip file **into your project folder** and run the bash script generated (inside of your project folder).

## Player Usage

Players can access the automatically generated user interface using `/store` or `/buy`, this will show them:

- Purchases made:
    - Their ongoing subscriptions (if they have any)
    - Their previous purchases (if they have any)
- Purchases they're able to make:
    - Any subscriptions they have permission to start (permission enabled/disabled in the setup UI)
    - Any one time purchases they have permission to buy (permission enabled/disabled in the setup UI)
    - Any multiple time purchases they have permission to buy (permission enabled/disabled defined in the setup UI)

## Contributing

We welcome any contributions to improve this project, this is made as a result of a need to have a consistent, easy to
use, and quick to setup experience.

### User Interface (setup UI)

#### Building

#### Running locally

1. Navigate to the `website` directory:
   ```sh
   cd website
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
4. Open the provided local URL in your browser (usually http://localhost:5173)

### Spigot Plugin

#### Building

This plugin uses gradle, run
`./plugin/gradlew build`
