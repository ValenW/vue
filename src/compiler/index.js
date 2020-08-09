/* @flow */

import { parse } from './parser/index'
import { optimize } from './optimizer'
import { generate } from './codegen/index'
import { createCompilerCreator } from './create-compiler'

// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
  // 将模板转换为ast抽象语法树
  const ast = parse(template.trim(), options)
  if (options.optimize !== false) {
    // 优化ast
    optimize(ast, options)
  }
  // 将ast转换为字符串形式的js代码
  const code = generate(ast, options)
  return {
    ast,
    // 渲染函数
    render: code.render,
    // 静态渲染函数, 生成静态的Vnode tree
    staticRenderFns: code.staticRenderFns
  }
})
