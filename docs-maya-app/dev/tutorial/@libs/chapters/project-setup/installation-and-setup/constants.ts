export const SETUP_PARA = `Firstly, make sure that below environments are ready.`;

type Section = {
  TITLE: string;
  PARA: string;
  STEPS: {
    DESCRIPTION: string;
    ALERT?: string | undefined;
    CODE?: string | undefined;
  }[];
};

export const SETUP: Section = {
  TITLE: `Environment setup`,
  PARA: `Firstly, make sure that below environments are ready.`,
  STEPS: [
    {
      DESCRIPTION: `Install VS Code from ##here|https://code.visualstudio.com/##. You can also use any other editor of your choice. But you'll miss some good-to-have benefits.`,
      ALERT: undefined,
      CODE: undefined,
    },
    {
      DESCRIPTION: `Open your favourite terminal.`,
      ALERT: undefined,
      CODE: undefined,
    },
  ],
};

export const INSTALLATIONS: Section = {
  TITLE: `Install packages and CLI library for Maya`,
  PARA: `After environment is set up, install below packages which is required
        for the development.`,
  STEPS: [
    {
      DESCRIPTION: `Install latest 'bun' package globally on your machine. Having 'nodejs' or 'npm' alongside 'bun' is not necessory.`,
      ALERT: `Only recommended way to install 'bun' globally on your machine is to do it from
  ##bun.sh|https://bun.sh/## website directly. Installing 'bun' globally using 
  'npm install -g bun' doesn't work well with Maya and its CLI currently.`,
      CODE: undefined,
    },
    {
      DESCRIPTION: `Check if bun is installed properly using below command in your terminal.`,
      ALERT: undefined,
      CODE: `bun`,
    },
    {
      DESCRIPTION: `Install 'brahma' Cli for developing Maya apps using below command.`,
      ALERT: undefined,
      CODE: `bun add -g @mufw/brahma`,
    },
    {
      DESCRIPTION: `Check if 'brahma' CLI is installed properly using below command in your terminal.`,
      ALERT: undefined,
      CODE: `brahma`,
    },
  ],
};

export const TASKS = [SETUP, INSTALLATIONS];
