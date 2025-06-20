
export type CompilerOptions = {
    statickeys?:string // 列出ast中被视为静态的属性，用于优化编译过程
    isUnaryTag?:(tag:string) => boolean | undefined // 判断标签是否可以被左开
    optimize?:boolean; // 是否优化静态内容
    
}