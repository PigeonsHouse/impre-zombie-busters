# インプレゾンビバスターズ

![icon](./public/icon128.png)

## これは何？

Twitter(現X)を使用している際に大量に出てくる、不快なユーザを機械的に非表示にするChrome拡張機能です。
非表示の対象に引っかかったユーザのIDを控えて、非表示対象ユーザを常に非表示にします。
NGワードの設定や、非表示対象のユーザの確認ができるポップアップ機能もあります。

## 使い方

### パッケージをインストールする

```bash
npm ci
```

### パッケージを作成する

```bash
npm run build
```

上のコマンドを実行すると `dist/` というディレクトリが生成される。

### 拡張機能を導入する

`chrome://extensions/` にアクセスし、右上の「デベロッパーモード」をONにして、「パッケージ化されていない拡張機能を読み込む」から `dist/` フォルダを指定する。

## 開発の環境構築

### パッケージをインストールする(上でインストール済であれば飛ばす)

```bash
npm ci
```

### 開発環境を起動する

```bash
npm run dev
```

### 拡張機能を導入する(初回のみでOK)

`chrome://extensions/` にアクセスし、右上の「デベロッパーモード」をONにして、「パッケージ化されていない拡張機能を読み込む」から `dist/` フォルダを指定する。
