

export interface Config {
    optionsMergeStrategies:{[key: string]:Function}
    silent:boolean
    // devtools:boolean
}

export default {
    optionsMergeStrategies: Object.create(null),
    silent:false
} as Config