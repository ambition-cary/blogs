---
draft: true 
date: 2024-09-25 
authors:
  - LK
categories:
  - 逆向
  - js
tags:
  - ast
# hide:
#   - footer
---

AST各种模板的使用学习


<!-- more -->

??? note annotate "资源获取"

    以下内容的学习来自 ==悦来客栈的老板== 的[知识星球](https://wx.zsxq.com/group/48415254524248)

## AST解析-学习模板
```js
// babel库及文件导入
const fs = require("fs");

const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;
const types = require("@babel/types");

console.log("开始解析文件")

// 参数处理
let encode_file = './test.js'
let decode_file = './decode.js'
if (process.argv.length > 2) {
    encode_file = process.argv[2]
    decode_file = process.argv[3]
}

// 读取文件
const jscode = fs.readFileSync(encode_file, "utf8");

// 解析文件
const ast = parser.parse(jscode, { sourceType: "module" });

//插件编写
const plugin = {
    // 操作 类型
    BinaryExpression:{
        // enter 不遍历， exit 遍历
        exit(path) {
            const {left, operator, right } = path.node
            // 判断是否是encode函数
            if (types.isNumericLiteral(left) && operator === "+" && types.isNumericLiteral(right)) {
                // 修改函数名
                let newNode = types.numericLiteral(left.value + right.value)
                path.replaceWith(newNode)
            }
        }
    }
}

// 遍历文件
traverse(ast, plugin, opts={})

// 生成文件
const {code} = generator(ast)
console.log(code)
fs.writeFileSync(decode_file, code, {encoding: "utf8"}, (err) => {console.log(err)})
console.log("文件解析完成")
```