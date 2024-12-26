export const showHelp = () => {
  console.log(`
  Usage: brm <COMMAND> <ARG>

  COMMAND      | ARG            | RESULT
  ------------------------------------------------------------------------------------
  h, help      |                | Shows this help message
  v, version   |                | Shows the version number
  c, create    | <app-dir-name> | Creates a maya app scaffold in the given directory
  i, install   |                | Installs the config and packages based on 'karma.ts'
  u, uninstall |                | Uninstalls the config and packages
  s, stage     |                | Stages the app to localhost for testing
  p, publish   |                | Generates the minified prod version of the app
  a, add       | <package>      | Adds the package
  r, remove    | <package>      | Removes the package


  Examples: 
    - brm create my-app
    - brm -c my-app  
    - brm -s
    - brm stage
    - brm -a lodash
    - brm add lodash
`);

  process.exit();
};
