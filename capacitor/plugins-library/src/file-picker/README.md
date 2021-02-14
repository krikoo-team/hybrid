# File Picker
It presents a native file picker for browse option. Neither the camera nor the photo library are supported.  

#### CONTENTS
[Known Issues](#known-issues) 
[Usage](#usage)  
[API](#api)  
[Interfaces](#interfaces)  
[Enumerations](#enumerations)  

# Known Issues
- **all**: It can retrieve just one file per present.

# Usage

```typescript
import {FilePicker} from 'krikoo-capacitor'; import {FilePickerError} from './FilePickerError';

// Simple native file picker presenter.
FilePicker.present()
    .then((filePickerResult: FilePickerResult) => /* result handler here */)
    .catch((error: { message: FilePickerError }) => /* error handler here */);
```

# API

## present
```typescript
present(): Promise<FilePickerResult>
```
It presents a native file picker.

**options** void  
**return** `Promise<FilePickerResult>`  
**error** `Promise<{ message: FilePickerError }>` 

# Interfaces
 
## FilePickerResult

| Property | Type | Description |
|--|--|--|
| data | `string` | Base 64 file data. |
| extension | `string` | File extension. |
| mimeType | `string` | File mime type. |
| name | `string` | Entire file name. (with extension) |
| uri | `string` | Internal or external URI to file |

# Enumerations

## FilePickerError
Returned error messages
| Name | Value | Description |
|--|--|--|
| Cancelled | `CANCELLED` | Picker operations cancelled by user. |
| MimeType | `MIME_TYPE_ERROR` | Error getting picked file mime type. |
| NoDataRetrieved | `NO_DATA_RETRIEVED_ERROR` | Error converting file to base64 data. |
| ReadingFile | `READING_FILE_CODE` | Reading file error. |
| Unknown | `UNKNOWN_ERROR` | Unknown error. |
| WrongRequestCode | `WRONG_REQUEST_CODE_ERROR` | No FILE_PICKE request code is detected on activity result. (Android) |
