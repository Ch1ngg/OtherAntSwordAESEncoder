# CUSTOM 模式
> 目前 ASPX 和 JSP 要最简化实现 AES 双向传输数据加密绕过 WAF 只能是用 CUSTOM 模式来编写。

## Shell

> ASPX 和 JSP 都是基于 AntSword 项目中的 Shell 基础进行增加和改动。

## BUG

1. CUSTOM 脚本使用 AES 加解密且中文乱码官方暂时无解决方案，可使用临时修复方法。

## 临时修复方法

> 1. 在 \source\core\base.js 284行下方增加一行代码

```js
          if(!(buff instanceof Uint8Array)){
              text = buff;
          }
```

![1566653797328](E:\WorkSpace\Git\SelfAntSwordDESEncoder\CUSTOM\pic\1566653797328.png)