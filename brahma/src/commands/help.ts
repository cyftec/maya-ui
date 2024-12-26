export const showHelp = () => {
  console.log(`
  Usage: brhm <COMMAND> <ARG>

  COMMAND      | ARG               | RESULT
  ---------------------------------------------------------------------------------------
  h, help      |                   | Shows this help message
  v, version   |                   | Shows the version number
  c, create    | <project-dirname> | Creates a maya app scaffold in the given directory
  i, install   |                   | Installs the config and packages based on 'karma.ts'
  i, install   | <package>         | Installs the given package as dependency
  u, uninstall |                   | Uninstalls the config and packages
  u, uninstall | <package>         | Uninstalls the given package
  s, stage     |                   | Stages the app to localhost for testing
  p, publish   |                   | Generates the minified prod version of the app


  Examples: 
    - brhm create my-app
    - brhm c my-app  
    - brhm s
    - brhm stage
    - brhm i lodash
    - brhm install lodash
`);

  process.exit();
};
