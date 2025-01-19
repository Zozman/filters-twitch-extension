<p align="center">
  <a href="#">
    <picture>
      <img src="images/listingAssets/screenshots/screenshot1.gif" alt="Animated gif of the Filters Extension in use">
    </picture>
  </a>
</p>

### Filters is a [Twitch Extension](https://dev.twitch.tv/docs/extensions/) that allows viewers to add and modify filters to the video of the stream.

## Releases

Releases can be found on the [Releases Page](https://github.com/Zozman/filters-twitch-extension/releases) and are created using Git Tagging using any `v*` tags to correspond to a Release. 

## Issues / Bugs / Things People Are Mad About

Issues and bug reports can be filed on the [GitHub Issues Page](https://github.com/Zozman/filters-twitch-extension/issues).

## Contributing

Contributions are welcome!  Get started by [forking the repo](https://github.com/Zozman/filters-twitch-extension/fork), working on your contribution, and [filing a pull request](https://github.com/Zozman/filters-twitch-extension/compare) when you're ready.

## Development

### Environment Setup

1. Ensure [NodeJS](https://nodejs.org/en) is installed on your system.
2. Run `npm install` to install dependencies.

### Running The Local Dev Server

Local development uses [Rspack Dev Server](https://rspack.dev/guide/features/dev-server) to allow for local development and uses [Mirage JS](https://miragejs.com/) for locally mocking calls to the [Twitch API](https://dev.twitch.tv/docs/api/).  The following commands are available:

- `npm run dev`
    - Spins up a local development server and have the [overlay](./src/overlay/) open in the browser.
- `npm run dev:config`
    - Does the same thing as `npm run dev` except opens the [config page](./src/config/) by default instead.

### Localization

This extension uses [@lit/localize](https://lit.dev/docs/localization/overview/) to handle localization based on the configuration defined in [the @lit/localize localization schema](./lit-localize.json) including what languages are supported.  The following commands are available:

- `npm run localize:extract`
    - Extracts and updates strings [marked for localization](https://lit.dev/docs/localization/overview/#making-strings-and-templates-localizable) into `.xlf` files in the [`xliff` directory](./xliff/).
    - This command will not replace existing translations in the `.xlf` files and only adds new strings.
- `npm run localize:build`
    - Uses the `.xlf` files build `.ts` files used by the build into the [`src/generated` directory](./src/generated).

### Build

This extension uses [Rspack](https://rspack.dev) to handle building and packaging the extension and the following commands are available:

- `npm run build`
    - Builds the extension and puts the resulting build in the `dist` directory.
- `npm run package`
    - Packages the `dist` directory into a `.zip` file suitable for uploading into the [Twitch Developer Console](https://dev.twitch.tv/console).
    - `.zip` file will be in the format of `filters-twitch-extension-<VERSION>.zip`.
- `npm run prod`
    - Runs `npm run build` followed by `npm run package` in one command.
- `npm run clean`
    - Deletes any existing build artifacts.
        - `dist` directory
        - `filters-twitch-extension-<VERSION>.zip` file

## License

The source code is [licensed under The MIT License](./LICENSE.md).  The [Filters image](./images/filters/filtersOriginal.svg) is used under a purchased Royalty-Free Commercial License from [The Noun Project](https://thenounproject.com/icon/video-effect-3554427/).

## About

Filters is cobbled together by [Zac Lovoy](https://thenounproject.com/icon/video-effect-3554427/) (aka [BigZoz on Twitch](https://www.twitch.tv/bigzoz)) and is the same goober who brought you [YarpBot](https://yarpbot.com), which you should check out because it's cool and I don't have a Soundcloud to link to here.

Created for the [Twitch Streamer Tools Hackathon](https://twitchstreamertools.devpost.com/) 2024.