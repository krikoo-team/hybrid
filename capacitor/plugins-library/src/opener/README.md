# Opener
It allows to open a file by using native actions depending on the used device:
- For web, it opens a file in the browser if it is able to, or it just downloads the file. 
- For Android and iOS it presents a native action sheet with compatible apps to open to.
It uses capacitor's Filesystem plugin.

#### CONTENTS
[Configuration](#configuration)  
[References](#references)    
[Usage](#usage)  
[API](#api)  
[Interfaces](#interfaces)  

# Configuration

### iOS
There is no needed.

### Android
Open main activity project file located at:
```
app -> java -> com.domain.myapplication -> MainActivity
```
Import the following dependencies:
```java
import com.krikoo.capacitor.opener.Opener;
```
Add into `this.init` method the following classes:
```
add(Opener.class);
```

# References
- Capacitor's plugins:
  - [Filesystem](https://capacitor.ionicframework.com/docs/apis/filesystem)

# Usage

```typescript
import {FilesystemDirectory} from '@capacitor/core';
import {Opener, OpenOptions} from 'krikoo-capacitor';

// It opens a file by using its paths and directory.
const openOptions: OpenOptions = {
  path: 'path/to/file.ext',
  directory: FilesystemDirectory.Data,
  displayableName: 'Displayable name',
  dialogTitle: 'Dialog title'
};
Opener.open(openOptions);

// It opens a file by using its absolute url.
const openOptions: OpenOptions = {
  url: 'file:///path/file.ext',
  displayableName: 'Displayable name',
  dialogTitle: 'Dialog title'
};
Opener.open(openOptions);
```

# API

## open
```typescript
open(options: OpenOptions): Promise<{ status: any }> {
```
It enables the file open options.

**options** [OpenOptions](#interfaces)  
**return** `Promise<{ status: any }>`  
**error** `Promise<{ message: string }>`  

# Interfaces
 
## OpenOptions

| Property | Type | Description |
|--|--|--|
| dialogTitle | `string` (optional) | Set a title for the share modal. Android only. |
| directory | `FilesystemDirectory` (optional) | `FilesystemDirectory.Documents` | The `FilesystemDirectory` to store the file in. |
| displayableName | `Array<string>` (optional) | `(Same as path)` | Custom file name with its extension (important set an extension to display a thumbnail). Default its origin name. |
| path | `string` | - | The path to the file with its name and extension included: `path/to/file.ext` |
| url | `string` (optional) | Set a URL to share. |
