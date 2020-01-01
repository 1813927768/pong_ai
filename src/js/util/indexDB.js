/* eslint-disable no-console */
var daVer = 1,              // 数据库版本号
    db = '';                // 用于数据库对象
    
// 连接数据库
function openDB(dbName) {
    var request = indexedDB.open(dbName, daVer);
    request.onsuccess = function (e) {
        db = e.target.result;
        console.log('连接数据库' + dbName + '成功');
    }
    request.onerror = function () {
        console.log('连接数据库' + dbName + '失败');
    }
    request.onupgradeneeded = function (e) {
        db = e.target.result;
        console.log('创建数据库' + dbName + '成功');
        // 如果不存在对象仓库则创建
        if (!db.objectStoreNames.contains('his_data')) {
            var store = db.createObjectStore('his_data', { autoIncrement: true });
            store.createIndex("label","label", {unique:false});  
        }
        // db.createObjectStore('level_2', { autoIncrement: true });
    }
}

/**
 * 保存数据
 * @param {Object} data 要保存到数据库的数据对象
 */
async function saveData(data, dbName, callback) {
    //debugger;
    var request = indexedDB.open(dbName, 1);
    request.onsuccess = function (e) {
        db = e.target.result;
        var tx = db.transaction('his_data', 'readwrite');
        var store = tx.objectStore('his_data');
        var req = store.put(data);
        req.onsuccess = function () {
            console.log('成功保存数据');
            callback && callback();
        }
        // req.onerror = function(){
        //     console.log("保存失败")
        // }
        
    }
}


/**
 * 通过索引读取数据
 * @param {Object} index 要读取的主键值
 */
async function readData(item, dbName, callback) {
    var request = indexedDB.open(dbName, 1);
    request.onsuccess = function (e) {
        console.log('读取：打开数据库' + dbName + '成功');
        db = e.target.result;
        var tx = db.transaction('his_data', 'readonly');
        var store = tx.objectStore('his_data');
        var index = store.index("label");
        // debugger
        var result = []
        index.openCursor().onsuccess = async function(event) {
            var cursor = event.target.result;           
            if (cursor) {
              // cursor.key is a name, like "Bill", and cursor.value is the whole object.
              if(cursor.key == item){
                  result.push(cursor.value.raw);
              }
              cursor.continue();
            }
            else{
                if(callback){
                    callback(result);
                }
                // callback && await callback(result);
            }           
          };
        // var req = index.get(item);
        // console.log(req);
        // req.onsuccess = function () {
        //     // debugger
        //     callback && callback();
        // }
        // req.onerror = function () {
        //     console.log('读取失败');
        // };
    }
}


//删除数据库
function deleteDB(dbName) {
    indexedDB.deleteDatabase(dbName);
}


export {deleteDB, openDB, saveData, readData}