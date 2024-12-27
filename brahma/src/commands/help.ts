export const showHelp = () => {
  console.log(`
  Usage: brhm <COMMAND> <?ARG>

  COMMAND      | ARG           | RESULT
  ---------------------------------------------------------------------------------
  h, help      |               | Shows this help message
  v, version   |               | Shows the version number
  c, create    | <app-dirname> | Creates a maya app scaffold in the given directory
  i, install   | <?package>    | Installs app or specific package if provided
  u, uninstall | <?package>    | Uninstalls app or specific package if provided
  s, stage     |               | Stages the app to localhost for testing
  p, publish   |               | Generates the minified prod version of the app
  r, reset     |               | Resets the karma file and re-installs the app


  Examples: 
    - brhm create my-app
    - brhm c my-app  
    - brhm s
    - brhm stage
    - brhm install
    - brhm install lodash
`);

  process.exit();
};
