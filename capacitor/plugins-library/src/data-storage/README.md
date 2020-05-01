# DataStorage
Key-value data storage. It is developed by using sqlite so it is posible handle table and database too.

#### CONTENTS
[Usage](#usage)  
[API](#api)  
[Interfaces](#interfaces)  

# Usage

```typescript
import {DataStorage} from 'krikoo-capacitor';

// Optional database initialization.
DataStorage.database({name: 'myDB'});

// It will delete the 'country' key of 'user-data' table.
DataStorage.delete({key: 'country', table: 'user-data'});

// It will store the value 'Spain' in the 'country' table in the 'user-data' table. 
DataStorage.store({key: 'country', table: 'user-data', value: 'Spain'});

// It will remove the entire database and consequently its tables and key-values. 
DataStorage.remove();

// It will retrieve the value of the 'country' key into 'user-data' table. 
DataStorage.retrieve({key: 'country', table: 'user-data'})
    .then((result: { value: any }) => /* value handler here */);

// It will drop (remove) the user-data's table and consequently its key-values.
DataStorage.drop({table: 'user-data'});
```

# API

## database
```typescript
database(options: DataBaseOptions): Promise<{}>
```
It establish the name for the database. By default `datastorage`.

**options** [DataBaseOptions](#interfaces)  
**return** `Promise<{}>`
**error** `Promise<{ message: string }>`  

## delete
```typescript
delete(options: DeleteOptions): Promise<{}>
```
It deletes a key-value from a table.

**options** [DeleteOptions](#interfaces)  
**return** `Promise<{}>`   
**error** `Promise<{ message: string }>`  

## drop
```typescript
drop(options: DropOptions): Promise<{}>
```
It drops (remove) a table.

**options** [DropOptions](#interfaces)  
**return** `Promise<{}>`  
**error** `Promise<{ message: string }>`  

## remove
```typescript
remove(): Promise<{}>
```
It removes the entire database.

**options** void  
**return** `Promise<{}>`  
**error** `Promise<{ message: string }>`  

## retrieve
```typescript
retrieve(options: RetrieveOptions): Promise<{ value: any }>
```
It retrieves the value of a specific key.

**options** [RetrieveOptions](#interfaces)  
**return** `Promise<{ value: any }>`  
**error** `Promise<{ message: string }>`  

## store
```typescript
store(options: StoreOptions): Promise<{}>
```
It stores value of a specific key.

**options** [StoreOptions](#interfaces)  
**return** `Promise<{}>`  
**error** `Promise<{ message: string }>`  

# Interfaces
 
## DataBaseOptions
| Property | Type | Description |
|--|--|--|
| name | `string` | Name of the database. Default: datastorage. |

## DeleteOptions
| Property | Type | Description |
|--|--|--|
| key | `string` | The key name. |
| table | `string` | The table name. |

## DropOptions
| Property | Type | Description |
|--|--|--|
| table | `string` | The table name. |

## RetrieveOptions
| Property | Type | Description |
|--|--|--|
| key | `string` | The key name. |
| table | `string` | The table name. |

## StoreOptions
| Property | Type | Description |
|--|--|--|
| key | `string` | The key name. |
| table | `string` | The table name. |
| value | any | Text, number, boolean or object to store. |
