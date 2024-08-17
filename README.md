# インプレゾンビバスターズ

![icon](./public/icon128.png)

## これは何？

Twitter(現X)を使用している際に大量に出てくる、不快なユーザを機械的に非表示にするChrome拡張機能です。

非表示の対象に引っかかったユーザのIDを控えて、非表示対象ユーザを常に非表示にします。

NGワードの設定や、非表示対象のユーザの確認ができるポップアップ機能もあります。

## 使い方

### パッケージをダウンロードする

[GitHub Releases](https://github.com/PigeonsHouse/impre-zombie-busters/releases/latest) から `extension.zip` か `extension.tar.gz` をダウンロードする。

### 解凍する

**windowsの場合**

`extension.zip` を右クリックして解凍する

**コマンドで解凍する場合**

```
unzip extension.zip -d extension
```

```
tar -xvzf extension.tar.gz
```

### 拡張機能を導入する

`chrome://extensions/` にアクセスし、右上の「デベロッパーモード」をONにして、「パッケージ化されていない拡張機能を読み込む」から先ほど解凍した `extension/` フォルダを指定する。
