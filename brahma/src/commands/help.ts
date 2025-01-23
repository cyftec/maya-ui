export const showHelp = () => {
  console.log(`
  Usage: brahma <COMMAND> <?ARG> <?--SPECIFIER>

  COMMAND      | ARG --SPECIFIER      | RESULT
  --------------------------------------------------------------------------------
  h, help      |                      | Shows this help message
               |                      |
  v, version   | <?version>           | Upgrades or downgrades the cli version to
               |                      | the given version. If version is not
               |                      | provided, it simply shows the current
               |                      | version of the cli
               |                      | 
  c, create    | <appname>  <?--mode> | Creates the app scaffold directory in
               |                      | in 'web' mode if no mode is provided.
               |                      | If mode is provided, the scaffold app is
               |                      | created with that mode. Accepted modes are
               |                      | 'web' (default), 'ext' & 'pwa'
               |                      |
  i, install   | <?npmpackage>        | If no package name is provided, it
               |                      | installs the entire app based on karma.ts.
               |                      | If provided, it installs that specific
               |                      | npm package
               |                      |
  u, uninstall | <?npmpackage>        | If no package name is provided, it removes
               |                      | all the installed packages and generated
               |                      | files. If package name provided, it just
               |                      | uninstalls that specific npm package
               |                      |    
  s, stage     |                      | Stages the app for testing by genrating
               |                      | static site and serving it on localhost
               |                      |
  p, publish   |                      | Builds the minified static version of
               |                      | the app for deployment to prod
               |                      |
  r, reset     | <?--resetMode>       | Resets the karma file to base karma.ts
               |                      | state. Any change made to karma.ts file
               |                      | gets lost with this command.
               |                      | Acepptable rest modes are - 'hard' and
               |                      | 'soft' (default).
               |                      | If no or 'soft' reset mode is provided
               |                      | a soft reset is done preserving the
               |                      | app mode, i.e. 'web', 'ext' or 'pwa'.
               |                      | If 'hard' reset mode is provided, it
               |                      | resets the app to absolute base version
               |                      | of karma, i.e. a karma for 'web' app mode.
  --------------------------------------------------------------------------------


  Examples: 
    - brahma create my-app        // creates new scaffold app in 'web' mode
    - brahma c my-app             // same as 'brahma create my-app'
    - brahma create my-app --ext  // creates scaffold app in chrome-extension mode
    - brahma stage                // builds the app and starts local server
    - brahma install              // installs entire app
    - brahma install lodash       // installs only 'lodash' package
    - brahma version              // only shows the version e.g. v0.1.0
    - brahma version latest       // upgrades to @mufw/brahma@latest
    - brahma version 0.1.0        // shifts to @mufw/brahma@0.1.0
    - brahma reset --hard         // resets the karma for 'web' app mode
`);

  process.exit();
};
