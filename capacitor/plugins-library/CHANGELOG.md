##  (2021-03-26)

## [0.6.4](https://github.com/krikoo-team/hybrid/compare/0.6.3...0.6.4) (2021-03-26)

### Bug Fixes

* **opener(web)**: Added displayable name to file when it is not openable.


## [0.6.3](https://github.com/krikoo-team/hybrid/compare/0.6.1...0.6.3) (2021-03-23)

### Bug Fixes

* **opener(ios)**: Added Opener to Capacitor Plugins and fixed empty `path` condition.


## [0.6.1](https://github.com/krikoo-team/hybrid/compare/0.6.0...0.6.1) (2021-03-22)

### Docs

* **docs(plugins-library)**: Added contributors, home page, bugs page and sorted keywords alphabetically.

### Bug Fixes

* **sharer(ios)**: Fixed wrong enumeration access.
* **opener(ios)**: Fixed objc declaration.


## [0.6.0](https://github.com/krikoo-team/hybrid/compare/0.5.0...0.6.0) (2021-03-22)

### Features

* **feat(android)**: Added Opener plugin.
* **feat(ios)**: Added Opener plugin.
* **feat(Opener)**: Attribute `path` is now optional.
* **feat(web)**: Added Sharer plugin.

### Docs

* **docs(DataStorage)**: Updated with plugin configuration and known issues.
* **docs(FilePicker)**: Updated with plugin configuration.
* **docs(Opener)**: Updated with extended description for web, iOS and Android, plugin configuration and examples.
* **docs(plugins-library)**: Added Opener plugin configuration and readme link.
* **docs(Sharer)**: Updated with plugin configuration and added ´SomeFileDoesNotExist´ error and share status messages.

### Bug Fixes

* **sharer(android)**: Fixed error when it is sharing by using the `url` attribute.
* **sharer(ios)**: Fixed error when it is sharing by using the `url` attribute.


## [0.5.0](https://github.com/krikoo-team/hybrid/compare/0.4.1...0.5.0) (2021-03-18)

### Features

* **feat(web)**: Added Opener plugin.

### Docs

* **docs(Opener)**: Created readme file.


## [0.4.1](https://github.com/krikoo-team/hybrid/compare/0.3.1...0.4.1) (2021-02-14)

### Features

* **feat(android)**: Added FilePicker plugin.
* **feat(ios)**: Added FilePicker plugin.

### Docs

* **docs(FilePicker)**: Created readme file.

### Chores

* **chore(capacitor)**: Version incremented to `2.4.6`.

### Bug Fixes

* **sharer(android)**: Fixed unused displayable name.
* **datastorage(ios)**: Fixed wrong retrieved data when it is selected all key-values.


## [0.3.1](https://github.com/krikoo-team/hybrid/compare/0.3.0...0.3.1) (2021-01-26)

### Bug Fixes

* **datastorage(ios)**: Fixed wrong retrieved data when it is selected all key-values in iOS.


## [0.3.0](https://github.com/krikoo-team/hybrid/compare/0.2.0...0.3.0) (2020-10-28)

### Docs

* **docs(PluginsLibrary)**: Changed `Plugins link` index and added a better android configuration information.
* **docs(Capacitor)**: Removed unnecessary `Capacitor Plugin` link and added a `Sharer` link.
* **docs(Sharer)**: Fixed ShareOptions interface table.

### Chores

* **chore(capacitor)**: Version incremented to `2.4.2`.


## [0.2.0](https://github.com/krikoo-team/hybrid/compare/0.1.2...0.2.0) (2020-05-19)


### Features

* **feat(android)**: Added retrieveAll method to DataStorage plugin.
* **feat(ios)**: Added retrieveAll method to DataStorage plugin.
* **feat(web)**: Added retrieveAll method to DataStorage plugin.

### Docs

* **docs(DataStorage)**: Updated readme with retrieveAll new feature.


## [0.1.2](https://github.com/krikoo-team/hybrid/compare/0.1.0...0.1.2) (2020-05-19)

### Bug Fixes
* **datastorage(android)**: Fixed retrieving error in android platform for data storage plugin.
* **datastorage(web)**: Fixed "non updatable value" error in Web Data Storage plugin by changing "add" by "put" method.
* **datastorage(web)**: Fixed web error retrieving massive data from data storage.
* **datastorage(web)**: Exported data storage error enum.


### Docs

* **docs(PluginsProxy)**: Updated links of the plugins for absolute ones to github.


## 0.1.0 (2020-05-18)

### Features

* **feat(android)**: Added DataStorage plugin.
* **feat(ios)**: Added DataStorage plugin.
* **feat(web)**: Added DataStorage plugin.

### Docs

* **docs(DataStorage)**: Created readme file.
* **docs(Sharer)**: Updated readme file.


## 0.0.4 (2020-04-20)

### Features

* **feat(android)**: Added Sharer plugin.
* **feat(ios)**: Added Sharer plugin.

### Docs

* **docs(Sharer)**: Created readme file.
