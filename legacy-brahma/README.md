# @ckzer0/brahma-cli

## Description

Cli tool to generate and develop Maya apps.

## Installation

```bash
npm install -g @ckzer0/brahma-cli
```

## Usage

Usage:
`brahma [options] [command]`

Options:
`-h, --help display help for command`

Commands:

| Command                | Action                                                                       |
| ---------------------- | ---------------------------------------------------------------------------- |
| `create <appName>`     | Creates a new maya app                                                       |
| `init `                | Initializes files of new maya app or reset files to inital state             |
| `install`              | Installs or updates the configuration and packages based on maya config file |
| `stage`                | Builds the app in 'stage' mode for dev and testing                           |
| `add <packageName>`    | Adds an npm package to be used in the app                                    |
| `remove <packageName>` | Removes the npm package from the app                                         |
