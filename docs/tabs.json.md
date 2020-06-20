# カスタムタブの利用方法
## 説明
TenChaはタイムラインの重複防止を搭載し、タイムラインのタブをJSONファイルで管理しているので、複数のタイムラインを統合して表示することが可能です。また定義次第では特定の内容を抽出したタブを作ることも可能です。
## 前提知識
- JSONファイルの構造

## 構造
TenChaのタイムラインのファイルは`tabs.json`です。    
中には`tabs`の配列があり、その中身は以下の要素で構成されています。

- `id`
- `name`
- `source`
  - `from`
  - `filter`
    - `type`
    - `match`
    - `match_type`
    - `ignore_case`
    - `negative`

これらの個別の説明は以下の通りです。

| 項目 | 説明 |
|  ----|----  |
| `id`          | 必須。文字列。<br>タブの管理用のIDです。重複してはいけません。<br>基本的には半角英数が推奨されます。 |
| `name`        | 必須。文字列。<br>表示で利用される名前です。重複可、文字種制限なしです。|
| `source`      | 必須。Object。<br>このタイムラインに流れる投稿に関する設定。|
| `from`        | 必須。文字列の配列。<br>この中には下記のタイムラインソースを文字列として入れます。|
| `filter`      | 任意。Objectの配列。<br>表示する内容を細かく調整できます。中の要素は複数定義できます。<br>基本的には表示しないという定義の方が優先されます。|
| `type`        | 必須。文字列。<br>何に対して定義を適用するか。下記のフィルターの種類のうちどれが1つを指定します。|
| `match`       | 必須。文字列。<br>フィルター対象と評価される値。`match_type`の指定によってどう比較されるかが変わります。|
| `match_type`  | 必須。文字列。<br>フィルター対象と`match`をどう比較するかの指定。<br>下記のフィルターの比較の種類のうちどれか1つを指定します。|
| `ignore_case` | 任意。真偽値。<br>大文字小文字を区別するか。|
| `negative`    | 任意。真偽値。<br>指定された定義を否定にするか。

## タイムラインソース
| 項目 | 説明 |
|  ----|----  |
| `home`         | ホーム |
| `local`        | ローカル |
| `social`       | ソーシャル |
| `global`       | グローバル |
| `notification` | 通知|

## フィルターの種類
| 項目 | 説明 |
|  ----|----  |
| `username`   | `coke12103`のような形式のユーザーのID |
| `acct`       | `c0_ke@misskey.dev`のような形式のドメインが入ったユーザーのID |
| `name`       | ユーザーの表示名 |
| `text`       | 投稿の本文とCW |
| `host`       | インスタンスのドメイン |
| `visibility` | 公開範囲 |
| `file_count` | 添付されたファイルの数。比較の種類の指定が他のものと違うため注意。 |

## フィルターの比較の種類
| 項目 | 説明 |
|  ----|----  |
| `full`| 完全一致|
| `part`| 部分一致|
| `regexp`| 正規表現マッチ|

### `file_count`のみで利用される比較
| 項目 | 説明 |
|  ----|----  |
| `match`| 枚数完全一致|
| `more`| 指定された枚数以上|
| `under`| 指定された枚数以下|


## サンプル
```
{
 "tabs": [
  {
   "id": "home",
   "name": "ホーム",
   "source": {
    "from": [
     "home"
    ]
   }
  },
  {
   "id": "notification",
   "name": "通知",
   "source": {
    "from": [
     "notification"
    ]
   }
  },
  {
    "id": "tencha",
    "name": "TenCha",
    "source": {
      "from": ["social", "global"],
      "filter": [
        {
          "negative": false,
          "type": "text",
          "match": "TenCha",
          "match_type": "part",
          "ignore_case": true
        }
      ]
    }
  },
  {
    "id": "coke",
    "name": "自分だけ",
    "source": {
      "from": ["social", "global", "home"],
      "filter": [
        {
          "negative": false,
          "type": "acct",
          "match": "c0_ke@missley.dev",
          "match_type": "full",
          "ignore_case": true
        }
      ]
    }
  },
  {
    "id": "tenchamemo",
    "name": "メモ",
    "source": {
      "from": ["social", "global", "home"],
      "filter": [
        {
          "negative": false,
          "type": "acct",
          "match": "c0_ke@misskey.dev",
          "match_type": "full",
          "ignore_case": true
        },
        {
          "type": "text",
          "match": "TenChaMemo",
          "match_type": "part",
          "ignore_case": true
        }
      ]
    }
  },
  {
    "id": "locked",
    "name": "鍵TL",
    "source": {
      "from": ["social", "global", "home"],
      "filter": [
        {
          "negative": false,
          "type": "visibility",
          "match": "followers",
          "match_type": "full",
          "ignore_case": true
        }
      ]
    }
  },
  {
    "id": "pawoo",
    "name": "Pawoo",
    "source": {
      "from": ["social", "global", "home"],
      "filter": [
        {
          "negative": false,
          "type": "host",
          "match": "pawoo.net",
          "match_type": "full",
          "ignore_case": true
        }
      ]
    }
  },
  {
    "id": "pawoo_image",
    "name": "Pawooメディア",
    "source": {
      "from": ["social", "global", "home"],
      "filter": [
        {
          "type": "host",
          "match": "pawoo.net",
          "match_type": "full",
          "ignore_case": true
        },
        {
          "type": "file_count",
          "match": "0",
          "match_type": "more"
        }
      ]
    }
  }
 ]
}
```
