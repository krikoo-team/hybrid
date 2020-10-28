# Sharer
Share files and text by using the native share modal or a email app. It is based in Capacitor's `Share` plugin and it is compatible with capacitor's `Filesystem` plugin.

#### CONTENTS
[References](#references)  
[Known Issues](#known-issues) 
[Usage](#usage)  
[API](#api)  
[Interfaces](#interfaces)  
[Enumerations](#enumerations)  

# References
- Capacitor's plugins:
  - [Share](https://capacitor.ionicframework.com/docs/apis/share)
  - [Filesystem](https://capacitor.ionicframework.com/docs/apis/filesystem)

# Known Issues
- **iOS**: Share files by using Apple Mail it is possible, but with other app it will open the native modal with sharing options and just subject and body could be set of the email options.

# Usage

```typescript
import {FilesystemDirectory} from '@capacitor/core';
import {Sharer, ShareOptions} from 'krikoo-capacitor';

// Share simple text by presenting a native modal
const shareOptions: ShareOptions = {
  dialogTitle: 'Dialog Title',
  text: 'Some text here'
};
Sharer.share(shareOptions);

// Share one file by presenting a native modal
const shareOptions: ShareOptions = {
  files: [{
    directory: FilesystemDirectory.Data,
    path: 'path/to/file.ext'
  }]
};
Sharer.share(shareOptions);

// Share some information by using specific email app.
const shareOptions: ShareOptions = {
  email: {
    app: ShareEmailApp.Outlook,
    subject: 'The subject',
    cc: ['name@domain.com']
  }
};
Sharer.share(shareOptions);

// Share files by using default native app.
const shareOptions: ShareOptions = {
  email: {
    app: ShareEmailApp.Default
  },
  files: [{
    directory: FilesystemDirectory.Data,
    path: 'path/to/file.ext'
  }]
};
Sharer.share(shareOptions);
```

# API

## share
```typescript
share(options: ShareOptions): Promise<{ status: any }>
```
It shares text and files by using sharing modal (multiple options) or email.

**options** [ShareOptions](#interfaces)  
**return** `Promise<{ status: any }>`  
**error** `Promise<{ message: string }>`  

# Interfaces
 
## ShareOptions

| Property | Type | Description |
|--|--|--|
| dialogTitle | `string` (optional) | Set a title for the share modal. Android only. |
| email | `ShareOptionEmail` (optional) | Options to compose and share an email. |
| text | `string` (optional) | Set some text to share. |
| url | `string` (optional) | Set a URL to share. |
| files | `Array<ShareOptionFile>` (optional) | Set files to share. |

## ShareOptionEmail
Share data by using an email app. Can be used with `files` param as an attached files.
| Property | Type | Default | Description |
|--|--|--|--|
| app | `ShareEmailApp` (optional) | `ShareEmailApp.Default` | It specifies an app. |
| bcc | `Array<string>` (optional) | `[]` | Bcc emails. |
| body | `string` (optional) | `` | Body of the email. |
| cc | `Array<string>` (optional) | `[]` | Cc emails. |
| isHTML | `string` (optional) | `false` | Necessary flag if the body has HTML codification. |
| subject | `string` (optional) | `` | Subject of the email. |
| to | `Array<string>` (optional) | `[]` | To email. |

## ShareOptionFile
Information of the files to share by using native modal options or email, depending on if email param it is declared.
| Property | Type | Default | Description |
|--|--|--|--|
| directory | `FilesystemDirectory` (optional) | `FilesystemDirectory.Documents` | The `FilesystemDirectory` to store the file in. |
| displayableName | `Array<string>` (optional) | `(Same as path)` | Custom file name with its extension (important set an extension to display a thumbnail). Default its origin name. |
| path | `string` | - | The path to the file with its name and extension included: `path/to/file.ext` |

# Enumerations

## ShareEmailApp
Specific email app to use. 
| Name | Description |
|--|--|
| Default | Use native email app. Default: `Mail` (iOS) or `Gmail` (Android) |
| Gmail | Use gmail app. |
| Mail | Use Apple Mail app. |
| Outlook | Use outlook app. |
| Yahoo | Use yahoo app. |

## SharerError
Returned error messages
| Name | Description |
|--|--|
| AppNotFound | The specified email application it is not a `ShareEmailApp` options. |
| ClearTempDir | Error cleaning temp directory. It is cleaned each time it is shared a file by setting the `displayableName` param, because it must to create a temporary file with that name and first clean entire temp directory to avoid duplicates. |
| CopyFileToTemp | Error copying some file to temp file. |
| DoAction | Error sending, canceling or saving email by using Apple Mail app. |
| EmptyData | Not enough data to share. |
| EmptyFilePath | Some of file `path` is empty. |
| FileConversion | Error converting directory and path to `File`. |
| FileToUri | Error converting `File` to `URI`. |
| InvalidFileParam | File param is not a proper `ShareOptionFile` object. |
| InvalidPath | The combination of directory and path is not a valid URL. |
| MailComposer | Unknown error at time to create the email composer `view controller`. |
| MimeType | Error getting the mime type of some file. |
| OpenExternalApp | Error opening a specified email app. |
| SharingActivityItems | Error trying to share some `activity item`. |
| UnsupportedUrl | The `url` param does not have a valid url. |
| UrlParamsConversion | Error converting `email` params into a url. |
| UrlToData | Error converting `Data` object into url. |
