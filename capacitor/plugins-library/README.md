# krikoo-capacitor
Set of Capacitor plugins compatible with Capacitor's plugins.

#### CONTENTS
[Installation](#installation)  
[Plugin Links](#plugin-links)  

# Installation
```
$ npm i krikoo-capacitor@latest
```

### iOS configuration
There is no needed.

### Android configuration
Open main activity project file located at:
```
app -> java -> com.domain.myapplication -> MainActivity
```
Import the following dependencies:
```java
import com.krikoo.capacitor.datastorage.DataStorage;
import com.krikoo.capacitor.filepicker.FilePicker;
import com.krikoo.capacitor.opener.Opener;
import com.krikoo.capacitor.sharer.Sharer;
```
Add into `this.init` method the following classes:
```
add(DataStorage.class);
add(FilePicker.class);
add(Opener.class);
add(Sharer.class);
```

# Plugin Links
  - [Data Storage](https://github.com/krikoo-team/hybrid/blob/master/capacitor/plugins-library/src/data-storage/README.md)
  - [FilePicker](https://github.com/krikoo-team/hybrid/blob/master/capacitor/plugins-library/src/file-picker/README.md)
  - [Opener](https://github.com/krikoo-team/hybrid/blob/master/capacitor/plugins-library/src/opener/README.md)
  - [Sharer](https://github.com/krikoo-team/hybrid/blob/master/capacitor/plugins-library/src/sharer/README.md)

# Developing setup

TODO
