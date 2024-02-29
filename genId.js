export const genId = () => {
    return Math.random().toString().slice(2) + Date.now()
}