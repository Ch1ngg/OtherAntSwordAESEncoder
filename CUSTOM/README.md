# CUSTOM 模式
> 目前 ASPX 和 JSP 要最简化实现 DES 双向传输数据加密绕过 WAF 只能是用 CUSTOM 模式来编写。

## Shell

> ASPX 和 JSP 都是基于 AntSword 项目中的 Shell 基础进行增加和改动。



## BUG

1. CUSTOM ASPX 脚本使用 DES 加密时只能使用 UTF8 编码，且中文乱码暂时无法解决，请求各路大神帮忙解决。