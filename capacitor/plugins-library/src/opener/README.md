# Opener
It opens the file in a browser if it is able to, or it downloads the file. It uses capacitor's Filesystem plugin.

#### CONTENTS
[References](#references)  
[Known Issues](#known-issues) 
[Usage](#usage)  
[API](#api)  
[Interfaces](#interfaces)  

# References
- Capacitor's plugins:
  - [Filesystem](https://capacitor.ionicframework.com/docs/apis/filesystem)

# Known Issues
- 

# Usage

```typescript
import {FilesystemDirectory} from '@capacitor/core';
import {Opener, OpenOptions} from 'krikoo-capacitor';

// Share simple text by presenting a native modal
const openOptions: OpenOptions = {
  path: 'path/to/file.ext',
  directory: FilesystemDirectory.Data,
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
It opens the file in a browser if it is able to, or it downloads the file.

**options** [ShareOptions](#interfaces)  
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
