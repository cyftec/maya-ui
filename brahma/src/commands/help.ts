export const showHelp = () => {
  console.log(`
  Usage: brahma <COMMAND> <?ARG>

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
    - brahma create my-app
    - brahma c my-app  
    - brahma s
    - brahma stage
    - brahma install
    - brahma install lodash
`);

  process.exit();
};
