var sqlite3 = require('sqlite3').verbose();
//var db = new sqlite3.Database(':memory:');
var db = new sqlite3.Database('contacts.db');

var sampleNames= "서연,서윤,지우,서현,민서,윤서,아인,해민,지원,수연,하윤,민아,채빈,채아,지아,시아,효린,설현,소아,민정";
var arrNames = sampleNames.split(',');
var lastNames = ["김","이", "박", "서", "고", "안", "임", "나", "강", "최", "손", "우", "정", "윤", "오", "한", "송","황", "권", "류", "홍", "문", "양", "조", "배", "백", "허", "남", "심", "장", "곽", "차", "성", "주", "구", "신", "엄", "공", "함", "염" ];


var initializeDB = function() {
    var no = 0;
    db.get("SELECT no, name, tel, address FROM contacts", function(err,row) {
        if (err) {
            db.serialize(function() {
                db.run("CREATE TABLE contacts (no INTEGER PRIMARY KEY, name TEXT, tel TEXT, address TEXT, photo TEXT)");
                var stmt = db.prepare("INSERT INTO contacts (no, name,tel,address, photo) VALUES (?,?,?,?,?)");
                for (var i=0; i < 100; i++) {
                    var num=""+no;
                    if (no < 10) num = "0"+no;
                    var ridx = Math.floor(Math.random() * lastNames.length);
                    
                    stmt.run(++no, lastNames[ridx] + arrNames[i % 20], "010-3456-82"+num, "서울시", "" + no + ".jpg");  
                }
                stmt.finalize();
            });
        }
    });
}

initializeDB();

//true이면 인젝션 문자열을 포함하고 있으므로 실행을 거부함.
var  injectionfilter = function(val){
    var str="select,insert,update,delete,merge,commit,rollback,create,alter,drop,truncate,grant,revoke,union,alter,and,or,--,'";
    var str = str.split(",");
    
    val = val.toLowerCase(); 
    
    for(var i=0; i<str.length; i++)
    {
        if(val.indexOf(str[i],0)>-1) {
            return true;
            break;
        }
    }
    return false;
}

module.exports = {
    insertContact : function(name,tel,address) {
         return new Promise(function(resolve, reject) {
             var nextno = (new Date()).getTime();
             db.run("INSERT INTO contacts VALUES (?,?,?,?,?)",[nextno,name,tel,address,'noimage.jpg'], function(err) {
                 if (err) {
                     reject({ status:'fail', message:error });
                 } else {
                     resolve({ status:'success', message:'No(' + this.lastID + ') 데이터 추가 성공!!', no:this.lastID });
                 }
             })
         });
    },
    updateContact : function(no,name,tel,address) {
         return new Promise(function(resolve, reject) {
             db.run("UPDATE contacts SET name=?, tel=?, address=? WHERE no=?", [name,tel,address,no], function(err) {
                 if (err) {
                     reject({ status:'fail', message:error });
                 } else {
                     resolve({ status:'success', message:'No(' + no + ') 데이터 변경 성공!!', no:no });
                 }
             })
         });
    },
    deleteContact : function(no) {
         return new Promise(function(resolve, reject) {
             db.run("DELETE FROM contacts WHERE no=?", no, function(err) {
                 if (err) {
                     reject({ status:'fail', message:error });
                 } else {
                     resolve({ status:'success', message:'No(' + no + ') 데이터 삭제 성공!!', no:no });
                 }
             })
         });
    },
    getContactList : function(photoUrl, pageno, pagesize) {
        var sql = "SELECT no, name,tel,address,photo FROM contacts ORDER BY no DESC";
        if (pageno !== 0) {
            sql += " LIMIT " + ((pageno-1)*pagesize) + ", " + pagesize;
        }
        var sqlcnt = "SELECT count(*) FROM contacts";

        var p1 =  new Promise(function(resolve, reject) {
            db.all(sql, function(err, rows) {
                if (err) {
                    reject(err);
                } else {
                    var data = [];
                    rows.forEach(function (row) {
                        data.push({no:row.no, name:row.name, tel:row.tel, address:row.address, photo:photoUrl + row.photo });
                    });
                    resolve(data);
                }
            });
        });

        var p2 = new Promise(function(resolve, reject) {
            db.each("SELECT count(*) as cnt  FROM contacts", function(err, row) {
                if (err) {
                    reject(err);
                } else {
                    resolve(row.cnt);
                }
            });
        })

        return Promise.all([p1,p2]);

    },
    getContact : function(photoUrl, no) {
        return new Promise(function(resolve, reject) {
            db.get("SELECT no,name,tel,address,photo FROM contacts WHERE no=?", no, function(err, row) {
                if (err) {
                    reject({ message : err });
                } else {
                    var data = {};
                    if (row) {
                        data.no = row.no;
                        data.name = row.name;
                        data.tel = row.tel;
                        data.address = row.address;
                        data.photo = photoUrl + row.photo;
                    }
                    resolve(data);
                }
            });
        });
    },
    searchContact : function(photoUrl, name) {
        return new Promise(function(resolve, reject) {
            var injResult = injectionfilter(name);
            if (injResult == true) {
                reject({ message:"이름에 인젝션 문자열을 포함하고 있으므로 실행하지 않습니다."});
            }
            if (name.length < 2) {
                reject({ message:"2글자 이상만 검색이 가능합니다."});
            }
            var sql = "SELECT no,name,tel,address,photo FROM contacts WHERE name LIKE '%" + name + "%'"
            db.all(sql, function(err, rows) {
                if (err) {
                    reject({ message : err });
                } else {
                    var data = [];
                    rows.forEach(function (row) {
                        data.push({no:row.no, name:row.name, tel:row.tel, address:row.address, photo:photoUrl + row.photo });
                    });
                    resolve(data);
                }
            });
        });
    },
    batchInsert : function(arr) {
        return new Promise(function(resolve, reject) {
            var no = (new Date()).getTime();
            var insertedRows = [];
            db.serialize(function() {
                try {
                    var stmt = db.prepare("INSERT INTO contacts VALUES (?,?,?,?,?)");
                    for (var i = 0; i < arr.length; i++) {
                        stmt.run(++no, arr[i].name, arr[i].tel, arr[i].address, 'noimage.jpg');
                        insertedRows.push(no);
                    }
                    stmt.finalize();
                    resolve({ status:'success', message: i+'건 데이터 추가 성공!!', no : insertedRows });
                } catch(e) {
                    reject({ status:'fail', message:e });
                }
            });
        });
    },
    updatePhoto : function(no, photo) {
         return new Promise(function(resolve, reject) {
             db.get("SELECT no FROM contacts WHERE no=?", no, function(err, row) {
                 if (row) {
                    db.run("UPDATE contacts SET photo=? WHERE no=?", [photo,no], function(err) {
                        if (err) {
                            reject({ status:'fail', message:error });
                        } else {
                            resolve({ status:'success', message:'No(' + no + ') 사진 변경 성공!!', no:no });
                        }
                    })
                 } else {
                     reject({ status:'fail', message:"no에 해당하는 연락처 정보 없음" })
                 }
             })

         });
    },
    close : function() {
        db.close();
    }
}