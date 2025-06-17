# Debugger Changelog

## Version 2.0.0

### API

> - The API is now available at `game.modules.get('debugger').api`
> - Added API argument validation that throws an error when a method gets called
>   with invalid parameters

### Internal

> - Moved module to [monorepo](https://github.com/RPG-Made-Simple/FVTT-Debugger)
> - Changed language to `typescript`
> - Added `package.json` to manage the module
> - Moved boilerplate code into a common project inside the monorepo
> - Removed unused comments
> - Added `tsdoc` notation above all code
> - Added unit testing
> - Relevant types are properly exported

## Version 1.0.1

### Internal

> - Changed identation from `4` spaces to `2` spaces

### CI/CD

> - Enabled deploy on Foundry

## Version 1.0.0

### API

> - Added `shouldDebugGlobal()`
> - Added `Debugger.shouldDebug()`
> - Added `Debugger.shouldSave()`
> - Added `Debugger.log()`
> - Added `Debugger.info()`
> - Added `Debugger.warn()`
> - Added `Debugger.error()`
> - Added `Debugger.dump()`
> - Added `dumpAll()`

### Internal

> - No `file` or `folder` gets created unless requested

### CI/CD

> - Github workflow now releases the module to Foundry
