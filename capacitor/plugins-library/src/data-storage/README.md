# DataStorage
Key-value data storage. It is developed by using sqlite for native platforms and IndexedDB for web, so it is possible handle table and database too.

#### CONTENTS
[Usage](#usage)  
[API](#api)  
[Interfaces](#interfaces)  
[Enumerations](#enumerations)  

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

// It will retrieve all key-values of the 'user-data' table. 
DataStorage.retrieveAll({table: 'user-data'})
    .then((result: { [key: string]: any }) => /* value handler here */);

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
**error** `Promise<string>`  

## delete
```typescript
delete(options: DeleteOptions): Promise<{}>
```
It deletes a key-value from a table.

**options** [DeleteOptions](#interfaces)  
**return** `Promise<{}>`   
**error** `Promise<string>`  

## drop
```typescript
drop(options: DropOptions): Promise<{}>
```
It drops (remove) a table.

**options** [DropOptions](#interfaces)  
**return** `Promise<{}>`  
**error** `Promise<string>`  

## remove
```typescript
remove(): Promise<{}>
```
It removes the entire database.

**options** void  
**return** `Promise<{}>`  
**error** `Promise<string>`  

## retrieve
```typescript
retrieve(options: RetrieveOptions): Promise<{ value: any }>
```
It retrieves the value of a specific key.

**options** [RetrieveOptions](#interfaces)  
**return** `Promise<{ value: any }>`  
**error** `Promise<string>`  

## retrieveAll
```typescript
retrieveAll(options: RetrieveAllOptions): Promise<{ [key: string]: any }>
```
It retrieves all key-values of a specific table.

**options** [RetrieveAllOptions](#interfaces)  
**return** `Promise<{ [key: string]: any }>`  
**error** `Promise<string>`  

## store
```typescript
store(options: StoreOptions): Promise<{}>
```
It stores value of a specific key.

**options** [StoreOptions](#interfaces)  
**return** `Promise<{}>`  
**error** `Promise<string>`  

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

## RetrieveAllOptions
| Property | Type | Description |
|--|--|--|
| table | `string` | The table name. |

## StoreOptions
| Property | Type | Description |
|--|--|--|
| key | `string` | The key name. |
| table | `string` | The table name. |
| value | any | Text, number, boolean or object to store. |

# Enumerations

## DataStorageError
Returned error messages
| Name | Description |
|--|--|
| CloseTable | Error closing the database. |
| CreateTable | Error creating a table. |
| CreateTableStatement | Error with the table creation statement. |
| DatabaseNotFound | Impossible to proceed with the action because of database does not exist. |
| Delete | Error deleting key-value of a specific table. |
| DeleteStatement | Error with the key-value deletion statement. |
| DropTable | Error dropping an specific table. |
| DropTableStatement | Error with the table dropping statement. |
| EmptyDatabaseName | It was not specified the param `name` with the database name. |
| EmptyKey | It was not specified the param `key` with the key name. |
| EmptyTable | It was not specified the param `table` with the table name. |
| EmptyValue | It was not specified the param `value` with a value. |
| InsertOrReplace | Error inserting or updating an specific value. |
| InsertOrReplaceStatement | Error with the value inserting or updating  statement. |
| JsonParse | Impossible convert the object stored as string to json.  |
| JsonStringify | Impossible convert the json object to store to string. |
| KeyNotFound | Impossible to proceed with the action because the specified key does not exist. |
| OpenDatabase | Error opening database. |
| RemoveDatabase | Error removing database. |
| Select | Error selecting (retrieving) an specific key-value of a specific table. |
| SelectStatement | Error with the value retrieving statement. |
| TableNotFound | Impossible to proceed with the action because the specified table does not exist. |
