---
title: "mysql (mysql-connector-python)"
date: 2025-10-21 13:09:08 +0900
render_with_liquid: false
categories: ["데이터 분석", "데이터 수집"]
---

```python
# 설치
conda install -c conda-forge mysql-connector-python



import mysql.connector

try:
    # # 데이터베이스 연결
    conn = mysql.connector.connect(
        host="localhost",  # 또는 IP 주소
        user="root",  # MySQL 사용자
        password="sktkfka5",
        database="testdb",  # 사용할 데이터베이스명
    )
    # 커서 생성
    cursor = conn.cursor()
    print("mysql 연결성공")
    # ? 생성
    cursor.execute(
        """
    create table if not exists users(
                   id int auto_increment primary key,
                   name varchar(50),
                   age int)
    """
    )
    sql = "insert into users (name, age) values (%s, %s)"
    val = [("홍길동", 25), ("최만선", 26), ("김승현", 27)]
    cursor.executemany(sql, val)
    conn.commit()
    cursor.close()
    conn.close()

    # # ? 조회
    cursor.execute("SELECT * FROM users")
    # # 전체 조회
    rows = cursor.fetchall()
    print(rows)
    # 한 행씩
    while True:
        row = cursor.fetchone()
        if row == None:
            break
        print(row)

    # ? 수정
    cursor.execute('update users set age = 26 where name = "김승현"')
    conn.commit()

    cursor.close()
    conn.close()

    # ? 삭제
    cursor.execute('delete from users where name="김승현"')
    conn.commit()
except mysql.connector.Error as err:
    print("데이터 베이스 오류")
finally:
    if cursor:
        cursor.close()
    if conn:
        conn.close()
```
