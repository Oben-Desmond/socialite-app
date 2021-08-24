export const  getRandomColor=(word:string)=>{
    const colors = [`primary`, `secondary`, `danger`, `success`, `warning`, `tertiary`, `dark`, `medium`]
    const alpha = `abcdefghijklmnopqrstuvwxyz`;
    const randomColor = (colors[getColorIndex(word)] )

    function getColorIndex(word: string) {
        let num = 0
        if (!word) return num;

        const index = alpha.indexOf(word[0].toLowerCase())
        num = index >= 0 ? index : 0;

        return num % colors.length
    }
    return randomColor
}