export function deepCopy(data){
    return JSON.parse(JSON.stringify(data));
}

export function shallowCopy(data){
    return data.slice();
}