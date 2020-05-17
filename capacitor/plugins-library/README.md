# krikoo-capacitor
Set of Capacitor plugins compatible with Capacitor's plugins.

#### CONTENTS
[Installation](#installation)  
[Plugins](#plugins) 

# Installation
```
$ npm i krikoo-capacitor@latest
```

### Android configuration
Add into `this.init` method of `app -> java -> com.domain.myaplication -> MainActivy` file:
```
add(Sharer.class);
```

# Plugins
  - [Data Storage](src/data-storage/README.md)
  - [Sharer](src/sharer/README.md)
