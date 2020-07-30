##交易签名教程

###安装 txsign

`cnpm i txsign -s`

###页面引入

`import { sendTx } from 'txsign'`

###使用

`sendTx(keyStore, nodeInfo, from, pass, type, msg, msgs)`

###参数说明

keyStore： 钱包 keyStore

nodeInfo：节点名称

from: 操作钱包账户地址

pass：操作钱包账户密码

type：交易类型（默认“hg-custom”）

msg：交易数据，

msgs：（暂时没用到，可不传）
