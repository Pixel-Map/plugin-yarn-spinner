## How to add custom commands?
This plugin was designed to be easily extensible.  Let's say you'd like to add a new command
named `custom_hello`.  Not only that, but we also want it to accept a parameter of WHO to say
hello to.  Here's how you'd do it:

First, create your Yarn dialog file, exactly as you'd like it to be.

```yarn
title: SampleNode
---
Whatever other things you want to have happen.
<<custom_hello george>>
Other things...
===
```
Notice that "custom_hello" by default won't work, as that's not one of the commands built into
this plugin.  So, let's add it.

Using a "script" in the event editor, or via your own plugins javascript code, add the following:
```js
const customGreeter = (_callingEventId, name) => {console.log("Hi " + name + "!")};
if (!pixelmapYarnSpinner.commands.get('custom_hello')) {
  pixelmapYarnSpinner.addCommand('custom_hello', customGreeter);
}
```

The important part here is the `pixelmapYarnSpinner.addCommand` call.  This is how you add a
new command to the plugin.  The first parameter is the name of the command, and the second is
the function that will be called when the command is encountered in the Yarn dialog.  The function
will be passed the calling event ID, followed by any parameters that were passed to the command.

Provided this is invoked BEFORE the Yarn dialog is loaded, the command will be available to use.
